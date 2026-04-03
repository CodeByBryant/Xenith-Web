import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { WorkoutLog } from "@/lib/types";

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}

export function useWorkouts(date?: Date) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const dateStr = toDateStr(date);

  const query = useQuery({
    queryKey: ["workouts", user?.id, dateStr],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", dateStr)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as WorkoutLog[];
    },
  });

  const add = useMutation({
    mutationFn: async (
      entry: Omit<WorkoutLog, "id" | "user_id" | "date" | "created_at">,
    ) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("workout_logs")
        .insert({ ...entry, user_id: user.id, date: dateStr });
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["workouts", user?.id, dateStr] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("workout_logs")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["workouts", user?.id, dateStr] }),
  });

  return {
    workouts: query.data ?? [],
    isLoading: query.isLoading,
    add: add.mutateAsync,
    isAdding: add.isPending,
    remove: remove.mutateAsync,
  };
}

/** Past 30-day history — needed for "last worked" muscle map indicator */
export function useWorkoutHistory(daysBack = 30) {
  const { user } = useAuth();
  const since = toDateStr(new Date(Date.now() - daysBack * 86400000));

  return useQuery({
    queryKey: ["workout_history", user?.id, daysBack],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("workout_logs")
        .select("date, muscle_groups")
        .eq("user_id", user.id)
        .gte("date", since)
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as { date: string; muscle_groups: string[] }[];
    },
  });
}

/** Returns days since a muscle was last worked (null = never) */
export function daysSinceWorked(
  muscleId: string,
  history: { date: string; muscle_groups: string[] }[],
): number | null {
  const last = history
    .filter((w) => w.muscle_groups.includes(muscleId))
    .map((w) => w.date)
    .sort()
    .at(-1);
  if (!last) return null;
  return Math.floor(
    (Date.now() - new Date(last + "T00:00:00").getTime()) / 86400000,
  );
}
