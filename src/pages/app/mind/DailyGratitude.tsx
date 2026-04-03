import { useState } from "react";
import { Heart, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

export default function DailyGratitude() {
  const [date, setDate] = useState(new Date());
  const [items, setItems] = useState(["", "", ""]);

  const dateStr = toDateStr(date);
  const isToday = dateStr === toDateStr();

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleSave = () => {
    const filled = items.filter((i) => i.trim());
    if (filled.length === 0) {
      toast.error("Add at least one item");
      return;
    }
    toast.success("Gratitude saved");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">Daily Gratitude</h1>
          </div>
          <p className="text-xs text-muted-foreground">Three things, every day</p>
        </div>

        {/* Date navigation */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <button
            onClick={() => setDate((d) => offsetDate(d, -1))}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium">{formatDate(date)}</span>
          <button
            onClick={() => setDate((d) => offsetDate(d, 1))}
            disabled={isToday}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">
                {index + 1}. I'm grateful for...
              </label>
              <Textarea
                placeholder="Something good that happened"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="min-h-[60px] resize-none"
              />
            </div>
          ))}

          <Button onClick={handleSave} className="w-full">
            Save
          </Button>
        </div>

        {/* Recent entries placeholder */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold px-1">Recent Entries</h3>
          <p className="text-sm text-muted-foreground text-center py-8">
            No entries yet. Start above.
          </p>
        </div>
      </div>
    </div>
  );
}
