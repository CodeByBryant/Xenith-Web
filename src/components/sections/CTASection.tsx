import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { WaitlistForm } from "../WaitlistForm";

export const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const xScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const xOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 0.03]);

  return (
    <section
      ref={sectionRef}
      id="waitlist"
      className="py-32 md:py-48 px-6 bg-foreground text-background relative overflow-hidden"
    >
      {/* Dramatic X watermark with parallax */}
      <motion.div
        style={{ scale: xScale, opacity: xOpacity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-chomsky text-[50vw] text-background pointer-events-none select-none leading-none"
      >
        X
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-radial from-background/5 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto max-w-4xl text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 border border-background/20 rounded-full text-sm text-background/60 mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#22c55e]"
            />
            <span>Limited beta spots remaining</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium leading-[1.1] mb-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Ready to stop
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-background/50"
            >
              drifting?
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-background/60 max-w-xl mx-auto mb-12"
          >
            Join the waitlist. Get early access. Lock in 50% off Pro forever. No
            spam. Just updates on launch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="max-w-md mx-auto mb-8"
          >
            <WaitlistForm variant="footer" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-background/40"
          >
            <span>Free during beta</span>
            <div className="w-1 h-1 rounded-full bg-background/20" />
            <span>No credit card</span>
            <div className="w-1 h-1 rounded-full bg-background/20" />
            <span>Cancel anytime</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
