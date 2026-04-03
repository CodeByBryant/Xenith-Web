import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { RoutineItem, RoutineWithItems, RoutineCompletionLog } from "@/lib/types";

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}

export function useRoutines() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const today = toDateStr();

  const routinesQuery = useQuery({
    queryKey: ["routines", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("routines")
        .select("*, items:routine_items(*)")
        .eq("user_id", user.id)
        .eq("active", true)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as RoutineWithItems[];
    },
  });

  const completionsQuery = useQuery({
    queryKey: ["routine_completions", user?.id, today],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("routine_completions")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed_date", today);
      if (error) throw error;
      return (data ?? []) as RoutineCompletion[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["routines", user?.id] });
    qc.invalidateQueries({
      queryKey: ["routine_completions", user?.id, today],
    });
  };

  const addRoutine = useMutation({
    mutationFn: async ({
      name,
      time_of_day,
    }: {
      name: string;
      time_of_day: RoutineWithItems["time_of_day"];
    }) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("routines")
        .insert({ user_id: user.id, name, time_of_day })
        .select()
        .single();
      if (error) throw error;
      return data as Routine;
    },
    onSuccess: invalidate,
  });

  const addItem = useMutation({
    mutationFn: async ({
      routine_id,
      title,
      estimated_minutes,
    }: {
      routine_id: string;
      title: string;
      estimated_minutes?: number;
    }) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("routine_items")
        .insert({
          routine_id,
          user_id: user.id,
          title,
          estimated_minutes: estimated_minutes ?? 5,
        });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const toggleItem = useMutation({
    mutationFn: async ({
      routine_id,
      item_id,
      checked,
    }: {
      routine_id: string;
      item_id: string;
      checked: boolean;
    }) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const existing = completionsQuery.data?.find(
        (c) => c.routine_id === routine_id,
      );
      const currentIds: string[] = existing?.completed_item_ids ?? [];
      const newIds = checked
        ? [...new Set([...currentIds, item_id])]
        : currentIds.filter((id) => id !== item_id);
      const { error } = await supabase
        .from("routine_completions")
        .upsert(
          {
            routine_id,
            user_id: user.id,
            completed_date: today,
            completed_item_ids: newIds,
          },
          { onConflict: "routine_id,user_id,completed_date" },
        );
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["routine_completions", user?.id, today],
      }),
  });

  const removeRoutine = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error("Not authenticated");
      const { error } = await supabase.from("routines").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return {
    routines: routinesQuery.data ?? [],
    completions: completionsQuery.data ?? [],
    isLoading: routinesQuery.isLoading,
    addRoutine: addRoutine.mutateAsync,
    addItem: addItem.mutateAsync,
    toggleItem: toggleItem.mutateAsync,
    removeRoutine: removeRoutine.mutateAsync,
  };
}
