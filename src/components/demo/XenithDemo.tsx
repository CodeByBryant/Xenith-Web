import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneMockup } from "./PhoneMockup";
import { BottomNav, ScreenId } from "./BottomNav";

const SplashScreen = lazy(() => import("./screens/SplashScreen").then((m) => ({ default: m.SplashScreen })));
const DashboardScreen = lazy(() => import("./screens/DashboardScreen").then((m) => ({ default: m.DashboardScreen })));
const IntentionsScreen = lazy(() => import("./screens/IntentionsScreen").then((m) => ({ default: m.IntentionsScreen })));
const DimensionsScreen = lazy(() => import("./screens/DimensionsScreen").then((m) => ({ default: m.DimensionsScreen })));
const GrowthScreen = lazy(() => import("./screens/GrowthScreen").then((m) => ({ default: m.GrowthScreen })));
const FocusScreen = lazy(() => import("./screens/FocusScreen").then((m) => ({ default: m.FocusScreen })));
const ReflectionScreen = lazy(() => import("./screens/ReflectionScreen").then((m) => ({ default: m.ReflectionScreen })));
const InsightsScreen = lazy(() => import("./screens/InsightsScreen").then((m) => ({ default: m.InsightsScreen })));

export const XenithDemo = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>("splash");

  const handleNavigate = (screen: ScreenId) => {
    setActiveScreen(screen);
  };

  return (
    <PhoneMockup>
      <div className="relative h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full"
          >
            <Suspense fallback={<div className="h-full" />}>
              {activeScreen === "splash" && <SplashScreen onNavigate={handleNavigate} />}
              {activeScreen === "dashboard" && <DashboardScreen onNavigate={handleNavigate} />}
              {activeScreen === "intentions" && <IntentionsScreen onNavigate={handleNavigate} />}
              {activeScreen === "dimensions" && <DimensionsScreen onNavigate={handleNavigate} />}
              {activeScreen === "growth" && <GrowthScreen onNavigate={handleNavigate} />}
              {activeScreen === "focus" && <FocusScreen onNavigate={handleNavigate} />}
              {activeScreen === "reflection" && <ReflectionScreen onNavigate={handleNavigate} />}
              {activeScreen === "insights" && <InsightsScreen onNavigate={handleNavigate} />}
            </Suspense>
          </motion.div>
        </AnimatePresence>

        {/* FocusScreen is always mounted to persist timer state across navigation */}
        <div
          className="absolute inset-0 h-full"
          style={{ display: activeScreen === "focus" ? "block" : "none" }}
          aria-hidden={activeScreen !== "focus"}
        >
          <FocusScreen onNavigate={handleNavigate} />
        </div>

        <BottomNav activeScreen={activeScreen} onNavigate={handleNavigate} />
      </div>
    </PhoneMockup>
  );
};
