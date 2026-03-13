import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WaitlistCountProvider } from "@/context/WaitlistCountContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import SignIn from "./pages/SignIn";
import AuthCallback from "./pages/AuthCallback";

// Lazy-load auth + app pages
const Onboarding = lazy(() => import("./pages/Onboarding"));
const AppLayout = lazy(() => import("./pages/app/AppLayout"));
const Dashboard = lazy(() => import("./pages/app/Dashboard"));
const Intentions = lazy(() => import("./pages/app/Intentions"));
const Dimensions = lazy(() => import("./pages/app/Dimensions"));
const FocusPage = lazy(() => import("./pages/app/Focus"));
const Routines = lazy(() => import("./pages/app/Routines"));
const Reflection = lazy(() => import("./pages/app/Reflection"));
const Insights = lazy(() => import("./pages/app/Insights"));
const Growth = lazy(() => import("./pages/app/Growth"));
const AppSettings = lazy(() => import("./pages/app/Settings"));
const HealthTools = lazy(() => import("./pages/app/health/HealthTools"));
const CalorieTracker = lazy(() => import("./pages/app/health/CalorieTracker"));
const WorkoutTracker = lazy(() => import("./pages/app/health/WorkoutTracker"));

// Lazy-load dev panel — only fetched when route is hit, never bundled in prod
const Dev = lazy(() => import("./pages/Dev"));
const OgImage = lazy(() => import("./pages/OgImage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

const AppLoader = (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <span className="font-chomsky text-4xl text-foreground animate-pulse">
      X
    </span>
  </div>
);

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/terms", element: <Terms /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/auth/callback", element: <AuthCallback /> },

  // ─── Protected: onboarding ───────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/onboarding",
        element: (
          <Suspense fallback={AppLoader}>
            <Onboarding />
          </Suspense>
        ),
      },
      {
        path: "/app",
        element: (
          <Suspense fallback={AppLoader}>
            <AppLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={AppLoader}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: "intentions",
            element: (
              <Suspense fallback={AppLoader}>
                <Intentions />
              </Suspense>
            ),
          },
          {
            path: "dimensions",
            element: (
              <Suspense fallback={AppLoader}>
                <Dimensions />
              </Suspense>
            ),
          },
          {
            path: "focus",
            element: (
              <Suspense fallback={AppLoader}>
                <FocusPage />
              </Suspense>
            ),
          },
          {
            path: "routines",
            element: (
              <Suspense fallback={AppLoader}>
                <Routines />
              </Suspense>
            ),
          },
          {
            path: "reflection",
            element: (
              <Suspense fallback={AppLoader}>
                <Reflection />
              </Suspense>
            ),
          },
          {
            path: "insights",
            element: (
              <Suspense fallback={AppLoader}>
                <Insights />
              </Suspense>
            ),
          },
          {
            path: "growth",
            element: (
              <Suspense fallback={AppLoader}>
                <Growth />
              </Suspense>
            ),
          },
          {
            path: "settings",
            element: (
              <Suspense fallback={AppLoader}>
                <AppSettings />
              </Suspense>
            ),
          },
          {
            path: "dimensions/health",
            element: (
              <Suspense fallback={AppLoader}>
                <HealthTools />
              </Suspense>
            ),
          },
          {
            path: "dimensions/health/calories",
            element: (
              <Suspense fallback={AppLoader}>
                <CalorieTracker />
              </Suspense>
            ),
          },
          {
            path: "dimensions/health/workouts",
            element: (
              <Suspense fallback={AppLoader}>
                <WorkoutTracker />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },

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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WaitlistCountProvider>
            <TooltipProvider>
              <Sonner />
              <RouterProvider router={router} />
              <Analytics />
              <SpeedInsights />
            </TooltipProvider>
          </WaitlistCountProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;
