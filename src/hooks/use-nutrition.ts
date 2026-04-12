import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { MealType, NutritionLog, FoodSearchResult } from "@/lib/types";

export type { FoodSearchResult, MealType } from "@/lib/types";

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
    // Key micronutrients
    fiber: +(query.data?.reduce((s, e) => s + (e.fiber || 0), 0) ?? 0).toFixed(1),
    sugar: +(query.data?.reduce((s, e) => s + (e.sugar || 0), 0) ?? 0).toFixed(1),
    sodium: Math.round(query.data?.reduce((s, e) => s + (e.sodium || 0), 0) ?? 0),
    cholesterol: Math.round(query.data?.reduce((s, e) => s + (e.cholesterol || 0), 0) ?? 0),
    saturated_fat: +(query.data?.reduce((s, e) => s + (e.saturated_fat || 0), 0) ?? 0).toFixed(1),
    vitamin_c: +(query.data?.reduce((s, e) => s + (e.vitamin_c || 0), 0) ?? 0).toFixed(1),
    calcium: Math.round(query.data?.reduce((s, e) => s + (e.calcium || 0), 0) ?? 0),
    iron: +(query.data?.reduce((s, e) => s + (e.iron || 0), 0) ?? 0).toFixed(1),
    potassium: Math.round(query.data?.reduce((s, e) => s + (e.potassium || 0), 0) ?? 0),
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

const SEARCH_RETRY_DELAYS_MS = [250, 800, 1500] as const;

export class FoodSearchError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = "FoodSearchError";
    this.code = code;
  }
}

async function searchFoodOnce(query: string): Promise<FoodSearchResult[]> {
  const supportsAbortTimeout =
    typeof AbortSignal !== "undefined" &&
    "timeout" in AbortSignal &&
    typeof AbortSignal.timeout === "function";

  const requestOptions = supportsAbortTimeout
    ? { signal: AbortSignal.timeout(10000) }
    : undefined;

  const response = await fetch(
    `/api/food?query=${encodeURIComponent(query)}`,
    requestOptions,
  );

  if (response.status === 429) {
    throw new FoodSearchError("Food search rate-limited", 429);
  }

  if (!response.ok) {
    throw new FoodSearchError(`Food search failed (${response.status})`, response.status);
  }

  const payload = await response.json();
  if (Array.isArray(payload)) return payload as FoodSearchResult[];
  if (Array.isArray(payload?.items)) return payload.items as FoodSearchResult[];
  return [];
}

/** Search foods via backend proxy with retry/backoff for transient failures. */
export async function searchFood(query: string): Promise<FoodSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  let lastError: unknown;

  for (let attempt = 0; attempt <= SEARCH_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await searchFoodOnce(trimmed);
    } catch (error) {
      lastError = error;
      const code = error instanceof FoodSearchError ? error.code : 0;
      const isRetryable = code === 429 || code >= 500 || code === 0;

      if (!isRetryable || attempt === SEARCH_RETRY_DELAYS_MS.length) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, SEARCH_RETRY_DELAYS_MS[attempt]));
    }
  }

  if (lastError instanceof FoodSearchError) {
    throw lastError;
  }

  throw new FoodSearchError("Food search unavailable", 503);
}

/** Lookup a single product by barcode via Open Food Facts */
export async function lookupBarcode(
  barcode: string,
): Promise<FoodSearchResult | null> {
  try {
    const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error('Barcode lookup failed:', res.status);
      return null;
    }
    const data = await res.json();
    const p = data.product;
    if (!p?.nutriments?.["energy-kcal_100g"]) {
      console.log('No nutrition data for barcode:', barcode);
      return null;
    }
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
  } catch (err) {
    console.error('Barcode lookup error:', err);
    return null;
  }
}
