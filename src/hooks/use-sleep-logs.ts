import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { SleepLog, SleepLogInput } from "@/lib/types";

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}

export function useSleepLogs(daysBack = 7) {
  const queryClient = useQueryClient();
  const oldest = toDateStr(new Date(Date.now() - daysBack * 86400000));

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["sleep-logs", daysBack],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("sleep_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", oldest)
        .order("date", { ascending: false });

      if (error) throw error;
      return (data || []) as SleepLog[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (input: SleepLogInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("sleep_logs").upsert({
        user_id: user.id,
        date: input.date,
        bedtime: input.bedtime || null,
        wake_time: input.wake_time || null,
        hours_slept: input.hours_slept || null,
        quality_rating: input.quality_rating || null,
        caffeine_consumed: input.caffeine_consumed || false,
        screen_time_before_bed: input.screen_time_before_bed || false,
        exercised_today: input.exercised_today || false,
        stressed: input.stressed || false,
        notes: input.notes || null,
      }, { onConflict: "user_id,date" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep-logs"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sleep_logs")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep-logs"] });
    },
  });

  return {
    logs,
    isLoading,
    upsert: upsert.mutateAsync,
    remove: remove.mutateAsync,
    isSaving: upsert.isPending,
  };
}
