import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const audiences = [
  {
    title: "Students",
    stat: "3.8",
    statLabel: "up to GPA lift",
    description: "Balance academics, fitness, social life, and side projects. Stop choosing between success and wellbeing.",
    tags: ["Time-blocked studying", "Energy management", "Life balance tracking"],
  },
  {
    title: "Young Professionals",
    stat: "27%",
    statLabel: "more focused hours",
    description: "Climb the ladder without burning the candle. Build habits that compound over a 40-year career.",
    tags: ["Deep work sessions", "Career growth tracking", "Sustainable pace"],
  },
  {
    title: "Builders & Creators",
    stat: "3x",
    statLabel: "project completion",
    description: "Stop starting. Start finishing. Turn scattered ideas into shipped work with systematic execution.",
    tags: ["Project milestones", "Creative momentum", "Shipping discipline"],
  },
];

export const AudienceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const xMove = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={sectionRef} className="py-32 md:py-48 px-6 relative overflow-hidden">
      {/* Animated Background X */}
      <motion.div
        style={{ x: xMove }}
        className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 font-chomsky text-[60vw] text-foreground/[0.02] pointer-events-none select-none leading-none"
      >
        X
      </motion.div>

      <div className="container mx-auto max-w-6xl relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-8 mb-16"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-sans whitespace-nowrap">
            Who It's For
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px flex-1 bg-border origin-left"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] max-w-3xl">
            For people who are
            <br />
            <span className="text-muted-foreground">done with excuses.</span>
          </h2>
        </motion.div>

        {/* Audience cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="absolute inset-0 border border-border rounded-2xl group-hover:border-foreground/30 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/[0.02] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative p-8">
                {/* Stat callout with counter animation */}
                <div className="mb-8">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring", stiffness: 100 }}
                    className="text-5xl font-serif font-bold mb-1"
                  >
                    {audience.stat}
                  </motion.div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {audience.statLabel}
                  </div>
                </div>

                <h3 className="text-2xl font-serif font-medium mb-4 group-hover:translate-x-1 transition-transform duration-300">
                  {audience.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {audience.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {audience.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="px-3 py-1 text-xs bg-secondary text-muted-foreground rounded-full hover:bg-secondary/80 transition-colors"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
