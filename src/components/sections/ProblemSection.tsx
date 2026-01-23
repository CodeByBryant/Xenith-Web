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

  const lineHeight = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-32 md:py-48 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative">
        {/* Section header with horizontal line */}
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
          <div className="h-px flex-1 bg-border" />
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
                Most productivity
                <br />
                <span className="text-muted-foreground">apps are designed</span>
                <br />
                <span className="text-muted-foreground">to fail you.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-sm">
                They optimize for engagement, not outcomes. We built something different.
              </p>
            </motion.div>
          </div>

          {/* Right - Manifesto items with connecting line */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Animated vertical line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border">
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
                    {/* Dot on the line */}
                    <div className="absolute -left-12 top-2 w-2.5 h-2.5 rounded-full bg-foreground transform -translate-x-1/2 group-hover:scale-150 transition-transform duration-300" />
                    
                    <div className="flex items-start gap-6">
                      <span className="font-chomsky text-5xl text-muted/30 leading-none">
                        {item.number}
                      </span>
                      <div className="pt-2">
                        <h3 className="text-2xl font-serif font-medium mb-3">
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
