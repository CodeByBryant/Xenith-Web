import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckSquare,
  Coins,
  Flame,
  GripVertical,
  Heart,
  Moon,
  MoveDown,
  MoveUp,
  RotateCw,
  Sparkles,
  Timer,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useBooks } from "@/hooks/use-books";
import { useDashboardPreferences } from "@/hooks/use-dashboard-preferences";
import { useDimensionScores } from "@/hooks/use-dimension-scores";
import { useFocusSessions } from "@/hooks/use-focus-sessions";
import { useIntentions } from "@/hooks/use-intentions";
import { useNutrition } from "@/hooks/use-nutrition";
import { useProfile } from "@/hooks/use-profile";
import { useRechargeActivities } from "@/hooks/use-recharge-activities";
import { useReflections } from "@/hooks/use-reflections";
import { useRoutines } from "@/hooks/use-routines";
import { useSleepLogs } from "@/hooks/use-sleep-logs";
import { useTransactions } from "@/hooks/use-transactions";
import { useWater } from "@/hooks/use-water-supplements";
import { useWorkouts } from "@/hooks/use-workouts";
import {
  getCompletedFocusSessionsThisWeek,
  getTotalFocusMinutes,
} from "@/lib/focus-metrics";
import { LIFE_DIMENSIONS } from "@/lib/types";
import { cn } from "@/lib/utils";

type DashboardWidgetId =
  | "intentions"
  | "routines"
  | "focus"
  | "reflection"
  | "dimensions"
  | "health"
  | "finances"
  | "learning"
  | "rest"
  | "quick-actions";

interface WidgetMeta {
  id: DashboardWidgetId;
  title: string;
  description: string;
  href?: string;
  icon: typeof CheckSquare;
}

interface WidgetAccent {
  iconBg: string;
  iconText: string;
  accentBar: string;
  metricText: string;
  hoverBorder: string;
}

const WIDGET_META: WidgetMeta[] = [
  {
    id: "intentions",
    title: "Intentions",
    description: "Today completion",
    href: "/app/intentions",
    icon: CheckSquare,
  },
  {
    id: "routines",
    title: "Routines",
    description: "Daily adherence",
    href: "/app/routines",
    icon: RotateCw,
  },
  {
    id: "focus",
    title: "Focus",
    description: "Deep work this week",
    href: "/app/focus",
    icon: Flame,
  },
  {
    id: "reflection",
    title: "Reflection",
    description: "Journal consistency",
    href: "/app/reflection",
    icon: BookOpen,
  },
  {
    id: "dimensions",
    title: "Dimensions",
    description: "Life balance index",
    href: "/app/dimensions",
    icon: Activity,
  },
  {
    id: "health",
    title: "Health",
    description: "Nutrition and movement",
    href: "/app/dimensions/health",
    icon: Heart,
  },
  {
    id: "finances",
    title: "Finances",
    description: "Monthly flow",
    href: "/app/dimensions/finances",
    icon: Coins,
  },
  {
    id: "learning",
    title: "Learning",
    description: "Books and progress",
    href: "/app/dimensions/learning",
    icon: TrendingUp,
  },
  {
    id: "rest",
    title: "Rest",
    description: "Recovery and sleep",
    href: "/app/dimensions/rest",
    icon: Moon,
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    description: "Jump into tools",
    icon: Sparkles,
  },
];

const DEFAULT_WIDGET_ORDER = WIDGET_META.map((widget) => widget.id);

