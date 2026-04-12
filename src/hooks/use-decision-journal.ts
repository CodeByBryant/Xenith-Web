import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { DecisionJournal, DecisionJournalInput } from "@/lib/types";

export function useDecisionJournal(days: number = 90) {
  const queryClient = useQueryClient();

  const { data: decisions = [], isLoading } = useQuery({
    queryKey: ["decision-journal", days],
    queryFn: async () => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data, error } = await supabase
        .from("decision_journal")
        .select("*")
        .gte("decision_date", cutoffDate.toISOString().split("T")[0])
        .order("decision_date", { ascending: false });

      if (error) throw error;
      return data as DecisionJournal[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (input: DecisionJournalInput) => {
      const { data, error } = await supabase
        .from("decision_journal")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decision-journal"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...input }: DecisionJournalInput & { id: string }) => {
      const { data, error } = await supabase
        .from("decision_journal")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decision-journal"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("decision_journal")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decision-journal"] });
    },
  });

  return {
    decisions,
    isLoading,
    add: addMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
}
