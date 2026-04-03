import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Book, BookInput } from "@/lib/types";

export function useBooks(status?: string) {
  const queryClient = useQueryClient();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books", status],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("books")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Book[];
    },
  });

  const add = useMutation({
    mutationFn: async (input: BookInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Auto-calculate progress from pages if provided
      let progressPercent = input.progress_percent || 0;
      if (input.total_pages && input.current_page) {
        progressPercent = Math.round((input.current_page / input.total_pages) * 100);
      }

      const { error } = await supabase.from("books").insert({
        user_id: user.id,
        title: input.title,
        author: input.author || null,
        status: input.status || "reading",
        progress_percent: progressPercent,
        total_pages: input.total_pages || null,
        current_page: input.current_page || null,
        rating: input.rating || null,
        key_takeaways: input.key_takeaways || null,
        notes: input.notes || null,
        started_date: input.started_date || new Date().toISOString().split("T")[0],
        completed_date: input.completed_date || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<BookInput> }) => {
      // Auto-calculate progress from pages if provided
      const updateData = { ...input };
      if (input.total_pages && input.current_page) {
        updateData.progress_percent = Math.round((input.current_page / input.total_pages) * 100);
      }

      const { error } = await supabase
        .from("books")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  return {
    books,
    isLoading,
    add: add.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    isAdding: add.isPending,
    isUpdating: update.isPending,
  };
}
