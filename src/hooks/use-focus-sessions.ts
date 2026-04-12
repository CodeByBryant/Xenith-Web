import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import {
  getFocusDurationMinutes,
  isFocusSessionCompleted,
  isFocusSessionOnDate,
} from "@/lib/focus-metrics";

export interface FocusSession {
  id: string;
  duration_minutes: number;
  energy_before: number | null;
  started_at: string;
  completed_at: string | null;
  intention_id: string | null;
}

export function useFocusSessions(days?: number) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["focus_sessions", user?.id, days],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      
      let queryBuilder = supabase
        .from("focus_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });
      
      // If days specified, filter by date
      if (days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        queryBuilder = queryBuilder.gte("started_at", cutoffDate.toISOString());
      } else {
        queryBuilder = queryBuilder.limit(50);
      }
      
      const { data, error } = await queryBuilder;
      if (error) throw error;
      return (data ?? []) as FocusSession[];
    },
  });

  const start = useMutation({
    mutationFn: async ({
      duration_minutes,
      energy_before,
      intention_id,
    }: {
      duration_minutes: number;
      energy_before?: number;
      intention_id?: string | null;
    }) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("focus_sessions")
        .insert({
          user_id: user.id,
          duration_minutes,
          energy_before: energy_before ?? null,
          intention_id: intention_id ?? null,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data as FocusSession;
    },
  });

  const complete = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("focus_sessions")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", id)
        .select();
      if (error) {
        console.error("Error completing focus session:", error);
        throw error;
      }
      console.log("Focus session completed:", data);
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["focus_sessions", user?.id] }),
  });

  const sessions = query.data ?? [];
  const totalMinutesToday = sessions
    .filter((session) => isFocusSessionCompleted(session) && isFocusSessionOnDate(session))
    .reduce((acc, session) => acc + getFocusDurationMinutes(session), 0);

  return {
    sessions,
    isLoading: query.isLoading,
    start: start.mutateAsync,
    complete: complete.mutateAsync,
    totalMinutesToday,
  };
}
