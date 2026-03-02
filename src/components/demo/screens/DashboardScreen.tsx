import { motion } from "framer-motion";
import { Check, Plus, Play, TrendingUp, Zap, Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import { RadarChart, Dimension } from "../RadarChart";
import { ScreenId } from "../BottomNav";
import { DIMENSION_COLORS } from "../tokens";

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
  { name: "Health", value: 8, color: DIMENSION_COLORS.health },
  { name: "Mind", value: 7, color: DIMENSION_COLORS.mind },
  { name: "Relationships", value: 6, color: DIMENSION_COLORS.relationships },
  { name: "Work", value: 7, color: DIMENSION_COLORS.work },
  { name: "Finances", value: 5, color: DIMENSION_COLORS.finances },
  { name: "Learning", value: 8, color: DIMENSION_COLORS.learning },
  { name: "Rest", value: 4, color: DIMENSION_COLORS.rest },
  { name: "Purpose", value: 7, color: DIMENSION_COLORS.purpose },
];

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const DashboardScreen = ({ onNavigate }: DashboardScreenProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const formattedDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    [],
  );

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
    <div className="h-full bg-demo-bg pt-14 pb-24 px-5 overflow-y-auto no-scrollbar">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="font-chomsky text-2xl text-demo-fg">X</span>
          <Calendar className="w-5 h-5 text-demo-subtle" />
        </div>
        <h1 className="text-xl font-serif text-demo-fg">
          {greeting}, John
        </h1>
        <p className="text-sm text-demo-subtle">{formattedDate}</p>
      </motion.div>

      {/* Today's Intentions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-demo-fg uppercase tracking-wider">
            Today's Intentions
          </h2>
          <span className="text-xs text-demo-subtle">
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
                  ? "bg-demo-surface/50 border-demo-border"
                  : "bg-demo-surface border-demo-border active:border-demo-muted"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  task.completed
                    ? "bg-demo-fg border-demo-fg"
                    : "border-demo-muted"
                }`}
              >
                {task.completed && <Check className="w-3 h-3 text-demo-bg" />}
              </div>
              <span
                className={`flex-1 text-sm ${
                  task.completed
                    ? "line-through text-demo-subtle"
                    : "text-demo-fg"
                }`}
              >
                {task.text}
              </span>
              <span className="text-[10px] text-demo-subtle bg-demo-border px-2 py-0.5 rounded">
                {task.tag}
              </span>
            </motion.div>
          ))}
        </div>

        <button className="flex items-center gap-2 mt-3 text-sm text-demo-subtle hover:text-demo-fg transition-colors">
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
        className="bg-demo-surface border border-demo-border rounded-2xl p-4 mb-6 cursor-pointer active:border-demo-muted transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-demo-fg uppercase tracking-wider">
            Life Balance
          </h2>
          <span className="text-xs text-demo-subtle">{averageBalance}%</span>
        </div>
        <div className="flex justify-center py-2">
          <RadarChart dimensions={dimensions} size={160} />
        </div>
        <p className="text-center text-xs text-demo-subtle">Tap to expand</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="bg-demo-surface border border-demo-border rounded-xl p-3 text-center">
          <Zap className="w-4 h-4 text-demo-fg mx-auto mb-1" />
          <div className="text-lg font-serif font-bold text-demo-fg">
            4h 32m
          </div>
          <div className="text-[10px] text-demo-subtle">Focus today</div>
        </div>
        <div className="bg-demo-surface border border-demo-border rounded-xl p-3 text-center">
          <Calendar className="w-4 h-4 text-demo-fg mx-auto mb-1" />
          <div className="text-lg font-serif font-bold text-demo-fg">6/7</div>
          <div className="text-[10px] text-demo-subtle">Days active</div>
        </div>
        <div className="bg-demo-surface border border-demo-border rounded-xl p-3 text-center">
          <TrendingUp className="w-4 h-4 text-demo-fg mx-auto mb-1" />
          <div className="text-lg font-serif font-bold text-demo-fg">12</div>
          <div className="text-[10px] text-demo-subtle">Completed</div>
        </div>
      </motion.div>

      {/* Focus Studio Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => onNavigate("focus")}
        className="bg-demo-fg rounded-2xl p-4 flex items-center justify-between cursor-pointer active:opacity-90 transition-opacity"
      >
        <div>
          <h3 className="text-demo-bg font-medium">Start Focus Session</h3>
          <p className="text-demo-subtle text-sm">Deep work • 25 min</p>
        </div>
        <div className="w-12 h-12 bg-demo-bg rounded-full flex items-center justify-center">
          <Play className="w-5 h-5 text-demo-fg ml-0.5" />
        </div>
      </motion.div>
    </div>
  );
};
