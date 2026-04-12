import { useState, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGratitude } from "@/hooks/use-gratitude";
import type { GratitudeEntry } from "@/lib/types";

function toDateStr(d = new Date()) {
  return d.toISOString().split("T")[0];
}

function offsetDate(from: Date, days: number) {
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date) {
  const today = toDateStr();
  const dateStr = toDateStr(d);
  if (dateStr === today) return "Today";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" });
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function DailyGratitude() {
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState(["", "", ""]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { entries, isLoading, upsert, remove, isSaving } = useGratitude();

  const dateStr = toDateStr(date);
  const isToday = dateStr === toDateStr();

  // Load existing entry for selected date
  useEffect(() => {
    const entry = entries.find((e) => e.entry_date === dateStr);
    if (entry) {
      // Ensure we always have 3 items
      const loadedItems = [...entry.items];
      while (loadedItems.length < 3) loadedItems.push("");
      setItems(loadedItems.slice(0, 3));
    } else {
      setItems(["", "", ""]);
    }
  }, [dateStr, entries]);

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleSave = async () => {
    const filled = items.filter((i) => i.trim());
    if (filled.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    try {
      await upsert({
        entry_date: dateStr,
        items: items.map((i) => i.trim()).filter(Boolean),
      });
      toast.success("Gratitude saved");
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to save gratitude");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success("Entry deleted");
    } catch (error) {
      toast.error("Failed to delete entry");
      console.error(error);
    }
  };

  const handleEdit = (entry: GratitudeEntry) => {
    setDate(new Date(entry.entry_date));
    setEditingId(entry.id);
  };

  const sortedEntries = [...entries].sort((a, b) => 
    b.entry_date.localeCompare(a.entry_date)
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Simple Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/30">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            </div>
            <div>
              <h1 className="text-2xl font-light tracking-tight">Gratitude Journal</h1>
              <p className="text-sm text-muted-foreground/80">A space for reflection</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-12">
        {/* Date Navigator & Entry Form */}
        <div className="space-y-6">
          {/* Date Navigation */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setDate((d) => offsetDate(d, -1))}
              className="p-2 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/20 text-muted-foreground hover:text-pink-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center min-w-[200px]">
              <h2 className="text-lg font-light text-foreground/90">{formatDate(date)}</h2>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                {new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <button
              onClick={() => setDate((d) => offsetDate(d, 1))}
              disabled={isToday}
              className="p-2 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/20 text-muted-foreground hover:text-pink-600 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Writing Area */}
          <div className="bg-card border border-border/50 rounded-lg p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-light text-foreground/90">Today I'm grateful for...</h3>
              <div className="h-px bg-gradient-to-r from-pink-200 via-pink-300 to-transparent dark:from-pink-900/40 dark:via-pink-800/40" />
            </div>

            <div className="space-y-5">
              {items.map((item, index) => (
                <div key={index} className="space-y-2">
                  <Textarea
                    placeholder={`${index + 1}. Something you appreciate...`}
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    className="min-h-[100px] resize-none border-border/50 focus:border-pink-300 dark:focus:border-pink-700 rounded-lg text-base leading-relaxed bg-background/50"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 rounded-lg font-light"
              >
                {isSaving ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </div>
        </div>

        {/* Journal Entries */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-light text-foreground/90">Previous Entries</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border/50 to-transparent" />
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-sm text-muted-foreground/60">Loading your journal...</p>
            </div>
          ) : sortedEntries.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-sm text-muted-foreground/60">Your journal is empty</p>
              <p className="text-xs text-muted-foreground/40">Start by writing your first entry above</p>
            </div>
          ) : (
            <div className="space-y-10">
              {sortedEntries.map((entry) => (
                <div key={entry.id} className="space-y-4">
                  {/* Date Header */}
                  <div className="flex items-center gap-3">
                    <time className="text-sm font-light text-pink-600 dark:text-pink-400">
                      {formatFullDate(entry.entry_date)}
                    </time>
                    <div className="flex-1 h-px bg-gradient-to-r from-pink-200/50 to-transparent dark:from-pink-900/30" />
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="p-1.5 rounded-md hover:bg-pink-50 dark:hover:bg-pink-950/20 text-muted-foreground hover:text-pink-600 transition-colors"
                        title="Edit entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1.5 rounded-md hover:bg-pink-50 dark:hover:bg-pink-950/20 text-muted-foreground hover:text-red-600 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Entry Card */}
                  <div className="bg-card border border-border/40 rounded-lg p-8 shadow-sm space-y-5">
                    {entry.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 group">
                        <span className="text-pink-400/60 dark:text-pink-600/60 font-light text-sm mt-0.5">
                          {idx + 1}.
                        </span>
                        <p className="text-base leading-relaxed text-foreground/85 flex-1">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
