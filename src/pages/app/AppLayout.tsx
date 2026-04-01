import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { NAV_ITEMS } from "@/lib/nav-items";
import { FocusTimerProvider } from "@/context/FocusTimerContext";

// ─── Sidebar content (shared between desktop + mobile drawer) ────────
function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();

  const displayName = profile?.name ?? user?.email?.split("@")[0] ?? "Account";
  const email = user?.email ?? "";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 h-14 flex items-center gap-2 shrink-0">
        <span className="font-chomsky text-2xl text-foreground leading-none">
          X
        </span>
        <span className="font-serif text-base text-foreground">Xenith</span>
      </div>

      <Separator />

      {/* Nav - Scrollable */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 min-h-0">
        {NAV_ITEMS.map(({ label, path, icon: Icon, exact }) => {
          const isActive = exact
            ? location.pathname === path
            : location.pathname.startsWith(path);

          return (
            <NavLink
              key={path}
              to={path}
              onClick={onNavClick}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5
                transition-all duration-150
                ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <Separator />

      {/* User footer */}
      <div className="px-3 py-3 shrink-0 space-y-1">
        <button
          onClick={() => {
            navigate("/app/settings");
            onNavClick?.();
          }}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150"
        >
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </button>

        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center shrink-0 overflow-hidden">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-background text-[10px] font-semibold">
                {initials}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AppLayout ─────────────────────────────────────────────────────────
export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [drawerOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Current page label for mobile header
  const currentNav =
    NAV_ITEMS.find((n) =>
      n.exact
        ? location.pathname === n.path
        : location.pathname.startsWith(n.path),
    ) ?? NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-background flex">
      <FocusTimerProvider>
        {/* ── Desktop sidebar (fixed) ── */}
        {!isMobile && (
          <aside className="fixed top-0 left-0 h-screen w-[220px] border-r border-border bg-background z-30 flex flex-col">
            <SidebarContent />
          </aside>
        )}

        {/* ── Mobile: overlay drawer ── */}
        <AnimatePresence>
          {isMobile && drawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              />
              {/* Drawer */}
              <motion.aside
                key="drawer"
                ref={drawerRef}
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 350, damping: 35 }}
                className="fixed top-0 left-0 h-screen w-[260px] border-r border-border bg-background z-50 flex flex-col"
              >
                <SidebarContent onNavClick={() => setDrawerOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Main content ── */}
        <div
          className={`flex-1 flex flex-col min-h-screen ${!isMobile ? "ml-[220px]" : ""}`}
        >
          {/* Mobile top bar */}
          {isMobile && (
            <header className="sticky top-0 z-20 h-12 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="p-1.5 -ml-1.5 rounded-lg hover:bg-secondary transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5 text-foreground" />
                </button>
                <span className="text-sm font-medium text-foreground">
                  {currentNav.label}
                </span>
              </div>
              <ThemeToggle />
            </header>
          )}

          {/* Desktop top bar */}
          {!isMobile && (
            <header className="sticky top-0 z-20 h-12 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <currentNav.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {currentNav.label}
                </span>
              </div>
              <ThemeToggle />
            </header>
          )}

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </FocusTimerProvider>
    </div>
  );
}
