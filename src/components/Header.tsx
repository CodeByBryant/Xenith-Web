import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Demo", href: "#preview" },
  { label: "Pricing", href: "#pricing" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const rafId = useRef<number | null>(null);

  const { session, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!session;
  const displayName = profile?.name ?? session?.user?.email ?? "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "X";

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        rafId.current = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Close menu on Escape and return focus to toggle button
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    },
    [mobileMenuOpen],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Move focus to first menu link when menu opens
  useEffect(() => {
    if (mobileMenuOpen) {
      firstMenuLinkRef.current?.focus();
    }
  }, [mobileMenuOpen]);

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
              backgroundColor: scrolled
                ? "hsl(var(--background) / 0.95)"
                : "hsl(var(--background) / 0.8)",
              boxShadow: scrolled
                ? "0 4px 30px hsl(var(--foreground) / 0.08)"
                : "0 0 0 transparent",
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
                <span className="font-chomsky text-3xl text-foreground leading-none">
                  X
                </span>
                <span className="font-serif text-lg text-foreground hidden sm:block">
                  Xenith
                </span>
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

                {isAuthenticated ? (
                  /* ── Authenticated: avatar dropdown ── */
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="User menu"
                      >
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-background text-xs font-semibold">
                            {initials}
                          </span>
                        )}
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {profile?.name ?? "Your account"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session?.user?.email}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => navigate("/app")}
                        className="gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Open app
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={signOut}
                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  /* ── Unauthenticated: Sign In + Join Waitlist ── */
                  <>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="hidden sm:block"
                    >
                      <Link
                        to="/signin"
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-secondary"
                      >
                        Sign in
                      </Link>
                    </motion.div>
                    <motion.a
                      href="#waitlist"
                      className="hidden sm:inline-flex px-5 py-2 bg-foreground text-background text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Join Waitlist
                    </motion.a>
                  </>
                )}

                <motion.button
                  ref={menuButtonRef}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                  whileTap={{ scale: 0.95 }}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  <AnimatePresence mode="wait">
                    {mobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        aria-hidden="true"
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
                        aria-hidden="true"
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
              id="mobile-menu"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden mx-4 mt-2 overflow-hidden"
            >
              <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl p-4">
                <nav
                  className="flex flex-col gap-1"
                  aria-label="Mobile navigation"
                >
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      ref={index === 0 ? firstMenuLinkRef : null}
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-4 py-3 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                  {isAuthenticated ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <Link
                          to="/app"
                          onClick={() => setMobileMenuOpen(false)}
                          className="mt-2 flex px-4 py-3 bg-foreground text-background text-sm font-medium rounded-xl text-center justify-center"
                        >
                          Open App
                        </Link>
                      </motion.div>
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          signOut();
                        }}
                        className="px-4 py-3 text-sm text-muted-foreground hover:bg-secondary rounded-lg transition-colors text-left"
                      >
                        Sign out
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <Link
                          to="/signin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                        >
                          Sign in
                        </Link>
                      </motion.div>
                      <motion.a
                        href="#waitlist"
                        onClick={() => setMobileMenuOpen(false)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-2 px-4 py-3 bg-foreground text-background text-sm font-medium rounded-xl text-center"
                      >
                        Join Waitlist
                      </motion.a>
                    </>
                  )}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};
