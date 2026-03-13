import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface NutritionLog {
  id: string;
  user_id: string;
  date: string;
  meal_type: MealType;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  grams: number;
  created_at: string;
}

export interface FoodSearchResult {
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
}

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}

export function useNutrition(date?: Date) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const dateStr = toDateStr(date);

  const query = useQuery({
    queryKey: ["nutrition", user?.id, dateStr],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return [];
      const { data, error } = await supabase
        .from("nutrition_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", dateStr)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as NutritionLog[];
    },
  });

  const add = useMutation({
    mutationFn: async (
      entry: Omit<NutritionLog, "id" | "user_id" | "created_at" | "date">,
    ) => {
      if (!supabase || !user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("nutrition_logs")
        .insert({ ...entry, user_id: user.id, date: dateStr });
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["nutrition", user?.id, dateStr] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("nutrition_logs")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["nutrition", user?.id, dateStr] }),
  });

  const totals = {
    calories: Math.round(query.data?.reduce((s, e) => s + e.calories, 0) ?? 0),
    protein: +(query.data?.reduce((s, e) => s + e.protein, 0) ?? 0).toFixed(1),
    carbs: +(query.data?.reduce((s, e) => s + e.carbs, 0) ?? 0).toFixed(1),
    fat: +(query.data?.reduce((s, e) => s + e.fat, 0) ?? 0).toFixed(1),
  };

  return {
    logs: query.data ?? [],
    totals,
    isLoading: query.isLoading,
    add: add.mutateAsync,
    isAdding: add.isPending,
    remove: remove.mutateAsync,
  };
}

/** Weekly stats — for health dimension summary card */
export function useNutritionWeekStats() {
  const { user } = useAuth();
  const weekAgo = toDateStr(new Date(Date.now() - 6 * 86400000));

  return useQuery({
    queryKey: ["nutrition_week", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!supabase || !user) return null;
      const { data, error } = await supabase
        .from("nutrition_logs")
        .select("date, calories")
        .eq("user_id", user.id)
        .gte("date", weekAgo);
      if (error) throw error;
      const rows = data ?? [];
      const days = new Set(rows.map((r: { date: string }) => r.date));
      const loggedDays = days.size;
      const avgCalories =
        loggedDays > 0
          ? Math.round(
              rows.reduce(
                (s: number, r: { calories: number }) => s + r.calories,
                0,
              ) / loggedDays,
            )
          : 0;
      return { loggedDays, avgCalories, totalDays: 7 };
    },
  });
}

/** Search Open Food Facts by food name (debounce on the caller side) */
export async function searchFood(query: string): Promise<FoodSearchResult[]> {
  if (!query.trim()) return [];
  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${encodeURIComponent(query)}&json=1&page_size=12&fields=product_name,nutriments`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (
      (data.products ?? [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter(
          (p: any) =>
            p.product_name && p.nutriments?.["energy-kcal_100g"] != null,
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((p: any) => ({
          name: String(p.product_name).trim(),
          calories_per_100g: Math.round(p.nutriments["energy-kcal_100g"] ?? 0),
          protein_per_100g: +(
            (p.nutriments["proteins_100g"] ?? 0) as number
          ).toFixed(1),
          carbs_per_100g: +(
            (p.nutriments["carbohydrates_100g"] ?? 0) as number
          ).toFixed(1),
          fat_per_100g: +((p.nutriments["fat_100g"] ?? 0) as number).toFixed(1),
        }))
    );
  } catch {
    return [];
  }
}

/** Lookup a single product by barcode via Open Food Facts */
export async function lookupBarcode(
  barcode: string,
): Promise<FoodSearchResult | null> {
  try {
    const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    const p = data.product;
    if (!p?.nutriments?.["energy-kcal_100g"]) return null;
    return {
      name: String(p.product_name ?? `Product ${barcode}`).trim(),
      calories_per_100g: Math.round(p.nutriments["energy-kcal_100g"] ?? 0),
      protein_per_100g: +(
        (p.nutriments["proteins_100g"] ?? 0) as number
      ).toFixed(1),
      carbs_per_100g: +(
        (p.nutriments["carbohydrates_100g"] ?? 0) as number
      ).toFixed(1),
      fat_per_100g: +((p.nutriments["fat_100g"] ?? 0) as number).toFixed(1),
    };
  } catch {
    return null;
  }
}
