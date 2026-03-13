import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureStubProps {
  icon: LucideIcon;
  title: string;
  description: string;
  phase: string;
  features: string[];
}

export function FeatureStub({
  icon: Icon,
  title,
  description,
  phase,
  features,
}: FeatureStubProps) {
  return (
    <div className="max-w-lg mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center gap-5"
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center">
          <Icon className="w-8 h-8 text-foreground" />
        </div>

        {/* Title + description */}
        <div>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        </div>

        {/* Phase badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary border border-border rounded-full text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 inline-block" />
          Coming in {phase}
        </span>

        {/* Feature list */}
        <div className="w-full mt-2 border border-border rounded-2xl divide-y divide-border overflow-hidden text-left">
          {features.map((f, i) => (
            <div
              key={i}
              className="px-4 py-3 text-sm text-muted-foreground hover:bg-secondary/50 transition-colors"
            >
              {f}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
