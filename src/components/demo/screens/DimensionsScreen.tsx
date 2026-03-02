import { motion } from "framer-motion";
import { useState } from "react";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
} from "lucide-react";
import { RadarChart, Dimension } from "../RadarChart";
import { ScreenId } from "../BottomNav";
import { DIMENSION_COLORS } from "../tokens";

const initialDimensions: (Dimension & { trend: "up" | "down" | "stable" })[] = [
  { name: "Health", value: 8, color: DIMENSION_COLORS.health, trend: "up" },
  { name: "Mind", value: 7, color: DIMENSION_COLORS.mind, trend: "stable" },
  { name: "Relationships", value: 6, color: DIMENSION_COLORS.relationships, trend: "down" },
  { name: "Work", value: 7, color: DIMENSION_COLORS.work, trend: "up" },
  { name: "Finances", value: 5, color: DIMENSION_COLORS.finances, trend: "stable" },
  { name: "Learning", value: 8, color: DIMENSION_COLORS.learning, trend: "up" },
  { name: "Rest", value: 4, color: DIMENSION_COLORS.rest, trend: "down" },
  { name: "Purpose", value: 7, color: DIMENSION_COLORS.purpose, trend: "up" },
];

interface DimensionsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const DimensionsScreen = ({ onNavigate }: DimensionsScreenProps) => {
  const [dimensions, setDimensions] = useState(initialDimensions);
  const [selectedDimension, setSelectedDimension] = useState<number | null>(
    null,
  );

  const updateDimension = (index: number, delta: number) => {
    setDimensions((prev) =>
      prev.map((d, i) =>
        i === index
          ? { ...d, value: Math.max(1, Math.min(10, d.value + delta)) }
          : d,
      ),
    );
  };

  const averageBalance = Math.round(
    (dimensions.reduce((acc, d) => acc + d.value, 0) / dimensions.length) * 10,
  );

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
    if (trend === "up")
      return <TrendingUp className="w-3 h-3 text-demo-dim-health" />;
    if (trend === "down")
      return <TrendingDown className="w-3 h-3 text-demo-dim-danger" />;
    return <Minus className="w-3 h-3 text-demo-subtle" />;
  };

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
          <h1 className="text-lg font-serif text-demo-fg">Life Balance</h1>
          <div className="w-6" />
        </div>
        <p className="text-center text-sm text-demo-subtle">
          Overall: {averageBalance}%
        </p>
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center px-5 py-4 shrink-0"
      >
        <RadarChart
          dimensions={dimensions}
          size={220}
          onDimensionClick={(i) =>
            setSelectedDimension(selectedDimension === i ? null : i)
          }
        />
      </motion.div>

      {/* Dimension Cards */}
      <div className="flex-1 px-5 overflow-y-auto space-y-2 no-scrollbar">
        {dimensions.map((dim, i) => (
          <motion.div
            key={dim.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.03 }}
            onClick={() =>
              setSelectedDimension(selectedDimension === i ? null : i)
            }
            className={`bg-demo-surface border rounded-xl p-3 cursor-pointer transition-all ${
              selectedDimension === i ? "border-demo-fg" : "border-demo-border"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Color indicator */}
              <div
                className="w-2 h-10 rounded-full"
                style={{ backgroundColor: dim.color }}
              />

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-demo-fg">
                    {dim.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <TrendIcon trend={dim.trend} />
                    <span className="text-sm text-demo-subtle">
                      {dim.value}/10
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-demo-muted transition-transform ${selectedDimension === i ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-demo-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: dim.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${dim.value * 10}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                </div>
              </div>
            </div>

            {/* Expanded controls */}
            {selectedDimension === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-demo-border flex items-center justify-between"
              >
                <span className="text-xs text-demo-subtle">Adjust rating</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateDimension(i, -1);
                    }}
                    className="w-8 h-8 rounded-lg bg-demo-border text-demo-fg flex items-center justify-center hover:bg-demo-elevated"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-demo-fg w-8 text-center">
                    {dim.value}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateDimension(i, 1);
                    }}
                    className="w-8 h-8 rounded-lg bg-demo-border text-demo-fg flex items-center justify-center hover:bg-demo-elevated"
                  >
                    +
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Monthly Reflection CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-demo-surface to-demo-border border border-demo-elevated rounded-xl p-4 mt-4"
        >
          <p className="text-xs text-demo-subtle mb-2">
            Time for your monthly check-in
          </p>
          <button className="w-full bg-demo-fg text-demo-bg py-2 rounded-lg text-sm font-medium">
            Start Reflection
          </button>
        </motion.div>
      </div>
    </div>
  );
};
