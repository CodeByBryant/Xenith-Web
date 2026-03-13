import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export function useSkillTree() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["skill_tree", user?.id],
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!supabase || !user) return [] as string[];
      const { data, error } = await supabase
        .from("skill_tree_completions")
        .select("node_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.node_id as string);
    },
  });

  const completedIds = new Set(data);

  const { mutate: toggle } = useMutation({
    mutationFn: async (nodeId: string) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      // Determine current state from pre-mutation cache (closed-over completedIds)
      if (completedIds.has(nodeId)) {
        const { error } = await supabase
          .from("skill_tree_completions")
          .delete()
          .eq("user_id", user.id)
          .eq("node_id", nodeId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("skill_tree_completions")
          .insert({ user_id: user.id, node_id: nodeId });
        if (error) throw error;
      }
    },
    onMutate: async (nodeId) => {
      await qc.cancelQueries({ queryKey: ["skill_tree", user?.id] });
      const prev = qc.getQueryData<string[]>(["skill_tree", user?.id]) ?? [];
      const next = prev.includes(nodeId)
        ? prev.filter((id) => id !== nodeId)
        : [...prev, nodeId];
      qc.setQueryData(["skill_tree", user?.id], next);
      return { prev };
    },
    onError: (_err, _nodeId, ctx) => {
      if (ctx?.prev) qc.setQueryData(["skill_tree", user?.id], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["skill_tree", user?.id] });
    },
  });

  return { completedIds, toggle, isLoading };
}
