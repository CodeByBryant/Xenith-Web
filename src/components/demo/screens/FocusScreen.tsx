import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, Play, Pause, RotateCcw, Settings, Volume2 } from "lucide-react";
import { ScreenId } from "../BottomNav";
import { DEMO_COLORS } from "../tokens";

const durations = [15, 25, 45, 90];
const sounds = ["Silence", "Lo-fi", "Rain", "White Noise"];

interface FocusScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const FocusScreen = ({ onNavigate }: FocusScreenProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [selectedSound, setSelectedSound] = useState("Silence");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [energyRating, setEnergyRating] = useState(7);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setSessionComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = 1 - timeLeft / (selectedDuration * 60);
  const circumference = 2 * Math.PI * 110;

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
    setSessionComplete(false);
  };

  const selectDuration = (mins: number) => {
    setSelectedDuration(mins);
    setTimeLeft(mins * 60);
    setIsRunning(false);
    setSessionComplete(false);
  };

  if (sessionComplete) {
    return (
      <div className="h-full bg-demo-bg pt-14 pb-24 flex flex-col items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="font-chomsky text-6xl text-demo-fg mb-4">✓</div>
          <h2 className="text-xl font-serif text-demo-fg mb-2">Session Complete!</h2>
          <p className="text-sm text-demo-subtle mb-8">{selectedDuration} minutes of deep work</p>

          <div className="bg-demo-surface border border-demo-border rounded-xl p-4 mb-6 w-full max-w-xs">
            <p className="text-xs text-demo-subtle mb-3">How's your energy now?</p>
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <button
                  key={n}
                  onClick={() => setEnergyRating(n)}
                  className={`w-6 h-6 rounded-full text-xs font-medium transition-all ${
                    energyRating === n
                      ? "bg-demo-fg text-demo-bg"
                      : "bg-demo-border text-demo-subtle hover:bg-demo-elevated"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-demo-surface border border-demo-border rounded-xl p-4 mb-6 w-full max-w-xs">
            <p className="text-xs text-demo-subtle mb-2">Add a note (optional)</p>
            <input
              type="text"
              placeholder="How did it go?"
              className="w-full bg-demo-bg border border-demo-elevated rounded-lg px-3 py-2 text-sm text-demo-fg placeholder-demo-muted focus:outline-none focus:border-demo-fg"
            />
          </div>

          <button
            onClick={resetTimer}
            className="w-full max-w-xs bg-demo-fg text-demo-bg py-3 rounded-xl font-medium"
          >
            Done
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full bg-demo-bg pt-14 pb-24 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 pb-4 shrink-0"
      >
        <div className="flex items-center justify-between mb-1">
          <button onClick={() => onNavigate("dashboard")} className="text-demo-subtle">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-serif text-demo-fg">Focus Studio</h1>
          <Settings className="w-5 h-5 text-demo-subtle" />
        </div>
      </motion.div>

      {/* Timer Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 flex flex-col items-center justify-center px-5"
      >
        <div className="relative mb-8">
          <svg width="240" height="240" className="-rotate-90">
            <circle
              cx="120"
              cy="120"
              r="110"
              stroke={DEMO_COLORS.border}
              strokeWidth="4"
              fill="none"
            />
            <motion.circle
              cx="120"
              cy="120"
              r="110"
              stroke={DEMO_COLORS.fg}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - progress) }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-bold text-demo-fg">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-demo-subtle mt-1">
              {isRunning ? "Deep Work" : "Ready"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-16 h-16 bg-demo-fg rounded-full flex items-center justify-center text-demo-bg active:scale-95 transition-transform"
          >
            {isRunning ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-1" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className="w-12 h-12 bg-demo-border rounded-full flex items-center justify-center text-demo-fg active:scale-95 transition-transform"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Duration Selector */}
        <div className="flex gap-2 mb-4">
          {durations.map(mins => (
            <button
              key={mins}
              onClick={() => selectDuration(mins)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedDuration === mins
                  ? "bg-demo-fg text-demo-bg"
                  : "bg-demo-surface text-demo-subtle border border-demo-border"
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Sound Selector */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-demo-subtle" />
          <div className="flex gap-1">
            {sounds.map(sound => (
              <button
                key={sound}
                onClick={() => setSelectedSound(sound)}
                className={`px-3 py-1 rounded-lg text-xs transition-all ${
                  selectedSound === sound
                    ? "bg-demo-elevated text-demo-fg"
                    : "text-demo-subtle hover:text-demo-fg"
                }`}
              >
                {sound}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Today's Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-5 pb-4"
      >
        <div className="bg-demo-surface border border-demo-border rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-demo-subtle">
            <span>2 sessions today</span>
            <span>1h 15m total focus</span>
            <span>Energy: 7→8</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
