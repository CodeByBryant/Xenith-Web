import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { GratitudeEntry, GratitudeInput } from "@/lib/types";

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}

export function useGratitude(daysBack = 30) {
  const queryClient = useQueryClient();
  const oldest = toDateStr(new Date(Date.now() - daysBack * 86400000));

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["gratitude-entries", daysBack],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("gratitude_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("entry_date", oldest)
        .order("entry_date", { ascending: false });

      if (error) throw error;
      return (data || []) as GratitudeEntry[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (input: GratitudeInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("gratitude_entries").upsert({
        user_id: user.id,
        entry_date: input.entry_date,
        items: input.items,
      }, { onConflict: "user_id,entry_date" });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gratitude-entries"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("gratitude_entries")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gratitude-entries"] });
    },
  });

  return {
    entries,
    isLoading,
    upsert: upsert.mutateAsync,
    remove: remove.mutateAsync,
    isSaving: upsert.isPending,
  };
}
