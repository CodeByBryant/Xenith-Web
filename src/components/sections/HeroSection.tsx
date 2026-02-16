import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { WaitlistForm } from "../WaitlistForm";
import { useWaitlistCount } from "@/hooks/use-waitlist-count";

export const HeroSection = () => {
  const { count, loading } = useWaitlistCount();
  const displayCount = count !== null ? count.toLocaleString() : "—";
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const xRotate = useTransform(scrollYProgress, [0, 0.3], [0, -15]);

  return (
    <section
      ref={containerRef}
      className="min-h-[120vh] flex items-start pt-32 md:pt-0 md:items-center justify-center px-6 relative overflow-hidden"
    >
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-foreground to-transparent rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.02, 0.05, 0.02],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-foreground to-transparent rounded-full blur-3xl"
      />

      {/* Dramatic grid with glow */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Giant X watermark with rotation */}
      <motion.div
        style={{ opacity, scale, rotateZ: xRotate }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-chomsky text-[50vw] md:text-[35vw] text-foreground/[0.02] pointer-events-none select-none leading-none"
      >
        X
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto max-w-6xl relative z-10"
      >
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left side - Editorial typography */}
          <div className="lg:col-span-7 text-left">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="font-chomsky text-7xl md:text-9xl text-foreground leading-none"
                >
                  X
                </motion.div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="h-px flex-1 bg-gradient-to-r from-foreground/40 to-transparent origin-left"
                />
              </div>

              <div className="flex items-center gap-3 text-xs tracking-[0.4em] uppercase text-muted-foreground mb-8">
                {["Discipline", "Intention", "Execution"].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    {i > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                    )}
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium leading-[0.9] mb-8"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Stop
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-muted-foreground"
              >
                drifting.
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="max-w-md"
            >
              <p className="text-lg md:text-xl text-muted-foreground font-sans leading-relaxed mb-8">
                A no-nonsense system for people who are done making excuses. Set
                intentions. Execute. Become undeniable.
              </p>
            </motion.div>
          </div>

          {/* Right side - CTA Block */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
                type: "spring",
                stiffness: 80,
              }}
              className="relative"
            >
              {/* Animated decorative border frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute -inset-4 border border-foreground/10 rounded-3xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute -inset-8 border border-foreground/5 rounded-3xl"
              />

              <div className="bg-card/60 backdrop-blur-md border border-border/80 rounded-2xl p-8 relative shadow-2xl shadow-foreground/5">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6 font-sans"
                >
                  Early Access
                </motion.div>

                <h3 className="text-2xl md:text-3xl font-serif mb-4">
                  Claim your spot.
                </h3>

                <p className="text-muted-foreground text-sm mb-6">
                  Join{" "}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="text-foreground font-medium tabular-nums"
                  >
                    {loading ? "…" : displayCount}
                  </motion.span>{" "}
                  ambitious students and professionals already on the waitlist.
                </p>

                <WaitlistForm variant="hero" />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6 pt-6 border-t border-border"
                >
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-[#22c55e]"
                      />
                      <span>Free during beta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-foreground" />
                      <span>No credit card</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-20 bg-gradient-to-b from-foreground/60 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};
