import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { LIFE_DIMENSIONS, type LifeDimensionName } from "@/lib/types";

export interface DimensionScore {
  dimension: LifeDimensionName;
  score: number;
  week_start: string;
}

function weekStart(d = new Date()) {
  const day = d.getDay(); // 0=Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const mon = new Date(d.setDate(diff));
  return mon.toISOString().split("T")[0];
}

export function useDimensionScores(weeksBack = 4) {
  const { user } = useAuth();

  const weeks = Array.from({ length: weeksBack }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    return weekStart(d);
  });
  const oldest = weeks[weeks.length - 1];

  const query = useQuery({
    queryKey: ["dimension_scores", user?.id, weeksBack],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("life_dimension_scores")
        .select("*")
        .eq("user_id", user.id)
        .gte("week_start", oldest)
        .order("week_start", { ascending: false });
      if (error) throw error;
      return (data ?? []) as DimensionScore[];
    },
  });

  const qc = useQueryClient();

  const saveScores = useMutation({
    mutationFn: async (scores: Record<LifeDimensionName, number>) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const ws = weekStart();
      const rows = LIFE_DIMENSIONS.map((d) => ({
        user_id: user.id,
        dimension: d,
        score: scores[d],
        week_start: ws,
      }));
      const { error } = await supabase
        .from("life_dimension_scores")
        .upsert(rows, { onConflict: "user_id,dimension,week_start" });
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["dimension_scores", user?.id] }),
  });

  // Current week's scores as a map
  const currentWs = weekStart();
  const currentScores = Object.fromEntries(
    LIFE_DIMENSIONS.map((d) => {
      const row = query.data?.find(
        (r) => r.dimension === d && r.week_start === currentWs,
      );
      return [d, row?.score ?? 0];
    }),
  ) as Record<LifeDimensionName, number>;

  return {
    scores: query.data ?? [],
    currentScores,
    isLoading: query.isLoading,
    saveScores: saveScores.mutateAsync,
    isSaving: saveScores.isPending,
    weeks,
  };
}
