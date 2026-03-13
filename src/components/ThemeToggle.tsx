import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Read initial theme synchronously to avoid flash */
const getInitialDark = () => {
  if (typeof window === "undefined") return false;
  // Check for a persisted preference first, then system preference
  const stored = localStorage.getItem("xenith-theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(getInitialDark);

  // Apply class on mount and whenever isDark changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark); // suppress system media-query when in light mode
    localStorage.setItem("xenith-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-secondary transition-colors duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-foreground" />
      )}
    </motion.button>
  );
};
