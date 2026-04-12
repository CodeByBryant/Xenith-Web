import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  Clock,
  Volume2,
  VolumeX,
  Volume1,
  CloudRain,
  Music,
  type LucideIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useFocusSessions } from "@/hooks/use-focus-sessions";
import { useFocusTimer } from "@/context/FocusTimerContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { focusAudioPlayer, type AudioType } from "@/lib/focus-audio";
import {
  getFocusDurationMinutes,
  isFocusSessionCompleted,
} from "@/lib/focus-metrics";

const PRESETS = [
  { label: "25 min", minutes: 25 },
  { label: "45 min", minutes: 45 },
  { label: "90 min", minutes: 90 },
];

const ENERGY_LABELS: Record<number, string> = {
  1: "Depleted",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Peak",
};

const AUDIO_OPTIONS: { value: AudioType; label: string; icon: LucideIcon }[] = [
  { value: "none", label: "None", icon: VolumeX },
  { value: "white-noise", label: "White Noise", icon: Volume2 },
  { value: "brown-noise", label: "Brown Noise", icon: Volume1 },
  { value: "rain", label: "Rain", icon: CloudRain },
  { value: "lofi", label: "Lo-fi", icon: Music },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function fmtTime(secs: number) {
  return `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Focus() {
  const { sessions, start, complete, totalMinutesToday } = useFocusSessions();
  const {
    preset,
    setPreset,
    energy,
    setEnergy,
    step,
    sessionId,
    remaining,
    paused,
    setPaused,
    beginRun,
    markDone,
    resetTimer,
    totalDuration,
  } = useFocusTimer();

  const [audioType, setAudioType] = useState<AudioType>("none");
  const [showAudioPicker, setShowAudioPicker] = useState(false);

  const handleStart = async () => {
    if (!energy) return toast.error("Select your energy level first.");
    try {
      const s = await start({
        duration_minutes: preset,
        energy_before: energy,
      });
      beginRun(s.id);
      setShowAudioPicker(false);
      // Start audio if selected
      if (audioType !== "none") {
        focusAudioPlayer.play(audioType, 0.3);
      }
    } catch {
      toast.error("Could not start session.");
    }
  };

  const handleComplete = async () => {
    if (sessionId) await complete(sessionId).catch(() => {});
    markDone();
    focusAudioPlayer.stop();
    toast.success("Session complete. Great work.");
  };

  const handleAudioChange = (type: AudioType) => {
    setAudioType(type);
    if (step === "running") {
      if (type === "none") {
        focusAudioPlayer.stop();
      } else {
        focusAudioPlayer.play(type, 0.3);
      }
    }
    setShowAudioPicker(false);
  };

  const handleReset = () => {
    focusAudioPlayer.stop();
    resetTimer();
  };

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      focusAudioPlayer.stop();
    };
  }, []);

  // Auto-complete session when timer reaches zero
  useEffect(() => {
    if (step === "done" && sessionId) {
      complete(sessionId).catch(() => {});
      focusAudioPlayer.stop();
      toast.success("Focus session complete!");
    }
  }, [step, sessionId, complete]);

  const pct = totalDuration > 0 ? 1 - remaining / totalDuration : 0;
  const r = 88;
  const circ = 2 * Math.PI * r;
  const completedSessions = sessions.filter((session) =>
    isFocusSessionCompleted(session),
  );

  return (
    <div className="max-w-sm mx-auto">
      <Helmet>
        <title>Focus Timer | Xenith</title>
      </Helmet>
      <AnimatePresence mode="wait">
        {step === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div>
              <p className="text-xs text-muted-foreground mb-2">Duration</p>
              <div className="flex gap-2">
                {PRESETS.map(({ label, minutes }) => (
                  <button
                    key={minutes}
                    onClick={() => setPreset(minutes)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all",
                      preset === minutes
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Energy right now
              </p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((e) => (
                  <button
                    key={e}
                    onClick={() => setEnergy(e)}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all",
                      energy === e
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/30",
                    )}
                  >
                    {e}
                  </button>
                ))}
              </div>
              {energy && (
                <p className="text-xs text-muted-foreground mt-1.5 text-center">
                  {ENERGY_LABELS[energy]}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Background Audio
              </p>
              <div className="relative">
                <button
                  onClick={() => setShowAudioPicker(!showAudioPicker)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border hover:border-foreground/30 transition-all"
                >
                  <span className="text-sm text-foreground flex items-center gap-2">
                    {(() => {
                      const Icon =
                        AUDIO_OPTIONS.find((a) => a.value === audioType)
                          ?.icon || VolumeX;
                      return <Icon className="w-4 h-4" />;
                    })()}
                    {AUDIO_OPTIONS.find((a) => a.value === audioType)?.label}
                  </span>
                  {audioType === "none" ? (
                    <VolumeX className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {showAudioPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl overflow-hidden shadow-lg z-10"
                    >
                      {AUDIO_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleAudioChange(option.value)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-secondary transition-colors",
                              audioType === option.value && "bg-secondary",
                            )}
                          >
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <Button onClick={handleStart} className="w-full" disabled={!energy}>
              <Play className="w-4 h-4 mr-2" /> Start {preset}-minute session
            </Button>
            {totalMinutesToday > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                {totalMinutesToday} minutes focused today
              </p>
            )}
          </motion.div>
        )}

        {(step === "running" || step === "done") && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <svg width={200} height={200} className="-rotate-90">
                <circle
                  cx={100}
                  cy={100}
                  r={r}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth={6}
                />
                <circle
                  cx={100}
                  cy={100}
                  r={r}
                  fill="none"
                  stroke="hsl(var(--foreground))"
                  strokeWidth={6}
                  strokeDasharray={circ}
                  strokeDashoffset={circ * (1 - pct)}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-mono font-semibold text-foreground tabular-nums">
                  {fmtTime(remaining)}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {step === "done"
                    ? "Complete"
                    : paused
                      ? "Paused"
                      : "Focusing"}
                </span>
              </div>
            </div>

            {step === "running" ? (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPaused((p) => !p)}
                >
                  {paused ? (
                    <Play className="w-4 h-4" />
                  ) : (
                    <Pause className="w-4 h-4" />
                  )}
                </Button>
                <Button onClick={handleComplete}>
                  <Check className="w-4 h-4 mr-2" /> Done early
                </Button>
                <Button variant="outline" size="icon" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={handleReset}>Start another session</Button>
            )}

            {/* Audio control during session */}
            {step === "running" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {audioType !== "none" ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>
                      Playing:{" "}
                      {AUDIO_OPTIONS.find((a) => a.value === audioType)?.label}
                    </span>
                    <button
                      onClick={() => handleAudioChange("none")}
                      className="ml-2 text-foreground hover:text-muted-foreground underline"
                    >
                      Stop
                    </button>
                  </>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setShowAudioPicker((prev) => !prev)}
                      className="text-foreground hover:text-muted-foreground underline"
                    >
                      Add background audio
                    </button>
                    <AnimatePresence>
                      {showAudioPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="absolute left-1/2 top-full mt-2 w-48 -translate-x-1/2 rounded-xl border border-border bg-card shadow-lg z-20"
                        >
                          {AUDIO_OPTIONS.filter(
                            (option) => option.value !== "none",
                          ).map((option) => {
                            const Icon = option.icon;
                            return (
                              <button
                                key={option.value}
                                onClick={() => handleAudioChange(option.value)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-secondary transition-colors"
                              >
                                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-foreground">
                                  {option.label}
                                </span>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {completedSessions.length > 0 && (
        <div className="mt-8 space-y-1.5">
          <p className="text-xs text-muted-foreground mb-2">Recent sessions</p>
          {completedSessions.slice(0, 5).map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 px-3 py-2 rounded-xl border border-border"
            >
              <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-sm flex-1">
                {getFocusDurationMinutes(s)} min
              </span>
              <span className="text-xs text-muted-foreground">
                {fmtDate(s.started_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
