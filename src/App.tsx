import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Lazy-load dev panel — only fetched when route is hit, never bundled in prod
const Dev = lazy(() => import("./pages/Dev"));
const OgImage = lazy(() => import("./pages/OgImage"));

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/terms", element: <Terms /> },
  // Dev panel: only accessible in development
  ...(import.meta.env.DEV
    ? [
        {
          path: "/dev",
          element: (
            <Suspense
              fallback={
                <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center text-white/40 text-sm">
                  Loading dev panel…
                </div>
              }
            >
              <Dev />
            </Suspense>
          ),
        },
        {
          path: "/og",
          element: (
            <Suspense fallback={null}>
              <OgImage />
            </Suspense>
          ),
        },
      ]
    : []),
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <TooltipProvider>
        <Sonner />
        <RouterProvider router={router} />
        <Analytics />
        <SpeedInsights />
      </TooltipProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;
