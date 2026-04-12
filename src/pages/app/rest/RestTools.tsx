import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, ChevronRight, ArrowLeft, Sparkles } from "lucide-react";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function RestTools() {
  return (
    <div className="max-w-lg mx-auto">
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
        <h1 className="text-xl font-semibold text-foreground">Rest Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track sleep quality and patterns to strengthen your Rest dimension score.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        <motion.div variants={itemVariants}>
          <Link
            to="/app/dimensions/rest/sleep"
            className="group flex items-center gap-4 p-5 bg-card border border-border rounded-2xl hover:border-indigo-500/40 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
              <Moon className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Sleep Tracker
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Log hours, quality, and factors affecting your sleep
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/app/dimensions/rest/recharge"
            className="group flex items-center gap-4 p-5 bg-card border border-border rounded-2xl hover:border-teal-500/40 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0 group-hover:bg-teal-500/20 transition-colors">
              <Sparkles className="w-5 h-5 text-teal-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Recharge Log
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track non-sleep rest and recovery activities
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xs text-muted-foreground text-center mt-8 leading-relaxed"
      >
        Pro tip — use these tools to inform your weekly Rest dimension score.
        Consistent logging here should reflect in a higher self-rating.
      </motion.p>
    </div>
  );
}