const WIDGET_ACCENTS: Record<DashboardWidgetId, WidgetAccent> = {
  intentions: {
    iconBg: "bg-blue-500/15",
    iconText: "text-blue-500",
    accentBar: "bg-blue-500",
    metricText: "text-blue-500",
    hoverBorder: "hover:border-blue-500/35",
  },
  routines: {
    iconBg: "bg-emerald-500/15",
    iconText: "text-emerald-500",
    accentBar: "bg-emerald-500",
    metricText: "text-emerald-500",
    hoverBorder: "hover:border-emerald-500/35",
  },
  focus: {
    iconBg: "bg-orange-500/15",
    iconText: "text-orange-500",
    accentBar: "bg-orange-500",
    metricText: "text-orange-500",
    hoverBorder: "hover:border-orange-500/35",
  },
  reflection: {
    iconBg: "bg-violet-500/15",
    iconText: "text-violet-500",
    accentBar: "bg-violet-500",
    metricText: "text-violet-500",
    hoverBorder: "hover:border-violet-500/35",
  },
  dimensions: {
    iconBg: "bg-fuchsia-500/15",
    iconText: "text-fuchsia-500",
    accentBar: "bg-fuchsia-500",
    metricText: "text-fuchsia-500",
    hoverBorder: "hover:border-fuchsia-500/35",
  },
  health: {
    iconBg: "bg-rose-500/15",
    iconText: "text-rose-500",
    accentBar: "bg-rose-500",
    metricText: "text-rose-500",
    hoverBorder: "hover:border-rose-500/35",
  },
  finances: {
    iconBg: "bg-green-500/15",
    iconText: "text-green-500",
    accentBar: "bg-green-500",
    metricText: "text-green-500",
    hoverBorder: "hover:border-green-500/35",
  },
  learning: {
    iconBg: "bg-cyan-500/15",
    iconText: "text-cyan-500",
    accentBar: "bg-cyan-500",
    metricText: "text-cyan-500",
    hoverBorder: "hover:border-cyan-500/35",
  },
  rest: {
    iconBg: "bg-indigo-500/15",
    iconText: "text-indigo-500",
    accentBar: "bg-indigo-500",
    metricText: "text-indigo-500",
    hoverBorder: "hover:border-indigo-500/35",
  },
  "quick-actions": {
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-500",
    accentBar: "bg-amber-500",
    metricText: "text-amber-500",
    hoverBorder: "hover:border-amber-500/35",
  },
};

const DIMENSION_ACCENTS: Record<string, string> = {
  Health: "bg-emerald-500",
  Mind: "bg-violet-500",
  Relationships: "bg-pink-500",
  Work: "bg-blue-500",
  Finances: "bg-yellow-500",
  Learning: "bg-cyan-500",
  Rest: "bg-indigo-500",
  Purpose: "bg-orange-500",
};

const QUICK_ACTIONS = [
  {
    label: "Start Focus Session",
    description: "Open timer and run deep work",
    path: "/app/focus",
    icon: Timer,
    accentBg: "bg-orange-500/20",
    accentText: "text-orange-500",
  },
  {
    label: "Weekly Insights",
    description: "Analyze your trends",
    path: "/app/insights",
    icon: TrendingUp,
    accentBg: "bg-cyan-500/20",
    accentText: "text-cyan-500",
  },
  {
    label: "Project Workspace",
    description: "Capture and organize work",
    path: "/app/projects",
    icon: BookOpen,
    accentBg: "bg-violet-500/20",
    accentText: "text-violet-500",
  },
] as const;

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}

function normalizeDate(dateLike?: string | null) {
  if (!dateLike) return null;
  return dateLike.slice(0, 10);
}

