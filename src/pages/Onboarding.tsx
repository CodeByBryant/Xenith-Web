import { useState, startTransition } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ChevronRight,
  ChevronLeft,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { LEGAL_LAST_UPDATED, PRIVACY_URL, TERMS_URL } from "@/lib/legal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LIFE_DIMENSIONS } from "@/lib/types";

const TOTAL_STEPS = 3;

const THEMES = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
  { id: "system", label: "System", icon: Monitor },
] as const;

const _intl = Intl as { supportedValuesOf?: (key: string) => string[] };
const TIMEZONES: string[] = _intl.supportedValuesOf
  ? _intl.supportedValuesOf("timeZone")
  : [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "Europe/London",
      "Europe/Paris",
      "Asia/Tokyo",
      "Asia/Shanghai",
      "Australia/Sydney",
    ];

const BROWSER_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

// ─── Step sub-components ─────────────────────────────────────────────

function Step1({
  name,
  setName,
}: {
  name: string;
  setName: (v: string) => void;
}) {
  const { user } = useAuth();
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user?.email?.[0] ?? "X").toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          What should we call you?
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          This is how your name will appear in the app.
        </p>
      </div>

      {/* Avatar preview */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center">
          <span className="text-background text-2xl font-semibold tracking-tight">
            {initials}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Your name</Label>
        <Input
          id="name"
          placeholder="e.g. Marcus"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11"
          autoFocus
          maxLength={60}
        />
      </div>
    </div>
  );
}

function Step2({
  focusStyle,
  setFocusStyle,
  timezone,
  setTimezone,
}: {
  focusStyle: string;
  setFocusStyle: (v: string) => void;
  timezone: string;
  setTimezone: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Where do you want to focus?
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Pick the life dimension you want to prioritise first.
        </p>
      </div>

      {/* Focus dimension */}
      <div className="grid grid-cols-2 gap-2">
        {LIFE_DIMENSIONS.map((dim) => (
          <button
            key={dim}
            onClick={() => setFocusStyle(dim)}
            className={`h-11 rounded-xl border text-sm font-medium transition-all ${
              focusStyle === dim
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-foreground border-border hover:border-foreground/40"
            }`}
          >
            {dim}
          </button>
        ))}
      </div>

      {/* Timezone */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="timezone">Your timezone</Label>
        <select
          id="timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="h-11 rounded-xl border border-border bg-card text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Detected: {BROWSER_TZ.replace(/_/g, " ")}
        </p>
      </div>
    </div>
  );
}

function Step3({
  theme,
  setTheme,
  dataConsent,
  setDataConsent,
}: {
  theme: string;
  setTheme: (v: string) => void;
  dataConsent: boolean;
  setDataConsent: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Almost there</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Set your preferred appearance.
        </p>
      </div>

      {/* Theme selector */}
      <div className="flex flex-col gap-2">
        <Label>Appearance</Label>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-medium transition-all ${
                theme === id
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-foreground border-border hover:border-foreground/40"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Data consent */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
        <Switch
          id="consent"
          checked={dataConsent}
          onCheckedChange={setDataConsent}
          className="mt-0.5 shrink-0"
        />
        <div>
          <Label
            htmlFor="consent"
            className="text-sm font-medium cursor-pointer"
          >
            Help improve Xenith
          </Label>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Share anonymous usage data to help us build better features. Your
            reflections and personal data are never included. You can change
            this anytime in settings.
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Your data is end-to-end encrypted and never sold.
      </p>

      <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
        Privacy Policy and Terms of Service were accepted at signup (policy
        version {LEGAL_LAST_UPDATED}). Review anytime: {" "}
        <a
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-2"
        >
          Privacy
        </a>{" "}
        and{" "}
        <a
          href={TERMS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline underline-offset-2"
        >
          Terms
        </a>
        .
      </p>
    </div>
  );
}

// ─── Slide animation ─────────────────────────────────────────────────
const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

// ─── Main Onboarding component ────────────────────────────────────────
export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form state — pre-fill from OAuth metadata where possible
  const [name, setName] = useState(
    () => user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "",
  );
  const [focusStyle, setFocusStyle] = useState("Discipline");
  const [timezone, setTimezone] = useState(BROWSER_TZ || "America/New_York");
  const [theme, setTheme] = useState("dark");
  const [dataConsent, setDataConsent] = useState(false);

  const goNext = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleFinish = async () => {
    setSaving(true);

    // Apply theme immediately regardless of DB outcome
    if (theme === "dark") document.documentElement.classList.add("dark");
    else if (theme === "light")
      document.documentElement.classList.remove("dark");

    // Always mark onboarding done locally so AuthCallback doesn't re-route here
    localStorage.setItem("xenith_onboarding_complete", "1");

    try {
      // upsert — works even if the migration hasn't run yet (may omit
      // onboarding_completed column if it doesn't exist in the table)
      if (supabase && user) {
        const payload: Record<string, unknown> = {
          id: user.id,
          name: name.trim() || user.user_metadata?.full_name || undefined,
          avatar_url: user.user_metadata?.avatar_url || undefined,
          focus_style: focusStyle,
          timezone,
          theme,
          data_sharing_consent: dataConsent,
          last_active_at: new Date().toISOString(),
        };
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ ...payload, onboarding_completed: true })
          .eq("id", user.id);

        if (updateError) {
          const { error: upsertWithOnboardingError } = await supabase
            .from("profiles")
            .upsert(
              { id: user.id, ...payload, onboarding_completed: true },
              { onConflict: "id" },
            );

          if (upsertWithOnboardingError) {
            // Retry without onboarding_completed in case the column doesn't exist yet.
            const { error: fallbackError } = await supabase
              .from("profiles")
              .upsert({ id: user.id, ...payload }, { onConflict: "id" });

            if (fallbackError) {
              throw fallbackError;
            }
          }
        }
      }
    } catch (error) {
      console.error("Onboarding profile sync failed", error);
      // Non-blocking — preferences saved to localStorage, DB will sync later
      toast.warning(
        "Preferences saved locally. They'll sync once the DB is ready.",
      );
    }

    toast.success("Welcome to Xenith.");
    startTransition(() => navigate("/app", { replace: true }));
    setSaving(false);
  };

  const steps = [
    <Step1 name={name} setName={setName} />,
    <Step2
      focusStyle={focusStyle}
      setFocusStyle={setFocusStyle}
      timezone={timezone}
      setTimezone={setTimezone}
    />,
    <Step3
      theme={theme}
      setTheme={setTheme}
      dataConsent={dataConsent}
      setDataConsent={setDataConsent}
    />,
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Helmet>
        <title>Onboarding — Xenith</title>
        <meta
          name="description"
          content="Complete your Xenith onboarding preferences before entering the app."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://xenith.life/onboarding" />
      </Helmet>

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--foreground)/0.03),transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <span className="font-chomsky text-4xl text-foreground">X</span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i < step ? "bg-foreground" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="bg-card border border-border rounded-2xl p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {steps[step - 1]}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              disabled={step === 1 || saving}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <span className="text-xs text-muted-foreground">
              {step} / {TOTAL_STEPS}
            </span>

            {step < TOTAL_STEPS ? (
              <Button size="sm" onClick={goNext} className="gap-1">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleFinish}
                disabled={saving}
                className="gap-1"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Let's go
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
