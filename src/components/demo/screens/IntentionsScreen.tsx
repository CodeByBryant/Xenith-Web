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
  { id: 1, text: "Complete Physics assignment", completed: false, tag: "Academic" },
  { id: 2, text: "30 min focused reading", completed: false, tag: "Learning" },
  { id: 3, text: "Morning workout", completed: true, tag: "Health" },
  { id: 4, text: "Review weekly goals", completed: false, tag: "Growth" },
  { id: 5, text: "Update portfolio", completed: false, tag: "Work" },
  { id: 6, text: "Call mentor", completed: true, tag: "Relations" },
  { id: 7, text: "Budget review", completed: false, tag: "Finance" },
];

const tags = ["All", "Academic", "Health", "Work", "Learning", "Growth", "Relations", "Finance"];

interface IntentionsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const IntentionsScreen = ({ onNavigate }: IntentionsScreenProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTag, setActiveTag] = useState("All");
  const [newTaskText, setNewTaskText] = useState("");
  const [showInput, setShowInput] = useState(false);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTaskText,
        completed: false,
        tag: activeTag === "All" ? "Work" : activeTag
      }]);
      setNewTaskText("");
      setShowInput(false);
    }
  };

  const filteredTasks = activeTag === "All" 
    ? tasks 
    : tasks.filter(t => t.tag === activeTag);

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="h-full bg-[#0a0a0a] pt-14 pb-24 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pb-4"
      >
        <div className="flex items-center justify-between mb-1">
          <button onClick={() => onNavigate("dashboard")} className="text-[#6a6a6a]">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-serif text-[#fafafa]">Intentions</h1>
          <div className="w-6" />
        </div>
        <p className="text-center text-xs text-[#6a6a6a]">{completedCount} of {tasks.length} complete</p>
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
                  ? "bg-[#fafafa] text-[#0a0a0a]"
                  : "bg-[#1a1a1a] text-[#6a6a6a] border border-[#2a2a2a]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 px-5 overflow-y-auto space-y-2">
        {filteredTasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              task.completed
                ? "bg-[#1a1a1a]/50 border-[#2a2a2a]"
                : "bg-[#1a1a1a] border-[#2a2a2a]"
            }`}
          >
            <div
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
                task.completed
                  ? "bg-[#fafafa] border-[#fafafa]"
                  : "border-[#4a4a4a] hover:border-[#fafafa]"
              }`}
            >
              {task.completed && <Check className="w-3 h-3 text-[#0a0a0a]" />}
            </div>
            <span
              className={`flex-1 text-sm ${
                task.completed ? "line-through text-[#6a6a6a]" : "text-[#fafafa]"
              }`}
            >
              {task.text}
            </span>
            <span className="text-[10px] text-[#6a6a6a] bg-[#2a2a2a] px-2 py-0.5 rounded">
              {task.tag}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-[#4a4a4a] hover:text-[#ef4444] transition-colors"
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
              className="flex-1 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-sm text-[#fafafa] placeholder-[#6a6a6a] focus:outline-none focus:border-[#fafafa]"
            />
            <button
              onClick={addTask}
              className="bg-[#fafafa] text-[#0a0a0a] p-3 rounded-xl"
            >
              <Check className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center gap-2 w-full p-3 text-sm text-[#6a6a6a] hover:text-[#fafafa] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add intention
          </button>
        )}
      </div>
    </div>
  );
};
