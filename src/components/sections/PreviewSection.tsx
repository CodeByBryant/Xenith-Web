import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { XenithDemo } from "../demo/XenithDemo";

export const PreviewSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const phoneY = useTransform(scrollYProgress, [0, 1], [100, -50]);
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 0.15]);

  return (
    <section
      ref={sectionRef}
      id="preview"
      className="py-32 md:py-48 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Animated radial glow */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-foreground via-transparent to-transparent rounded-full"
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

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
            Live Demo
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px flex-1 bg-border origin-left"
          />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-medium leading-[1.1] mb-6">
              Touch it.
              <br />
              <span className="text-muted-foreground">Try it.</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Navigate through screens, check off tasks, start focus sessions.
              Experience the app before it launches.
            </p>

            <div className="space-y-4">
              {[
                "8 interactive screens",
                "Working focus timer",
                "Live Life Balance chart",
                "Real task interactions",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 group"
                >
                  <motion.div
                    whileHover={{ scale: 1.5 }}
                    className="w-1.5 h-1.5 rounded-full bg-foreground"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Phone demo */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:col-span-7 order-1 lg:order-2 flex justify-center"
          >
            <motion.div style={{ y: phoneY }} className="relative">
              {/* Glow effects behind phone */}
              <motion.div
                animate={{
                  opacity: [0.05, 0.1, 0.05],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-12 bg-gradient-radial from-foreground to-transparent rounded-full blur-2xl"
              />
              <div className="absolute -inset-4 bg-gradient-to-b from-foreground/5 to-transparent rounded-[3rem] blur-xl" />
              <XenithDemo />
            </motion.div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-muted-foreground mt-12 lg:hidden"
        >
          ↑ Tap to navigate ↑
        </motion.p>
      </div>
    </section>
  );
};
