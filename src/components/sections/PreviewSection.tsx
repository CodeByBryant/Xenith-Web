import { motion } from "framer-motion";
import { XenithDemo } from "../demo/XenithDemo";

export const PreviewSection = () => {
  return (
    <section id="preview" className="py-32 md:py-48 px-6 relative overflow-hidden">
      {/* Dramatic radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-foreground/5 via-transparent to-transparent rounded-full" />
      
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
          <div className="h-px flex-1 bg-border" />
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
              This isn't a mockup. It's a fully functional prototype. Navigate through screens, 
              check off tasks, start focus sessions. Experience the app before it launches.
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
                  className="flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                  <span className="text-sm text-muted-foreground">{item}</span>
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
            <div className="relative">
              {/* Glow effect behind phone */}
              <div className="absolute -inset-8 bg-gradient-radial from-foreground/10 to-transparent rounded-full blur-2xl" />
              <XenithDemo />
            </div>
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
