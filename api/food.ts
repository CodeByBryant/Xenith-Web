import type { VercelRequest, VercelResponse } from "@vercel/node";

interface UsdaFoodNutrient {
  nutrientId: number;
  value: number;
}

interface UsdaFood {
  fdcId: number;
  description?: string;
  brandOwner?: string;
  dataType?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients?: UsdaFoodNutrient[];
}

interface FoodSearchResult {
  name: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  cholesterol_per_100g?: number;
  saturated_fat_per_100g?: number;
  polyunsaturated_fat_per_100g?: number;
  monounsaturated_fat_per_100g?: number;
  trans_fat_per_100g?: number;
  vitamin_a_per_100g?: number;
  vitamin_c_per_100g?: number;
  vitamin_d_per_100g?: number;
  vitamin_e_per_100g?: number;
  vitamin_k_per_100g?: number;
  thiamin_per_100g?: number;
  riboflavin_per_100g?: number;
  niacin_per_100g?: number;
  vitamin_b6_per_100g?: number;
  folate_per_100g?: number;
  vitamin_b12_per_100g?: number;
  calcium_per_100g?: number;
  iron_per_100g?: number;
  magnesium_per_100g?: number;
  phosphorus_per_100g?: number;
  potassium_per_100g?: number;
  zinc_per_100g?: number;
  selenium_per_100g?: number;
  brand?: string;
  serving_size?: string;
  serving_unit?: string;
  fdcId?: number;
  data_type?: string;
}

interface CachedResponse {
  expiresAt: number;
  items: FoodSearchResult[];
}

const CACHE_TTL_MS = 10 * 60 * 1000;
const MAX_CACHE_ITEMS = 200;
const SEARCH_CACHE = new Map<string, CachedResponse>();

const NUTRIENT_IDS = {
  ENERGY: 1008,
  PROTEIN: 1003,
  CARBS: 1005,
  FAT: 1004,
  FIBER: 1079,
  SUGAR: 2000,
  SODIUM: 1093,
  CHOLESTEROL: 1253,
  SATURATED_FAT: 1258,
  POLYUNSATURATED_FAT: 1293,
  MONOUNSATURATED_FAT: 1292,
  TRANS_FAT: 1257,
  VITAMIN_A: 1106,
  VITAMIN_C: 1162,
  VITAMIN_D: 1114,
  VITAMIN_E: 1109,
  VITAMIN_K: 1185,
  THIAMIN: 1165,
  RIBOFLAVIN: 1166,
  NIACIN: 1167,
  VITAMIN_B6: 1175,
  FOLATE: 1177,
  VITAMIN_B12: 1178,
  CALCIUM: 1087,
  IRON: 1089,
  MAGNESIUM: 1090,
  PHOSPHORUS: 1091,
  POTASSIUM: 1092,
  ZINC: 1095,
  SELENIUM: 1103,
} as const;

