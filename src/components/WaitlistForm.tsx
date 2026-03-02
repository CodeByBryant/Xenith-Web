import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/** Extract UTM params from the current URL query string. */
const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
    referred_by: params.get("ref") || null,
  };
};

/** Read & clear the plan the user picked on the pricing section. */
const getSelectedPlan = (): string | null => {
  try {
    const plan = sessionStorage.getItem("xenith_selected_plan");
    if (plan) sessionStorage.removeItem("xenith_selected_plan");
    return plan;
  } catch {
    return null;
  }
};

interface WaitlistFormProps {
  variant?: "hero" | "footer";
}

export const WaitlistForm = ({ variant = "hero" }: WaitlistFormProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string) => {
    if (email.length > 254) return false;
    const regex = /^[a-zA-Z0-9_%+\-]+(\.[a-zA-Z0-9_%+\-]+)*@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setStatus("error");
      setErrorMessage("Enter a valid email");
      return;
    }

    setStatus("loading");

    try {
      const utm = getUtmParams();
      const plan = getSelectedPlan();
      const source = plan ? `${variant}:${plan}` : variant;

      if (isSupabaseConfigured && supabase) {
        // ─── Supabase path ───────────────────────────────────
        const { error } = await supabase.from("waitlist").upsert(
          {
            email: email.toLowerCase().trim(),
            source,
            referred_by: utm.referred_by,
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
          },
          { onConflict: "email" },
        );

        if (error) throw error;
      } else {
        // ─── localStorage fallback (dev without Supabase) ────
        await new Promise((resolve) => setTimeout(resolve, 800));
        const existing: { email: string; source: string }[] = JSON.parse(
          localStorage.getItem("xenith_waitlist") || "[]",
        );
        if (!existing.some((e) => e.email === email)) {
          existing.push({ email, source });
          localStorage.setItem("xenith_waitlist", JSON.stringify(existing));
        }
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("[Waitlist]", err);
      setStatus("error");
      setErrorMessage("Something went wrong — try again");
    }
  };

  const isFooter = variant === "footer";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="your@email.com"
            maxLength={254}
            disabled={status === "loading" || status === "success"}
            className={`w-full px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 ${
              isFooter
                ? "bg-background/10 border border-background/20 text-background placeholder:text-background/40 focus:ring-background/30 focus:border-background/40"
                : "bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:ring-foreground/20 focus:border-foreground/30"
            }`}
          />
        </div>
        <motion.button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`px-6 py-4 font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 ${
            isFooter
              ? "bg-background text-foreground hover:bg-background/90"
              : "bg-foreground text-background hover:opacity-90"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {status === "loading" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="w-5 h-5 animate-spin" />
              </motion.div>
            ) : status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>You're in</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span>Join Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-2 text-sm ${isFooter ? "text-red-400" : "text-destructive"}`}
          >
            {errorMessage}
          </motion.p>
        )}
        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 text-sm ${isFooter ? "text-background/60" : "text-muted-foreground"}`}
          >
            We'll notify you when Xenith launches.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
};
