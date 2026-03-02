import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Plus, ChevronLeft, Trash2 } from "lucide-react";
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
  { id: 5, text: "Update portfolio", completed: false, tag: "Work" },
  { id: 6, text: "Call mentor", completed: true, tag: "Relations" },
  { id: 7, text: "Budget review", completed: false, tag: "Finance" },
];

const tags = [
  "All",
  "Academic",
  "Health",
  "Work",
  "Learning",
  "Growth",
  "Relations",
  "Finance",
];

interface IntentionsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const IntentionsScreen = ({ onNavigate }: IntentionsScreenProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTag, setActiveTag] = useState("All");
  const [newTaskText, setNewTaskText] = useState("");
  const [showInput, setShowInput] = useState(false);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTaskText,
          completed: false,
          tag: activeTag === "All" ? "Work" : activeTag,
        },
      ]);
      setNewTaskText("");
      setShowInput(false);
    }
  };

  const filteredTasks =
    activeTag === "All" ? tasks : tasks.filter((t) => t.tag === activeTag);

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="h-full bg-demo-bg pt-14 pb-24 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pb-4"
      >
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-demo-subtle"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-serif text-demo-fg">Intentions</h1>
          <div className="w-6" />
        </div>
        <p className="text-center text-xs text-demo-subtle">
          {completedCount} of {tasks.length} complete
        </p>
      </motion.div>

      {/* Tag Filter */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeTag === tag
                  ? "bg-demo-fg text-demo-bg"
                  : "bg-demo-surface text-demo-subtle border border-demo-border"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 px-5 overflow-y-auto space-y-2 no-scrollbar">
        {filteredTasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              task.completed
                ? "bg-demo-surface/50 border-demo-border"
                : "bg-demo-surface border-demo-border"
            }`}
          >
            <div
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                task.completed
                  ? "bg-demo-fg border-demo-fg"
                  : "border-demo-muted hover:border-demo-fg"
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
            <button
              onClick={() => deleteTask(task.id)}
              className="text-demo-muted hover:text-demo-dim-danger transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}

        {/* Add Task Input */}
        {showInput ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="New intention..."
              autoFocus
              className="flex-1 bg-demo-surface border border-demo-elevated rounded-xl px-4 py-3 text-sm text-demo-fg placeholder-demo-subtle focus:outline-none focus:border-demo-fg"
            />
            <button
              onClick={addTask}
              className="bg-demo-fg text-demo-bg p-3 rounded-xl"
            >
              <Check className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 w-full p-3 text-sm text-demo-subtle hover:text-demo-fg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add intention
          </button>
        )}
      </div>
    </div>
  );
};
