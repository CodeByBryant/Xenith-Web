import { motion } from "framer-motion";
import { Target, Compass, Timer, BookOpen, Flag, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Daily Intentions",
    description: "Purpose-driven planning. Not just another todo list.",
    accent: "bg-blue-500",
  },
  {
    icon: Compass,
    title: "Life Dimensions",
    description: "Track 8 areas of life. See where you're thriving and slipping.",
    accent: "bg-purple-500",
  },
  {
    icon: Timer,
    title: "Focus Studio",
    description: "Deep work sessions with energy tracking. No distractions.",
    accent: "bg-green-500",
  },
  {
    icon: BookOpen,
    title: "Reflection",
    description: "Daily and weekly reviews that actually matter.",
    accent: "bg-orange-500",
  },
  {
    icon: Flag,
    title: "Growth Path",
    description: "Build core skills: Discipline, Focus, Endurance, Resolve.",
    accent: "bg-red-500",
  },
  {
    icon: BarChart3,
    title: "Insights",
    description: "Understand your patterns. Optimize ruthlessly.",
    accent: "bg-cyan-500",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 md:py-48 px-6 bg-foreground text-background relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
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
          <div className="h-px flex-1 bg-background/10" />
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
              Six core tools. No bloat. Each one designed to compound with the others into a system that actually works.
            </p>
          </motion.div>
        </div>

        {/* Feature grid - 3x2 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-background/10 rounded-2xl overflow-hidden">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-foreground p-8 md:p-10 group hover:bg-background/5 transition-colors duration-300 relative"
            >
              {/* Accent bar */}
              <div className={`absolute top-0 left-0 w-full h-0.5 ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="w-12 h-12 rounded-xl bg-background/10 flex items-center justify-center mb-6 group-hover:bg-background/20 transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-background" />
              </div>
              
              <h3 className="text-xl font-serif font-medium mb-3">{feature.title}</h3>
              <p className="text-background/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
