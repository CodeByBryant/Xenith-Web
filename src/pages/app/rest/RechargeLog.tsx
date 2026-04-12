import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, X, Trash2, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRechargeActivities } from "@/hooks/use-recharge-activities";
import type { RechargeActivity } from "@/lib/types";
import { toast } from "sonner";

const ACTIVITY_TYPES = ["Meditation", "Walk", "Hobby", "Social", "Reading", "Other"];

export default function RechargeLog() {
  const [showAdd, setShowAdd] = useState(false);
  
  // Form state
  const [activityType, setActivityType] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [feelingBefore, setFeelingBefore] = useState<number | null>(null);
  const [feelingAfter, setFeelingAfter] = useState<number | null>(null);

  const { activities, isLoading, add, remove } = useRechargeActivities();

  const resetForm = () => {
    setActivityType("");
    setDurationMinutes("");
    setFeelingBefore(null);
    setFeelingAfter(null);
  };

  const handleSubmit = async () => {
    if (!activityType || !durationMinutes || feelingBefore === null || feelingAfter === null) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await add({
        activity_type: activityType,
        duration_minutes: parseInt(durationMinutes),
        feeling_before: feelingBefore,
        feeling_after: feelingAfter,
      });
      toast.success("Activity logged");
      resetForm();
      setShowAdd(false);
    } catch (error) {
      toast.error("Failed to add activity");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success("Activity deleted");
    } catch (error) {
      toast.error("Failed to delete activity");
    }
  };

  const getImpact = (before: number, after: number) => {
    const diff = after - before;
    if (diff > 0) return { text: `+${diff}`, color: "text-green-600", bg: "bg-green-50", darkBg: "dark:bg-green-950/30" };
    if (diff < 0) return { text: `${diff}`, color: "text-red-600", bg: "bg-red-50", darkBg: "dark:bg-red-950/30" };
    return { text: "0", color: "text-gray-600", bg: "bg-gray-50", darkBg: "dark:bg-gray-800/30" };
  };

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      meditation: "🧘",
      walk: "🚶",
      hobby: "🎨",
      social: "👥",
      reading: "📚",
      other: "✨",
    };
    return icons[type.toLowerCase()] || "✨";
  };

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="bg-card border border-border sticky top-0 z-10 rounded-2xl mx-4 mt-4 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-500" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Recharge Log</h1>
              <p className="text-xs text-muted-foreground">Track non-sleep rest activities</p>
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
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Activity Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {ACTIVITY_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setActivityType(type.toLowerCase())}
                      className={cn(
                        "px-3 py-2 rounded-xl text-xs font-medium transition-all border",
                        activityType === type.toLowerCase()
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary/50 border-border hover:border-primary/40"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Duration (minutes)</label>
                <Input
                  type="number"
                  placeholder="30"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="rounded-xl max-w-xs"
                  min="1"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                  Feeling Before (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFeelingBefore(level)}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-medium transition-all border",
                        feelingBefore === level
                          ? "bg-teal-500 text-white border-teal-500"
                          : "bg-secondary/50 border-border hover:border-teal-500/40"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                  Feeling After (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFeelingAfter(level)}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-sm font-medium transition-all border",
                        feelingAfter === level
                          ? "bg-teal-500 text-white border-teal-500"
                          : "bg-secondary/50 border-border hover:border-teal-500/40"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!activityType || !durationMinutes || feelingBefore === null || feelingAfter === null}
                className="w-full rounded-xl"
              >
                Add Activity
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activities Grid */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center text-muted-foreground text-sm py-8">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            No activities yet. Start tracking your recharge habits!
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activities.map((activity) => {
              const impact = getImpact(activity.feeling_before || 0, activity.feeling_after || 0);
              const icon = getActivityIcon(activity.activity_type);
              
              return (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-teal-500/40 transition-all hover:shadow-md group"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-teal-50/50 dark:bg-teal-950/20 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-lg">
                        {icon}
                      </div>
                      <div>
                        <div className="text-sm font-semibold capitalize text-teal-900 dark:text-teal-100">
                          {activity.activity_type}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{activity.duration_minutes || 0} min</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(activity.id)}
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Before → After Visualization */}
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      {/* Before */}
                      <div className="flex-1 text-center">
                        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          Before
                        </div>
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                            {activity.feeling_before || 0}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1.5">/ 5</div>
                      </div>

                      {/* Arrow with Impact */}
                      <div className="flex flex-col items-center gap-1">
                        <ArrowRight className="w-6 h-6 text-teal-500" strokeWidth={2.5} />
                        <div className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-bold",
                          impact.bg,
                          impact.darkBg,
                          impact.color
                        )}>
                          {impact.text}
                        </div>
                      </div>

                      {/* After */}
                      <div className="flex-1 text-center">
                        <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
                          After
                        </div>
                        <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 dark:bg-teal-950/40 border-2 border-teal-500 flex items-center justify-center">
                          <span className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                            {activity.feeling_after || 0}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-1.5">/ 5</div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="mt-4 pt-3 border-t border-border/50 text-center">
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(activity.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-8 leading-relaxed px-4">
        Pro tip — use this tool to inform your weekly Rest dimension score.
        Consistent logging here should reflect in a higher self-rating.
      </p>
    </div>
  );
}
