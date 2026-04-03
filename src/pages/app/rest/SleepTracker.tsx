import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  Coffee,
  Smartphone,
  Dumbbell,
  AlertCircle,
  Star,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useSleepLogs } from "@/hooks/use-sleep-logs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
  const yesterday = toDateStr(offsetDate(new Date(), -1));
  if (dateStr === yesterday) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" });
}

export default function SleepTracker() {
  const [date, setDate] = useState(new Date());
  const { logs = [], isLoading, upsert, remove, isSaving } = useSleepLogs(30);

  const dateStr = toDateStr(date);
  const isToday = dateStr === toDateStr();
  const existingLog = logs.find((l) => l.date === dateStr);

  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [hours, setHours] = useState("");
  const [quality, setQuality] = useState<number | null>(null);
  const [caffeine, setCaffeine] = useState(false);
  const [screenTime, setScreenTime] = useState(false);
  const [exercised, setExercised] = useState(false);
  const [stressed, setStressed] = useState(false);
  const [notes, setNotes] = useState("");

  // Update form when date changes (but not when logs update during save)
  useEffect(() => {
    const log = logs.find((l) => l.date === dateStr);
    if (log) {
      setBedtime(log.bedtime || "");
      setWakeTime(log.wake_time || "");
      setHours(log.hours_slept?.toString() || "");
      setQuality(log.quality_rating);
      setCaffeine(log.caffeine_consumed);
      setScreenTime(log.screen_time_before_bed);
      setExercised(log.exercised_today);
      setStressed(log.stressed);
      setNotes(log.notes || "");
    } else {
      setBedtime("");
      setWakeTime("");
      setHours("");
      setQuality(null);
      setCaffeine(false);
      setScreenTime(false);
      setExercised(false);
      setStressed(false);
      setNotes("");
    }
  }, [dateStr]); // Only run when date changes, not when logs change

  const handleSave = async () => {
    try {
      await upsert({
        date: dateStr,
        bedtime: bedtime || undefined,
        wake_time: wakeTime || undefined,
        hours_slept: parseFloat(hours) || undefined,
        quality_rating: quality || undefined,
        caffeine_consumed: caffeine,
        screen_time_before_bed: screenTime,
        exercised_today: exercised,
        stressed: stressed,
        notes: notes || undefined,
      });
      toast.success("Sleep log saved");
    } catch {
      toast.error("Failed to save");
    }
  };

  const stats = useMemo(() => {
    const last7 = logs.filter((l) => {
      const daysAgo = Math.floor((Date.now() - new Date(l.date).getTime()) / 86400000);
      return daysAgo < 7 && l.hours_slept;
    });
    const avgHours = last7.length
      ? (last7.reduce((sum, l) => sum + (l.hours_slept || 0), 0) / last7.length).toFixed(1)
      : "—";
    const avgQuality = last7.filter((l) => l.quality_rating).length
      ? (
          last7.reduce((sum, l) => sum + (l.quality_rating || 0), 0) /
          last7.filter((l) => l.quality_rating).length
        ).toFixed(1)
      : "—";
    return { avgHours, avgQuality, logged: last7.length };
  }, [logs]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">Sleep Tracker</h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{stats.logged}/7 logged</span>
            <span>·</span>
            <span>{stats.avgHours} hrs avg</span>
            <span>·</span>
            <span>{stats.avgQuality}/5 quality</span>
          </div>
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

      {/* Log form */}
      <div className="p-4 space-y-6">
        {/* Circular Hours Display */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Circular Progress for Hours */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-secondary"
                />
                {/* Progress circle */}
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(parseFloat(hours) || 0) * 36.96} 552.92`}
                  className="text-primary transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold">{hours || "0"}</p>
                <p className="text-sm text-muted-foreground">hours slept</p>
              </div>
            </div>

            {/* Hours slider */}
            <div className="w-full space-y-2">
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={hours || 0}
                onChange={(e) => setHours(e.target.value)}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0h</span>
                <span>6h</span>
                <span>12h</span>
              </div>
            </div>

            {/* Time inputs - Compact */}
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Moon className="w-3 h-3" />
                  Bedtime
                </label>
                <Input
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="text-center"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Sun className="w-3 h-3" />
                  Wake
                </label>
                <Input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="text-center"
                />
              </div>
            </div>

            {/* Quality stars */}
            <div className="w-full space-y-2">
              <label className="text-xs text-muted-foreground font-medium">Quality</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setQuality(quality === rating ? null : rating)}
                    className="transition-all hover:scale-110"
                  >
                    <Star
                      className={cn(
                        "w-8 h-8",
                        quality && rating <= quality
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Factors - Compact */}
            <div className="w-full space-y-2">
              <label className="text-xs text-muted-foreground font-medium">Factors</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCaffeine(!caffeine)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    caffeine
                      ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  Caffeine
                </button>
                <button
                  type="button"
                  onClick={() => setScreenTime(!screenTime)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    screenTime
                      ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Screen
                </button>
                <button
                  type="button"
                  onClick={() => setExercised(!exercised)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    exercised
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  Exercise
                </button>
                <button
                  type="button"
                  onClick={() => setStressed(!stressed)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    stressed
                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Stress
                </button>
              </div>
            </div>

            {/* Save button */}
            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Log"
              )}
            </Button>
          </div>
        </div>

        {/* Recent logs */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold px-1">Recent Logs</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No sleep logs yet. Start tracking above.
            </p>
          ) : (
            <AnimatePresence>
              {logs.slice(0, 7).map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-card border border-border rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">
                          {new Date(log.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            weekday: "short",
                          })}
                        </p>
                        {log.quality_rating && (
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: log.quality_rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 fill-yellow-500 text-yellow-500"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {log.hours_slept && <span>{log.hours_slept} hrs</span>}
                        {log.bedtime && (
                          <span className="flex items-center gap-1">
                            <Moon className="w-3 h-3" />
                            {log.bedtime}
                          </span>
                        )}
                        {log.wake_time && (
                          <span className="flex items-center gap-1">
                            <Sun className="w-3 h-3" />
                            {log.wake_time}
                          </span>
                        )}
                      </div>
                      {(log.caffeine_consumed || log.screen_time_before_bed || log.exercised_today || log.stressed) && (
                        <div className="flex items-center gap-1.5 mt-2">
                          {log.caffeine_consumed && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/10 text-orange-500">
                              Caffeine
                            </span>
                          )}
                          {log.screen_time_before_bed && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-500">
                              Screen
                            </span>
                          )}
                          {log.exercised_today && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-500">
                              Exercise
                            </span>
                          )}
                          {log.stressed && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-500">
                              Stress
                            </span>
                          )}
                        </div>
                      )}
                      {log.notes && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {log.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setDate(new Date(log.date));
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
