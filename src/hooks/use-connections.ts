import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Connection, ConnectionInput } from "@/lib/types";

export function useConnections() {
  const queryClient = useQueryClient();

  const { data: connections = [], isLoading } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("connections")
        .select("*")
        .eq("user_id", user.id)
        .order("last_contact_date", { ascending: true, nullsFirst: true });

      if (error) throw error;
      return (data || []) as Connection[];
    },
  });

  const add = useMutation({
    mutationFn: async (input: ConnectionInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("connections").insert({
        user_id: user.id,
        name: input.name,
        relationship_type: input.relationship_type || null,
        last_contact_date: input.last_contact_date || null,
        health_score: input.health_score || null,
        notes: input.notes || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<ConnectionInput> }) => {
      const { error } = await supabase
        .from("connections")
        .update(input)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });

  const logContact = useMutation({
    mutationFn: async (id: string) => {
      const today = new Date().toISOString().split("T")[0];
      const { error } = await supabase
        .from("connections")
        .update({ last_contact_date: today })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("connections")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
    },
  });

  return {
    connections,
    isLoading,
    add: add.mutateAsync,
    update: update.mutateAsync,
    logContact: logContact.mutateAsync,
    remove: remove.mutateAsync,
    isAdding: add.isPending,
    isUpdating: update.isPending,
    isLoggingContact: logContact.isPending,
  };
}
