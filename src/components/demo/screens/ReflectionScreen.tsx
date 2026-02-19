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
          <h1 className="text-lg font-serif text-[#fafafa]">Reflection</h1>
          <BookOpen className="w-5 h-5 text-[#6a6a6a]" />
        </div>
      </motion.div>

      <div className="flex-1 px-5 overflow-y-auto space-y-4 no-scrollbar">
        {/* Featured Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4"
        >
          <p className="text-xs text-[#6a6a6a] uppercase tracking-wider mb-2">
            Daily Reflection
          </p>
          <p className="text-sm text-[#fafafa] mb-4">
            What's one thing you're grateful for today?
          </p>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Start writing..."
            className="w-full h-24 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-[#fafafa] placeholder-[#4a4a4a] focus:outline-none focus:border-[#4a4a4a] resize-none"
          />
          <button className="w-full mt-3 bg-[#fafafa] text-[#0a0a0a] py-2 rounded-lg text-sm font-medium active:opacity-90">
            Save
          </button>
        </motion.div>

        {/* Quick Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs text-[#6a6a6a] mb-2">Quick prompts</p>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() =>
                  setActivePrompt(activePrompt === prompt ? null : prompt)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activePrompt === prompt
                    ? "bg-[#fafafa] text-[#0a0a0a]"
                    : "bg-[#1a1a1a] text-[#6a6a6a] border border-[#2a2a2a]"
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
          <p className="text-xs text-[#6a6a6a] mb-2">Past entries</p>
          <div className="space-y-2">
            {pastEntries.map((entry, i) => (
              <motion.div
                key={entry.date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 cursor-pointer active:border-[#4a4a4a] transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#6a6a6a]">{entry.date}</span>
                  <span className="text-xs text-[#4a4a4a]">
                    {entry.words} words
                  </span>
                </div>
                <p className="text-sm text-[#fafafa] line-clamp-2">
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
          className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-[#3a3a3a] rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#fafafa] font-medium">
                Weekly review available
              </p>
              <p className="text-xs text-[#6a6a6a]">Reflect on your progress</p>
            </div>
            <button className="bg-[#fafafa] text-[#0a0a0a] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1">
              Start <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
