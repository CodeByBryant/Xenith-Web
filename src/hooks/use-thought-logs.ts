import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { ThoughtLog, ThoughtLogInput, ThoughtType } from "@/lib/types";

export function useThoughtLogs(typeFilter?: ThoughtType) {
  return useQuery({
    queryKey: ["thought-logs", typeFilter],
    queryFn: async () => {
      let query = supabase
        .from("thought_logs")
        .select("*")
        .order("logged_at", { ascending: false });

      if (typeFilter) {
        query = query.eq("type", typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ThoughtLog[];
    },
  });
}

export function useAddThoughtLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ThoughtLogInput) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("thought_logs")
        .insert({
          ...input,
          user_id: userData.user.id,
          logged_at: input.logged_at || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thought-logs"] });
    },
  });
}

export function useUpdateThoughtLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ThoughtLogInput> }) => {
      const { data, error } = await supabase
        .from("thought_logs")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thought-logs"] });
    },
  });
}

export function useDeleteThoughtLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("thought_logs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thought-logs"] });
    },
  });
}
