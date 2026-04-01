import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Activity,
  Timer,
  RotateCw,
  BookOpen,
  ArrowRight,
  Circle,
  CheckCircle2,
  Flame,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useIntentions } from "@/hooks/use-intentions";
import { useRoutines } from "@/hooks/use-routines";
import { useFocusSessions } from "@/hooks/use-focus-sessions";
import { useReflections } from "@/hooks/use-reflections";
import { useDimensionScores } from "@/hooks/use-dimension-scores";
import { cn } from "@/lib/utils";

const hour = new Date().getHours();
const greeting =
  hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}

const QUICK_ACTIONS = [
  {
    label: "Focus Timer",
    description: "Deep work session",
    path: "/app/focus",
    icon: Timer,
  },
  {
    label: "Insights",
    description: "View analytics",
    path: "/app/insights",
    icon: TrendingUp,
  },
  {
    label: "Growth Path",
    description: "Track your skills",
    path: "/app/growth",
    icon: Activity,
  },
] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { intentions } = useIntentions();
  const { routines, completions } = useRoutines();
  const { sessions } = useFocusSessions(7);
  const { reflections } = useReflections(7);
  const { scores } = useDimensionScores();
  
  const firstName =
    (profile?.name ?? user?.email ?? "").split(/[\s@]/)[0] || "there";
  
  const today = toDateStr();
  const todayIntentions = intentions.filter((i) => i.target_date === today);
  const completedIntentions = todayIntentions.filter((i) => i.completed);
  
  const todayReflection = reflections.find((r) => r.entry_date === today);
  const recentSessions = sessions.slice(0, 3);
  const totalFocusMinutes = recentSessions.reduce((sum, s) => sum + (s.duration_minutes ?? 0), 0);
  
  const thisWeek = toDateStr(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const weekScore = scores.find((s) => s.week_start_date === thisWeek);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-semibold text-foreground">
          {greeting}, {firstName}.
        </h1>
        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Intentions Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            to="/app/intentions"
            className="block h-full p-5 bg-card border border-border rounded-2xl hover:border-foreground/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-foreground" />
                <h3 className="text-sm font-semibold text-foreground">
                  Today's Intentions
                </h3>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
            {todayIntentions.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-foreground">
                    {completedIntentions.length}/{todayIntentions.length}
                  </div>
                  <div className="text-xs text-muted-foreground">completed</div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-full transition-all"
                    style={{
                      width: `${(completedIntentions.length / todayIntentions.length) * 100}%`,
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  {todayIntentions.slice(0, 3).map((intention) => (
                    <div key={intention.id} className="flex items-center gap-2 text-xs">
                      {intention.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      <span
                        className={cn(
                          "truncate",
                          intention.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        )}
                      >
                        {intention.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No intentions set for today</p>
            )}
          </Link>
        </motion.div>

        {/* Routines Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link
            to="/app/routines"
            className="block h-full p-5 bg-card border border-border rounded-2xl hover:border-foreground/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Routines</h3>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
            {routines.length > 0 ? (
              <div className="space-y-3">
                <div className="text-2xl font-bold text-foreground">
                  {routines.length} {routines.length === 1 ? "routine" : "routines"}
                </div>
                <div className="space-y-1.5">
                  {routines.slice(0, 3).map((routine) => {
                    const items = routine.items ?? [];
                    const completion = completions.find((c) => c.routine_id === routine.id);
                    const completed = completion?.completed_item_ids?.length ?? 0;
                    const total = items.length;
                    return (
                      <div key={routine.id} className="flex items-center justify-between text-xs">
                        <span className="text-foreground truncate">{routine.name}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {completed}/{total}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No routines created yet</p>
            )}
          </Link>
        </motion.div>

        {/* Focus Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/app/focus"
            className="block h-full p-5 bg-card border border-border rounded-2xl hover:border-foreground/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-semibold text-foreground">Focus Time</h3>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {totalFocusMinutes}
                </span>
                <span className="text-xs text-muted-foreground">min this week</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {recentSessions.length} {recentSessions.length === 1 ? "session" : "sessions"} completed
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Reflection Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Link
            to="/app/reflection"
            className="block h-full p-5 bg-card border border-border rounded-2xl hover:border-foreground/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Journal</h3>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
            {todayReflection ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-foreground" />
                  <span className="text-sm text-foreground">Reflection complete</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {reflections.length} {reflections.length === 1 ? "entry" : "entries"} this week
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reflection yet today</p>
            )}
          </Link>
        </motion.div>

        {/* Dimensions Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/app/dimensions"
            className="block h-full p-5 bg-card border border-border rounded-2xl hover:border-foreground/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Life Dimensions</h3>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
            {weekScore ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-foreground" />
                  <span className="text-sm text-foreground">Weekly check-in complete</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Complete your weekly check-in</p>
            )}
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ label, description, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="group flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-foreground/30 hover:bg-secondary/50 transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-secondary group-hover:bg-foreground/10 flex items-center justify-center shrink-0 transition-colors">
                <Icon className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground truncate">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
