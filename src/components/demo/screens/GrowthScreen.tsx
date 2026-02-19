import { motion } from "framer-motion";
import { ChevronLeft, Info } from "lucide-react";
import { ScreenId } from "../BottomNav";

interface Skill {
  name: string;
  value: number;
  max: number;
  description: string;
  color: string;
}

const skills: Skill[] = [
  {
    name: "Discipline",
    value: 68,
    max: 100,
    description: "Consistency and follow-through",
    color: "#ef4444",
  },
  {
    name: "Focus",
    value: 61,
    max: 100,
    description: "Deep work and concentration",
    color: "#8b5cf6",
  },
  {
    name: "Consistency",
    value: 72,
    max: 100,
    description: "Daily patterns and reliability",
    color: "#3b82f6",
  },
  {
    name: "Endurance",
    value: 55,
    max: 100,
    description: "Sustained effort over time",
    color: "#22c55e",
  },
  {
    name: "Insight",
    value: 48,
    max: 100,
    description: "Self-reflection and learning",
    color: "#eab308",
  },
  {
    name: "Resolve",
    value: 52,
    max: 100,
    description: "Pushing through challenges",
    color: "#f97316",
  },
];

interface GrowthScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const GrowthScreen = ({ onNavigate }: GrowthScreenProps) => {
  const overallProgress = Math.round(
    skills.reduce((acc, s) => acc + s.value, 0) / skills.length,
  );

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
          <h1 className="text-lg font-serif text-[#fafafa]">Growth Path</h1>
          <div className="w-6" />
        </div>
        <p className="text-center text-xs text-[#6a6a6a]">
          Track your personal development
        </p>
      </motion.div>

      {/* Overall Progress Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="px-5 py-4 flex justify-center shrink-0"
      >
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="#2a2a2a"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="56"
              cy="56"
              r="48"
              stroke="#fafafa"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 48}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
              animate={{
                strokeDashoffset:
                  2 * Math.PI * 48 * (1 - overallProgress / 100),
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#fafafa]">
              {overallProgress}%
            </span>
            <span className="text-[10px] text-[#6a6a6a]">Overall</span>
          </div>
        </div>
      </motion.div>

      {/* Skills List */}
      <div className="flex-1 px-5 overflow-y-auto space-y-3 no-scrollbar">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 relative overflow-hidden"
          >
            {/* Color accent */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1"
              style={{ backgroundColor: skill.color }}
            />

            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-[#fafafa]">
                {skill.name}
              </span>
              <span className="text-sm text-[#6a6a6a]">
                {skill.value}/{skill.max}
              </span>
            </div>

            <p className="text-xs text-[#6a6a6a] mb-3">{skill.description}</p>

            {/* Progress bar */}
            <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#fafafa] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(skill.value / skill.max) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
              />
            </div>
          </motion.div>
        ))}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-4 flex gap-3"
        >
          <Info className="w-5 h-5 text-[#6a6a6a] shrink-0 mt-0.5" />
          <p className="text-xs text-[#6a6a6a] leading-relaxed">
            Skills improve as you complete intentions. Each task contributes
            based on its type and complexity.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