function reorder<T>(arr: T[], from: T, to: T) {
  const next = [...arr];
  const fromIdx = next.indexOf(from);
  const toIdx = next.indexOf(to);

  if (fromIdx === -1 || toIdx === -1) return arr;

  const [item] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, item);
  return next;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { intentions } = useIntentions();
  const { routines, completions } = useRoutines();
  const { sessions } = useFocusSessions(14);
  const { reflections } = useReflections(14);
  const { currentScores } = useDimensionScores(1);
  const { totals: nutritionTotals, logs: nutritionLogs } = useNutrition(
    new Date(),
  );
  const { workouts } = useWorkouts(new Date());
  const { totalMl } = useWater(new Date());
  const { transactions } = useTransactions(
    new Date().toISOString().slice(0, 7),
  );
  const { books } = useBooks();
  const { logs: sleepLogs } = useSleepLogs(7);
  const { activities: rechargeActivities } = useRechargeActivities(7);

  const {
    preferences,
    isLoading: preferencesLoading,
    reorderWidgets,
    setWidgetVisible,
    resetPreferences,
  } = useDashboardPreferences(DEFAULT_WIDGET_ORDER);

  const [editMode, setEditMode] = useState(false);
  const [draggingWidget, setDraggingWidget] =
    useState<DashboardWidgetId | null>(null);

  const firstName =
    (profile?.name ?? user?.email ?? "").split(/[\s@]/)[0] || "there";
  const today = toDateStr();

  const todayIntentions = intentions.filter(
    (intention) =>
      normalizeDate(intention.scheduled_date) === today ||
      normalizeDate(intention.due_date) === today,
  );

  const completedIntentions = todayIntentions.filter(
    (intention) => intention.completed_at !== null,
  ).length;

  const weekFocusSessions = getCompletedFocusSessionsThisWeek(sessions);
  const totalFocusMinutes = getTotalFocusMinutes(weekFocusSessions);

  const todayReflection = reflections.find(
    (entry) => entry.entry_date === today,
  );

  const routineCompletionStats = useMemo(() => {
    const totalItems = routines.reduce(
      (acc, routine) => acc + (routine.items?.length ?? 0),
      0,
    );

    const completedItems = completions.reduce(
      (acc, completion) => acc + (completion.completed_item_ids?.length ?? 0),
      0,
    );

    const adherence =
      totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
      totalItems,
      completedItems,
      adherence,
    };
  }, [completions, routines]);

  const dimensionAverage = useMemo(() => {
    const values = LIFE_DIMENSIONS.map(
      (dimension) => currentScores[dimension],
    ).filter((score) => score > 0);

    if (!values.length) return 0;
    return Number(
      (values.reduce((sum, score) => sum + score, 0) / values.length).toFixed(
        1,
      ),
    );
  }, [currentScores]);

  const monthlyFinance = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.income += Number(transaction.amount);
        } else {
          acc.expense += Number(transaction.amount);
        }
        return acc;
      },
      { income: 0, expense: 0 },
    );
  }, [transactions]);

  const booksInProgress = books.filter(
    (book) => book.status === "reading",
  ).length;
  const booksCompleted = books.filter(
    (book) => book.status === "completed",
  ).length;

  const sleepAverage = useMemo(() => {
    const values = sleepLogs
      .map((log) => Number(log.hours_slept || 0))
      .filter((value) => value > 0);
    if (!values.length) return 0;
    return Number(
      (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(
        1,
      ),
    );
  }, [sleepLogs]);

  const topDimensionHighlights = useMemo(
    () =>
      LIFE_DIMENSIONS.map((dimension) => ({
        dimension,
        score: currentScores[dimension] ?? 0,
      }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [currentScores],
  );

  const widgetOrder =
    preferences.widget_order.length > 0
      ? (preferences.widget_order as DashboardWidgetId[])
      : DEFAULT_WIDGET_ORDER;

  const hiddenSet = new Set(preferences.hidden_widgets);

  const visibleWidgets = widgetOrder.filter(
    (widgetId) => !hiddenSet.has(widgetId),
  );

  const hiddenWidgets = WIDGET_META.filter((widget) =>
    hiddenSet.has(widget.id),
  );

  const widgetMap = useMemo(
    () =>
      Object.fromEntries(
        WIDGET_META.map((widget) => [widget.id, widget]),
      ) as Record<DashboardWidgetId, WidgetMeta>,
    [],
  );

  const handleDrop = async (targetId: DashboardWidgetId) => {
    if (!draggingWidget || draggingWidget === targetId) return;
    const nextOrder = reorder(widgetOrder, draggingWidget, targetId);
    await reorderWidgets(nextOrder);
    setDraggingWidget(null);
  };

  const moveWidget = async (
    widgetId: DashboardWidgetId,
    direction: "up" | "down",
  ) => {
    const currentIndex = widgetOrder.indexOf(widgetId);
    if (currentIndex === -1) return;

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (swapIndex < 0 || swapIndex >= widgetOrder.length) return;

    const next = [...widgetOrder];
    const [item] = next.splice(currentIndex, 1);
    next.splice(swapIndex, 0, item);
    await reorderWidgets(next);
  };

  const renderWidgetBody = (widgetId: DashboardWidgetId) => {
    const accent = WIDGET_ACCENTS[widgetId];

    switch (widgetId) {
      case "intentions": {
        const progress =
          todayIntentions.length > 0
            ? Math.round((completedIntentions / todayIntentions.length) * 100)
            : 0;

        return (
          <div className="space-y-3">
            <p
              className={cn(
                "text-3xl font-semibold tabular-nums",
                accent.metricText,
              )}
            >
              {completedIntentions}/{todayIntentions.length || 0}
            </p>
            <p className="text-xs text-muted-foreground">
              {progress}% complete today
            </p>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  accent.accentBar,
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      }
      case "routines":
        return (
          <div className="space-y-3">
            <p
              className={cn(
                "text-3xl font-semibold tabular-nums",
                accent.metricText,
              )}
            >
              {routineCompletionStats.adherence}%
            </p>
            <p className="text-xs text-muted-foreground">
              {routineCompletionStats.completedItems}/
              {routineCompletionStats.totalItems} routine steps done today
            </p>
          </div>
        );
      case "focus":
        return (
          <div className="space-y-3">
            <p
              className={cn(
                "text-3xl font-semibold tabular-nums",
                accent.metricText,
              )}
            >
              {totalFocusMinutes}m
            </p>
            <p className="text-xs text-muted-foreground">
              {weekFocusSessions.length} completed session
              {weekFocusSessions.length === 1 ? "" : "s"} this week
            </p>
          </div>
        );
      case "reflection":
        return (
          <div className="space-y-3">
            <p className={cn("text-lg font-medium", accent.metricText)}>
              {todayReflection ? "Entry captured" : "No entry yet"}
            </p>
            <p className="text-xs text-muted-foreground">
              {reflections.length} reflections logged over 14 days
            </p>
          </div>
        );
      case "dimensions":
        return (
          <div className="space-y-3">
            <p
              className={cn(
                "text-3xl font-semibold tabular-nums",
                accent.metricText,
              )}
            >
              {dimensionAverage || "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              Current life balance average score
            </p>
            {topDimensionHighlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {topDimensionHighlights.map((item) => (
                  <span
                    key={item.dimension}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        DIMENSION_ACCENTS[item.dimension] ?? "bg-foreground",
                      )}
                    />
                    {item.dimension}
                    <span className="font-medium text-foreground">
                      {item.score}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      case "health":
        return (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Calories today:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                {nutritionTotals.calories}
              </span>
            </p>
            <p>
              Water today:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                {totalMl} ml
              </span>
            </p>
            <p>
              Workouts logged:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                {workouts.length}
              </span>
            </p>
            <p>
              Meals tracked:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                {nutritionLogs.length}
              </span>
            </p>
          </div>
        );
      case "finances": {
        const net = monthlyFinance.income - monthlyFinance.expense;
        return (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Income:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                ${monthlyFinance.income.toFixed(2)}
              </span>
            </p>
            <p>
              Expenses:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                ${monthlyFinance.expense.toFixed(2)}
              </span>
            </p>
            <p>
              Net flow:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                ${net.toFixed(2)}
              </span>
            </p>
          </div>
        );
      }
      case "learning":
        return (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              In progress:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                {booksInProgress}
              </span>
            </p>
            <p>
              Completed:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                {booksCompleted}
              </span>
            </p>
            <p>
              Total tracked:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                {books.length}
              </span>
            </p>
          </div>
        );
      case "rest":
        return (
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Avg sleep (7d):{" "}
              <span className={cn("font-medium", accent.metricText)}>
                {sleepAverage || "—"}h
              </span>
            </p>
            <p>
              Sleep entries:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                {sleepLogs.length}
              </span>
            </p>
            <p>
              Recharge sessions:{" "}
              <span className={cn("font-medium", accent.metricText)}>
                {rechargeActivities.length}
              </span>
            </p>
          </div>
        );
      case "quick-actions":
        return (
          <div className="space-y-2">
            {QUICK_ACTIONS.map(
              ({
                icon: Icon,
                label,
                description,
                path,
                accentBg,
                accentText,
              }) => (
                <Link
                  key={path}
                  to={path}
                  className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3 transition-colors hover:bg-secondary"
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      accentBg,
                    )}
                  >
                    <Icon className={cn("h-4 w-4", accentText)} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">
                      {label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {description}
                    </span>
                  </span>
                </Link>
              ),
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Helmet>
        <title>Dashboard | Xenith</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Welcome back, {firstName}.
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={editMode ? "default" : "outline"}
              size="sm"
              onClick={() => setEditMode((prev) => !prev)}
            >
              {editMode ? "Done" : "Customize widgets"}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetPreferences}>
              Reset layout
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Intentions</p>
            <p className="text-sm font-semibold text-foreground">
              {completedIntentions}/{todayIntentions.length || 0} done
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Focus this week</p>
            <p className="text-sm font-semibold text-foreground">
              {totalFocusMinutes} minutes
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Monthly net</p>
            <p className="text-sm font-semibold text-foreground">
              ${(monthlyFinance.income - monthlyFinance.expense).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background px-3 py-2">
            <p className="text-xs text-muted-foreground">Sleep avg (7d)</p>
            <p className="text-sm font-semibold text-foreground">
              {sleepAverage || "—"}h
            </p>
          </div>
        </div>
      </motion.div>

      {editMode && hiddenWidgets.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-medium text-foreground">
            Add hidden widgets
          </p>
          <div className="flex flex-wrap gap-2">
            {hiddenWidgets.map((widget) => (
              <Button
                key={widget.id}
                variant="secondary"
                size="sm"
                onClick={() => setWidgetVisible(widget.id, true)}
              >
                Add {widget.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 gap-4 lg:grid-cols-2",
          preferencesLoading && "opacity-60",
        )}
      >
        {visibleWidgets.map((widgetId) => {
          const widget = widgetMap[widgetId];
          const Icon = widget.icon;
          const accent = WIDGET_ACCENTS[widget.id];

          return (
            <motion.div
              key={widget.id}
              layout
              draggable={editMode}
              onDragStart={() => setDraggingWidget(widget.id)}
              onDragOver={(event) => {
                if (!editMode) return;
                event.preventDefault();
              }}
              onDrop={() => handleDrop(widget.id)}
              className={cn(
                "rounded-2xl border border-border bg-card p-5 transition-colors",
                accent.hoverBorder,
                editMode ? "cursor-move" : "cursor-default",
              )}
            >
              <div
                className={cn("mb-4 h-1 w-14 rounded-full", accent.accentBar)}
              />
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  {editMode && (
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      accent.iconBg,
                    )}
                  >
                    <Icon className={cn("h-4 w-4", accent.iconText)} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {widget.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {widget.description}
                    </p>
                  </div>
                </div>

                {editMode ? (
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveWidget(widget.id, "up")}
                      aria-label={`Move ${widget.title} up`}
                    >
                      <MoveUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => moveWidget(widget.id, "down")}
                      aria-label={`Move ${widget.title} down`}
                    >
                      <MoveDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setWidgetVisible(widget.id, false)}
                    >
                      Hide
                    </Button>
                  </div>
                ) : widget.href ? (
                  <Link
                    to={widget.href}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    Open
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </div>

              {renderWidgetBody(widget.id)}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
