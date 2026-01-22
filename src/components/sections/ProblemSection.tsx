import { motion } from "framer-motion";
import { Shield, Sparkles, Lock } from "lucide-react";

const problems = [
  {
    icon: Sparkles,
    title: "No Streak Anxiety",
    description: "Focus on patterns, not perfection. We celebrate consistency without punishment.",
  },
  {
    icon: Shield,
    title: "Not Another Todo App",
    description: "Intentions, not just tasks. Connect your daily actions to what truly matters.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data stays yours. Local-first, encrypted, exportable.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const ProblemSection = () => {
  return (
    <section className="py-32 px-6 bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Built different. On purpose.
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We reimagined productivity from the ground up, prioritizing your wellbeing.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {problems.map((problem) => (
            <motion.div
              key={problem.title}
              variants={itemVariants}
              className="bg-card border border-border rounded-xl p-8 text-center hover:border-foreground/20 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <problem.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-serif font-medium mb-3">{problem.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
