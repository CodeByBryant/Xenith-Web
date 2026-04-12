import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BookOpen,
  Clock,
  Coins,
  Dumbbell,
  Heart,
  Moon,
  Repeat,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useBooks } from "@/hooks/use-books";
import { useDimensionScores } from "@/hooks/use-dimension-scores";
import { useFocusSessions } from "@/hooks/use-focus-sessions";
import { useIntentions } from "@/hooks/use-intentions";
import { useNutrition } from "@/hooks/use-nutrition";
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

const PIE_COLORS = ["#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899", "#22c55e"];
const CHART_COLORS = {
  focus: "#22c55e",
  dimensionRadar: "#a855f7",
  dimensionTrend: "#f59e0b",
  income: "#34d399",
  expense: "#fb7185",
  sleep: "#60a5fa",
};

const AXIS_TICK = {
  fontSize: 11,
  fill: "hsl(var(--muted-foreground))",
};

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "0.75rem",
  color: "hsl(var(--foreground))",
};

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}

function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  return d;
}

function formatWeekLabel() {
  const start = startOfWeek();
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return `${start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} - ${end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}`;
}

function metricClass(value: number, threshold: number) {
  return value >= threshold ? "text-emerald-500" : "text-muted-foreground";
}

function StatTile({
  title,
  value,
  subtitle,
  icon: Icon,
  valueClassName,
  iconClassName,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof TrendingUp;
  valueClassName?: string;
  iconClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>{title}</span>
        <Icon className={cn("h-3.5 w-3.5", iconClassName)} />
      </div>
      <p className={cn("text-2xl font-semibold tabular-nums", valueClassName)}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export default function Insights() {
  const { intentions } = useIntentions(new Date());
  const { routines, completions } = useRoutines();
  const { sessions } = useFocusSessions(30);
  const { reflections } = useReflections(14);
  const { scores, currentScores } = useDimensionScores(8);
  const { totals: nutritionTotals } = useNutrition(new Date());
  const { workouts } = useWorkouts(new Date());
  const { totalMl } = useWater(new Date());
  const { transactions } = useTransactions(
    new Date().toISOString().slice(0, 7),
  );
  const { books } = useBooks();
  const { logs: sleepLogs } = useSleepLogs(14);
  const { activities: rechargeActivities } = useRechargeActivities(14);

  const weekSessions = useMemo(
    () => getCompletedFocusSessionsThisWeek(sessions),
    [sessions],
  );

  const totalFocusMinutes = getTotalFocusMinutes(weekSessions);
  const focusHours = (totalFocusMinutes / 60).toFixed(1);

  const completedIntentions = intentions.filter((item) =>
    Boolean(item.completed_at),
  ).length;
  const intentionRate = intentions.length
    ? Math.round((completedIntentions / intentions.length) * 100)
    : 0;

  const routineTotals = useMemo(() => {
    const totalItems = routines.reduce(
      (sum, routine) => sum + (routine.items?.length ?? 0),
      0,
    );
    const completed = completions.reduce(
      (sum, completion) => sum + (completion.completed_item_ids?.length ?? 0),
      0,
    );

    const adherence = totalItems
      ? Math.round((completed / totalItems) * 100)
      : 0;
    return { totalItems, completed, adherence };
  }, [completions, routines]);

  const focusTrend = useMemo(() => {
    const byDay = new Map<string, number>();
    const start = new Date();
    start.setDate(start.getDate() - 13);

    for (let i = 0; i < 14; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = toDateStr(date);
      byDay.set(key, 0);
    }

    for (const session of sessions) {
      if (!session.completed_at || !session.started_at) continue;
      const key = toDateStr(new Date(session.started_at));
      if (!byDay.has(key)) continue;
      byDay.set(key, (byDay.get(key) ?? 0) + (session.duration_minutes || 0));
    }

    return Array.from(byDay.entries()).map(([date, minutes]) => ({
      date,
      label: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      minutes,
    }));
  }, [sessions]);

  const dimensionsRadar = useMemo(
    () =>
      LIFE_DIMENSIONS.map((dimension) => ({
        dimension,
        score: currentScores[dimension] ?? 0,
      })),
    [currentScores],
  );

  const dimensionsWeeklyTrend = useMemo(() => {
    const grouped = new Map<string, number[]>();

    for (const row of scores) {
      if (!row.week_start || !row.score) continue;
      if (!grouped.has(row.week_start)) grouped.set(row.week_start, []);
      grouped.get(row.week_start)?.push(row.score);
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .slice(-8)
      .map(([week, values]) => ({
        week: new Date(`${week}T00:00:00`).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        avg: Number(
          (
            values.reduce((sum, value) => sum + value, 0) / values.length
          ).toFixed(1),
        ),
      }));
  }, [scores]);

  const finances = useMemo(() => {
    const summary = transactions.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount || 0);
        if (transaction.type === "income") {
          acc.income += amount;
        } else {
          acc.expense += amount;
        }

        const key = transaction.category || "Other";
        if (!acc.categories[key]) {
          acc.categories[key] = { income: 0, expense: 0 };
        }

        if (transaction.type === "income") {
          acc.categories[key].income += amount;
        } else {
          acc.categories[key].expense += amount;
        }

        return acc;
      },
      {
        income: 0,
        expense: 0,
        categories: {} as Record<string, { income: number; expense: number }>,
      },
    );

    const categories = Object.entries(summary.categories)
      .map(([category, values]) => ({
        category,
        income: Number(values.income.toFixed(2)),
        expense: Number(values.expense.toFixed(2)),
      }))
      .sort((a, b) => b.expense + b.income - (a.expense + a.income))
      .slice(0, 6);

    return {
      income: summary.income,
      expense: summary.expense,
      net: summary.income - summary.expense,
      categories,
    };
  }, [transactions]);

  const learningData = useMemo(() => {
    const grouped = books.reduce(
      (acc, book) => {
        const key = book.status || "unknown";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped).map(([status, count]) => ({
      status,
      count,
    }));
  }, [books]);

  const sleepTrend = useMemo(
    () =>
      [...sleepLogs]
        .sort((a, b) => (a.date < b.date ? -1 : 1))
        .slice(-14)
        .map((row) => ({
          date: row.date,
          label: new Date(`${row.date}T00:00:00`).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          hours: Number(row.hours_slept || 0),
        })),
    [sleepLogs],
  );

  const rechargeLift = useMemo(() => {
    const diffs = rechargeActivities
      .map((entry) => {
        if (!entry.feeling_before || !entry.feeling_after) return null;
        return entry.feeling_after - entry.feeling_before;
      })
      .filter((value): value is number => value !== null);

    if (!diffs.length) return 0;
    return Number(
      (diffs.reduce((sum, value) => sum + value, 0) / diffs.length).toFixed(2),
    );
  }, [rechargeActivities]);

  const avgSleep = useMemo(() => {
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

  const narrative = useMemo(() => {
    const lines: string[] = [];

    lines.push(
      `Focus output sits at ${focusHours}h this week across ${weekSessions.length} sessions.`,
    );
    lines.push(
      `Intentions completion is ${intentionRate}% and routine adherence is ${routineTotals.adherence}%.`,
    );

    if (finances.net >= 0) {
      lines.push(
        `Finances are positive this month with a net of $${finances.net.toFixed(2)}.`,
      );
    } else {
      lines.push(
        `Finances are currently negative this month at $${finances.net.toFixed(2)} net.`,
      );
    }

    if (avgSleep > 0) {
      lines.push(
        `Average sleep over the last two weeks is ${avgSleep}h with recharge lift at ${rechargeLift}.`,
      );
    }

    if (books.length > 0) {
      lines.push(`Learning momentum includes ${books.length} tracked books.`);
    }

    return lines;
  }, [
    avgSleep,
    books.length,
    finances.net,
    focusHours,
    intentionRate,
    rechargeLift,
    routineTotals.adherence,
    weekSessions.length,
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Helmet>
        <title>Insights | Xenith</title>
      </Helmet>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Insights Command Center
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Weekly window: {formatWeekLabel()} | Multi-domain analytics across
          execution, health, finance, learning, and recovery.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatTile
          title="Focus"
          value={`${focusHours}h`}
          subtitle={`${weekSessions.length} sessions this week`}
          icon={Clock}
          valueClassName="text-green-500"
          iconClassName="text-green-500"
        />
        <StatTile
          title="Intentions"
          value={`${intentionRate}%`}
          subtitle={`${completedIntentions}/${intentions.length || 0} completed`}
          icon={Target}
          valueClassName="text-blue-500"
          iconClassName="text-blue-500"
        />
        <StatTile
          title="Routines"
          value={`${routineTotals.adherence}%`}
          subtitle={`${routineTotals.completed}/${routineTotals.totalItems || 0} steps done`}
          icon={Repeat}
          valueClassName="text-emerald-500"
          iconClassName="text-emerald-500"
        />
        <StatTile
          title="Reflection"
          value={`${reflections.length}`}
          subtitle="Entries in the last 14 days"
          icon={BookOpen}
          valueClassName="text-violet-500"
          iconClassName="text-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Focus Trend (14 days)
            </h2>
            <span className="text-xs text-muted-foreground">
              minutes per day
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={focusTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="label" tick={AXIS_TICK} />
                <YAxis tick={AXIS_TICK} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke={CHART_COLORS.focus}
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Current Dimension Balance
            </h2>
            <Activity className="h-4 w-4 text-fuchsia-500" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={dimensionsRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 10]}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke={CHART_COLORS.dimensionRadar}
                  fill={CHART_COLORS.dimensionRadar}
                  fillOpacity={0.25}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Dimension Trend (8 weeks)
            </h2>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dimensionsWeeklyTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="week" tick={AXIS_TICK} />
                <YAxis tick={AXIS_TICK} domain={[0, 10]} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke={CHART_COLORS.dimensionTrend}
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Finance by Category
            </h2>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
            <p className="rounded-lg bg-secondary px-2 py-1 text-muted-foreground">
              Income{" "}
              <span className="ml-1 font-medium text-foreground">
                ${finances.income.toFixed(2)}
              </span>
            </p>
            <p className="rounded-lg bg-secondary px-2 py-1 text-muted-foreground">
              Expense{" "}
              <span className="ml-1 font-medium text-foreground">
                ${finances.expense.toFixed(2)}
              </span>
            </p>
            <p
              className={
                metricClass(finances.net, 0) +
                " rounded-lg bg-secondary px-2 py-1 text-xs"
              }
            >
              Net{" "}
              <span className="ml-1 font-medium">
                ${finances.net.toFixed(2)}
              </span>
            </p>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finances.categories}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="category" tick={AXIS_TICK} />
                <YAxis tick={AXIS_TICK} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  wrapperStyle={{
                    color: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="income"
                  fill={CHART_COLORS.income}
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  fill={CHART_COLORS.expense}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Learning Mix
            </h2>
            <BookOpen className="h-4 w-4 text-cyan-500" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={learningData}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {learningData.map((entry, index) => (
                    <Cell
                      key={entry.status}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Legend
                  wrapperStyle={{
                    color: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Rest and Recovery Trend
            </h2>
            <Moon className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
            <p className="rounded-lg bg-secondary px-2 py-1 text-muted-foreground">
              Avg sleep{" "}
              <span className="ml-1 font-medium text-foreground">
                {avgSleep || "-"}h
              </span>
            </p>
            <p className="rounded-lg bg-secondary px-2 py-1 text-muted-foreground">
              Sleep logs{" "}
              <span className="ml-1 font-medium text-foreground">
                {sleepLogs.length}
              </span>
            </p>
            <p className="rounded-lg bg-secondary px-2 py-1 text-muted-foreground">
              Recharge logs{" "}
              <span className="ml-1 font-medium text-foreground">
                {rechargeActivities.length}
              </span>
            </p>
            <p className="rounded-lg bg-secondary px-2 py-1 text-muted-foreground">
              Lift score{" "}
              <span className="ml-1 font-medium text-foreground">
                {rechargeLift}
              </span>
            </p>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis dataKey="label" tick={AXIS_TICK} />
                <YAxis tick={AXIS_TICK} />
                <Tooltip contentStyle={TOOLTIP_STYLE} />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke={CHART_COLORS.sleep}
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Heart className="h-4 w-4 text-rose-500" /> Health Snapshot
          </h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Calories today:{" "}
              <span className="font-medium text-foreground">
                {nutritionTotals.calories}
              </span>
            </p>
            <p>
              Protein today:{" "}
              <span className="font-medium text-foreground">
                {nutritionTotals.protein}g
              </span>
            </p>
            <p>
              Water today:{" "}
              <span className="font-medium text-foreground">{totalMl}ml</span>
            </p>
            <p>
              Workouts today:{" "}
              <span className="font-medium text-foreground">
                {workouts.length}
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Dumbbell className="h-4 w-4 text-blue-500" /> Execution Signals
          </h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Intention completion:{" "}
              <span className="font-medium text-foreground">
                {intentionRate}%
              </span>
            </p>
            <p>
              Routine adherence:{" "}
              <span className="font-medium text-foreground">
                {routineTotals.adherence}%
              </span>
            </p>
            <p>
              Focus consistency:{" "}
              <span className="font-medium text-foreground">
                {focusTrend.filter((point) => point.minutes > 0).length}/14 days
              </span>
            </p>
            <p>
              Reflection cadence:{" "}
              <span className="font-medium text-foreground">
                {reflections.length}/14 days
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Coins className="h-4 w-4 text-amber-500" /> Weekly Narrative
          </h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            {narrative.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
