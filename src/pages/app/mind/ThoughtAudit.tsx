import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Plus, X, Trash2, Edit2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useThoughtLogs, useAddThoughtLog, useUpdateThoughtLog, useDeleteThoughtLog } from "@/hooks/use-thought-logs";
import type { ThoughtType, ThoughtLog } from "@/lib/types";
import { toast } from "sonner";

const THOUGHT_TYPES: { value: ThoughtType; label: string; color: string }[] = [
  { value: "anxiety", label: "Anxiety", color: "bg-red-500/10 text-red-500" },
  { value: "distraction", label: "Distraction", color: "bg-yellow-500/10 text-yellow-500" },
  { value: "ego", label: "Ego", color: "bg-purple-500/10 text-purple-500" },
  { value: "negative", label: "Negative", color: "bg-orange-500/10 text-orange-500" },
  { value: "worry", label: "Worry", color: "bg-blue-500/10 text-blue-500" },
  { value: "other", label: "Other", color: "bg-gray-500/10 text-gray-500" },
];

export default function ThoughtAudit() {
  const [typeFilter, setTypeFilter] = useState<ThoughtType | undefined>();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [thought, setThought] = useState("");
  const [type, setType] = useState<ThoughtType>("anxiety");
  const [trigger, setTrigger] = useState("");
  const [response, setResponse] = useState("");
  const [intensity, setIntensity] = useState<number | null>(null);

  const { data: logs = [], isLoading } = useThoughtLogs(typeFilter);
  const { mutateAsync: add } = useAddThoughtLog();
  const { mutateAsync: update } = useUpdateThoughtLog();
  const { mutateAsync: remove } = useDeleteThoughtLog();

  const resetForm = () => {
    setThought("");
    setType("anxiety");
    setTrigger("");
    setResponse("");
    setIntensity(null);
    setEditingId(null);
  };

  const loadLog = (log: ThoughtLog) => {
    setThought(log.thought);
    setType(log.type);
    setTrigger(log.trigger || "");
    setResponse(log.response || "");
    setIntensity(log.intensity);
    setEditingId(log.id);
    setShowAdd(true);
  };

  const handleSubmit = async () => {
    if (!thought.trim()) return;

    try {
      const input = {
        thought: thought.trim(),
        type,
        trigger: trigger.trim() || undefined,
        response: response.trim() || undefined,
        intensity: intensity || undefined,
      };

      if (editingId) {
        await update({ id: editingId, input });
        toast.success("Thought updated");
      } else {
        await add(input);
        toast.success("Thought logged");
      }

      resetForm();
      setShowAdd(false);
    } catch {
      toast.error("Failed to save thought");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this thought log?")) return;
    try {
      await remove(id);
      toast.success("Thought deleted");
    } catch {
      toast.error("Failed to delete thought");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border border-border sticky top-0 z-10 rounded-2xl mx-4 mt-4 shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <Lightbulb className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Thought Audit</h1>
              <p className="text-xs text-muted-foreground">Log intrusive thoughts, tag patterns</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setShowAdd(!showAdd)}
            variant={showAdd ? "ghost" : "default"}
            className="rounded-xl w-full"
          >
            {showAdd ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {showAdd ? "Cancel" : "Log Thought"}
          </Button>
        </div>

        {/* Type filter */}
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          <button
            onClick={() => setTypeFilter(undefined)}
            className={cn(
              "px-4 py-1.5 rounded-xl text-xs font-medium transition-all",
              !typeFilter
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {THOUGHT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className={cn(
                "px-4 py-1.5 rounded-xl text-xs font-medium transition-all",
                typeFilter === t.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    What was the thought?
                  </label>
                <Textarea
                  placeholder="I'm not good enough for this..."
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  className="mt-1.5 min-h-[80px]"
                  autoFocus
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Type</label>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {THOUGHT_TYPES.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setType(t.value)}
                        className={cn(
                          "py-2 px-3 rounded-lg text-xs font-medium transition-all",
                          type === t.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-medium">
                    Intensity
                  </label>
                  <div className="flex gap-1.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setIntensity(intensity === level ? null : level)}
                        className={cn(
                          "flex-1 h-9 rounded-lg text-xs font-medium transition-all",
                          intensity === level
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium">
                  What triggered it?
                </label>
                <Input
                  placeholder="Seeing a post on social media..."
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium">
                  How did you respond?
                </label>
                <Textarea
                  placeholder="Took a walk, talked to a friend..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1 rounded-xl">
                  {editingId ? "Update" : "Log Thought"}
                </Button>
                {editingId && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      resetForm();
                      setShowAdd(false);
                    }}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {!isLoading && logs.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No thoughts logged yet. Tap + to start.
          </p>
        )}
        {logs.map((log) => {
          const config = THOUGHT_TYPES.find((t) => t.value === log.type);
          return (
            <div
              key={log.id}
              className="bg-card border border-border rounded-2xl p-4 space-y-2 hover:border-primary/40 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={cn("px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/50", config?.color)}>
                      {config?.label}
                    </span>
                    {log.intensity && (
                      <span className="text-xs text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-lg">
                        Intensity: {log.intensity}/5
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed break-words">{log.thought}</p>
                  {log.trigger && (
                    <p className="text-xs text-muted-foreground mt-2 bg-secondary/30 px-2.5 py-1.5 rounded-lg break-words">
                      <span className="font-medium">Trigger:</span> {log.trigger}
                    </p>
                  )}
                  {log.response && (
                    <p className="text-xs text-muted-foreground mt-1 bg-secondary/30 px-2.5 py-1.5 rounded-lg break-words">
                      <span className="font-medium">Response:</span> {log.response}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(log.logged_at).toLocaleDateString()} at{" "}
                    {new Date(log.logged_at).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="sm" onClick={() => loadLog(log)} className="rounded-lg">
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(log.id)}
                    className="rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
