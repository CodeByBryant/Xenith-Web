import { motion } from "framer-motion";
import { Target, Compass, Timer, BookOpen, Flag, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Daily Intentions",
    description: "Plan your day with purpose, not just checkboxes",
  },
  {
    icon: Compass,
    title: "Life Dimensions",
    description: "Track balance across Health, Mind, Work, Relationships & more",
  },
  {
    icon: Timer,
    title: "Focus Studio",
    description: "Deep work sessions with energy tracking",
  },
  {
    icon: BookOpen,
    title: "Reflection & Journals",
    description: "Guided prompts for meaningful self-review",
  },
  {
    icon: Flag,
    title: "Goals & Projects",
    description: "Long-term vision meets daily execution",
  },
  {
    icon: BarChart3,
    title: "Insights",
    description: "Understand your patterns with beautiful analytics",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4">
            Everything you need. <span className="text-muted-foreground">Nothing you don't.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Thoughtfully crafted features that work together seamlessly.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group p-6 rounded-2xl glass hover-lift cursor-default"
            >
              <div className="w-12 h-12 bg-foreground text-background rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
