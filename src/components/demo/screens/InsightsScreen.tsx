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
  { name: "Health", value: 8, color: "#22c55e" },
  { name: "Mind", value: 7, color: "#8b5cf6" },
  { name: "Relationships", value: 6, color: "#ec4899" },
  { name: "Work", value: 7, color: "#3b82f6" },
  { name: "Finances", value: 5, color: "#eab308" },
  { name: "Learning", value: 8, color: "#06b6d4" },
  { name: "Rest", value: 4, color: "#6366f1" },
  { name: "Purpose", value: 7, color: "#f97316" },
];

interface InsightsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const InsightsScreen = ({ onNavigate }: InsightsScreenProps) => {
  const maxDaily = Math.max(...weeklyData.map((d) => d.value));
  const totalFocus = focusData.reduce((acc, d) => acc + d.hours, 0);
  const maxFocus = Math.max(...focusData.map((d) => d.hours));

  return (
    <div className="h-full bg-[#0a0a0a] pt-14 pb-24 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pb-4 shrink-0"
      >
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-[#6a6a6a]"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-serif text-[#fafafa]">Insights</h1>
          <div className="w-6" />
        </div>
      </motion.div>

      <div className="flex-1 px-5 overflow-y-auto space-y-4">
        {/* Weekly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-[#22c55e]" />
            <span className="text-sm text-[#fafafa]">
              18 intentions completed this week
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#22c55e]">
            <TrendingUp className="w-3 h-3" />
            <span>20% more than last week</span>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-20 mt-4 gap-2">
            {weeklyData.map((d, i) => (
              <div key={d.day} className="flex flex-col items-center flex-1">
                <motion.div
                  className="w-full bg-[#fafafa] rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / maxDaily) * 60}px` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
                <span className="text-[10px] text-[#6a6a6a] mt-1">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Focus Time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-[#fafafa]" />
            <span className="text-sm text-[#fafafa]">
              {totalFocus.toFixed(1)}h focused this week
            </span>
          </div>

          {/* Line-style Chart */}
          <div className="flex items-end justify-between h-16 mt-4 gap-2">
            {focusData.map((d, i) => (
              <div key={d.day} className="flex flex-col items-center flex-1">
                <motion.div
                  className="w-full bg-gradient-to-t from-[#3a3a3a] to-[#fafafa] rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.hours / maxFocus) * 48}px` }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                />
                <span className="text-[10px] text-[#6a6a6a] mt-1">{d.day}</span>
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
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#22c55e]" />
            <p className="text-sm text-[#fafafa]">
              You're most productive on{" "}
              <span className="font-medium">Thursdays</span>
            </p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#3b82f6]" />
            <p className="text-sm text-[#fafafa]">
              Your focus peaks between{" "}
              <span className="font-medium">9-11 AM</span>
            </p>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#eab308]" />
            <p className="text-sm text-[#fafafa]">
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
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#fafafa] font-medium">
              Life Balance Trend
            </span>
            <span className="text-xs text-[#6a6a6a]">vs. last month</span>
          </div>
          <div className="flex justify-center">
            <RadarChart dimensions={dimensions} size={160} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
