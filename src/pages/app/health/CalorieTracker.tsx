import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Camera,
  X,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CameraOff,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { useNutrition, searchFood, lookupBarcode } from "@/hooks/use-nutrition";
import { useProfile } from "@/hooks/use-profile";
import type { FoodSearchResult, MealType } from "@/hooks/use-nutrition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── helper to get all meal categories ─────────────────────────────────
function getMealCategories(profile: any): { id: MealType; label: string }[] {
  const base: { id: MealType; label: string }[] = [
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "snack", label: "Snacks" },
    { id: "uncategorized", label: "Uncategorized" },
  ];

  const custom: { id: MealType; label: string }[] = [];
  if (profile?.custom_meal_1) custom.push({ id: "custom_1", label: profile.custom_meal_1 });
  if (profile?.custom_meal_2) custom.push({ id: "custom_2", label: profile.custom_meal_2 });
  if (profile?.custom_meal_3) custom.push({ id: "custom_3", label: profile.custom_meal_3 });
  if (profile?.custom_meal_4) custom.push({ id: "custom_4", label: profile.custom_meal_4 });

  return [...base, ...custom];
}

const MACRO_COLORS = {
  protein: "bg-blue-500",
  carbs: "bg-yellow-500",
  fat: "bg-rose-500",
};

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}
function offsetDate(from: Date, days: number) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}
function formatDate(d: Date) {
  const today = new Date();
  const ds = d.toDateString();
  if (ds === today.toDateString()) return "Today";
  if (ds === offsetDate(today, -1).toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function scale(food: FoodSearchResult, grams: number) {
  const f = grams / 100;
  return {
    calories: Math.round(food.calories_per_100g * f),
    protein: +(food.protein_per_100g * f).toFixed(1),
    carbs: +(food.carbs_per_100g * f).toFixed(1),
    fat: +(food.fat_per_100g * f).toFixed(1),
  };
}

// ─── BarcodeScanner ──────────────────────────────────────────────────────────
function BarcodeScanner({
  onResult,
  onClose,
}: {
  onResult: (code: string) => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        if (cancelled || !videoRef.current) return;
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (result && !cancelled) {
              controls.stop();
              cancelled = true;
              onResult(result.getText());
            }
          },
        );
        controlsRef.current = controls;
        setLoading(false);
      } catch {
        if (!cancelled)
          setError("Could not access camera. Check browser permissions.");
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      controlsRef.current?.stop();
    };
  }, [onResult]);

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-medium text-foreground">Scan barcode</p>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-[4/3] bg-black flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          {error ? (
            <div className="flex flex-col items-center gap-2 p-6 text-center">
              <CameraOff className="w-8 h-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
          )}
          {/* Finder frame */}
          {!error && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-32 border-2 border-white/70 rounded-lg" />
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center p-3">
          Point at a product barcode to scan
        </p>
      </div>
    </div>
  );
}

