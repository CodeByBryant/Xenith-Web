import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#preview" },
  { label: "Pricing", href: "#pricing" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-4 mt-4">
          <motion.div
            animate={{
              backgroundColor: scrolled ? "hsl(var(--background) / 0.95)" : "hsl(var(--background) / 0.8)",
              boxShadow: scrolled ? "0 4px 30px hsl(var(--foreground) / 0.08)" : "0 0 0 transparent",
            }}
            transition={{ duration: 0.3 }}
            className="backdrop-blur-xl border border-border rounded-2xl"
          >
            <div className="px-6 h-14 flex items-center justify-between">
              <motion.a
                href="#"
                className="flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-chomsky text-3xl text-foreground leading-none">X</span>
                <span className="font-chomsky text-lg text-foreground hidden sm:block">Xenith</span>
              </motion.a>

              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary relative group"
                    whileHover={{ y: -1 }}
                  >
                    {link.label}
                    <span className="absolute bottom-1 left-4 right-4 h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </motion.a>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <motion.a
                  href="#waitlist"
                  className="hidden sm:inline-flex px-5 py-2 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join Waitlist
                </motion.a>
                <motion.button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden mx-4 mt-2 overflow-hidden"
            >
              <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl p-4">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-4 py-3 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                  <motion.a
                    href="#waitlist"
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-2 px-4 py-3 bg-foreground text-background text-sm font-medium rounded-xl text-center"
                  >
                    Join Waitlist
                  </motion.a>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};
