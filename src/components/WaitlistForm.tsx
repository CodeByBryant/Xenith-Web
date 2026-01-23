import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";

interface WaitlistFormProps {
  variant?: "hero" | "footer";
}

export const WaitlistForm = ({ variant = "hero" }: WaitlistFormProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store in localStorage for demo
    const existingEmails = JSON.parse(localStorage.getItem("xenith_waitlist") || "[]");
    if (!existingEmails.includes(email)) {
      existingEmails.push(email);
      localStorage.setItem("xenith_waitlist", JSON.stringify(existingEmails));
    }

    setStatus("success");
    setEmail("");
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
