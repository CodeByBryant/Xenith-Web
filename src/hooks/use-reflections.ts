import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { Mood, ReflectionWithMood } from "@/lib/types";

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}

export function useReflections(daysBack = 7) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const oldest = (() => {
    const d = new Date();
    d.setDate(d.getDate() - daysBack);
    return toDateStr(d);
  })();

  const query = useQuery({
    queryKey: ["reflections", user?.id, daysBack],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("reflections")
        .select("*")
        .eq("user_id", user.id)
        .gte("entry_date", oldest)
        .order("entry_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ReflectionWithMood[];
    },
  });

  const save = useMutation({
    mutationFn: async ({
      content,
      mood,
      entry_date,
    }: {
      content: Record<string, unknown>;
      mood?: Mood;
      entry_date?: string;
    }) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const date = entry_date ?? toDateStr();
      const { error } = await supabase
        .from("reflections")
        .upsert(
          { user_id: user.id, content, mood: mood ?? null, entry_date: date },
          { onConflict: "user_id,entry_date" },
        );
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["reflections", user?.id] }),
  });

  const today = toDateStr();
  const todayEntry = query.data?.find((r) => r.entry_date === today) ?? null;

  return {
    reflections: query.data ?? [],
    todayEntry,
    isLoading: query.isLoading,
    save: save.mutateAsync,
    isSaving: save.isPending,
  };
}
