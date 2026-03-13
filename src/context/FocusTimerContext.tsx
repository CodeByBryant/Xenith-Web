import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type TimerStep = "setup" | "running" | "done";

interface FocusTimerCtx {
  preset: number;
  setPreset: (n: number) => void;
  energy: number | null;
  setEnergy: (n: number | null) => void;
  step: TimerStep;
  sessionId: string | null;
  remaining: number;
  paused: boolean;
  setPaused: (p: boolean | ((prev: boolean) => boolean)) => void;
  beginRun: (sessionId: string) => void;
  markDone: () => void;
  resetTimer: () => void;
  totalDuration: number; // preset * 60 — used for ring progress
}

const Ctx = createContext<FocusTimerCtx | null>(null);

export function FocusTimerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preset, setPresetState] = useState(25);
  const [energy, setEnergy] = useState<number | null>(null);
  const [step, setStep] = useState<TimerStep>("setup");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(25 * 60);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  // Keep remaining in sync when preset changes — only during setup
  const setPreset = useCallback(
    (n: number) => {
      setPresetState(n);
      if (step === "setup") setRemaining(n * 60);
    },
    [step],
  );

  // Tick every second while running and not paused
  useEffect(() => {
    if (step !== "running" || paused) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearTimer();
          setStep("done");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return clearTimer;
  }, [step, paused, clearTimer]);

  const beginRun = useCallback(
    (id: string) => {
      setSessionId(id);
      setRemaining(preset * 60);
      setStep("running");
      setPaused(false);
    },
    [preset],
  );

  const markDone = useCallback(() => {
    clearTimer();
    setStep("done");
  }, [clearTimer]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setSessionId(null);
    setRemaining(preset * 60);
    setStep("setup");
    setPaused(false);
  }, [clearTimer, preset]);

  return (
    <Ctx.Provider
      value={{
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
        totalDuration: preset * 60,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useFocusTimer() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useFocusTimer must be used within FocusTimerProvider");
  return ctx;
}
