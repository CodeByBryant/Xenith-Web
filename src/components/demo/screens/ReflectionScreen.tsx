import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, BookOpen, ArrowRight } from "lucide-react";
import { ScreenId } from "../BottomNav";

const quickPrompts = [
  "Wins today",
  "Struggles",
  "Lessons learned",
  "Tomorrow's focus",
];

const pastEntries = [
  {
    date: "Jan 21",
    preview: "Made solid progress on the physics project...",
    words: 156,
  },
  {
    date: "Jan 20",
    preview: "Struggled with focus in the afternoon but recovered...",
    words: 203,
  },
  {
    date: "Jan 19",
    preview: "Great day overall. Hit all my intentions...",
    words: 178,
  },
];

interface ReflectionScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const ReflectionScreen = ({ onNavigate }: ReflectionScreenProps) => {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [journalText, setJournalText] = useState("");

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
          <h1 className="text-lg font-serif text-demo-fg">Reflection</h1>
          <BookOpen className="w-5 h-5 text-demo-subtle" />
        </div>
      </motion.div>

      <div className="flex-1 px-5 overflow-y-auto space-y-4 no-scrollbar">
        {/* Featured Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-demo-surface border border-demo-border rounded-xl p-4"
        >
          <p className="text-xs text-demo-subtle uppercase tracking-wider mb-2">
            Daily Reflection
          </p>
          <p className="text-sm text-demo-fg mb-4">
            What's one thing you're grateful for today?
          </p>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Start writing..."
            className="w-full h-24 bg-demo-bg border border-demo-border rounded-lg px-3 py-2 text-sm text-demo-fg placeholder-demo-muted focus:outline-none focus:border-demo-muted resize-none"
          />
          <button className="w-full mt-3 bg-demo-fg text-demo-bg py-2 rounded-lg text-sm font-medium active:opacity-90">
            Save
          </button>
        </motion.div>

        {/* Quick Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs text-demo-subtle mb-2">Quick prompts</p>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() =>
                  setActivePrompt(activePrompt === prompt ? null : prompt)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activePrompt === prompt
                    ? "bg-demo-fg text-demo-bg"
                    : "bg-demo-surface text-demo-subtle border border-demo-border"
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Past Entries */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-demo-subtle mb-2">Past entries</p>
          <div className="space-y-2">
            {pastEntries.map((entry, i) => (
              <motion.div
                key={entry.date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-demo-surface border border-demo-border rounded-xl p-3 cursor-pointer active:border-demo-muted transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-demo-subtle">{entry.date}</span>
                  <span className="text-xs text-demo-muted">
                    {entry.words} words
                  </span>
                </div>
                <p className="text-sm text-demo-fg line-clamp-2">
                  {entry.preview}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Review CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-demo-surface to-demo-border border border-demo-elevated rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-demo-fg font-medium">
                Weekly review available
              </p>
              <p className="text-xs text-demo-subtle">Reflect on your progress</p>
            </div>
            <button className="bg-demo-fg text-demo-bg px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
              Start <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
