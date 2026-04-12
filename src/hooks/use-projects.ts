import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { Project } from "@/lib/types";

export function useProjects() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["projects", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Project[];
    },
  });

  const add = useMutation({
    mutationFn: async (input: { name: string; icon?: string; color?: string }) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("projects")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as Project;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects", user?.id] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<Project> }) => {
      if (!supabase) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("projects")
        .update(input)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects", user?.id] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error("Not authenticated");
      const { error} = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects", user?.id] }),
  });

  return {
    projects: query.data ?? [],
    isLoading: query.isLoading,
    add: add.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    isAdding: add.isPending,
    isUpdating: update.isPending,
  };
}
