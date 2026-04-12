import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Plus, X, Trash2, Edit2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDecisionJournal } from "@/hooks/use-decision-journal";
import type { DecisionJournal as DecisionJournalEntry } from "@/lib/types";
import { toast } from "sonner";

export default function DecisionJournal() {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [decisionDate, setDecisionDate] = useState(new Date().toISOString().split("T")[0]);
  const [decisionTitle, setDecisionTitle] = useState("");
  const [chosenOption, setChosenOption] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [actualOutcome, setActualOutcome] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");

  const { decisions, isLoading, add, update, remove } = useDecisionJournal();

  const resetForm = () => {
    setDecisionDate(new Date().toISOString().split("T")[0]);
    setDecisionTitle("");
    setChosenOption("");
    setReasoning("");
    setExpectedOutcome("");
    setActualOutcome("");
    setLessonsLearned("");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!decisionTitle.trim() || !chosenOption.trim()) {
      toast.error("Please fill in decision and chosen option");
      return;
    }

    try {
      if (editingId) {
        await update({
          id: editingId,
          decision_date: decisionDate,
          decision_title: decisionTitle,
          chosen_option: chosenOption,
          reasoning,
          expected_outcome: expectedOutcome,
          actual_outcome: actualOutcome,
          lessons_learned: lessonsLearned,
        });
        toast.success("Decision updated");
      } else {
        await add({
          decision_date: decisionDate,
          decision_title: decisionTitle,
          chosen_option: chosenOption,
          reasoning,
          expected_outcome: expectedOutcome,
          actual_outcome: actualOutcome,
          lessons_learned: lessonsLearned,
        });
        toast.success("Decision logged");
      }
      resetForm();
      setShowAdd(false);
    } catch (error) {
      toast.error("Failed to save decision");
    }
  };

  const handleEdit = (decision: DecisionJournalEntry) => {
    setEditingId(decision.id);
    setDecisionDate(decision.decision_date);
    setDecisionTitle(decision.decision_title);
    setChosenOption(decision.chosen_option);
    setReasoning(decision.reasoning || "");
    setExpectedOutcome(decision.expected_outcome || "");
    setActualOutcome(decision.actual_outcome || "");
    setLessonsLearned(decision.lessons_learned || "");
    setShowAdd(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success("Decision deleted");
    } catch (error) {
      toast.error("Failed to delete decision");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="bg-card border border-border sticky top-0 z-10 rounded-2xl mx-4 mt-4 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Decision Journal</h1>
              <p className="text-xs text-muted-foreground">Track decisions and outcomes over time</p>
            </div>
          </div>
          <Button
            onClick={() => {
              if (showAdd && editingId) resetForm();
              setShowAdd(!showAdd);
            }}
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
            <div className="mx-4 mt-4 bg-card border border-border rounded-2xl p-5">
              <h3 className="font-medium text-sm mb-4">{editingId ? "Edit Decision" : "New Decision"}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1 sm:col-span-1">
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Date</label>
                  <Input
                    type="date"
                    value={decisionDate}
                    onChange={(e) => setDecisionDate(e.target.value)}
                    className="rounded-lg h-9"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Decision Title</label>
                  <Input
                    placeholder="e.g., Job offer acceptance"
                    value={decisionTitle}
                    onChange={(e) => setDecisionTitle(e.target.value)}
                    className="rounded-lg h-9"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Chosen Option</label>
                  <Input
                    placeholder="What did you choose?"
                    value={chosenOption}
                    onChange={(e) => setChosenOption(e.target.value)}
                    className="rounded-lg h-9"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Reasoning</label>
                  <Textarea
                    placeholder="Why did you make this choice?"
                    value={reasoning}
                    onChange={(e) => setReasoning(e.target.value)}
                    className="rounded-lg resize-none text-sm"
                    rows={2}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Expected Outcome</label>
                  <Textarea
                    placeholder="What do you expect to happen?"
                    value={expectedOutcome}
                    onChange={(e) => setExpectedOutcome(e.target.value)}
                    className="rounded-lg resize-none text-sm"
                    rows={2}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Actual Outcome (optional)</label>
                  <Textarea
                    placeholder="What actually happened?"
                    value={actualOutcome}
                    onChange={(e) => setActualOutcome(e.target.value)}
                    className="rounded-lg resize-none text-sm"
                    rows={2}
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Lessons Learned (optional)</label>
                  <Textarea
                    placeholder="What did you learn?"
                    value={lessonsLearned}
                    onChange={(e) => setLessonsLearned(e.target.value)}
                    className="rounded-lg resize-none text-sm"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!decisionTitle.trim() || !chosenOption.trim()}
                  className="flex-1 rounded-lg h-9"
                >
                  {editingId ? "Update" : "Save"} Decision
                </Button>
                {editingId && (
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="rounded-lg h-9"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div className="px-4 mt-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground text-sm py-12">Loading...</div>
        ) : decisions.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-12">
            No decisions tracked yet. Click the + button to start your decision journal.
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-purple-500/20" />

            {/* Timeline items */}
            <div className="space-y-6">
              {decisions.map((decision, index) => (
                <div key={decision.id} className="relative pl-12">
                  {/* Timeline node */}
                  <div className="absolute left-0 top-2 w-10 h-10 rounded-full bg-purple-500/10 border-2 border-purple-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                  </div>

                  {/* Decision card */}
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-purple-500/40 transition-colors">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border bg-muted/30">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-purple-500">
                              {new Date(decision.decision_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <h3 className="font-semibold text-base mb-1">{decision.decision_title}</h3>
                          <div className="flex items-center gap-1.5 text-sm">
                            <span className="text-muted-foreground">Chose:</span>
                            <span className="font-medium text-purple-600 dark:text-purple-400">{decision.chosen_option}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            onClick={() => handleEdit(decision)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-lg"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(decision.id)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                      {/* Reasoning */}
                      {decision.reasoning && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1.5">Reasoning</div>
                          <p className="text-sm text-foreground/90 leading-relaxed">{decision.reasoning}</p>
                        </div>
                      )}

                      {/* Expected vs Actual Outcomes */}
                      {(decision.expected_outcome || decision.actual_outcome) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Expected Outcome */}
                          {decision.expected_outcome && (
                            <div className="bg-purple-500/5 rounded-lg p-3 border border-purple-500/20">
                              <div className="flex items-center gap-1.5 mb-2">
                                <div className="text-xs font-medium text-purple-600 dark:text-purple-400">Expected Outcome</div>
                              </div>
                              <p className="text-sm text-foreground/80 leading-relaxed">{decision.expected_outcome}</p>
                            </div>
                          )}

                          {/* Actual Outcome */}
                          {decision.actual_outcome && (
                            <div className="bg-muted/50 rounded-lg p-3 border border-border">
                              <div className="flex items-center gap-1.5 mb-2">
                                <ArrowRight className="w-3 h-3 text-purple-500" />
                                <div className="text-xs font-medium text-purple-600 dark:text-purple-400">Actual Outcome</div>
                              </div>
                              <p className="text-sm text-foreground/80 leading-relaxed">{decision.actual_outcome}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Lessons Learned */}
                      {decision.lessons_learned && (
                        <div className="bg-purple-500/5 rounded-lg p-3 border border-purple-500/20">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Lightbulb className="w-3.5 h-3.5 text-purple-500" />
                            <div className="text-xs font-medium text-purple-600 dark:text-purple-400">Lessons Learned</div>
                          </div>
                          <p className="text-sm text-foreground/90 leading-relaxed font-medium">{decision.lessons_learned}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8 leading-relaxed px-4">
        Track major decisions to improve future judgment and inform your weekly Purpose dimension score.
      </p>
    </div>
  );
}
