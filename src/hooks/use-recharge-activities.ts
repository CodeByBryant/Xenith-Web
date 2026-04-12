import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { RechargeActivity, RechargeActivityInput } from "@/lib/types";

export function useRechargeActivities(days: number = 30) {
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["recharge-activities", days],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from("recharge_activities")
        .select("*")
        .eq("user_id", user.id)
        .gte("activity_date", startDate.toISOString().split("T")[0])
        .order("activity_date", { ascending: false });

      if (error) throw error;
      return (data || []) as RechargeActivity[];
    },
  });

  const add = useMutation({
    mutationFn: async (input: RechargeActivityInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("recharge_activities").insert({
        user_id: user.id,
        ...input,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recharge-activities"] });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<RechargeActivityInput> }) => {
      const { error } = await supabase
        .from("recharge_activities")
        .update(input)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recharge-activities"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("recharge_activities")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recharge-activities"] });
    },
  });

  return {
    activities,
    isLoading,
    add: add.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    isAdding: add.isPending,
    isUpdating: update.isPending,
  };
}
