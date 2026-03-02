import { motion } from "framer-motion";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { ScreenId } from "../BottomNav";
import { RadarChart, Dimension } from "../RadarChart";
import { DIMENSION_COLORS } from "../tokens";

const weeklyData = [
  { day: "Mon", value: 3 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 4 },
  { day: "Thu", value: 6 },
  { day: "Fri", value: 3 },
  { day: "Sat", value: 2 },
  { day: "Sun", value: 4 },
];

const focusData = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 2.8 },
  { day: "Thu", hours: 4.1 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 1.5 },
  { day: "Sun", hours: 2.2 },
];

const dimensions: Dimension[] = [
  { name: "Health", value: 8, color: DIMENSION_COLORS.health },
  { name: "Mind", value: 7, color: DIMENSION_COLORS.mind },
  { name: "Relationships", value: 6, color: DIMENSION_COLORS.relationships },
  { name: "Work", value: 7, color: DIMENSION_COLORS.work },
  { name: "Finances", value: 5, color: DIMENSION_COLORS.finances },
  { name: "Learning", value: 8, color: DIMENSION_COLORS.learning },
  { name: "Rest", value: 4, color: DIMENSION_COLORS.rest },
  { name: "Purpose", value: 7, color: DIMENSION_COLORS.purpose },
];

interface InsightsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const InsightsScreen = ({ onNavigate }: InsightsScreenProps) => {
  const maxDaily = Math.max(...weeklyData.map((d) => d.value));
  const totalFocus = focusData.reduce((acc, d) => acc + d.hours, 0);
  const maxFocus = Math.max(...focusData.map((d) => d.hours));

  return (
    <div className="h-full bg-demo-bg pt-14 pb-24 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pb-4 shrink-0"
      >
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-demo-subtle"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-serif text-demo-fg">Insights</h1>
          <div className="w-6" />
        </div>
      </motion.div>

      <div className="flex-1 px-5 overflow-y-auto space-y-4 no-scrollbar">
        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-demo-surface border border-demo-border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-demo-dim-health" />
            <span className="text-sm text-demo-fg">
              18 intentions completed this week
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-demo-dim-health">
            <TrendingUp className="w-3 h-3" />
            <span>20% more than last week</span>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-20 mt-4 gap-2">
            {weeklyData.map((d, i) => (
              <div key={d.day} className="flex flex-col items-center flex-1">
                <motion.div
                  className="w-full bg-demo-fg rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / maxDaily) * 60}px` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
                <span className="text-[10px] text-demo-subtle mt-1">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Focus Time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-demo-surface border border-demo-border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-demo-fg" />
            <span className="text-sm text-demo-fg">
              {totalFocus.toFixed(1)}h focused this week
            </span>
          </div>

          {/* Line-style Chart */}
          <div className="flex items-end justify-between h-16 mt-4 gap-2">
            {focusData.map((d, i) => (
              <div key={d.day} className="flex flex-col items-center flex-1">
                <motion.div
                  className="w-full bg-gradient-to-t from-demo-elevated to-demo-fg rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.hours / maxFocus) * 48}px` }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                />
                <span className="text-[10px] text-demo-subtle mt-1">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pattern Insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <div className="bg-demo-surface border border-demo-border rounded-xl p-3 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-demo-dim-health" />
            <p className="text-sm text-demo-fg">
              You're most productive on{" "}
              <span className="font-medium">Thursdays</span>
            </p>
          </div>
          <div className="bg-demo-surface border border-demo-border rounded-xl p-3 flex items-center gap-3">
            <Clock className="w-5 h-5 text-demo-dim-work" />
            <p className="text-sm text-demo-fg">
              Your focus peaks between{" "}
              <span className="font-medium">9-11 AM</span>
            </p>
          </div>
          <div className="bg-demo-surface border border-demo-border rounded-xl p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-demo-dim-finances" />
            <p className="text-sm text-demo-fg">
              <span className="font-medium">Rest</span> dimension needs
              attention (-15%)
            </p>
          </div>
        </motion.div>

        {/* Life Balance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-demo-surface border border-demo-border rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-demo-fg font-medium">
              Life Balance Trend
            </span>
            <span className="text-xs text-demo-subtle">vs. last month</span>
          </div>
          <div className="flex justify-center">
            <RadarChart dimensions={dimensions} size={160} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
