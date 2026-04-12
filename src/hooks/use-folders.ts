import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { Folder } from "@/lib/types";

export function useFolders(projectId?: string) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["folders", user?.id, projectId],
    enabled: !!user && !!projectId,
    queryFn: async () => {
      if (!supabase || !user || !projectId) return [];
      const { data, error } = await supabase
        .from("folders")
        .select("*")
        .eq("user_id", user.id)
        .eq("project_id", projectId)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Folder[];
    },
  });

  const add = useMutation({
    mutationFn: async (input: { project_id: string; parent_folder_id?: string; name: string }) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("folders")
        .insert({ ...input, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data as Folder;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["folders", user?.id] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<Folder> }) => {
      if (!supabase) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("folders")
        .update(input)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["folders", user?.id] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error("Not authenticated");
      const { error } = await supabase.from("folders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["folders", user?.id] }),
  });

  return {
    folders: query.data ?? [],
    isLoading: query.isLoading,
    add: add.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    isAdding: add.isPending,
    isUpdating: update.isPending,
  };
}
