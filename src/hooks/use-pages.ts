import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { Page } from "@/lib/types";

interface NewPageInput {
  project_id: string;
  folder_id?: string;
  parent_page_id?: string;
  title?: string;
}

export function usePages(projectId?: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const pagesQueryKey = ["pages", user?.id, projectId] as const;

  const query = useQuery({
    queryKey: pagesQueryKey,
    enabled: !!user && !!projectId,
    queryFn: async () => {
      if (!supabase || !user || !projectId) return [];
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("user_id", user.id)
        .eq("project_id", projectId)
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Page[];
    },
  });

  const getPage = useMutation({
    mutationFn: async (pageId: string) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .eq("id", pageId)
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data as Page;
    },
  });

  const add = useMutation({
    mutationFn: async (input: NewPageInput) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("pages")
        .insert({
          ...input,
          user_id: user.id,
          title: input.title || "Untitled",
          content: {},
        })
        .select()
        .single();
      if (error) throw error;
      return data as Page;
    },
    onSuccess: (createdPage) => {
      qc.setQueryData<Page[] | undefined>(pagesQueryKey, (current) => {
        if (!current) return [createdPage];
        return [...current, createdPage];
      });
    },
  });

  const search = useMutation({
    mutationFn: async (term: string) => {
      if (!supabase || !user || !projectId) return [];

      const queryText = term.trim();
      if (!queryText) return [];

      const baseQuery = supabase
        .from("pages")
        .select("*")
        .eq("user_id", user.id)
        .eq("project_id", projectId)
        .limit(25);

      const { data, error } = await baseQuery.ilike("title", `%${queryText}%`);

      if (!error) {
        return (data ?? []) as Page[];
      }

      // Fallback to full table scan title query when ilike fails unexpectedly.
      const { data: fallback, error: fallbackError } = await supabase
        .from("pages")
        .select("*")
        .eq("user_id", user.id)
        .eq("project_id", projectId)
        .limit(25);

      if (fallbackError) throw fallbackError;

      return (fallback ?? []).filter((page) =>
        page.title.toLowerCase().includes(queryText.toLowerCase()),
      ) as Page[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Partial<Page> }) => {
      if (!supabase) throw new Error("Not authenticated");
      const { error } = await supabase.from("pages").update(input).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      qc.setQueryData<Page[] | undefined>(pagesQueryKey, (current) => {
        if (!current) return current;

        return current.map((page) =>
          page.id === variables.id ? { ...page, ...variables.input } : page,
        );
      });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error("Not authenticated");
      const { error } = await supabase.from("pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, deletedId) => {
      qc.setQueryData<Page[] | undefined>(pagesQueryKey, (current) => {
        if (!current) return current;
        return current.filter((page) => page.id !== deletedId);
      });
    },
  });

  return {
    pages: query.data ?? [],
    isLoading: query.isLoading,
    getPage: getPage.mutateAsync,
    add: add.mutateAsync,
    update: update.mutateAsync,
    remove: remove.mutateAsync,
    searchPages: search.mutateAsync,
    searchingPages: search.isPending,
    isAdding: add.isPending,
    isUpdating: update.isPending,
  };
}
