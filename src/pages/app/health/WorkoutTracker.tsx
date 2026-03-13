import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Dumbbell, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import Model, { IExerciseData, IMuscleStats, MuscleType } from "react-body-highlighter";
import { useWorkouts, useWorkoutHistory, daysSinceWorked } from "@/hooks/use-workouts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Muscle catalogue ────────────────────────────────────────────────────────
// Maps our stable IDs → react-body-highlighter MuscleType + UI metadata
const MUSCLE_DEFS = [
  // Front
  { id: "chest",        label: "Chest",        rbhId: MuscleType.CHEST,          view: "front", color: "#ef4444" },
  { id: "front_delts",  label: "Front Delts",  rbhId: MuscleType.FRONT_DELTOIDS, view: "front", color: "#f97316" },
  { id: "biceps",       label: "Biceps",        rbhId: MuscleType.BICEPS,         view: "front", color: "#eab308" },
  { id: "forearms",     label: "Forearms",      rbhId: MuscleType.FOREARM,        view: "front", color: "#84cc16" },
  { id: "abs",          label: "Abs",           rbhId: MuscleType.ABS,            view: "front", color: "#22c55e" },
  { id: "obliques",     label: "Obliques",      rbhId: MuscleType.OBLIQUES,       view: "front", color: "#10b981" },
  { id: "quads",        label: "Quads",         rbhId: MuscleType.QUADRICEPS,     view: "front", color: "#06b6d4" },
  { id: "adductors",    label: "Adductors",     rbhId: MuscleType.ABDUCTOR,       view: "front", color: "#3b82f6" },
  { id: "calves",       label: "Calves",        rbhId: MuscleType.CALVES,         view: "front", color: "#6366f1" },
  // Back
  { id: "traps",        label: "Traps",         rbhId: MuscleType.TRAPEZIUS,      view: "back",  color: "#8b5cf6" },
  { id: "upper_back",   label: "Upper Back / Lats", rbhId: MuscleType.UPPER_BACK, view: "back",  color: "#a855f7" },
  { id: "lower_back",   label: "Lower Back",    rbhId: MuscleType.LOWER_BACK,     view: "back",  color: "#d946ef" },
  { id: "rear_delts",   label: "Rear Delts",    rbhId: MuscleType.BACK_DELTOIDS,  view: "back",  color: "#f97316" },
  { id: "triceps",      label: "Triceps",       rbhId: MuscleType.TRICEPS,        view: "back",  color: "#ec4899" },
  { id: "glutes",       label: "Glutes",        rbhId: MuscleType.GLUTEAL,        view: "back",  color: "#f59e0b" },
  { id: "hamstrings",   label: "Hamstrings",    rbhId: MuscleType.HAMSTRING,      view: "back",  color: "#ef4444" },
  { id: "abductors",    label: "Abductors",     rbhId: MuscleType.ABDUCTORS,      view: "back",  color: "#14b8a6" },
] as const;

type MuscleId = typeof MUSCLE_DEFS[number]["id"];

// Build a lookup from rbhId → our muscle def (for click handling)
const rbhToMuscle = Object.fromEntries(
  MUSCLE_DEFS.map((m) => [m.rbhId, m])
);

