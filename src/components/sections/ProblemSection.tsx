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
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-radial from-muted/30 to-transparent rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-radial from-muted/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto max-w-5xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4">
            Built different. <span className="text-muted-foreground">On purpose.</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            We reimagined productivity from the ground up, prioritizing your wellbeing.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {problems.map((problem) => (
            <motion.div
              key={problem.title}
              variants={itemVariants}
              className="group glass rounded-2xl p-8 text-center hover-lift cursor-default"
            >
              <div className="w-14 h-14 bg-foreground text-background rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <problem.icon className="w-7 h-7" />
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
