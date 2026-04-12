import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useDimensionScores } from "@/hooks/use-dimension-scores";
import { toast } from "sonner";

/**
 * Wraps a set of routes that require authentication.
 * - While the session is loading → shows a centred spinner.
 * - No session → redirects to /signin, preserving the intended path.
 * - Authenticated → waits for profile and dimension scores to load (max 20s timeout).
 * - Data loaded → renders nested <Outlet />.
 */
export function ProtectedRoute() {
  const { session, loading } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useProfile();
  const { isLoading: dimensionsLoading, scores } = useDimensionScores(4);
  const location = useLocation();
  const [timeoutError, setTimeoutError] = useState(false);

  const isDataLoading = profileLoading || dimensionsLoading;

  // Set 20-second timeout for data loading
  useEffect(() => {
    if (!session || !isDataLoading) return;

    const timeoutId = setTimeout(() => {
      if (isDataLoading) {
        setTimeoutError(true);
        toast.error("Failed to load data. Please refresh or contact support.");
      }
    }, 20000);

    return () => clearTimeout(timeoutId);
  }, [session, isDataLoading]);

  // Auth loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="font-chomsky text-4xl text-foreground animate-pulse">
            X
          </span>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Data timeout error
  if (timeoutError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <span className="font-chomsky text-4xl text-foreground">X</span>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Unable to Load Data
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't load your data within 20 seconds. This might be a connection issue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Data loading
  if (isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="font-chomsky text-4xl text-foreground animate-pulse">
            X
          </span>
          <p className="text-sm text-muted-foreground">Loading your data…</p>
        </div>
      </div>
    );
  }

  // Profile load error
  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <span className="font-chomsky text-4xl text-foreground">X</span>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Failed to Load Profile
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {profileError instanceof Error ? profileError.message : "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // All loaded, render app
  return <Outlet />;
}
