import { motion } from "framer-motion";

const audiences = [
  {
    title: "Students",
    stat: "4.0",
    statLabel: "avg GPA lift",
    description: "Balance academics, fitness, social life, and side projects. Stop choosing between success and wellbeing.",
    tags: ["Time-blocked studying", "Energy management", "Life balance tracking"],
  },
  {
    title: "Young Professionals",
    stat: "47%",
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
  return (
    <section className="py-32 md:py-48 px-6 relative overflow-hidden">
      {/* Background X */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 font-chomsky text-[60vw] text-foreground/[0.02] pointer-events-none select-none leading-none">
        X
      </div>

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
          <div className="h-px flex-1 bg-border" />
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

        {/* Audience cards - Horizontal scroll on mobile, grid on desktop */}
        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="absolute inset-0 border border-border rounded-2xl group-hover:border-foreground/30 transition-colors duration-300" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/[0.02] rounded-2xl" />
              
              <div className="relative p-8">
                {/* Stat callout */}
                <div className="mb-8">
                  <div className="text-5xl font-serif font-bold mb-1">{audience.stat}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {audience.statLabel}
                  </div>
                </div>

                <h3 className="text-2xl font-serif font-medium mb-4">{audience.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {audience.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {audience.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-secondary text-muted-foreground rounded-full"
                    >
                      {tag}
                    </span>
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
