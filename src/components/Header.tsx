import { motion } from "framer-motion";
import { XenithLogo } from "./XenithLogo";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <XenithLogo size="sm" />
          <span className="font-chomsky text-xl text-foreground">Xenith</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#preview" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Preview
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#waitlist"
            className="hidden sm:inline-flex px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-200 hover:shadow-lg"
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </motion.header>
  );
};
