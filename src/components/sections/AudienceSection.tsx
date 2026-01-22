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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6 },
  },
};

export const AudienceSection = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Large decorative X */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-chomsky text-[40rem] text-muted/10 pointer-events-none select-none">
        X
      </div>
      
      <div className="container mx-auto max-w-5xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-medium mb-4">
            Built for the <span className="text-muted-foreground">ambitious</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Designed for people who take their growth seriously.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              variants={itemVariants}
              className="relative overflow-hidden glass rounded-2xl p-8 hover-lift cursor-default group"
            >
              <div className="absolute top-4 right-4 font-chomsky text-6xl text-muted/20 group-hover:text-muted/40 transition-colors">
                {index + 1}
              </div>
              <div className="w-14 h-14 bg-foreground text-background rounded-2xl flex items-center justify-center mb-6">
                <audience.icon className="w-7 h-7" />
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
