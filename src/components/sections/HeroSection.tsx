import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

export const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.2]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100vh] overflow-hidden px-6 pt-28 pb-20 md:flex md:items-center md:pt-0"
    >
      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-foreground/10 to-transparent blur-3xl"
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <motion.div
        style={{ y }}
        className="container relative z-10 mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-12"
      >
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Free Beta Live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-5xl font-serif font-medium leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Focus your life.
            <br />
            <span className="text-muted-foreground">Ship your best work.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 max-w-xl text-lg text-muted-foreground md:text-xl"
          >
            Xenith is completely free during beta. Stress test your system:
            plan intentions, run focused sessions, track recovery, and manage
            projects in one command center.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Start free beta now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#preview"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              See live demo
              <PlayCircle className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="lg:col-span-5"
        >
          <div className="rounded-2xl border border-border bg-card/80 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
               What you can test today
            </p>
            <div className="mt-5 space-y-3">
              {[
                "Customize dashboard widgets for execution, health, and recovery",
                "Review weekly multi-domain insights with trend charts",
                "Organize projects with nested pages and command search",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
            <Link
              to="/app"
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Open app
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
