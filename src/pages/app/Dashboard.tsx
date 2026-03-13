import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Activity,
  Timer,
  RotateCw,
  BookOpen,
  BarChart2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";

const hour = new Date().getHours();
const greeting =
  hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

const QUICK_ACTIONS = [
  {
    label: "Intentions",
    description: "Plan your day",
    path: "/app/intentions",
    icon: CheckSquare,
  },
  {
    label: "Life Dimensions",
    description: "Weekly check-in",
    path: "/app/dimensions",
    icon: Activity,
  },
  {
    label: "Focus Timer",
    description: "Deep work session",
    path: "/app/focus",
    icon: Timer,
  },
  {
    label: "Routines",
    description: "Daily habits",
    path: "/app/routines",
    icon: RotateCw,
  },
  {
    label: "Reflection",
    description: "Daily journal",
    path: "/app/reflection",
    icon: BookOpen,
  },
  {
    label: "Insights",
    description: "Weekly summary",
    path: "/app/insights",
    icon: BarChart2,
  },
  {
    label: "Growth Path",
    description: "Track your skills",
    path: "/app/growth",
    icon: TrendingUp,
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
  const firstName =
    (profile?.name ?? user?.email ?? "").split(/[\s@]/)[0] || "there";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-semibold text-foreground">
          {greeting}, {firstName}.
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* Quick action grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {QUICK_ACTIONS.map(({ label, description, path, icon: Icon }) => (
          <motion.div key={path} variants={itemVariants}>
            <Link
              to={path}
              className="group flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:border-foreground/30 hover:bg-secondary/50 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary group-hover:bg-foreground/10 flex items-center justify-center shrink-0 transition-colors">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Setup nudge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-5 border border-dashed border-border rounded-2xl text-center"
      >
        <p className="text-sm font-medium text-foreground mb-1">
          Your app is ready
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Features are built progressively. Start by adding your first intention
          or completing a weekly life dimensions check-in.
        </p>
      </motion.div>
    </div>
  );
}
