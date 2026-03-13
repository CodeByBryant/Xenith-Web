import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Users,
  Briefcase,
  TrendingUp,
  BookOpen,
  Moon,
  Star,
} from "lucide-react";
import { useDimensionScores } from "@/hooks/use-dimension-scores";
import { LIFE_DIMENSIONS, type LifeDimensionName } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const DIM_CONFIG: Record<
  string,
  { Icon: LucideIcon; bar: string; dot: string; text: string; label: string }
> = {
  Health: {
    Icon: Heart,
    bar: "bg-emerald-500",
    dot: "fill-emerald-500 stroke-emerald-500",
    text: "text-emerald-500",
    label: "Health",
  },
  Mind: {
    Icon: Sparkles,
    bar: "bg-violet-500",
    dot: "fill-violet-500 stroke-violet-500",
    text: "text-violet-500",
    label: "Mind",
  },
  Relationships: {
    Icon: Users,
    bar: "bg-pink-500",
    dot: "fill-pink-500 stroke-pink-500",
    text: "text-pink-500",
    label: "Relations",
  },
  Work: {
    Icon: Briefcase,
    bar: "bg-blue-500",
    dot: "fill-blue-500 stroke-blue-500",
    text: "text-blue-500",
    label: "Work",
  },
  Finances: {
    Icon: TrendingUp,
    bar: "bg-yellow-500",
    dot: "fill-yellow-500 stroke-yellow-500",
    text: "text-yellow-500",
    label: "Finances",
  },
  Learning: {
    Icon: BookOpen,
    bar: "bg-cyan-500",
    dot: "fill-cyan-500 stroke-cyan-500",
    text: "text-cyan-500",
    label: "Learning",
  },
  Rest: {
    Icon: Moon,
    bar: "bg-indigo-400",
    dot: "fill-indigo-400 stroke-indigo-400",
    text: "text-indigo-400",
    label: "Rest",
  },
  Purpose: {
    Icon: Star,
    bar: "bg-orange-500",
    dot: "fill-orange-500 stroke-orange-500",
    text: "text-orange-500",
    label: "Purpose",
  },
};

const DIM_POLYGON_COLORS = [
  "#22c55e",
  "#8b5cf6",
  "#ec4899",
  "#3b82f6",
  "#eab308",
  "#06b6d4",
  "#818cf8",
  "#f97316",
];

function weekLabel(ws: string) {
  const d = new Date(ws + "T00:00:00");
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const thisWs = new Date(new Date().setDate(diff)).toISOString().split("T")[0];
  if (ws === thisWs) return "This week";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Dimensions() {
  const { currentScores, saveScores, isSaving, scores, weeks } =
    useDimensionScores(4);
  const [draft, setDraft] = useState<Record<LifeDimensionName, number>>(
    () => ({ ...currentScores }) as Record<LifeDimensionName, number>,
  );
  const [viewWeek, setViewWeek] = useState(0);

  const handleSave = async () => {
    const missing = LIFE_DIMENSIONS.filter((d) => !draft[d]);
    if (missing.length) return toast.error("Rate all dimensions first.");
    try {
      await saveScores(draft);
      toast.success("Scores saved.");
    } catch {
      toast.error("Failed to save.");
    }
  };

  const displayWeek = weeks[viewWeek];
  const weekScores = Object.fromEntries(
    LIFE_DIMENSIONS.map((d) => {
      const row = scores.find(
        (r) => r.dimension === d && r.week_start === displayWeek,
      );
      return [d, row?.score ?? 0];
    }),
  ) as Record<LifeDimensionName, number>;
  const isCurrentWeek = viewWeek === 0;
  const activeScores = isCurrentWeek ? draft : weekScores;

  return (
    <div className="max-w-lg mx-auto">
      {/* Week nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setViewWeek((w) => Math.min(w + 1, weeks.length - 1))}
          disabled={viewWeek >= weeks.length - 1}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold text-foreground">
          {displayWeek ? weekLabel(displayWeek) : "This week"}
        </h2>
        <button
          onClick={() => setViewWeek((w) => Math.max(w - 1, 0))}
          disabled={viewWeek <= 0}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Color-coded radar */}
      <RadarPreview scores={activeScores} />

      {/* Sliders */}
      <div className="mt-6 space-y-4">
        {LIFE_DIMENSIONS.map((dim) => {
          const cfg = DIM_CONFIG[dim];
          const val = activeScores[dim] ?? 0;
          return (
            <div key={dim}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <cfg.Icon className={cn("w-3.5 h-3.5", cfg.text)} />
                  <span className="text-sm font-medium text-foreground">
                    {dim}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-sm tabular-nums font-medium",
                    val > 0 ? cfg.text : "text-muted-foreground",
                  )}
                >
                  {val || "—"}
                </span>
              </div>
              <div className="relative h-2 bg-secondary rounded-full">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all",
                    cfg.bar,
                  )}
                  style={{ width: `${val * 10}%` }}
                />
                {isCurrentWeek && (
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={val || 1}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [dim]: Number(e.target.value) }))
                    }
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                  />
                )}
              </div>
              {/* Health deep tools link */}
              {dim === "Health" && (
                <Link
                  to="/app/dimensions/health"
                  className="inline-flex items-center gap-1 text-[11px] text-emerald-500 hover:text-emerald-400 transition-colors mt-1.5 font-medium"
                >
                  Health Tools →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {isCurrentWeek && (
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-6"
        >
          {isSaving ? "Saving…" : "Save this week's scores"}
        </Button>
      )}
    </div>
  );
}

