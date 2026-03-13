import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

/**
 * Wraps a set of routes that require authentication.
 * - While the session is loading → shows a centred spinner.
 * - No session → redirects to /signin, preserving the intended path.
 * - Authenticated → renders nested <Outlet />.
 */
export function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

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

  if (!session) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
