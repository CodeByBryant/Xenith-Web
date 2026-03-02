import { motion } from "framer-motion";
import { useEffect } from "react";
import { ScreenId } from "../BottomNav";

interface SplashScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SplashScreen = ({ onNavigate }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate("dashboard");
    }, 2500);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="h-full bg-demo-bg flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        {/* Logo X */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-chomsky text-[120px] leading-none text-demo-fg mb-2"
        >
          X
        </motion.div>
        
        {/* XENITH text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-demo-fg text-lg tracking-[0.4em] font-medium mb-8"
        >
          XENITH
        </motion.div>
        
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-demo-subtle text-xs tracking-[0.2em] uppercase"
        >
          Discipline | Intention | Execution
        </motion.div>
      </motion.div>

      {/* Loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-20"
      >
        <motion.div
          className="w-8 h-0.5 bg-demo-elevated rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-demo-fg"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 1 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};
