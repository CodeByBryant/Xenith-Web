import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Plus, Check, Trash2, ChevronLeft, ChevronRight, Tag, Bell, BellOff, Clock } from "lucide-react";
import { toast } from "sonner";
import { useIntentions } from "@/hooks/use-intentions";
import { LIFE_DIMENSIONS, type Intention } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DIMENSION_COLORS: Record<string, string> = {
  Health: "bg-emerald-500/20 text-emerald-500",
  Mind: "bg-violet-500/20 text-violet-500",
  Relationships: "bg-pink-500/20 text-pink-500",
  Work: "bg-blue-500/20 text-blue-500",
  Finances: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  Learning: "bg-cyan-500/20 text-cyan-500",
  Rest: "bg-indigo-500/20 text-indigo-400",
  Purpose: "bg-orange-500/20 text-orange-500",
};

function offsetDate(from: Date, days: number) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date) {
  const today = new Date();
  const ds = d.toDateString();
  if (ds === today.toDateString()) return "Today";
  if (ds === offsetDate(today, -1).toDateString()) return "Yesterday";
  if (ds === offsetDate(today, 1).toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function Intentions() {
  const [date, setDate] = useState(new Date());
  const { intentions, isLoading, add, toggle, remove, update } = useIntentions(date);
  const [newTitle, setNewTitle] = useState("");
  const [selectedDim, setSelectedDim] = useState<string | null>(null);
  const [showDimPicker, setShowDimPicker] = useState(false);

  const completed = intentions.filter((i) => i.completed_at);
  const pending = intentions.filter((i) => !i.completed_at);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await add({ title: newTitle.trim(), dimension: selectedDim });
      setNewTitle("");
      setSelectedDim(null);
    } catch {
      toast.error("Failed to add intention.");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Helmet>
        <title>Daily Intentions | Xenith</title>
      </Helmet>
      {/* Date nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setDate((d) => offsetDate(d, -1))}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h1 className="text-base font-semibold text-foreground">{formatDate(date)}</h1>
        <button
          onClick={() => setDate((d) => offsetDate(d, 1))}
          className="p-2 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="mb-5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add an intention…"
              className="pr-9"
            />
            <button
              type="button"
              onClick={() => setShowDimPicker((v) => !v)}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors",
                selectedDim ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Tag className="w-3.5 h-3.5" />
            </button>
          </div>
          <Button type="submit" size="icon" disabled={!newTitle.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <AnimatePresence>
          {showDimPicker && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-2 flex flex-wrap gap-1.5"
            >
              {LIFE_DIMENSIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setSelectedDim(selectedDim === d ? null : d);
                    setShowDimPicker(false);
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                    selectedDim === d
                      ? DIMENSION_COLORS[d]
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  {d}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {selectedDim && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Tagged: <span className="font-medium">{selectedDim}</span>
          </p>
        )}
      </form>

      {/* List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Loading…</div>
      ) : intentions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl">
          <p className="text-sm font-medium text-foreground mb-1">No intentions yet</p>
          <p className="text-xs text-muted-foreground">
            Add one above to start your day with purpose.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence initial={false}>
            {pending.map((i) => (
              <IntentionRow
                key={i.id}
                intention={i}
                onToggle={(id, done) =>
                  toggle({ id, completed: !done }).catch(() => toast.error("Failed."))
                }
                onRemove={(id) => remove(id).catch(() => toast.error("Failed."))}
                onUpdate={(id, updates) =>
                  update({ id, updates }).catch(() => toast.error("Failed."))
                }
              />
            ))}
          </AnimatePresence>

          {completed.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground pt-3 pb-1 px-1">
                Completed ({completed.length})
              </p>
              <AnimatePresence initial={false}>
                {completed.map((i) => (
                  <IntentionRow
                    key={i.id}
                    intention={i}
                    onToggle={(id, done) =>
                      toggle({ id, completed: !done }).catch(() => toast.error("Failed."))
                    }
                    onRemove={(id) => remove(id).catch(() => toast.error("Failed."))}
                    onUpdate={(id, updates) =>
                      update({ id, updates }).catch(() => toast.error("Failed."))
                    }
                  />
                ))}
              </AnimatePresence>
            </>
          )}
        </div>
      )}
    </div>
  );
}

type IntentionRowProps = {
  intention: Intention;
  onToggle: (id: string, done: boolean) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Intention>) => void;
};

function IntentionRow({ intention, onToggle, onRemove, onUpdate }: IntentionRowProps) {
  const done = !!intention.completed_at;
  const [showTimeInput, setShowTimeInput] = useState(false);
  const [timeValue, setTimeValue] = useState(
    intention.reminder_time?.slice(0, 5) || "09:00"
  );

  const handleToggleReminder = () => {
    if (!intention.reminder_enabled) {
      setShowTimeInput(true);
    } else {
      onUpdate(intention.id, { reminder_enabled: false });
    }
  };

  const handleSetTime = () => {
    onUpdate(intention.id, {
      reminder_time: timeValue + ":00",
      reminder_enabled: true,
    });
    setShowTimeInput(false);
    toast.success(`Reminder set for ${timeValue}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="bg-card"
    >
      <div className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border hover:border-foreground/20 transition-all">
        <button
          onClick={() => onToggle(intention.id!, done)}
          className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
            done
              ? "bg-foreground border-foreground"
              : "border-border hover:border-foreground/50"
          )}
        >
          {done && <Check className="w-3 h-3 text-background" />}
        </button>

        <span
          className={cn(
            "flex-1 text-sm",
            done && "line-through text-muted-foreground"
          )}
        >
          {intention.title}
        </span>

        {intention.dimension && (
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full font-medium",
              DIMENSION_COLORS[intention.dimension] ??
                "bg-secondary text-muted-foreground"
            )}
          >
            {intention.dimension}
          </span>
        )}

        {/* Reminder indicator */}
        {intention.reminder_enabled && intention.reminder_time && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Bell className="w-3 h-3" />
            {intention.reminder_time.slice(0, 5)}
          </span>
        )}

        {/* Reminder toggle */}
        <button
          onClick={handleToggleReminder}
          className={cn(
            "p-1 rounded-lg transition-all shrink-0",
            intention.reminder_enabled
              ? "text-blue-500"
              : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
          )}
          title={
            intention.reminder_enabled
              ? "Disable reminder"
              : "Set reminder"
          }
        >
          {intention.reminder_enabled ? (
            <Bell className="w-3.5 h-3.5" />
          ) : (
            <BellOff className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={() => onRemove(intention.id!)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-muted-foreground hover:text-foreground transition-all shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Time input */}
      <AnimatePresence>
        {showTimeInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-3"
          >
            <div className="flex items-center gap-2 pt-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Input
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                className="flex-1 text-sm"
              />
              <Button size="sm" onClick={handleSetTime}>
                Set
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowTimeInput(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
