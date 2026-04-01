import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  Sunrise,
  Sun,
  Sunset,
} from "lucide-react";
import { toast } from "sonner";
import { useRoutines, type Routine } from "@/hooks/use-routines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const TIME_CONFIG: Record<string, { Icon: LucideIcon; label: string }> = {
  morning: { Icon: Sunrise, label: "Morning" },
  afternoon: { Icon: Sun, label: "Afternoon" },
  evening: { Icon: Sunset, label: "Evening" },
};
type TimeOfDay = "morning" | "afternoon" | "evening";

export default function Routines() {
  const {
    routines,
    completions,
    isLoading,
    addRoutine,
    addItem,
    toggleItem,
    removeRoutine,
  } = useRoutines();
  const [newName, setNewName] = useState("");
  const [newTime, setNewTime] = useState<TimeOfDay>("morning");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [addingItem, setAddingItem] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemDuration, setNewItemDuration] = useState("5");

  const handleAddRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const r = await addRoutine({
        name: newName.trim(),
        time_of_day: newTime,
      });
      setNewName("");
      setExpanded((ex) => ({ ...ex, [r.id]: true }));
    } catch {
      toast.error("Failed to add routine.");
    }
  };

  const handleAddItem = async (routineId: string) => {
    if (!newItemTitle.trim()) return;
    try {
      const duration = parseInt(newItemDuration) || 5;
      await addItem({ 
        routine_id: routineId, 
        title: newItemTitle.trim(),
        estimated_minutes: duration
      });
      setNewItemTitle("");
      setNewItemDuration("5");
      setAddingItem(null);
    } catch {
      toast.error("Failed to add step.");
    }
  };

  const handleToggle = async (
    routineId: string,
    itemId: string,
    checked: boolean,
  ) => {
    try {
      await toggleItem({ routine_id: routineId, item_id: itemId, checked });
    } catch {
      toast.error("Failed to update.");
    }
  };

  const completedIds = (routineId: string) =>
    completions.find((c) => c.routine_id === routineId)?.completed_item_ids ??
    [];

  const groups: TimeOfDay[] = ["morning", "afternoon", "evening"];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Add form */}
      <form onSubmit={handleAddRoutine} className="flex gap-2">
        <div className="flex gap-1 p-1 bg-secondary rounded-xl shrink-0">
          {groups.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setNewTime(t)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                newTime === t
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Routine name…"
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newName.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </form>

      {isLoading && (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Loading…
        </div>
      )}

      {!isLoading && routines.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl">
          <p className="text-sm font-medium text-foreground mb-1">
            No routines yet
          </p>
          <p className="text-xs text-muted-foreground">
            Add your first routine above.
          </p>
        </div>
      )}

      {/* Grouped by time */}
      {groups.map((time) => {
        const group = routines.filter((r) => r.time_of_day === time);
        if (!group.length) return null;
        return (
          <div key={time}>
            <div className="flex items-center gap-1.5 mb-2">
              {(() => {
                const { Icon, label } = TIME_CONFIG[time];
                return (
                  <>
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </>
                );
              })()}
            </div>
            <div className="space-y-2">
              {group.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  expanded={!!expanded[routine.id]}
                  onToggleExpand={() =>
                    setExpanded((ex) => ({
                      ...ex,
                      [routine.id]: !ex[routine.id],
                    }))
                  }
                  completedIds={completedIds(routine.id)}
                  onToggleItem={handleToggle}
                  onRemove={() =>
                    removeRoutine(routine.id).catch(() =>
                      toast.error("Failed."),
                    )
                  }
                  addingItem={addingItem === routine.id}
                  onStartAddItem={() => {
                    setAddingItem(routine.id);
                    setNewItemTitle("");
                    setNewItemDuration("5");
                  }}
                  onCancelAddItem={() => setAddingItem(null)}
                  newItemTitle={newItemTitle}
                  setNewItemTitle={setNewItemTitle}
                  newItemDuration={newItemDuration}
                  setNewItemDuration={setNewItemDuration}
                  onAddItem={() => handleAddItem(routine.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RoutineCard({
  routine,
  expanded,
  onToggleExpand,
  completedIds,
  onToggleItem,
  onRemove,
  addingItem,
  onStartAddItem,
  onCancelAddItem,
  newItemTitle,
  setNewItemTitle,
  newItemDuration,
  setNewItemDuration,
  onAddItem,
}: {
  routine: Routine;
  expanded: boolean;
  onToggleExpand: () => void;
  completedIds: string[];
  onToggleItem: (rid: string, iid: string, checked: boolean) => void;
  onRemove: () => void;
  addingItem: boolean;
  onStartAddItem: () => void;
  onCancelAddItem: () => void;
  newItemTitle: string;
  setNewItemTitle: (v: string) => void;
  newItemDuration: string;
  setNewItemDuration: (v: string) => void;
  onAddItem: () => void;
}) {;

  const items = routine.items ?? [];
  const doneCount = items.filter((i) => completedIds.includes(i.id)).length;
  const pct = items.length ? doneCount / items.length : 0;

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors text-left"
      >
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{routine.name}</p>
          {items.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1 flex-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground rounded-full transition-all"
                  style={{ width: `${pct * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums">
                {doneCount}/{items.length}
              </span>
            </div>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border divide-y divide-border">
              {items.map((item) => {
                const done = completedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <button
                      onClick={() => onToggleItem(routine.id, item.id, !done)}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all",
                        done
                          ? "bg-foreground border-foreground"
                          : "border-border hover:border-foreground/50",
                      )}
                    >
                      {done && (
                        <Check className="w-2.5 h-2.5 text-background" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        done && "line-through text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </span>
                    {item.estimated_minutes > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {item.estimated_minutes}m
                      </span>
                    )}
                  </div>
                );
              })}

              {addingItem ? (
                <div className="flex items-center gap-2 px-4 py-2.5">
                  <Input
                    autoFocus
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onAddItem();
                      if (e.key === "Escape") onCancelAddItem();
                    }}
                    placeholder="Step title…"
                    className="flex-1 h-7 text-sm"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="999"
                    value={newItemDuration}
                    onChange={(e) => setNewItemDuration(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onAddItem();
                      if (e.key === "Escape") onCancelAddItem();
                    }}
                    placeholder="5"
                    className="w-16 h-7 text-sm text-center"
                    title="Duration in minutes"
                  />
                  <span className="text-xs text-muted-foreground">min</span>
                  <Button
                    size="sm"
                    onClick={onAddItem}
                    disabled={!newItemTitle.trim()}
                  >
                    Add
                  </Button>
                  <Button size="sm" variant="ghost" onClick={onCancelAddItem}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-2.5">
                  <button
                    onClick={onStartAddItem}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add step
                  </button>
                  <button
                    onClick={onRemove}
                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
