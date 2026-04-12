import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ValuesCheckin, ValuesCheckinInput } from "@/lib/types";

export function useValuesCheckin(days: number = 90) {
  const queryClient = useQueryClient();

  const { data: checkins = [], isLoading } = useQuery({
    queryKey: ["values-checkin", days],
    queryFn: async () => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await supabase
        .from("values_checkin")
        .select("*")
        .gte("checkin_date", cutoffDate.toISOString().split("T")[0])
        .order("checkin_date", { ascending: false });

      if (error) throw error;
      return data as ValuesCheckin[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (input: ValuesCheckinInput) => {
      const { data, error } = await supabase
        .from("values_checkin")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["values-checkin"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...input }: ValuesCheckinInput & { id: string }) => {
      const { data, error } = await supabase
        .from("values_checkin")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["values-checkin"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("values_checkin")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["values-checkin"] });
    },
  });

  return {
    checkins,
    isLoading,
    add: addMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
