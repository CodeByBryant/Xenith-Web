import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const manifesto = [
  {
    number: "01",
    title: "No streak anxiety",
    description: "Streaks are for Snapchat. We track patterns, not perfection. Miss a day? The work continues.",
  },
  {
    number: "02",
    title: "Not another todo app",
    description: "Intentions, not checkboxes. Every action connects to your larger purpose. Or it doesn't belong.",
  },
  {
    number: "03",
    title: "Zero gamification",
    description: "No XP. No badges. No confetti. Just you, your goals, and the discipline to achieve them.",
  },
];

export const ProblemSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-gradient-radial from-foreground/[0.02] to-transparent rounded-full blur-3xl translate-x-1/2" />

      <div className="container mx-auto max-w-6xl relative">
        {/* Section header with animated line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-8 mb-24"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-sans whitespace-nowrap">
            The Problem
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px flex-1 bg-border origin-left"
          />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left - Big statement */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="sticky top-32"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] mb-8">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Most productivity
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground"
                >
                  apps are designed
                </motion.span>
                <br />
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  to fail you.
                </motion.span>
              </h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-lg text-muted-foreground max-w-sm"
              >
                They optimize for engagement, not outcomes. We built something different.
              </motion.p>
            </motion.div>
          </div>

          {/* Right - Manifesto items with connecting line */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Animated vertical line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border overflow-hidden">
                <motion.div
                  style={{ height: lineHeight }}
                  className="w-full bg-foreground"
                />
              </div>

              <div className="space-y-16 pl-12">
                {manifesto.map((item, index) => (
                  <motion.div
                    key={item.number}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="relative group"
                  >
                    {/* Dot on the line with pulse effect */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.15, type: "spring", stiffness: 200 }}
                      className="absolute -left-12 top-2 transform -translate-x-1/2"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300" />
                      <motion.div
                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-foreground"
                      />
                    </motion.div>
                    
                    <div className="flex items-start gap-6">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.15 }}
                        className="font-chomsky text-5xl text-muted/30 leading-none"
                      >
                        {item.number}
                      </motion.span>
                      <div className="pt-2">
                        <h3 className="text-2xl font-serif font-medium mb-3 group-hover:text-foreground/80 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed max-w-md">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
