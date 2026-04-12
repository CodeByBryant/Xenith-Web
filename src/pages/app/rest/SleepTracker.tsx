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

  // Store as minutes from midnight (0-1440)
  const [bedtimeMinutes, setBedtimeMinutes] = useState(1320); // 10 PM default
  const [wakeMinutes, setWakeMinutes] = useState(420); // 7 AM default
  const [quality, setQuality] = useState<number | null>(null);
  const [caffeine, setCaffeine] = useState(false);
  const [screenTime, setScreenTime] = useState(false);
  const [exercised, setExercised] = useState(false);
  const [stressed, setStressed] = useState(false);
  const [notes, setNotes] = useState("");

  // Convert minutes to HH:MM format
  const minutesToTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  // Convert HH:MM to minutes
  const timeToMinutes = (time: string) => {
    const [hrs, mins] = time.split(":").map(Number);
    return hrs * 60 + mins;
  };

  // Calculate hours slept
  const calculateHours = () => {
    let duration = wakeMinutes - bedtimeMinutes;
    if (duration < 0) duration += 1440; // Next day
    return duration / 60;
  };

  const hoursSlept = calculateHours();

  // Load existing log data
  useEffect(() => {
    const log = logs.find((l) => l.date === dateStr);
    if (log) {
      if (log.bedtime) setBedtimeMinutes(timeToMinutes(log.bedtime));
      if (log.wake_time) setWakeMinutes(timeToMinutes(log.wake_time));
      setQuality(log.quality_rating);
      setCaffeine(log.caffeine_consumed);
      setScreenTime(log.screen_time_before_bed);
      setExercised(log.exercised_today);
      setStressed(log.stressed);
      setNotes(log.notes || "");
    } else {
      setBedtimeMinutes(1320); // 10 PM
      setWakeMinutes(420); // 7 AM
      setQuality(null);
      setCaffeine(false);
      setScreenTime(false);
      setExercised(false);
      setStressed(false);
      setNotes("");
    }
  }, [dateStr, logs]);

  const handleSave = async () => {
    if (!quality) {
      toast.error("Please rate your sleep quality");
      return;
    }

    await upsert.mutateAsync({
      date: dateStr,
      bedtime: minutesToTime(bedtimeMinutes),
      wake_time: minutesToTime(wakeMinutes),
      hours_slept: hoursSlept,
      quality_rating: quality,
      caffeine_consumed: caffeine,
      screen_time_before_bed: screenTime,
      exercised_today: exercised,
      stressed,
      notes,
    });
    toast.success("Sleep log saved!");
  };

  const handleDelete = async () => {
    if (!existingLog) return;
    await remove.mutateAsync(existingLog.id);
    toast.success("Sleep log deleted");
  };

  const stats = useMemo(() => {
    const last7 = logs.slice(0, 7);
    const avgHours = last7.filter((l) => l.hours_slept).length
      ? (
          last7.reduce((sum, l) => sum + (l.hours_slept || 0), 0) /
          last7.filter((l) => l.hours_slept).length
        ).toFixed(1)
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
      <div className="bg-card border border-border sticky top-0 z-10 rounded-2xl mx-4 mt-4 shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-indigo-500/10">
              <Moon className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Sleep Tracker</h1>
              <p className="text-xs text-muted-foreground">Track your rest & recovery</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
            <span className="font-medium">{stats.logged}/7 logged</span>
            <span className="text-muted-foreground/50">·</span>
            <span>{stats.avgHours} hrs avg</span>
            <span className="text-muted-foreground/50">·</span>
            <span>{stats.avgQuality}/5 quality</span>
          </div>
        </div>

        {/* Date navigation */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <button
            onClick={() => setDate((d) => offsetDate(d, -1))}
            className="p-2.5 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold bg-secondary/50 px-4 py-1.5 rounded-full">{formatDate(date)}</span>
          <button
            onClick={() => setDate((d) => offsetDate(d, 1))}
            disabled={isToday}
            className="p-2.5 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Circular Sleep Clock */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex flex-col items-center">
            {/* SVG Circle */}
            <div className="relative w-64 h-64">
              <svg className="w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="sleepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                {/* Background circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-secondary"
                />
                {/* Progress arc */}
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  fill="none"
                  stroke="url(#sleepGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(hoursSlept / 12) * 628} 628`}
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold">{hoursSlept.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">hours</div>
              </div>
            </div>

            {/* Time Labels */}
            <div className="w-full mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                <span className="font-medium">{minutesToTime(bedtimeMinutes)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="font-medium">{minutesToTime(wakeMinutes)}</span>
              </div>
            </div>

            {/* Sliders */}
            <div className="w-full mt-6 space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5" />
                  Bedtime
                </label>
                <input
                  type="range"
                  min="0"
                  max="1440"
                  step="15"
                  value={bedtimeMinutes}
                  onChange={(e) => setBedtimeMinutes(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5" />
                  Wake time
                </label>
                <input
                  type="range"
                  min="0"
                  max="1440"
                  step="15"
                  value={wakeMinutes}
                  onChange={(e) => setWakeMinutes(Number(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quality & Factors */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
          {/* Quality stars */}
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-2 block">Sleep Quality</label>
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
                      "w-8 h-8 transition-colors",
                      quality && rating <= quality
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-transparent text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Factors */}
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-2 block">Factors</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCaffeine(!caffeine)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                  caffeine
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-secondary/50 border-border text-muted-foreground"
                )}
              >
                <Coffee className="w-4 h-4" />
                <span className="text-sm font-medium">Caffeine</span>
              </button>
              <button
                onClick={() => setScreenTime(!screenTime)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                  screenTime
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-secondary/50 border-border text-muted-foreground"
                )}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-medium">Screen</span>
              </button>
              <button
                onClick={() => setExercised(!exercised)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                  exercised
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-secondary/50 border-border text-muted-foreground"
                )}
              >
                <Dumbbell className="w-4 h-4" />
                <span className="text-sm font-medium">Exercise</span>
              </button>
              <button
                onClick={() => setStressed(!stressed)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                  stressed
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-secondary/50 border-border text-muted-foreground"
                )}
              >
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Stressed</span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-2 block">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did you feel?"
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 rounded-xl"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
          {existingLog && (
            <Button
              variant="outline"
              onClick={handleDelete}
              className="rounded-xl"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
