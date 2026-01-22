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
      setErrorMessage("Please enter a valid email address");
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

  const isHero = variant === "hero";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className={`flex ${isHero ? "flex-col sm:flex-row" : "flex-col"} gap-3`}>
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Enter your email"
            disabled={status === "loading" || status === "success"}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all duration-200 disabled:opacity-50"
          />
        </div>
        <motion.button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
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
                <span>You're in!</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span>Join the Waitlist</span>
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
            className="mt-2 text-sm text-destructive"
          >
            {errorMessage}
          </motion.p>
        )}
        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-muted-foreground"
          >
            We'll notify you when Xenith launches. 🎉
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
};