// ─── BodyMap ─────────────────────────────────────────────────────────────────
// Shows front + back side-by-side using react-body-highlighter's real SVG anatomy
function BodyMap({
  selected,
  history,
  onToggle,
}: {
  selected: Set<string>;
  history: { date: string; muscle_groups: string[] }[];
  onToggle: (id: string) => void;
}) {
  // Build the data array that react-body-highlighter expects — one entry per
  // selected muscle, plus heat entries for recently-worked muscles
  const selectedData: IExerciseData[] = useMemo(() => {
    const entries: IExerciseData[] = [];

    // Selected muscles — show at full brightness (frequency=1)
    MUSCLE_DEFS.filter((m) => selected.has(m.id)).forEach((m) => {
      entries.push({ name: m.id, muscles: [m.rbhId as never] });
    });

    // Recently worked muscles not currently selected — show as heat hints
    MUSCLE_DEFS.filter((m) => !selected.has(m.id)).forEach((m) => {
      const days = daysSinceWorked(m.id, history);
      if (days !== null && days <= 6) {
        entries.push({ name: `${m.id}_heat`, muscles: [m.rbhId as never], frequency: 0 });
      }
    });

    return entries;
  }, [selected, history]);

  const handleClick = ({ muscle }: IMuscleStats) => {
    const def = rbhToMuscle[muscle];
    if (def) onToggle(def.id);
  };

  // Build per-muscle highlight colors — each muscle gets its own brand color
  // react-body-highlighter uses highlightedColors[frequency-1] as the fill color.
  // We pass a single-element array and set frequency=1, then override via CSS vars.
  // Since the package doesn't support per-muscle colors directly, we render two
  // separate Model instances — one for front, one for back.
  
  const frontSelected = useMemo(
    () => MUSCLE_DEFS.filter((m) => m.view === "front" && selected.has(m.id)),
    [selected]
  );
  const backSelected = useMemo(
    () => MUSCLE_DEFS.filter((m) => m.view === "back" && selected.has(m.id)),
    [selected]
  );

  // Build IExerciseData for front model
  const frontData: IExerciseData[] = useMemo(() => {
    const result: IExerciseData[] = [];
    frontSelected.forEach((m) => {
      result.push({ name: m.id, muscles: [m.rbhId as never], frequency: 2 });
    });
    MUSCLE_DEFS.filter((m) => m.view === "front" && !selected.has(m.id)).forEach((m) => {
      const days = daysSinceWorked(m.id, history);
      if (days !== null && days <= 5) {
        result.push({ name: `${m.id}_heat`, muscles: [m.rbhId as never], frequency: 1 });
      }
    });
    return result;
  }, [frontSelected, selected, history]);

  const backData: IExerciseData[] = useMemo(() => {
    const result: IExerciseData[] = [];
    backSelected.forEach((m) => {
      result.push({ name: m.id, muscles: [m.rbhId as never], frequency: 2 });
    });
    MUSCLE_DEFS.filter((m) => m.view === "back" && !selected.has(m.id)).forEach((m) => {
      const days = daysSinceWorked(m.id, history);
      if (days !== null && days <= 5) {
        result.push({ name: `${m.id}_heat`, muscles: [m.rbhId as never], frequency: 1 });
      }
    });
    return result;
  }, [backSelected, selected, history]);

  const modelStyle: React.CSSProperties = {
    width: "100%",
    padding: 0,
  };

  return (
    <div className="flex gap-1 w-full justify-center">
      {/* Front view */}
      <div className="flex-1">
        <p className="text-[10px] text-center text-muted-foreground mb-1 font-medium tracking-wide uppercase">Front</p>
        <Model
          data={frontData}
          type="anterior"
          style={modelStyle}
          bodyColor="hsl(var(--muted))"
          highlightedColors={["#6366f180", "#6366f1"]}
          onClick={handleClick}
        />
      </div>
      {/* Back view */}
      <div className="flex-1">
        <p className="text-[10px] text-center text-muted-foreground mb-1 font-medium tracking-wide uppercase">Back</p>
        <Model
          data={backData}
          type="posterior"
          style={modelStyle}
          bodyColor="hsl(var(--muted))"
          highlightedColors={["#a855f780", "#a855f7"]}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function toDateStr(d = new Date()) { return d.toISOString().split("T")[0]; }
function offsetDate(from: Date, days: number) {
  const d = new Date(from); d.setDate(d.getDate() + days); return d;
}
function formatDate(d: Date) {
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === offsetDate(today, -1).toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── WorkoutTracker ───────────────────────────────────────────────────────────
export default function WorkoutTracker() {
  const [date, setDate] = useState(new Date());
  const { workouts, isLoading, add, isAdding, remove } = useWorkouts(date);
  const { data: history = [] } = useWorkoutHistory(30);

  const [selectedMuscles, setSelectedMuscles] = useState<Set<MuscleId>>(new Set());

  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [notes, setNotes] = useState("");

  const isToday = toDateStr(date) === toDateStr();

  const toggleMuscle = (id: string) => {
    setSelectedMuscles((prev) => {
      const next = new Set(prev) as Set<MuscleId>;
      if (next.has(id as MuscleId)) next.delete(id as MuscleId);
      else next.add(id as MuscleId);
      return next;
    });
  };

  const handleAdd = async () => {
    if (!exerciseName.trim()) return toast.error("Enter an exercise name.");
    if (selectedMuscles.size === 0) return toast.error("Select at least one muscle group.");
    try {
      await add({
        exercise_name: exerciseName.trim(),
        muscle_groups: Array.from(selectedMuscles),
        sets:     sets     ? Number(sets)    : null,
        reps:     reps     ? Number(reps)    : null,
        weight_kg: weight  ? Number(weight)  : null,
        duration_minutes: duration ? Number(duration) : null,
        notes: notes || null,
      });
      setExerciseName(""); setSets(""); setReps(""); setWeight(""); setDuration(""); setNotes("");
      setSelectedMuscles(new Set());
      toast.success("Exercise logged.");
    } catch { toast.error("Failed to save."); }
  };

  const last7 = toDateStr(new Date(Date.now() - 6 * 86400000));
  interface VolumeEntry { name: string; sets: number; color: string }
  const volumeData: VolumeEntry[] = (() => {
    const counts: Record<string, number> = {};
    history.filter((w) => w.date >= last7).forEach((w) => {
      w.muscle_groups.forEach((m) => { counts[m] = (counts[m] ?? 0) + 1; });
    });
    return MUSCLE_DEFS.filter((m) => counts[m.id])
      .map((m) => ({ name: m.label.slice(0, 9), sets: counts[m.id], color: m.color }))
      .sort((a, b) => b.sets - a.sets).slice(0, 8);
  })();

  const selectedDefs = MUSCLE_DEFS.filter((m) => selectedMuscles.has(m.id as MuscleId));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Date nav */}
      <div className="flex items-center justify-between">
        <button onClick={() => setDate((d) => offsetDate(d, -1))}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-foreground">{formatDate(date)}</span>
        <button onClick={() => setDate((d) => offsetDate(d, 1))} disabled={isToday}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main card: body map + form side by side */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        
        {/* Body map — full width, front + back side by side */}
        <div>
          <p className="text-xs text-muted-foreground font-medium mb-3">
            Tap muscles to select
            {selectedDefs.length > 0 && (
              <span className="ml-2 text-foreground font-semibold">
                — {selectedDefs.map((m) => m.label).join(", ")}
              </span>
            )}
          </p>
          <BodyMap selected={selectedMuscles as Set<string>} history={history} onToggle={toggleMuscle} />
        </div>

        {/* Muscle chip legend — tap to toggle */}
        <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
          {MUSCLE_DEFS.map((m) => {
            const days = daysSinceWorked(m.id, history);
            const isSelected = selectedMuscles.has(m.id as MuscleId);
            return (
              <button key={m.id} onClick={() => toggleMuscle(m.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] border transition-all",
                  isSelected
                    ? "border-transparent text-white font-medium shadow-sm"
                    : "border-border text-muted-foreground hover:text-foreground bg-transparent"
                )}
                style={isSelected ? { backgroundColor: m.color, borderColor: m.color } : {}}>
                {!isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                )}
                {m.label}
                {days !== null && !isSelected && (
                  <span className="opacity-50 text-[10px]">{days}d</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Exercise form */}
        <div className="border-t border-border pt-4 space-y-2.5">
          <Input placeholder="Exercise name (e.g. Bench Press)" value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)} className="text-sm" />
          <div className="grid grid-cols-4 gap-2">
            <Input type="number" min={1} placeholder="Sets" value={sets}
              onChange={(e) => setSets(e.target.value)} className="text-sm" />
            <Input type="number" min={1} placeholder="Reps" value={reps}
              onChange={(e) => setReps(e.target.value)} className="text-sm" />
            <Input type="number" min={0} step={0.5} placeholder="kg" value={weight}
              onChange={(e) => setWeight(e.target.value)} className="text-sm" />
            <Input type="number" min={1} placeholder="min" value={duration}
              onChange={(e) => setDuration(e.target.value)} className="text-sm" />
          </div>
          <div className="flex gap-2">
            <Input placeholder="Notes (optional)" value={notes}
              onChange={(e) => setNotes(e.target.value)} className="text-sm flex-1" />
            <Button size="sm" onClick={handleAdd} disabled={isAdding} className="shrink-0">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              {isAdding ? "Saving…" : "Log"}
            </Button>
          </div>
        </div>
      </div>

      {/* Workout log */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2">
          {workouts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No exercises logged{isToday ? " today" : " for this day"}.
            </p>
          ) : (
            <AnimatePresence>
              {workouts.map((w) => (
                <motion.div key={w.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-3 px-3 py-3 bg-card border border-border rounded-xl">
                  <Dumbbell className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{w.exercise_name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[w.sets && `${w.sets} sets`, w.reps && `${w.reps} reps`,
                        w.weight_kg && `${w.weight_kg}kg`, w.duration_minutes && `${w.duration_minutes}min`]
                        .filter(Boolean).join(" · ")}
                    </p>
                    {w.muscle_groups.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {w.muscle_groups.map((mg) => {
                          const def = MUSCLE_DEFS.find((m) => m.id === mg);
                          return (
                            <span key={mg} className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                              style={{ backgroundColor: `${def?.color ?? "#666"}22`, color: def?.color ?? "#888" }}>
                              {def?.label ?? mg}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    {w.notes && <p className="text-xs text-muted-foreground mt-1 italic">{w.notes}</p>}
                  </div>
                  <button onClick={() => remove(w.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      )}

      {/* Weekly volume chart */}
      {volumeData.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground font-medium mb-4">Weekly volume (last 7 days)</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={volumeData} barSize={14} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 11 }}
                cursor={{ fill: "hsl(var(--secondary))" }}
                formatter={(v: number) => [`${v} session${v !== 1 ? "s" : ""}`, "Volume"]}
              />
              <Bar dataKey="sets" radius={[4, 4, 0, 0]}>
                {volumeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
