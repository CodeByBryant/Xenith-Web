import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Transaction, TransactionInput } from "@/lib/types";

export function useTransactions(month?: string) {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", month],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });

      if (month) {
        const [year, monthNum] = month.split("-");
        const startDate = `${year}-${monthNum}-01`;
        const endDate = new Date(parseInt(year), parseInt(monthNum), 0)
          .toISOString()
          .split("T")[0];
        query = query.gte("date", startDate).lte("date", endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Transaction[];
    },
  });

  const add = async (input: TransactionInput) => {
    setIsAdding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        amount: input.amount,
        type: input.type,
        category: input.category,
        description: input.description || null,
        date: input.date || new Date().toISOString().split("T")[0],
      });

      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    } finally {
      setIsAdding(false);
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  const update = async (id: string, input: Partial<TransactionInput>) => {
    const { error } = await supabase
      .from("transactions")
      .update(input)
      .eq("id", id);
    if (error) throw error;
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  return {
    transactions,
    isLoading,
    isAdding,
    add,
    remove,
    update,
  };
}