function setCorsHeaders(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function pruneCache() {
  const now = Date.now();

  for (const [key, value] of SEARCH_CACHE.entries()) {
    if (value.expiresAt <= now) {
      SEARCH_CACHE.delete(key);
    }
  }

  while (SEARCH_CACHE.size > MAX_CACHE_ITEMS) {
    const oldestKey = SEARCH_CACHE.keys().next().value;
    if (!oldestKey) break;
    SEARCH_CACHE.delete(oldestKey);
  }
}

function parseQuery(input: string | string[] | undefined): string {
  if (typeof input === "string") return input.trim();
  if (Array.isArray(input) && input.length > 0) return input[0].trim();
  return "";
}

function getNutrientValue(
  nutrients: UsdaFoodNutrient[] | undefined,
  nutrientId: number,
): number {
  if (!nutrients?.length) return 0;
  const entry = nutrients.find(
    (nutrient) => nutrient.nutrientId === nutrientId,
  );
  return typeof entry?.value === "number" ? entry.value : 0;
}

function optionalValue(value: number, precision = 1): number | undefined {
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return Number(value.toFixed(precision));
}

function mapFoodToResult(
  food: UsdaFood,
  queryLower: string,
): (FoodSearchResult & { _score: number }) | null {
  const name = food.description?.trim() ?? "";
  if (name.length < 2 || name.length > 160) return null;

  const nutrients = food.foodNutrients;
  const calories = Math.round(getNutrientValue(nutrients, NUTRIENT_IDS.ENERGY));
  if (calories <= 0) return null;

  const protein = getNutrientValue(nutrients, NUTRIENT_IDS.PROTEIN);
  const carbs = getNutrientValue(nutrients, NUTRIENT_IDS.CARBS);
  const fat = getNutrientValue(nutrients, NUTRIENT_IDS.FAT);

  const lowerName = name.toLowerCase();
  let score = 30;
  if (lowerName === queryLower) score = 100;
  else if (lowerName.startsWith(queryLower)) score = 80;
  else if (lowerName.includes(queryLower)) score = 60;

  return {
    name,
    fdcId: food.fdcId,
    data_type: food.dataType,
    brand: food.brandOwner || undefined,
    serving_size:
      typeof food.servingSize === "number"
        ? String(food.servingSize)
        : undefined,
    serving_unit: food.servingSizeUnit || undefined,
    calories_per_100g: calories,
    protein_per_100g: Number(protein.toFixed(1)),
    carbs_per_100g: Number(carbs.toFixed(1)),
    fat_per_100g: Number(fat.toFixed(1)),
    fiber_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.FIBER),
    ),
    sugar_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.SUGAR),
    ),
    sodium_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.SODIUM),
    ),
    cholesterol_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.CHOLESTEROL),
    ),
    saturated_fat_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.SATURATED_FAT),
    ),
    polyunsaturated_fat_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.POLYUNSATURATED_FAT),
    ),
    monounsaturated_fat_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.MONOUNSATURATED_FAT),
    ),
    trans_fat_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.TRANS_FAT),
    ),
    vitamin_a_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_A),
    ),
    vitamin_c_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_C),
    ),
    vitamin_d_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_D),
    ),
    vitamin_e_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_E),
      2,
    ),
    vitamin_k_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_K),
    ),
    thiamin_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.THIAMIN),
      2,
    ),
    riboflavin_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.RIBOFLAVIN),
      2,
    ),
    niacin_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.NIACIN),
      2,
    ),
    vitamin_b6_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_B6),
      2,
    ),
    folate_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.FOLATE),
    ),
    vitamin_b12_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.VITAMIN_B12),
      2,
    ),
    calcium_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.CALCIUM),
    ),
    iron_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.IRON),
      2,
    ),
    magnesium_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.MAGNESIUM),
    ),
    phosphorus_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.PHOSPHORUS),
    ),
    potassium_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.POTASSIUM),
    ),
    zinc_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.ZINC),
      2,
    ),
    selenium_per_100g: optionalValue(
      getNutrientValue(nutrients, NUTRIENT_IDS.SELENIUM),
    ),
    _score: score,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const query = parseQuery(req.query.query);
  if (!query) {
    res.status(400).json({ error: "Missing or invalid 'query' parameter" });
    return;
  }

  pruneCache();

  const cacheKey = query.toLowerCase();
  const cached = SEARCH_CACHE.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    res.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=600, stale-while-revalidate=120",
    );
    res.status(200).json({ items: cached.items, cached: true, source: "usda" });
    return;
  }

  const usdaApiKey =
    process.env.USDA_FDC_API_KEY || process.env.FDC_API_KEY || "DEMO_KEY";

  const url =
    "https://api.nal.usda.gov/fdc/v1/foods/search" +
    `?query=${encodeURIComponent(query)}` +
    "&pageSize=25" +
    "&dataType=Branded,SR%20Legacy,Foundation" +
    `&api_key=${encodeURIComponent(usdaApiKey)}`;

  try {
    const upstream = await fetch(url, { signal: AbortSignal.timeout(10000) });

    if (upstream.status === 429) {
      res.status(429).json({
        error: "rate_limited",
        message: "USDA rate limit reached. Please retry shortly.",
      });
      return;
    }

    if (!upstream.ok) {
      res.status(upstream.status).json({
        error: "upstream_error",
        message: `USDA search failed (${upstream.status})`,
      });
      return;
    }

    const payload = (await upstream.json()) as { foods?: UsdaFood[] };
    const queryLower = query.toLowerCase();

    const items = (payload.foods ?? [])
      .map((food) => mapFoodToResult(food, queryLower))
      .filter((food): food is FoodSearchResult & { _score: number } => !!food)
      .sort((a, b) => b._score - a._score)
      .slice(0, 12)
      .map(({ _score: _unused, ...food }) => food);

    SEARCH_CACHE.set(cacheKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      items,
    });

    res.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=600, stale-while-revalidate=120",
    );
    res.status(200).json({ items, cached: false, source: "usda" });
  } catch (error) {
    res.status(502).json({
      error: "upstream_unavailable",
      message: "Unable to reach USDA search service.",
      details: String(error),
    });
  }
}
