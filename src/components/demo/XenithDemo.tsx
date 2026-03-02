import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneMockup } from "./PhoneMockup";
import { BottomNav, ScreenId } from "./BottomNav";
import { SplashScreen } from "./screens/SplashScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { IntentionsScreen } from "./screens/IntentionsScreen";
import { DimensionsScreen } from "./screens/DimensionsScreen";
import { GrowthScreen } from "./screens/GrowthScreen";
import { FocusScreen } from "./screens/FocusScreen";
import { ReflectionScreen } from "./screens/ReflectionScreen";
import { InsightsScreen } from "./screens/InsightsScreen";

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
            {activeScreen === "splash" && <SplashScreen onNavigate={handleNavigate} />}
            {activeScreen === "dashboard" && <DashboardScreen onNavigate={handleNavigate} />}
            {activeScreen === "intentions" && <IntentionsScreen onNavigate={handleNavigate} />}
            {activeScreen === "dimensions" && <DimensionsScreen onNavigate={handleNavigate} />}
            {activeScreen === "growth" && <GrowthScreen onNavigate={handleNavigate} />}
            {activeScreen === "reflection" && <ReflectionScreen onNavigate={handleNavigate} />}
            {activeScreen === "insights" && <InsightsScreen onNavigate={handleNavigate} />}
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
