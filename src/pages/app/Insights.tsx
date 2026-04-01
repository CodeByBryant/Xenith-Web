import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  Users,
  Briefcase,
  TrendingUp,
  BookOpen,
  Moon,
  Star,
  Zap,
  Target,
  Clock,
} from "lucide-react";
import { useIntentions } from "@/hooks/use-intentions";
import { useDimensionScores } from "@/hooks/use-dimension-scores";
import { useFocusSessions } from "@/hooks/use-focus-sessions";
import { useRoutines } from "@/hooks/use-routines";
import { LIFE_DIMENSIONS } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const DIM_CFG: Record<string, { Icon: LucideIcon; bar: string; text: string }> =
  {
    Health: { Icon: Heart, bar: "bg-emerald-500", text: "text-emerald-500" },
    Mind: { Icon: Sparkles, bar: "bg-violet-500", text: "text-violet-500" },
    Relationships: { Icon: Users, bar: "bg-pink-500", text: "text-pink-500" },
    Work: { Icon: Briefcase, bar: "bg-blue-500", text: "text-blue-500" },
    Finances: {
      Icon: TrendingUp,
      bar: "bg-yellow-500",
      text: "text-yellow-500",
    },
    Learning: { Icon: BookOpen, bar: "bg-cyan-500", text: "text-cyan-500" },
    Rest: { Icon: Moon, bar: "bg-indigo-400", text: "text-indigo-400" },
    Purpose: { Icon: Star, bar: "bg-orange-500", text: "text-orange-500" },
  };

function weekRange() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split("T")[0],
    end: sunday.toISOString().split("T")[0],
    label:
      monday.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " – " +
      sunday.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

function StatCard({
  label,
  value,
  sub,
  accent,
  Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  Icon?: LucideIcon;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-4 border rounded-2xl",
        accent
          ? "border-foreground/30 bg-foreground/5"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

export default function Insights() {
  const week = weekRange();

  const todayIntentions = useIntentions(new Date());
  const { currentScores } = useDimensionScores(1);
  const { sessions } = useFocusSessions(7); // Get last 7 days
  const { routines, completions } = useRoutines();

  const weekSessions = useMemo(
    () =>
      sessions.filter(
        (s) => s.completed && s.started_at && s.started_at >= week.start + "T00:00:00",
      ),
    [sessions, week.start],
  );

  const totalFocusMin = weekSessions.reduce(
    (a, s) => a + (s.duration_minutes ?? 0),
    0,
  );
  const focusHours = (totalFocusMin / 60).toFixed(1);

  const allIntentions = todayIntentions.intentions;
  const completedIntentions = allIntentions.filter(
    (i) => i.completed_at,
  ).length;
  const completionPct = allIntentions.length
    ? Math.round((completedIntentions / allIntentions.length) * 100)
    : null;

  const dimEntries = Object.entries(currentScores).filter(([, v]) => v > 0);
  const highDim = dimEntries.sort((a, b) => b[1] - a[1])[0];
  const lowDim = dimEntries.sort((a, b) => a[1] - b[1])[0];
  const avgDim = dimEntries.length
    ? (dimEntries.reduce((a, [, v]) => a + v, 0) / dimEntries.length).toFixed(1)
    : null;

  const routineAdherence = useMemo(() => {
    if (!routines.length) return null;
    const totalItems = routines.flatMap((r) => r.items ?? []).length;
    if (!totalItems) return null;
    const doneItems = completions.reduce(
      (a, c) => a + (c.completed_item_ids?.length ?? 0),
      0,
    );
    return Math.round((doneItems / totalItems) * 100);
  }, [routines, completions]);

  // Narrative
  const narrative = useMemo(() => {
    const parts: string[] = [];
    if (totalFocusMin > 0)
      parts.push(
        `You logged ${focusHours} hours of focused work across ${weekSessions.length} session${weekSessions.length !== 1 ? "s" : ""}.`,
      );
    if (completionPct !== null)
      parts.push(
        `Today's intention completion rate sits at ${completionPct}%.`,
      );
    if (highDim)
      parts.push(
        `Your strongest life dimension this week is ${highDim[0]} (${highDim[1]}/10).`,
      );
    if (lowDim && highDim && lowDim[0] !== highDim[0])
      parts.push(
        `${lowDim[0]} is your lowest at ${lowDim[1]}/10 — worth some attention.`,
      );
    if (routineAdherence !== null)
      parts.push(`Routine adherence today: ${routineAdherence}%.`);
    if (!parts.length)
      parts.push(
        "No data yet this week. Start tracking to see your insights here.",
      );
    return parts;
  }, [
    totalFocusMin,
    focusHours,
    weekSessions.length,
    completionPct,
    highDim,
    lowDim,
    routineAdherence,
  ]);

  const dimOrder = [...LIFE_DIMENSIONS];

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-base font-semibold text-foreground">
          Weekly Insights
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">{week.label}</p>
      </div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <StatCard
          label="Focus time"
          value={`${focusHours}h`}
          sub={`${weekSessions.length} sessions`}
          accent={parseFloat(focusHours) > 0}
          Icon={Clock}
        />
        <StatCard
          label="Sessions"
          value={String(weekSessions.length)}
          sub="this week"
          Icon={Zap}
        />
        <StatCard
          label="Intentions"
          value={completionPct !== null ? `${completionPct}%` : "—"}
          sub={
            allIntentions.length
              ? `${completedIntentions}/${allIntentions.length} done`
              : "None logged"
          }
          Icon={Target}
        />
        <StatCard
          label="Routine adherence"
          value={routineAdherence !== null ? `${routineAdherence}%` : "—"}
          sub="today"
          Icon={Star}
        />
      </motion.div>

      {/* Narrative */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-border rounded-2xl p-4 mb-6 space-y-2"
      >
        <p className="text-xs text-muted-foreground mb-1">Summary</p>
        {narrative.map((t, i) => (
          <p key={i} className="text-sm text-foreground leading-relaxed">
            {t}
          </p>
        ))}
      </motion.div>

      {/* Dimension bars */}
      {dimEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-border rounded-2xl p-4"
        >
          <p className="text-xs text-muted-foreground mb-3">
            Life dimensions this week{" "}
            {avgDim && (
              <span className="ml-1 font-medium text-foreground">
                avg {avgDim}
              </span>
            )}
          </p>
          <div className="space-y-2.5">
            {dimOrder
              .filter((d) => currentScores[d] > 0)
              .map((d, i) => {
                const cfg = DIM_CFG[d];
                return (
                  <div key={d}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5">
                        {cfg && (
                          <cfg.Icon className={cn("w-3 h-3", cfg.text)} />
                        )}
                        <span className="text-muted-foreground">{d}</span>
                      </div>
                      <span
                        className={cn(
                          "font-medium tabular-nums",
                          cfg?.text ?? "text-foreground",
                        )}
                      >
                        {currentScores[d]}
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          cfg?.bar ?? "bg-foreground",
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentScores[d] * 10}%` }}
                        transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
