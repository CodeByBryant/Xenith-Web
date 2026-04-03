import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { WaterLog, Supplement, SupplementLog } from "@/lib/types";

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}

// ─── Water Tracking ──────────────────────────────────────────────────────────

export function useWater(date: Date = new Date()) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dateStr = toDateStr(date);

  const query = useQuery<WaterLog[]>({
    queryKey: ["water", user?.id, dateStr],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("water_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", dateStr)
        .order("logged_at", { ascending: true });
      if (error) throw error;
      return data as WaterLog[];
    },
  });

  const totalMl = query.data?.reduce((sum, log) => sum + log.amount_ml, 0) || 0;

  const addMutation = useMutation({
    mutationFn: async (amountMl: number) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("water_logs")
        .insert({
          user_id: user.id,
          date: dateStr,
          amount_ml: amountMl,
        })
        .select()
        .single();
      if (error) throw error;
      return data as WaterLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water", user?.id, dateStr] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (logId: string) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("water_logs")
        .delete()
        .eq("id", logId)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water", user?.id, dateStr] });
    },
  });

  return {
    logs: query.data || [],
    totalMl,
    isLoading: query.isLoading,
    addWater: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    removeLog: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
  };
}

// ─── Supplements Management ──────────────────────────────────────────────────

export function useSupplements() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Supplement[]>({
    queryKey: ["supplements", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("supplements")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Supplement[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (input: {
      name: string;
      dosage?: string;
      unit?: string;
      notes?: string;
    }) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("supplements")
        .insert({
          user_id: user.id,
          ...input,
        })
        .select()
        .single();
      if (error) throw error;
      return data as Supplement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplements", user?.id] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Supplement>;
    }) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("supplements")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data as Supplement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplements", user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("supplements")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplements", user?.id] });
    },
  });

  return {
    supplements: query.data || [],
    isLoading: query.isLoading,
    addSupplement: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateSupplement: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    removeSupplement: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
  };
}

// ─── Supplement Logging ──────────────────────────────────────────────────────

export function useSupplementLogs(date: Date = new Date()) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dateStr = toDateStr(date);

  const query = useQuery<SupplementLog[]>({
    queryKey: ["supplement-logs", user?.id, dateStr],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("supplement_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", dateStr)
        .order("logged_at", { ascending: false });
      if (error) throw error;
      return data as SupplementLog[];
    },
  });

  const logMutation = useMutation({
    mutationFn: async ({
      supplementId,
      taken,
    }: {
      supplementId: string;
      taken: boolean;
    }) => {
      if (!supabase || !user) throw new Error("Not authenticated");

      const existing = query.data?.find(
        (log) => log.supplement_id === supplementId && log.date === dateStr,
      );

      if (existing) {
        const { data, error } = await supabase
          .from("supplement_logs")
          .update({ taken })
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        return data as SupplementLog;
      } else {
        const { data, error } = await supabase
          .from("supplement_logs")
          .insert({
            user_id: user.id,
            supplement_id: supplementId,
            date: dateStr,
            taken,
          })
          .select()
          .single();
        if (error) throw error;
        return data as SupplementLog;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["supplement-logs", user?.id, dateStr],
      });
    },
  });

  return {
    logs: query.data || [],
    isLoading: query.isLoading,
    logSupplement: logMutation.mutateAsync,
    isLogging: logMutation.isPending,
  };
}
