import { motion } from "framer-motion";
import { XenithLogo } from "../XenithLogo";
import { WaitlistForm } from "../WaitlistForm";

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-6">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <XenithLogo size="xl" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-sm font-sans uppercase tracking-[0.2em] text-muted-foreground mb-6"
        >
          Intentional living. Meaningful progress.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium leading-tight mb-6 text-balance"
        >
          Your journey to intentional living starts here
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-sans"
        >
          A minimalist productivity platform for students and young professionals. 
          Track intentions, build sustainable routines, and grow across all dimensions of life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <WaitlistForm variant="hero" />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Join 2,000+ students already signed up
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20"
        >
          <div className="w-px h-16 bg-border mx-auto" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground mt-4">
            Scroll to explore
          </p>
        </motion.div>
      </div>
    </section>
  );
};
