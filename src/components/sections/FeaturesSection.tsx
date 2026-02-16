import { motion } from "framer-motion";
import {
  Target,
  Compass,
  Timer,
  BookOpen,
  Flag,
  BarChart3,
  LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
}

const features: Feature[] = [
  {
    icon: Target,
    title: "Daily Intentions",
    description: "Purpose-driven planning. Not just another todo list.",
    accent: "from-blue-500 to-blue-600",
  },
  {
    icon: Compass,
    title: "Life Dimensions",
    description:
      "Track 8 areas of life. See where you're thriving and slipping.",
    accent: "from-purple-500 to-purple-600",
  },
  {
    icon: Timer,
    title: "Focus Studio",
    description: "Deep work sessions with energy tracking. No distractions.",
    accent: "from-green-500 to-green-600",
  },
  {
    icon: BookOpen,
    title: "Reflection",
    description: "Daily and weekly reviews that actually matter.",
    accent: "from-orange-500 to-orange-600",
  },
  {
    icon: Flag,
    title: "Growth Path",
    description:
      "Build core skills: Discipline, Focus, Consistency, Endurance, Insight, Resolve.",
    accent: "from-red-500 to-red-600",
  },
  {
    icon: BarChart3,
    title: "Insights",
    description: "Understand your patterns. Optimize ruthlessly.",
    accent: "from-cyan-500 to-cyan-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="py-32 md:py-48 px-6 bg-foreground text-background relative overflow-hidden"
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-background/5 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto max-w-6xl relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-8 mb-16"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-background/50 font-sans whitespace-nowrap">
            Features
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px flex-1 bg-background/10 origin-left"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1]">
              Everything
              <br />
              <span className="text-background/50">you need.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pt-4"
          >
            <p className="text-xl text-background/60 leading-relaxed">
              Six core tools. No bloat. Each one designed to compound with the
              others into a system that actually works.
            </p>
          </motion.div>
        </div>

        {/* Feature grid - 3x2 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-background/10 rounded-2xl overflow-hidden"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="bg-foreground p-8 md:p-10 group hover:bg-background/[0.03] transition-all duration-500 relative overflow-hidden"
            >
              {/* Gradient accent bar on hover */}
              <div
                className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Icon glow effect */}
              <div className="relative mb-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-12 h-12 rounded-xl bg-background/10 flex items-center justify-center group-hover:bg-background/20 transition-colors duration-300 relative z-10"
                >
                  <feature.icon className="w-6 h-6 text-background" />
                </motion.div>
                <div
                  className={`absolute inset-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                />
              </div>

              <h3 className="text-xl font-serif font-medium mb-3 group-hover:translate-x-1 transition-transform duration-300">
                {feature.title}
              </h3>
              <p className="text-background/50 text-sm leading-relaxed group-hover:text-background/60 transition-colors duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
