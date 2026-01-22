import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Lightbulb } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Balance academics, health, social life, and personal growth without sacrificing what matters.",
  },
  {
    icon: Briefcase,
    title: "Young Professionals",
    description: "Level up your career without burning out. Build sustainable success habits.",
  },
  {
    icon: Lightbulb,
    title: "Creators & Builders",
    description: "Turn side projects into finished work. Ship consistently, not sporadically.",
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

export const AudienceSection = () => {
  return (
    <section className="py-32 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Built for the ambitious
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Designed for people who take their growth seriously.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {audiences.map((audience) => (
            <motion.div
              key={audience.title}
              variants={itemVariants}
              className="relative overflow-hidden bg-card border border-border rounded-xl p-8 hover:border-foreground/20 transition-colors duration-300"
            >
              <div className="w-12 h-12 bg-foreground text-background rounded-xl flex items-center justify-center mb-6">
                <audience.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-medium mb-3">{audience.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {audience.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
