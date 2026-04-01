import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Smile,
  SmilePlus,
  Meh,
  Frown,
  CloudRain,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useReflections, type Mood } from "@/hooks/use-reflections";
import { RichTextEditor } from "@/components/app/RichTextEditor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const MOODS: { value: Mood; Icon: LucideIcon; label: string; color: string }[] =
  [
    {
      value: "great",
      Icon: SmilePlus,
      label: "Great",
      color: "text-emerald-500",
    },
    { value: "good", Icon: Smile, label: "Good", color: "text-cyan-500" },
    { value: "okay", Icon: Meh, label: "Okay", color: "text-yellow-500" },
    { value: "low", Icon: Frown, label: "Low", color: "text-orange-500" },
    { value: "rough", Icon: CloudRain, label: "Rough", color: "text-red-500" },
  ];

const PROMPTS = [
  "What went well today, and what drained you?",
  "What's one thing you'd do differently tomorrow?",
  "What are you grateful for right now?",
  "Did your actions today align with your intentions?",
  "What did you learn about yourself today?",
  "What's one small win worth celebrating?",
  "What felt heavy today, and how can you lighten it?",
];

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}
function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const today = toDateStr();
  if (dateStr === today) return "Today";
  if (dateStr === toDateStr(new Date(Date.now() - 86400000)))
    return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function Reflection() {
  const { reflections, todayEntry, save, isSaving } = useReflections(7);
  const [selectedDate, setSelectedDate] = useState(toDateStr());
  const [mood, setMood] = useState<Mood | null>(
    (todayEntry?.mood as Mood) ?? null,
  );
  
  // Parse content - handle both JSON object and stringified JSON
  const parseContent = (rawContent: unknown): Record<string, unknown> => {
    if (!rawContent) return {};
    if (typeof rawContent === 'object') return rawContent as Record<string, unknown>;
    if (typeof rawContent === 'string') {
      try {
        return JSON.parse(rawContent);
      } catch {
        // If it's not valid JSON, wrap it as plain text
        return {
          type: 'doc',
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: rawContent }]
          }]
        };
      }
    }
    return {};
  };
  
  const [content, setContent] = useState<Record<string, unknown>>(
    parseContent(todayEntry?.content)
  );
  const [dirty, setDirty] = useState(false);

  const isToday = selectedDate === toDateStr();
  const dayOfWeek = new Date().getDay();
  const prompt = PROMPTS[dayOfWeek % PROMPTS.length];

  const selectedEntry = reflections.find((r) => r.entry_date === selectedDate);

  const handleContentChange = useCallback((json: Record<string, unknown>) => {
    setContent(json);
    setDirty(true);
  }, []);

  const handleSave = async () => {
    if (!isToday) return;
    try {
      await save({ content, mood: mood ?? undefined });
      setDirty(false);
      toast.success("Reflection saved.");
    } catch {
      toast.error("Failed to save.");
    }
  };

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return toDateStr(d);
  });

  return (
    <div className="max-w-xl mx-auto">
      {/* Day strip */}
      <div className="flex gap-1.5 mb-6">
        {days.map((ds) => {
          const entry = reflections.find((r) => r.entry_date === ds);
          const isSelected = ds === selectedDate;
          const d = new Date(ds + "T00:00:00");
          return (
            <button
              key={ds}
              onClick={() => setSelectedDate(ds)}
              className={cn(
                "flex-1 flex flex-col items-center py-2 rounded-xl border text-xs transition-all",
                isSelected
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/30",
              )}
            >
              <span className="font-medium">
                {d.toLocaleDateString("en-US", { weekday: "narrow" })}
              </span>
              <span className="mt-0.5 flex items-center justify-center">
                {entry ? (
                  entry.mood ? (
                    (() => {
                      const m = MOODS.find((x) => x.value === entry.mood);
                      return m ? (
                        <m.Icon className={cn("w-3 h-3", m.color)} />
                      ) : null;
                    })()
                  ) : (
                    <Check className="w-3 h-3 text-muted-foreground" />
                  )
                ) : (
                  <span className="text-muted-foreground">·</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <h1 className="text-base font-semibold text-foreground mb-4">
        {formatDate(selectedDate)}
      </h1>

      {isToday ? (
        <div className="space-y-5">
          {/* Mood */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              How are you feeling?
            </p>
            <div className="flex gap-2">
              {MOODS.map(({ value, Icon, label, color }) => (
                <button
                  key={value}
                  onClick={() => setMood(mood === value ? null : value)}
                  className={cn(
                    "flex-1 flex flex-col items-center py-2.5 rounded-xl border text-xs transition-all",
                    mood === value
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-foreground/30",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      mood === value ? "text-background" : color,
                    )}
                  />
                  <span className="mt-0.5">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Today's prompt</p>
            <p className="text-sm text-foreground italic border border-border rounded-xl px-4 py-3">
              {prompt}
            </p>
          </div>

          {/* Editor */}
          <RichTextEditor
            content={
              content && Object.keys(content).length ? content : undefined
            }
            onChange={handleContentChange}
            placeholder="Write your reflection…"
          />

          <Button
            onClick={handleSave}
            disabled={isSaving || !dirty}
            className="w-full"
          >
            {isSaving ? "Saving…" : "Save reflection"}
          </Button>
        </div>
      ) : selectedEntry ? (
        <div className="space-y-4">
          {selectedEntry.mood && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              Feeling:{" "}
              {(() => {
                const m = MOODS.find((x) => x.value === selectedEntry.mood);
                return m ? (
                  <span
                    className={cn(
                      "flex items-center gap-1 font-medium text-foreground",
                    )}
                  >
                    <m.Icon className={cn("w-3.5 h-3.5", m.color)} />
                    {m.label}
                  </span>
                ) : null;
              })()}
            </p>
          )}
          <RichTextEditor
            content={parseContent(selectedEntry.content)}
            editable={false}
          />
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl">
          <p className="text-sm font-medium text-foreground mb-1">
            No reflection
          </p>
          <p className="text-xs text-muted-foreground">
            No entry was written for this day.
          </p>
        </div>
      )}
    </div>
  );
}