// ─── MacroBar ────────────────────────────────────────────────────────────────
function MacroBar({
  label,
  value,
  max,
  colorClass,
}: {
  label: string;
  value: number;
  max: number;
  colorClass: string;
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-medium tabular-nums">
          {value}g
        </span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full">
        <div
          className={cn("h-full rounded-full transition-all", colorClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── CategorySettingsDialog ──────────────────────────────────────────────────
function CategorySettingsDialog({
  isOpen,
  onClose,
  profile,
  updateProfile,
  isUpdating,
}: {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  updateProfile: (updates: any) => Promise<any>;
  isUpdating: boolean;
}) {
  const [custom1, setCustom1] = useState(profile?.custom_meal_1 || "");
  const [custom2, setCustom2] = useState(profile?.custom_meal_2 || "");
  const [custom3, setCustom3] = useState(profile?.custom_meal_3 || "");
  const [custom4, setCustom4] = useState(profile?.custom_meal_4 || "");

  const handleSave = async () => {
    try {
      await updateProfile({
        custom_meal_1: custom1 || null,
        custom_meal_2: custom2 || null,
        custom_meal_3: custom3 || null,
        custom_meal_4: custom4 || null,
      });
      toast.success("Meal categories updated");
      onClose();
    } catch {
      toast.error("Failed to save categories");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Custom Meal Categories
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Add up to 4 custom meal categories for tracking specific eating patterns.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Custom Category 1
            </label>
            <Input
              value={custom1}
              onChange={(e) => setCustom1(e.target.value)}
              placeholder="e.g., Pre-Workout, Dessert"
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Custom Category 2
            </label>
            <Input
              value={custom2}
              onChange={(e) => setCustom2(e.target.value)}
              placeholder="e.g., Post-Workout"
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Custom Category 3
            </label>
            <Input
              value={custom3}
              onChange={(e) => setCustom3(e.target.value)}
              placeholder="e.g., Late Night"
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Custom Category 4
            </label>
            <Input
              value={custom4}
              onChange={(e) => setCustom4(e.target.value)}
              placeholder="e.g., Meal Prep"
              className="text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdating} className="flex-1">
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── CalorieTracker ──────────────────────────────────────────────────────────
export default function CalorieTracker() {
  const [date, setDate] = useState(new Date());
  const { logs, totals, isLoading, add, isAdding, remove } = useNutrition(date);
  const { profile, updateProfile, isUpdating } = useProfile();
  const [showCategorySettings, setShowCategorySettings] = useState(false);
  const MEALS = getMealCategories(profile);

  // Search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<FoodSearchResult | null>(null);
  const [grams, setGrams] = useState(100);
  const [mealType, setMealType] = useState<MealType>("breakfast");

  // Barcode
  const [showScanner, setShowScanner] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced food search
  useEffect(() => {
    let active = true; // Track if this specific effect run is still valid

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!query.trim()) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const items = await searchFood(query);
        if (active) {
          setResults(items || []);
          if (items.length === 0) {
            console.log('No results found for query:', query);
          }
        }
      } catch (error) {
        console.error('Food search error:', error);
        if (active) {
          setResults([]);
          toast.error('Failed to search foods. Please try again.');
        }
      } finally {
        if (active) {
          setSearching(false);
        }
      }
    }, 500);
    
    return () => {
      active = false;
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [query]);

  const handleBarcodeResult = useCallback(async (code: string) => {
    setShowScanner(false);
    toast.info("Looking up product…");
    const food = await lookupBarcode(code);
    if (food) {
      setSelected(food);
      setQuery(food.name);
      setResults([]);
    } else {
      toast.error("Product not found in Open Food Facts.");
    }
  }, []);

  const handleSelectFood = (food: FoodSearchResult) => {
    setSelected(food);
    setQuery(food.name);
    setResults([]);
  };

  const handleAdd = async () => {
    if (!selected) return;
    const macros = scale(selected, grams);
    try {
      await add({
        meal_type: mealType,
        food_name: selected.name,
        grams,
        ...macros,
      });
      setSelected(null);
      setQuery("");
      setGrams(100);
    } catch {
      toast.error("Failed to log food.");
    }
  };

  const isToday = toDateStr(date) === toDateStr();
  const logsByMeal = MEALS.map((m) => ({
    ...m,
    entries: logs.filter((l) => l.meal_type === m.id),
  }));

  const staged = selected ? scale(selected, grams) : null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header with date nav and settings */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setDate((d) => offsetDate(d, -1))}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-foreground">
          {formatDate(date)}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDate((d) => offsetDate(d, 1))}
            disabled={isToday}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCategorySettings(true)}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Manage meal categories"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calorie summary ring */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-6">
          {/* Ring */}
          <div className="relative shrink-0">
            <svg width={80} height={80} className="-rotate-90">
              <circle
                cx={40}
                cy={40}
                r={34}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth={5}
              />
              <circle
                cx={40}
                cy={40}
                r={34}
                fill="none"
                stroke="#22c55e"
                strokeWidth={5}
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={
                  2 * Math.PI * 34 * (1 - Math.min(totals.calories / 2000, 1))
                }
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-bold text-foreground tabular-nums leading-none">
                {totals.calories}
              </span>
              <span className="text-[9px] text-muted-foreground">kcal</span>
            </div>
          </div>
          {/* Macros */}
          <div className="flex-1 space-y-2.5">
            <MacroBar
              label="Protein"
              value={totals.protein}
              max={150}
              colorClass={MACRO_COLORS.protein}
            />
            <MacroBar
              label="Carbs"
              value={totals.carbs}
              max={250}
              colorClass={MACRO_COLORS.carbs}
            />
            <MacroBar
              label="Fat"
              value={totals.fat}
              max={65}
              colorClass={MACRO_COLORS.fat}
            />
          </div>
        </div>
      </div>

      {/* Search + scan */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9 pr-10"
            placeholder="Search food (e.g. chicken breast)…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
            }}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSelected(null);
                setResults([]);
              }}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setShowScanner(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            title="Scan barcode"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        {/* Search results */}
        <AnimatePresence>
          {(results.length > 0 || searching) && !selected && (
            <motion.div
              key="search-results-dropdown"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border max-h-52 overflow-y-auto"
            >
              {searching && (
                <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" /> Searching…
                </div>
              )}
              {results.map((food, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectFood(food)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-secondary text-left transition-colors"
                >
                  <span className="text-sm text-foreground truncate flex-1 mr-3">
                    {food.name}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {food.calories_per_100g} kcal/100g
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Staging area */}
      <AnimatePresence>
        {selected && staged && (
          <motion.div
            key="staging-area"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-border rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-foreground leading-tight">
                {selected.name}
              </p>
              <button
                onClick={() => {
                  setSelected(null);
                  setQuery("");
                }}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Macro preview */}
            <div className="flex gap-3 text-center">
              {[
                { label: "kcal", val: staged.calories },
                { label: "protein", val: `${staged.protein}g` },
                { label: "carbs", val: `${staged.carbs}g` },
                { label: "fat", val: `${staged.fat}g` },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  className="flex-1 bg-secondary rounded-xl py-2"
                >
                  <p className="text-sm font-semibold text-foreground">{val}</p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            {/* Grams input */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-muted-foreground shrink-0">
                Grams
              </label>
              <Input
                type="number"
                min={1}
                max={2000}
                value={grams}
                onChange={(e) => setGrams(Math.max(1, Number(e.target.value)))}
                className="w-24 text-sm"
              />
            </div>

            {/* Meal selector */}
            <div className="flex gap-2 flex-wrap">
              {MEALS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMealType(m.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    mealType === m.id
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <Button className="w-full" onClick={handleAdd} disabled={isAdding}>
              <Plus className="w-4 h-4 mr-2" />
              {isAdding
                ? "Logging…"
                : `Log to ${MEALS.find((m) => m.id === mealType)?.label}`}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meal log */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {logsByMeal.map(({ id: mId, label, entries }) =>
            entries.length === 0 ? null : (
              <div key={mId}>
                <p className="text-xs text-muted-foreground font-medium mb-2">
                  {label}
                </p>
                <div className="space-y-1.5">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 px-3 py-2.5 bg-card border border-border rounded-xl"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {entry.food_name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {entry.grams}g · P:{entry.protein}g C:{entry.carbs}g
                          F:{entry.fat}g
                        </p>
                      </div>
                      <span className="text-sm font-medium text-foreground tabular-nums shrink-0">
                        {entry.calories} kcal
                      </span>
                      <button
                        onClick={() => remove(entry.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              No meals logged{isToday ? " today" : " for this day"}. Search
              above to add food.
            </p>
          )}
        </div>
      )}

      {/* Barcode scanner overlay */}
      {showScanner && (
        <BarcodeScanner
          onResult={handleBarcodeResult}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Category settings dialog */}
      <CategorySettingsDialog
        isOpen={showCategorySettings}
        onClose={() => setShowCategorySettings(false)}
        profile={profile}
        updateProfile={updateProfile}
        isUpdating={isUpdating}
      />
    </div>
  );
}
