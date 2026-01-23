import { motion } from "framer-motion";
import { WaitlistForm } from "../WaitlistForm";
import { ArrowUpRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section id="waitlist" className="py-32 md:py-48 px-6 bg-foreground text-background relative overflow-hidden">
      {/* Dramatic X watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-chomsky text-[50vw] text-background/[0.03] pointer-events-none select-none leading-none"
      >
        X
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto max-w-4xl text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-background/20 rounded-full text-sm text-background/60 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span>Limited beta spots remaining</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium leading-[1.1] mb-6">
            Ready to stop
            <br />
            <span className="text-background/50">drifting?</span>
          </h2>
          
          <p className="text-lg md:text-xl text-background/60 max-w-xl mx-auto mb-12">
            Join the waitlist. Get early access. Lock in 50% off Pro forever.
            No spam. Just updates on launch.
          </p>

          <div className="max-w-md mx-auto mb-8">
            <WaitlistForm variant="footer" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-background/40">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4" />
              <span>2,847 on the list</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-background/20" />
            <span>Free during beta</span>
            <div className="w-1 h-1 rounded-full bg-background/20" />
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
