import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useValuesCheckin } from "@/hooks/use-values-checkin";
import { toast } from "sonner";

export default function ValuesCheckin() {
  const [showAdd, setShowAdd] = useState(false);
  
  // Form state
  const [checkinDate, setCheckinDate] = useState(new Date().toISOString().split("T")[0]);
  const [valueInput, setValueInput] = useState("");
  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [alignmentScore, setAlignmentScore] = useState<number | null>(null);
  const [alignedActions, setAlignedActions] = useState("");
  const [misalignedActions, setMisalignedActions] = useState("");
  const [reflection, setReflection] = useState("");

  const { checkins, isLoading, add, remove } = useValuesCheckin();

  const resetForm = () => {
    setCheckinDate(new Date().toISOString().split("T")[0]);
    setValueInput("");
    setCoreValues([]);
    setAlignmentScore(null);
    setAlignedActions("");
    setMisalignedActions("");
    setReflection("");
  };

  const addValue = () => {
    if (valueInput.trim() && coreValues.length < 5) {
      setCoreValues([...coreValues, valueInput.trim()]);
      setValueInput("");
    }
  };

  const removeValue = (index: number) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (coreValues.length === 0 || alignmentScore === null) {
      toast.error("Please add at least one value and set alignment score");
      return;
    }

    try {
      await add({
        checkin_date: checkinDate,
        core_values: coreValues,
        alignment_score: alignmentScore,
        aligned_actions: alignedActions,
        misaligned_actions: misalignedActions,
        reflection,
      });
      toast.success("Check-in logged");
      resetForm();
      setShowAdd(false);
    } catch (error) {
      toast.error("Failed to save check-in");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success("Check-in deleted");
    } catch (error) {
      toast.error("Failed to delete check-in");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="bg-card border border-border sticky top-0 z-10 rounded-2xl mx-4 mt-4 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Values Check-In</h1>
              <p className="text-xs text-muted-foreground">Track alignment with your core values</p>
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

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Date</label>
                <Input
                  type="date"
                  value={checkinDate}
                  onChange={(e) => setCheckinDate(e.target.value)}
                  className="rounded-xl max-w-xs"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                  Core Values (up to 5)
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a value..."
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addValue();
                      }
                    }}
                    className="rounded-xl"
                    disabled={coreValues.length >= 5}
                  />
                  <Button
                    onClick={addValue}
                    disabled={!valueInput.trim() || coreValues.length >= 5}
                    className="rounded-xl"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {coreValues.map((value, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-xl text-xs font-medium"
                    >
                      {value}
                      <button
                        onClick={() => removeValue(index)}
                        className="hover:text-amber-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                  Alignment Score (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => setAlignmentScore(score)}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-medium transition-all border",
                        alignmentScore === score
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-secondary/50 border-border hover:border-amber-500/40"
                      )}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Aligned Actions</label>
                <Textarea
                  placeholder="What did you do that aligned with your values?"
                  value={alignedActions}
                  onChange={(e) => setAlignedActions(e.target.value)}
                  className="rounded-xl resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Misaligned Actions</label>
                <Textarea
                  placeholder="What didn't align with your values?"
                  value={misalignedActions}
                  onChange={(e) => setMisalignedActions(e.target.value)}
                  className="rounded-xl resize-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Reflection</label>
                <Textarea
                  placeholder="Any insights or thoughts..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="rounded-xl resize-none"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={coreValues.length === 0 || alignmentScore === null}
                className="w-full rounded-xl"
              >
                Add Check-In
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Check-ins List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="text-center text-muted-foreground text-sm py-8">Loading...</div>
        ) : checkins.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            No check-ins yet. Start tracking your values alignment!
          </div>
        ) : (
          checkins.map((checkin) => (
            <div
              key={checkin.id}
              className="bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                      Alignment: {checkin.alignment_score}/5
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(checkin.checkin_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {checkin.core_values.map((value, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-secondary rounded-lg text-muted-foreground font-medium"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                  {checkin.aligned_actions && (
                    <div>
                      <p className="text-xs font-medium">Aligned:</p>
                      <p className="text-xs text-muted-foreground">{checkin.aligned_actions}</p>
                    </div>
                  )}
                  {checkin.misaligned_actions && (
                    <div>
                      <p className="text-xs font-medium">Misaligned:</p>
                      <p className="text-xs text-muted-foreground">{checkin.misaligned_actions}</p>
                    </div>
                  )}
                  {checkin.reflection && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground italic">{checkin.reflection}</p>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleDelete(checkin.id)}
                  size="sm"
                  variant="ghost"
                  className="rounded-xl text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8 leading-relaxed px-4">
        Pro tip — use this tool to inform your weekly Purpose dimension score.
        Consistent logging here should reflect in a higher self-rating.
      </p>
    </div>
  );
}
