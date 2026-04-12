import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Heart, ChevronRight, ArrowLeft } from "lucide-react";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function RelationshipsTools() {
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
        <h1 className="text-xl font-semibold text-foreground">Relationship Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track connections and gratitude to strengthen your Relationships dimension score.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {/* Connection Tracker card */}
        <motion.div variants={itemVariants}>
          <Link
            to="/app/dimensions/relationships/connections"
            className="group flex items-center gap-4 p-5 bg-card border border-border rounded-2xl hover:border-pink-500/40 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0 group-hover:bg-pink-500/20 transition-colors">
              <Users className="w-5 h-5 text-pink-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Connection Tracker
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track interactions with people, stay connected intentionally
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
        Strong relationships require intentional effort. Consistent contact and genuine
        gratitude reflect in higher Relationships dimension scores.
      </motion.p>
    </div>
  );
}
