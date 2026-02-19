import { motion } from "framer-motion";
import { Check, Plus, Play, TrendingUp, Zap, Calendar } from "lucide-react";
import { useState } from "react";
import { RadarChart, Dimension } from "../RadarChart";
import { ScreenId } from "../BottomNav";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  tag: string;
}

const initialTasks: Task[] = [
  {
    id: 1,
    text: "Complete Physics assignment",
    completed: false,
    tag: "Academic",
  },
  { id: 2, text: "30 min focused reading", completed: false, tag: "Learning" },
  { id: 3, text: "Morning workout", completed: true, tag: "Health" },
  { id: 4, text: "Review weekly goals", completed: false, tag: "Growth" },
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

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const DashboardScreen = ({ onNavigate }: DashboardScreenProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const averageBalance = Math.round(
    (dimensions.reduce((acc, d) => acc + d.value, 0) / dimensions.length) * 10,
  );

  return (
    <div className="h-full bg-[#0a0a0a] pt-14 pb-24 px-5 overflow-y-auto no-scrollbar">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-chomsky text-2xl text-[#fafafa]">X</span>
          <Calendar className="w-5 h-5 text-[#6a6a6a]" />
        </div>
        <h1 className="text-xl font-serif text-[#fafafa]">
          {getGreeting()}, John
        </h1>
        <p className="text-sm text-[#6a6a6a]">{getDate()}</p>
      </motion.div>

      {/* Today's Intentions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-[#fafafa] uppercase tracking-wider">
            Today's Intentions
          </h2>
          <span className="text-xs text-[#6a6a6a]">
            {completedCount} of {tasks.length} complete
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                task.completed
                  ? "bg-[#1a1a1a]/50 border-[#2a2a2a]"
                  : "bg-[#1a1a1a] border-[#2a2a2a] active:border-[#4a4a4a]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? "bg-[#fafafa] border-[#fafafa]"
                    : "border-[#4a4a4a]"
                }`}
              >
                {task.completed && <Check className="w-3 h-3 text-[#0a0a0a]" />}
              </div>
              <span
                className={`flex-1 text-sm ${
                  task.completed
                    ? "line-through text-[#6a6a6a]"
                    : "text-[#fafafa]"
                }`}
              >
                {task.text}
              </span>
              <span className="text-[10px] text-[#6a6a6a] bg-[#2a2a2a] px-2 py-0.5 rounded">
                {task.tag}
              </span>
            </motion.div>
          ))}
        </div>

        <button className="flex items-center gap-2 mt-3 text-sm text-[#6a6a6a] hover:text-[#fafafa] transition-colors">
          <Plus className="w-4 h-4" />
          Add intention
        </button>
      </motion.div>

      {/* Life Balance Mini Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => onNavigate("dimensions")}
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 mb-6 cursor-pointer active:border-[#4a4a4a] transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-[#fafafa] uppercase tracking-wider">
            Life Balance
          </h2>
          <span className="text-xs text-[#6a6a6a]">{averageBalance}%</span>
        </div>
        <div className="flex justify-center py-2">
          <RadarChart dimensions={dimensions} size={160} />
        </div>
        <p className="text-center text-xs text-[#6a6a6a]">Tap to expand</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 text-center">
          <Zap className="w-4 h-4 text-[#fafafa] mx-auto mb-1" />
          <div className="text-lg font-serif font-bold text-[#fafafa]">
            4h 32m
          </div>
          <div className="text-[10px] text-[#6a6a6a]">Focus today</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 text-center">
          <Calendar className="w-4 h-4 text-[#fafafa] mx-auto mb-1" />
          <div className="text-lg font-serif font-bold text-[#fafafa]">6/7</div>
          <div className="text-[10px] text-[#6a6a6a]">Days active</div>
        </div>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 text-center">
          <TrendingUp className="w-4 h-4 text-[#fafafa] mx-auto mb-1" />
          <div className="text-lg font-serif font-bold text-[#fafafa]">12</div>
          <div className="text-[10px] text-[#6a6a6a]">Completed</div>
        </div>
      </motion.div>

      {/* Focus Studio Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => onNavigate("focus")}
        className="bg-[#fafafa] rounded-2xl p-4 flex items-center justify-between cursor-pointer active:opacity-90 transition-opacity"
      >
        <div>
          <h3 className="text-[#0a0a0a] font-medium">Start Focus Session</h3>
          <p className="text-[#6a6a6a] text-sm">Deep work • 25 min</p>
        </div>
        <div className="w-12 h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center">
          <Play className="w-5 h-5 text-[#fafafa] ml-0.5" />
        </div>
      </motion.div>
    </div>
  );
};
