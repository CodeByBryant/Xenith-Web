import { useState, useEffect, startTransition } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  LEGAL_POLICY_VERSION,
  PRIVACY_URL,
  TERMS_URL,
} from "@/lib/legal";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const APP_URL = import.meta.env.VITE_APP_URL ?? window.location.origin;

// TODO: Enable Google OAuth — see comments in the commented-out oauthProviders block below
// TODO: Enable Apple OAuth — same

// ─── Password strength rules ─────────────────────────────────────────

interface StrengthRule {
  label: string;
  test: (p: string) => boolean;
}

const STRENGTH_RULES: StrengthRule[] = [
  { label: "At least 12 characters", test: (p) => p.length >= 12 },
  { label: "Uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { label: "Number (0–9)", test: (p) => /[0-9]/.test(p) },
  { label: "Symbol (!@#$%^&*…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password: string): number {
  return STRENGTH_RULES.filter((r) => r.test(password)).length;
}

const STRENGTH_LABELS = ["", "Weak", "Weak", "Fair", "Strong", "Very strong"];

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = getStrength(password);
  const filledBars = Math.ceil((score / 5) * 4);

  return (
    <div className="flex flex-col gap-2 mt-1">
      <div className="flex items-center gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < filledBars ? "bg-foreground" : "bg-border"
            }`}
          />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1 shrink-0">
          {STRENGTH_LABELS[score]}
        </span>
      </div>
      <div className="flex flex-col gap-0.5">
        {STRENGTH_RULES.map((rule) => {
          const met = rule.test(password);
          return (
            <div key={rule.label} className="flex items-center gap-1.5">
              {met ? (
                <Check className="w-3 h-3 text-foreground shrink-0" />
              ) : (
                <X className="w-3 h-3 text-muted-foreground/40 shrink-0" />
              )}
              <span
                className={`text-[11px] ${met ? "text-foreground" : "text-muted-foreground"}`}
              >
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "••••••••••••"}
        disabled={disabled}
        className="h-11 pr-10"
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────

type AuthMode = "signin" | "signup";
type SigninMethod = "password" | "magic";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 24 : -24, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -24 : 24, opacity: 0 }),
};

export default function SignIn() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location })?.from?.pathname ?? "/app";

  const [mode, setMode] = useState<AuthMode>("signin");
  const [signinMethod, setSigninMethod] = useState<SigninMethod>("password");
  const [modeDir, setModeDir] = useState(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) startTransition(() => navigate(from, { replace: true }));
  }, [session, navigate, from]);

  const switchMode = (next: AuthMode) => {
    setModeDir(next === "signup" ? 1 : -1);
    setMode(next);
    setPassword("");
    setConfirmPassword("");
    setAcceptedPrivacy(false);
    setAcceptedTerms(false);
    setEmailSent(false);
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase)
      return toast.error("Supabase is not configured.");
    if (!email.trim() || !password)
      return toast.error("Please fill in all fields.");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) toast.error(error.message);
  };

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase)
      return toast.error("Supabase is not configured.");
    if (!email.trim() || !password || !confirmPassword)
      return toast.error("Please fill in all fields.");
    if (getStrength(password) < 5)
      return toast.error("Please meet all password requirements.");
    if (password !== confirmPassword)
      return toast.error("Passwords don't match.");
    if (!acceptedPrivacy || !acceptedTerms)
      return toast.error("Please accept Privacy Policy and Terms to continue.");

    const acceptedAt = new Date().toISOString();

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${APP_URL}/auth/callback`,
        data: {
          privacy_accepted_at: acceptedAt,
          terms_accepted_at: acceptedAt,
          legal_policy_version: LEGAL_POLICY_VERSION,
        },
      },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      setEmailSent(true);
      toast.success("Account created — check your email to confirm.");
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase)
      return toast.error("Supabase is not configured.");
    if (!email.trim()) return toast.error("Please enter your email address.");

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${APP_URL}/auth/callback`,
        shouldCreateUser: false,
      },
    });
    setLoading(false);
    if (error) {
      const msg = error.message.toLowerCase();
      if (
        msg.includes("signup") ||
        msg.includes("not found") ||
        msg.includes("not allowed")
      ) {
        toast.error(
          "No account found for this email. Create an account with password first.",
        );
        return;
      }
      toast.error(error.message);
    } else {
      setEmailSent(true);
      toast.success("Magic link sent — check your inbox.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Helmet>
        <title>Sign In — Xenith</title>
        <meta
          name="description"
          content="Sign in to Xenith with your password or a one-time sign-in magic link for existing accounts."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://xenith.life/signin" />
      </Helmet>

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--foreground)/0.03),transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm relative"
      >
        {/* Logo */}
        <motion.a
          href="/"
          className="flex flex-col items-center gap-1 mb-10"
          whileHover={{ scale: 1.02 }}
        >
          <span className="font-chomsky text-5xl text-foreground leading-none">
            X
          </span>
          <span className="font-serif text-lg text-foreground tracking-wide">
            Xenith
          </span>
          <span className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">
            Discipline · Intention · Execution
          </span>
        </motion.a>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm overflow-hidden">
          {/* Mode tabs */}
          <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-8">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  mode === m
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" custom={modeDir}>
            <motion.div
              key={mode}
              custom={modeDir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {/* Email field shared across all modes */}
              <div className="flex flex-col gap-2 mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || emailSent}
                  className="h-11"
                  autoComplete="email"
                />
              </div>

              {mode === "signin" && (
                <>
                  {signinMethod === "password" ? (
                    <form
                      onSubmit={handlePasswordSignIn}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <button
                            type="button"
                            onClick={() => {
                              setSigninMethod("magic");
                              toast.info(
                                "Enter your email and send a magic link to reset your password.",
                              );
                            }}
                            className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <PasswordInput
                          id="password"
                          value={password}
                          onChange={setPassword}
                          disabled={loading}
                          autoComplete="current-password"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="h-11 font-medium mt-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    </form>
                  ) : emailSent ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-2"
                    >
                      <Mail className="w-8 h-8 text-foreground mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground">
                        Check your email
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Magic link sent to{" "}
                        <span className="text-foreground">{email}</span>
                      </p>
                      <button
                        onClick={() => setEmailSent(false)}
                        className="mt-4 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                      >
                        Use a different email
                      </button>
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={handleMagicLink}
                      className="flex flex-col gap-3"
                    >
                      <Button
                        type="submit"
                        className="h-11 font-medium"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Send magic link"
                        )}
                      </Button>
                    </form>
                  )}

                  <div className="mt-4 flex items-center gap-3">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">or</span>
                    <Separator className="flex-1" />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSigninMethod((m) =>
                        m === "password" ? "magic" : "password",
                      )
                    }
                    className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-center underline underline-offset-2"
                  >
                    {signinMethod === "password"
                      ? "Sign in with magic link instead"
                      : "Sign in with password instead"}
                  </button>
                  {/* TODO: OAuth buttons — uncomment once Google/Apple are configured in Supabase */}
                </>
              )}

              {mode === "signup" &&
                (emailSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <Mail className="w-8 h-8 text-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground">
                      Confirm your email
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      We sent a confirmation link to{" "}
                      <span className="text-foreground">{email}</span>. Click it
                      to activate your account.
                    </p>
                    <button
                      onClick={() => {
                        setEmailSent(false);
                        setPassword("");
                        setConfirmPassword("");
                      }}
                      className="mt-4 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                    >
                      Use a different email
                    </button>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handlePasswordSignUp}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="new-password">Password</Label>
                      <PasswordInput
                        id="new-password"
                        value={password}
                        onChange={setPassword}
                        disabled={loading}
                        autoComplete="new-password"
                      />
                      <PasswordStrength password={password} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="confirm-password">Confirm password</Label>
                      <PasswordInput
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        disabled={loading}
                        autoComplete="new-password"
                      />
                      {confirmPassword && (
                        <p
                          className={`text-[11px] flex items-center gap-1 ${password === confirmPassword ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {password === confirmPassword ? (
                            <>
                              <Check className="w-3 h-3" /> Passwords match
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3" /> Passwords don't match
                            </>
                          )}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 rounded-xl border border-border bg-secondary/30 p-3">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="accept-privacy"
                          checked={acceptedPrivacy}
                          onCheckedChange={(checked) =>
                            setAcceptedPrivacy(checked === true)
                          }
                          disabled={loading}
                          className="mt-0.5"
                        />
                        <Label
                          htmlFor="accept-privacy"
                          className="text-xs font-normal leading-relaxed text-muted-foreground"
                        >
                          I have read and accept the{" "}
                          <a
                            href={PRIVACY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground underline underline-offset-2"
                          >
                            Privacy Policy
                          </a>
                          .
                        </Label>
                      </div>

                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="accept-terms"
                          checked={acceptedTerms}
                          onCheckedChange={(checked) =>
                            setAcceptedTerms(checked === true)
                          }
                          disabled={loading}
                          className="mt-0.5"
                        />
                        <Label
                          htmlFor="accept-terms"
                          className="text-xs font-normal leading-relaxed text-muted-foreground"
                        >
                          I agree to the{" "}
                          <a
                            href={TERMS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground underline underline-offset-2"
                          >
                            Terms of Service
                          </a>
                          .
                        </Label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="h-11 font-medium"
                      disabled={
                        loading ||
                        getStrength(password) < 5 ||
                        password !== confirmPassword ||
                        !acceptedPrivacy ||
                        !acceptedTerms
                      }
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </form>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          End-to-end encrypted.{" "}
          <Link
            to="/privacy"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Privacy policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
