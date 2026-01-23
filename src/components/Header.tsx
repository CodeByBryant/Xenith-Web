import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-4 mt-4">
          <div className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl">
            <div className="px-6 h-14 flex items-center justify-between">
              <a href="#" className="flex items-center gap-2">
                <span className="font-chomsky text-3xl text-foreground leading-none">X</span>
                <span className="font-chomsky text-lg text-foreground hidden sm:block">Xenith</span>
              </a>

              <nav className="hidden md:flex items-center gap-1">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Demo", href: "#preview" },
                  { label: "Pricing", href: "#pricing" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <ThemeToggle />
                <a
                  href="#waitlist"
                  className="hidden sm:inline-flex px-5 py-2 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-200"
                >
                  Join Waitlist
                </a>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mx-4 mt-2"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl p-4">
              <nav className="flex flex-col gap-1">
                {[
                  { label: "Features", href: "#features" },
                  { label: "Demo", href: "#preview" },
                  { label: "Pricing", href: "#pricing" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#waitlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 px-4 py-3 bg-foreground text-background text-sm font-medium rounded-xl text-center"
                >
                  Join Waitlist
                </a>
              </nav>
            </div>
          </motion.div>
        )}
      </motion.header>
    </>
  );
};
