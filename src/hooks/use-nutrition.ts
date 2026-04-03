import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import type { MealType, NutritionLog, FoodSearchResult } from "@/lib/types";

interface OpenFoodFactsProduct {
  product_name: string;
  nutriments: {
    "energy-kcal_100g": number;
    proteins_100g: number;
    carbohydrates_100g: number;
    fat_100g: number;
  };
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

interface USDAFood {
  fdcId: number;
  description: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    value: number;
  }>;
}

/** Search USDA FoodData Central by food name */
export async function searchFood(query: string): Promise<FoodSearchResult[]> {
  if (!query.trim()) return [];
  try {
    // USDA FoodData Central API (free, no key required for search)
    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=25&api_key=DEMO_KEY`
    );
    
    if (!res.ok) {
      console.error('USDA API error:', res.status, res.statusText);
      return [];
    }
    
    const data = await res.json();
    if (!data.foods || data.foods.length === 0) {
      console.log('No foods found for:', query);
      return [];
    }

    const queryLower = query.toLowerCase();
    
    return (
      (data.foods ?? [])
        .filter(
          (food: USDAFood) =>
            food.description &&
            food.description.length > 2 &&
            food.description.length < 150 &&
            food.foodNutrients &&
            food.foodNutrients.length > 0
        )
        .map((food: USDAFood) => {
          const name = food.description.trim();
          const nameLower = name.toLowerCase();
          
          // Calculate relevance score
          let relevance = 0;
          if (nameLower === queryLower) relevance = 100;
          else if (nameLower.startsWith(queryLower)) relevance = 80;
          else if (nameLower.includes(queryLower)) relevance = 60;
          else relevance = 30;
          
          // Extract nutrients (USDA uses nutrient IDs)
          // 1008 = Energy (kcal), 1003 = Protein, 1005 = Carbs, 1004 = Fat
          const nutrients = food.foodNutrients.reduce((acc, n) => {
            if (n.nutrientId === 1008) acc.calories = n.value;
            if (n.nutrientId === 1003) acc.protein = n.value;
            if (n.nutrientId === 1005) acc.carbs = n.value;
            if (n.nutrientId === 1004) acc.fat = n.value;
            return acc;
          }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

          return {
            name,
            calories_per_100g: Math.round(nutrients.calories),
            protein_per_100g: +nutrients.protein.toFixed(1),
            carbs_per_100g: +nutrients.carbs.toFixed(1),
            fat_per_100g: +nutrients.fat.toFixed(1),
            _relevance: relevance,
          };
        })
        .filter((food: any) => food.calories_per_100g > 0) // Filter out items with no calorie data
        .sort((a: any, b: any) => (b._relevance || 0) - (a._relevance || 0))
        .slice(0, 12)
        .map(({ _relevance, ...food }: any) => food)
    );
  } catch (err) {
    console.error('Food search error:', err);
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
