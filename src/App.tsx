import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RouteError } from "@/components/RouteError";
import { lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
const WaterSupplementsTracker = lazy(
  () => import("./pages/app/health/WaterSupplementsTracker"),
);
const BiometricWizard = lazy(
  () => import("./pages/app/health/BiometricWizard"),
);
const FinanceTools = lazy(() => import("./pages/app/finances/FinanceTools"));
const TransactionTracker = lazy(
  () => import("./pages/app/finances/TransactionTracker"),
);
const LearningTools = lazy(() => import("./pages/app/learning/LearningTools"));
const BookTracker = lazy(() => import("./pages/app/learning/BookTracker"));
const RestTools = lazy(() => import("./pages/app/rest/RestTools"));
const SleepTracker = lazy(() => import("./pages/app/rest/SleepTracker"));
const RechargeLog = lazy(() => import("./pages/app/rest/RechargeLog"));
const WorkTools = lazy(() => import("./pages/app/work/WorkTools"));
const WinLossJournal = lazy(() => import("./pages/app/work/WinLossJournal"));
const EnergyTaskMatcher = lazy(
  () => import("./pages/app/work/EnergyTaskMatcher"),
);
const MindTools = lazy(() => import("./pages/app/mind/MindTools"));
const ThoughtAudit = lazy(() => import("./pages/app/mind/ThoughtAudit"));
const DailyGratitude = lazy(() => import("./pages/app/mind/DailyGratitude"));
const RelationshipsTools = lazy(
  () => import("./pages/app/relationships/RelationshipsTools"),
);
const ConnectionTracker = lazy(
  () => import("./pages/app/relationships/ConnectionTracker"),
);
const PurposeTools = lazy(() => import("./pages/app/purpose/PurposeTools"));
const DecisionJournal = lazy(
  () => import("./pages/app/purpose/DecisionJournal"),
);
const ValuesCheckin = lazy(() => import("./pages/app/purpose/ValuesCheckin"));
const Projects = lazy(() => import("./pages/app/Projects"));

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

const sentryCreateBrowserRouter =
  Sentry.wrapCreateBrowserRouterV6(createBrowserRouter);

const router = sentryCreateBrowserRouter([
  { path: "/", element: <Index />, errorElement: <RouteError /> },
  { path: "/privacy", element: <Privacy />, errorElement: <RouteError /> },
  { path: "/terms", element: <Terms />, errorElement: <RouteError /> },
  { path: "/signin", element: <SignIn />, errorElement: <RouteError /> },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
    errorElement: <RouteError />,
  },

  // ─── Protected: onboarding ───────────────────────────────────────
  {
    element: <ProtectedRoute />,
    errorElement: <RouteError />,
    children: [
      {
        path: "/onboarding",
        element: (
          <Suspense fallback={AppLoader}>
            <Onboarding />
          </Suspense>
        ),
        errorElement: <RouteError />,
      },
      {
        path: "/app",
        element: (
          <Suspense fallback={AppLoader}>
            <AppLayout />
          </Suspense>
        ),
        errorElement: <RouteError />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={AppLoader}>
                <Dashboard />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "intentions",
            element: (
              <Suspense fallback={AppLoader}>
                <Intentions />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions",
            element: (
              <Suspense fallback={AppLoader}>
                <Dimensions />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "focus",
            element: (
              <Suspense fallback={AppLoader}>
                <FocusPage />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "routines",
            element: (
              <Suspense fallback={AppLoader}>
                <Routines />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "reflection",
            element: (
              <Suspense fallback={AppLoader}>
                <Reflection />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "insights",
            element: (
              <Suspense fallback={AppLoader}>
                <Insights />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "growth",
            element: (
              <Suspense fallback={AppLoader}>
                <Growth />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "settings",
            element: (
              <Suspense fallback={AppLoader}>
                <AppSettings />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "projects",
            element: (
              <Suspense fallback={AppLoader}>
                <Projects />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/health",
            element: (
              <Suspense fallback={AppLoader}>
                <HealthTools />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/health/calories",
            element: (
              <Suspense fallback={AppLoader}>
                <CalorieTracker />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/health/workouts",
            element: (
              <Suspense fallback={AppLoader}>
                <WorkoutTracker />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/health/water",
            element: (
              <Suspense fallback={AppLoader}>
                <WaterSupplementsTracker />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/health/biometrics",
            element: (
              <Suspense fallback={AppLoader}>
                <BiometricWizard />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/finances",
            element: (
              <Suspense fallback={AppLoader}>
                <FinanceTools />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/finances/transactions",
            element: (
              <Suspense fallback={AppLoader}>
                <TransactionTracker />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/learning",
            element: (
              <Suspense fallback={AppLoader}>
                <LearningTools />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/learning/books",
            element: (
              <Suspense fallback={AppLoader}>
                <BookTracker />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/rest",
            element: (
              <Suspense fallback={AppLoader}>
                <RestTools />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/rest/sleep",
            element: (
              <Suspense fallback={AppLoader}>
                <SleepTracker />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/rest/recharge",
            element: (
              <Suspense fallback={AppLoader}>
                <RechargeLog />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/work",
            element: (
              <Suspense fallback={AppLoader}>
                <WorkTools />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/work/wins-losses",
            element: (
              <Suspense fallback={AppLoader}>
                <WinLossJournal />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/work/energy-tasks",
            element: (
              <Suspense fallback={AppLoader}>
                <EnergyTaskMatcher />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "mind",
            element: (
              <Suspense fallback={AppLoader}>
                <MindTools />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "mind/thought-audit",
            element: (
              <Suspense fallback={AppLoader}>
                <ThoughtAudit />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "mind/gratitude",
            element: (
              <Suspense fallback={AppLoader}>
                <DailyGratitude />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/relationships",
            element: (
              <Suspense fallback={AppLoader}>
                <RelationshipsTools />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/relationships/connections",
            element: (
              <Suspense fallback={AppLoader}>
                <ConnectionTracker />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/purpose",
            element: (
              <Suspense fallback={AppLoader}>
                <PurposeTools />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/purpose/decisions",
            element: (
              <Suspense fallback={AppLoader}>
                <DecisionJournal />
              </Suspense>
            ),
            errorElement: <RouteError />,
          },
          {
            path: "dimensions/purpose/values",
            element: (
              <Suspense fallback={AppLoader}>
                <ValuesCheckin />
              </Suspense>
            ),
            errorElement: <RouteError />,
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
          errorElement: <RouteError />,
        },
        {
          path: "/og",
          element: (
            <Suspense fallback={null}>
              <OgImage />
            </Suspense>
          ),
          errorElement: <RouteError />,
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
          <TooltipProvider>
            <Sonner />
            <RouterProvider router={router} />
            <Analytics />
            <SpeedInsights />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;
