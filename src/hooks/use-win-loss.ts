import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { WinLossEntry, WinLossInput } from "@/lib/types";

export function useWinLossEntries(days: number = 30) {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["win-loss-entries", days],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from("win_loss_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("entry_date", startDate.toISOString().split("T")[0])
        .order("entry_date", { ascending: false });

      if (error) throw error;
      return (data || []) as WinLossEntry[];
    },
  });

  const add = useMutation({
    mutationFn: async (input: WinLossInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("win_loss_entries").insert({
        user_id: user.id,
        ...input,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["win-loss-entries"] });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<WinLossInput> }) => {
      const { error } = await supabase
        .from("win_loss_entries")
        .update(input)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["win-loss-entries"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("win_loss_entries")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["win-loss-entries"] });
    },
  });

  return {
    entries,
    isLoading,
    add: add.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    isAdding: add.isPending,
    isUpdating: update.isPending,
  };
}
