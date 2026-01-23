import { motion } from "framer-motion";
import { XenithLogo } from "../XenithLogo";
import { WaitlistForm } from "../WaitlistForm";

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-6 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-6"
        >
          <XenithLogo size="hero" animated />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center justify-center gap-4 md:gap-8 mb-8"
        >
          <span className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-foreground font-medium">
            Discipline
          </span>
          <span className="w-1 h-1 rounded-full bg-foreground" />
          <span className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-foreground font-medium">
            Intention
          </span>
          <span className="w-1 h-1 rounded-full bg-foreground" />
          <span className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-foreground font-medium">
            Execution
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6 text-balance"
        >
          Stop drifting.
          <br />
          <span className="text-muted-foreground">Start executing.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 font-sans"
        >
          A no-nonsense productivity system for students and ambitious professionals. 
          Set intentions. Track progress. Build the discipline to dominate every dimension of your life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <WaitlistForm variant="hero" />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Join <span className="font-medium text-foreground">2,000+</span> students already signed up
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-24"
        >
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-foreground/50 to-transparent mx-auto"
          />
          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-4">
            Scroll to explore
          </p>
        </motion.div>
      </div>
    </section>
  );
};
