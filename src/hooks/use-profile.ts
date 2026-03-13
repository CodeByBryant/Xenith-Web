import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { Profile } from "@/lib/types";

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Profile | null>({
    queryKey: ["profile", user?.id],
    enabled: !!user && isSupabaseConfigured,
    queryFn: async () => {
      if (!supabase || !user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) throw error;
      return data as Profile;
    },
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      // upsert handles the case where the trigger hasn't created the row yet
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: user.id, ...updates }, { onConflict: "id" })
        .select()
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile", user?.id], updated);
    },
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
