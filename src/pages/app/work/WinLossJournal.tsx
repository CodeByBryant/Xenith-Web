import { useState } from "react";
import { TrendingUp, TrendingDown, Plus, X, Edit2, Trash2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useWinLossEntries } from "@/hooks/use-win-loss";
import { cn } from "@/lib/utils";
import type { WinLossEntry } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

export default function WinLossJournal() {
  const { entries, isLoading, add, update, remove, isAdding, isUpdating } = useWinLossEntries();
  
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [entryType, setEntryType] = useState<"win" | "loss">("win");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lessonLearned, setLessonLearned] = useState("");

  const wins = entries.filter((e) => e.entry_type === "win");
  const losses = entries.filter((e) => e.entry_type === "loss");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLessonLearned("");
    setEntryDate(new Date().toISOString().split("T")[0]);
    setEntryType("win");
    setEditingId(null);
    setShowAdd(false);
  };

  const loadEntry = (entry: WinLossEntry) => {
    setEditingId(entry.id);
    setEntryType(entry.entry_type);
    setEntryDate(entry.entry_date);
    setTitle(entry.title);
    setDescription(entry.description || "");
    setLessonLearned(entry.lesson_learned || "");
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      if (editingId) {
        await update({
          id: editingId,
          input: {
            entry_type: entryType,
            entry_date: entryDate,
            title,
            description: description || undefined,
            lesson_learned: lessonLearned || undefined,
          },
        });
        toast.success("Entry updated");
      } else {
        await add({
          entry_type: entryType,
          entry_date: entryDate,
          title,
          description: description || undefined,
          lesson_learned: lessonLearned || undefined,
        });
        toast.success("Entry added");
      }
      resetForm();
    } catch (error) {
      toast.error("Failed to save");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    
    try {
      await remove(id);
      toast.success("Entry deleted");
    } catch (error) {
      toast.error("Failed to delete");
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="bg-card border border-border sticky top-0 z-10 rounded-2xl mx-4 mt-4 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/10 to-red-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Win/Loss Journal</h1>
              <p className="text-xs text-muted-foreground">Learn from every outcome</p>
            </div>
          </div>
          <Button
            onClick={() => setShowAdd(!showAdd)}
            size="sm"
            variant={showAdd ? "outline" : "default"}
            className="rounded-xl"
          >
            {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
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
                {/* Type selector */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setEntryType("win")}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      entryType === "win"
                        ? "bg-green-500/5 border-green-500 ring-2 ring-green-500/20"
                        : "border-border hover:border-green-500/30"
                    )}
                  >
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="text-sm font-semibold">Win</div>
                  </button>
                  <button
                    onClick={() => setEntryType("loss")}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all",
                      entryType === "loss"
                        ? "bg-red-500/5 border-red-500 ring-2 ring-red-500/20"
                        : "border-border hover:border-red-500/30"
                    )}
                  >
                    <TrendingDown className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <div className="text-sm font-semibold">Loss</div>
                  </button>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Date</label>
                  <Input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="rounded-xl max-w-xs"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Title</label>
                  <Input
                    placeholder="What happened?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Description</label>
                  <Textarea
                    placeholder="Details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    Lesson Learned
                  </label>
                  <Textarea
                    placeholder="What did you learn?"
                    value={lessonLearned}
                    onChange={(e) => setLessonLearned(e.target.value)}
                    className="rounded-xl resize-none"
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isAdding || isUpdating} className="flex-1 rounded-xl">
                    {editingId ? "Update" : "Add"} Entry
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={resetForm} className="rounded-xl">
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two-Column Layout */}
      <div className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Wins Column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <h2 className="text-sm font-semibold text-green-600">Wins ({wins.length})</h2>
            </div>
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-xs text-muted-foreground text-center py-8">Loading...</p>
              ) : wins.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">No wins yet</p>
              ) : (
                wins.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-card border border-green-500/20 rounded-xl p-3 hover:border-green-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold flex-1">{entry.title}</h3>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadEntry(entry)}
                          className="h-7 w-7 p-0 rounded-lg"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="h-7 w-7 p-0 rounded-lg text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(entry.entry_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {entry.description && (
                      <p className="text-xs text-muted-foreground mb-2">{entry.description}</p>
                    )}
                    {entry.lesson_learned && (
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-2 py-1.5 mt-2">
                        <p className="text-xs text-muted-foreground">{entry.lesson_learned}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Losses Column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <h2 className="text-sm font-semibold text-red-600">Losses ({losses.length})</h2>
            </div>
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-xs text-muted-foreground text-center py-8">Loading...</p>
              ) : losses.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">No losses yet</p>
              ) : (
                losses.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-card border border-red-500/20 rounded-xl p-3 hover:border-red-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold flex-1">{entry.title}</h3>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadEntry(entry)}
                          className="h-7 w-7 p-0 rounded-lg"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(entry.id)}
                          className="h-7 w-7 p-0 rounded-lg text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {new Date(entry.entry_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {entry.description && (
                      <p className="text-xs text-muted-foreground mb-2">{entry.description}</p>
                    )}
                    {entry.lesson_learned && (
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg px-2 py-1.5 mt-2">
                        <p className="text-xs text-muted-foreground">{entry.lesson_learned}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8 leading-relaxed px-4">
        Pro tip — use this tool to inform your weekly Work dimension score.
        Consistent logging here should reflect in a higher self-rating.
      </p>
    </div>
  );
}