function RadarPreview({ scores }: { scores: Record<string, number> }) {
  const dims = LIFE_DIMENSIONS as unknown as string[];
  const size = 200;
  const cx = size / 2,
    cy = size / 2,
    maxR = 78;
  const angle = (i: number) => (i / dims.length) * 2 * Math.PI - Math.PI / 2;
  const pt = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  });

  const gridLevels = [2, 4, 6, 8, 10];

  // Build polygon paths per-dimension (each colored sector)
  const sectorPaths = dims.map((d, i) => {
    const nextI = (i + 1) % dims.length;
    const r = ((scores[d] ?? 0) / 10) * maxR;
    const rn = ((scores[dims[nextI]] ?? 0) / 10) * maxR;
    const { x: x1, y: y1 } = pt(i, r);
    const { x: x2, y: y2 } = pt(nextI, rn);
    return `M${cx},${cy} L${x1},${y1} L${x2},${y2} Z`;
  });

  const axisLabels = dims.map((d, i) => {
    const labelR = maxR + 14;
    const { x, y } = pt(i, labelR);
    const cfg = DIM_CONFIG[d];
    return { x, y, cfg, dim: d };
  });

  return (
    <AnimatePresence>
      <svg width={size} height={size} className="mx-auto overflow-visible">
        {/* Background grid */}
        {gridLevels.map((lvl) => (
          <polygon
            key={lvl}
            points={dims
              .map((_, i) => {
                const { x, y } = pt(i, (lvl / 10) * maxR);
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth={0.75}
          />
        ))}
        {/* Axes */}
        {dims.map((_, i) => {
          const outer = pt(i, maxR);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="hsl(var(--border))"
              strokeWidth={0.75}
            />
          );
        })}
        {/* Colored sectors */}
        {sectorPaths.map((path, i) => (
          <motion.path
            key={dims[i]}
            d={path}
            fill={DIM_POLYGON_COLORS[i]}
            fillOpacity={0.35}
            stroke={DIM_POLYGON_COLORS[i]}
            strokeWidth={1.5}
            strokeLinejoin="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          />
        ))}
        {/* Axis icons/labels */}
        {axisLabels.map(({ x, y, cfg, dim }) => (
          <foreignObject
            key={dim}
            x={x - 8}
            y={y - 8}
            width={16}
            height={16}
            overflow="visible"
          >
            <div className="flex items-center justify-center w-4 h-4">
              <cfg.Icon className={cn("w-3 h-3", cfg.text)} />
            </div>
          </foreignObject>
        ))}
      </svg>
    </AnimatePresence>
  );
}
