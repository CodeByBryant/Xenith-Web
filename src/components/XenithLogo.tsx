import { motion } from "framer-motion";

interface XenithLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const sizes = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-8xl",
};

export const XenithLogo = ({ size = "md", animated = false }: XenithLogoProps) => {
  if (animated) {
    return (
      <motion.span
        className={`font-serif font-bold tracking-tight ${sizes[size]} text-foreground`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        X
      </motion.span>
    );
  }

  return (
    <span className={`font-serif font-bold tracking-tight ${sizes[size]} text-foreground`}>
      X
    </span>
  );
};
