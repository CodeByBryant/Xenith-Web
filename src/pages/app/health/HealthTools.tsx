import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Utensils, Dumbbell, Droplet, Calculator, ChevronRight, ArrowLeft } from "lucide-react";
import { useNutritionWeekStats } from "@/hooks/use-nutrition";
import { useWorkoutHistory } from "@/hooks/use-workouts";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function HealthTools() {
  const { data: nutrition } = useNutritionWeekStats();
  const { data: history = [] } = useWorkoutHistory(7);

  const workoutsThisWeek = new Set(history.map((w) => w.date)).size;

  return (
    <div className="max-w-lg mx-auto">
      {/* Back link */}
      <Link
        to="/app/dimensions"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Life Dimensions
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl font-semibold text-foreground">Health Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track nutrition and exercise to strengthen your Health dimension
          score.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {/* Calorie Tracker card */}
        <motion.div variants={itemVariants}>
          <Link
            to="/app/dimensions/health/calories"
            className="group flex items-center gap-4 p-5 bg-card border border-border rounded-2xl hover:border-emerald-500/40 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
              <Utensils className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Calorie Tracker
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Log meals, search 3M+ foods, scan barcodes
              </p>
              {nutrition && (
                <p className="text-xs text-emerald-500 mt-1.5 font-medium">
                  {nutrition.loggedDays}/7 days logged this week
                  {nutrition.avgCalories > 0 &&
                    ` · ${nutrition.avgCalories} avg kcal`}
                </p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </motion.div>

        {/* Workout Tracker card */}
        <motion.div variants={itemVariants}>
          <Link
            to="/app/dimensions/health/workouts"
            className="group flex items-center gap-4 p-5 bg-card border border-border rounded-2xl hover:border-emerald-500/40 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
              <Dumbbell className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Workout Tracker
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Log exercises with interactive muscle map visualization
              </p>
              {workoutsThisWeek > 0 && (
                <p className="text-xs text-emerald-500 mt-1.5 font-medium">
                  {workoutsThisWeek} workout day
                  {workoutsThisWeek !== 1 ? "s" : ""} this week
                </p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </motion.div>

        {/* Water & Supplements card */}
        <motion.div variants={itemVariants}>
          <Link
            to="/app/dimensions/health/water"
            className="group flex items-center gap-4 p-5 bg-card border border-border rounded-2xl hover:border-emerald-500/40 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
              <Droplet className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Water & Supplements
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track daily hydration and supplement intake
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </motion.div>

        {/* Biometric Wizard card */}
        <motion.div variants={itemVariants}>
          <Link
            to="/app/dimensions/health/biometrics"
            className="group flex items-center gap-4 p-5 bg-card border border-border rounded-2xl hover:border-emerald-500/40 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 transition-colors">
              <Calculator className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Biometric Wizard
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Calculate personalized calorie and macro targets
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Info note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xs text-muted-foreground text-center mt-8 leading-relaxed"
      >
        Use these tools to inform your weekly Health dimension score.
        Consistent logging here should reflect in a higher self-rating.
      </motion.p>
    </div>
  );
}
