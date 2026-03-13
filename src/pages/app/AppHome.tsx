import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";

/**
 * Temporary placeholder for the authenticated app shell.
 * Will be replaced in Phase 2 with the full sidebar layout and feature pages.
 */
export default function AppHome() {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  const displayName = profile?.name ?? user?.email ?? "there";
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0] ?? "X").toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 px-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--foreground)/0.03),transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-background text-xl font-semibold">
              {initials}
            </span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Welcome, {displayName.split(" ")[0]}.
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            The app is being built. Phase 2 (app shell + features) coming next.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" asChild>
            <Link to="/">Back to landing</Link>
          </Button>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
