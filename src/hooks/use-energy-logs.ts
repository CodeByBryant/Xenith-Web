import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { EnergyLog, EnergyLogInput } from "@/lib/types";

export function useEnergyLogs(days: number = 7) {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["energy-logs", days],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from("energy_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("log_date", startDate.toISOString().split("T")[0])
        .order("log_date", { ascending: false })
        .order("time_of_day", { ascending: false });

      if (error) throw error;
      return (data || []) as EnergyLog[];
    },
  });

  const add = useMutation({
    mutationFn: async (input: EnergyLogInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("energy_logs").insert({
        user_id: user.id,
        ...input,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["energy-logs"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("energy_logs")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["energy-logs"] });
    },
  });

  return {
    logs,
    isLoading,
    add: add.mutateAsync,
    remove: remove.mutateAsync,
    isAdding: add.isPending,
  };
}
