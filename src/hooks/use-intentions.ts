import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { Intention } from "@/lib/types";

export type NewIntention = Pick<Intention, "title"> & {
  dimension?: string | null;
  context_tags?: string[];
  scheduled_date?: string;
};

function toDateStr(d: Date) {
  return d.toISOString().split("T")[0];
}

export function useIntentions(date?: Date) {
  const { user } = useAuth();
  const dateStr = toDateStr(date ?? new Date());

  const query = useQuery({
    queryKey: ["intentions", user?.id, dateStr],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("intentions")
        .select("*")
        .eq("user_id", user.id)
        .eq("scheduled_date", dateStr)
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Intention[];
    },
  });

  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["intentions", user?.id, dateStr] });

  const add = useMutation({
    mutationFn: async (payload: NewIntention) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("intentions")
        .insert({
          ...payload,
          user_id: user.id,
          scheduled_date: payload.scheduled_date ?? dateStr,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Intention;
    },
    onSuccess: invalidate,
  });

  const toggle = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      if (!supabase) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("intentions")
        .update({ completed_at: completed ? new Date().toISOString() : null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error("Not authenticated");
      const { error } = await supabase.from("intentions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Intention>;
    }) => {
      if (!supabase) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("intentions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as Intention;
    },
    onSuccess: invalidate,
  });

  return {
    intentions: query.data ?? [],
    isLoading: query.isLoading,
    add: add.mutateAsync,
    toggle: toggle.mutateAsync,
    remove: remove.mutateAsync,
    update: update.mutateAsync,
  };
}
