import { motion } from "framer-motion";

interface XenithLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  animated?: boolean;
}

const sizes = {
  sm: "text-3xl",
  md: "text-5xl",
  lg: "text-7xl",
  xl: "text-9xl",
  hero: "text-[12rem] md:text-[16rem]",
};

export const XenithLogo = ({ size = "md", animated = false }: XenithLogoProps) => {
  if (animated) {
    return (
      <motion.span
        className={`font-chomsky tracking-tight ${sizes[size]} text-foreground text-glow select-none`}
        initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        X
      </motion.span>
    );
  }

  return (
    <span className={`font-chomsky tracking-tight ${sizes[size]} text-foreground select-none`}>
      X
    </span>
  );
};
