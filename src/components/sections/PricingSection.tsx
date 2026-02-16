import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";

// ─── Pricing constants ───────────────────────────────────────────────
const MONTHLY_PRICE = 4.99;
const ANNUAL_MONTHLY_PRICE = 3.49; // ~30 % off
const ANNUAL_PRICE = +(ANNUAL_MONTHLY_PRICE * 12).toFixed(2); // 41.88

// ─── Feature data types ──────────────────────────────────────────────
interface FeatureItem {
  label: string;
  included: boolean;
  /** Optional annotation — e.g. "up to 3" */
  note?: string;
}

interface FeatureGroup {
  title: string;
  items: FeatureItem[];
}

// ─── Free-tier features ──────────────────────────────────────────────
const freeFeatures: FeatureGroup[] = [
  {
    title: "Intentions",
    items: [
      { label: "Daily intentions", included: true, note: "up to 3" },
      { label: "Scheduling & due dates", included: false },
      { label: "Sub-tasks & projects", included: false },
    ],
  },
  {
    title: "Life Dimensions",
    items: [
      { label: "8-dimension tracking", included: true },
      { label: "Radar chart", included: true },
      { label: "Dimension history", included: false },
    ],
  },
  {
    title: "Focus Timer",
    items: [
      { label: "25-min Pomodoro timer", included: true },
      { label: "Custom durations", included: false },
      { label: "Distraction logging", included: false },
    ],
  },
  {
    title: "Reflection & Routines",
    items: [
      { label: "Daily reflection prompts", included: true },
      { label: "Mood & energy tracking", included: true },
      { label: "Routines", included: false },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "7-day analytics", included: true },
      { label: "Trend analysis", included: false },
      { label: "Data export", included: false },
    ],
  },
];

// ─── Pro-tier features ───────────────────────────────────────────────
const proFeatures: FeatureGroup[] = [
  {
    title: "Intentions",
    items: [
      { label: "Unlimited daily intentions", included: true },
      { label: "Scheduling & due dates", included: true },
      { label: "Sub-tasks & projects", included: true },
    ],
  },
  {
    title: "Life Dimensions",
    items: [
      { label: "8-dimension tracking", included: true },
      { label: "Radar chart", included: true },
      { label: "Full dimension history", included: true },
    ],
  },
  {
    title: "Focus Timer",
    items: [
      { label: "Custom focus durations", included: true },
      { label: "Distraction logging", included: true },
      { label: "Energy before / after", included: true },
    ],
  },
  {
    title: "Reflection & Routines",
    items: [
      { label: "Daily reflection prompts", included: true },
      { label: "Mood & energy tracking", included: true },
      { label: "Unlimited routines & checklists", included: true },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Unlimited history", included: true },
      { label: "Trend analysis & patterns", included: true },
      { label: "Full data export", included: true },
    ],
  },
];

// ─── Save the selected plan so the waitlist form can read it ─────────
const savePlan = (plan: "free" | "pro") => {
  try {
    sessionStorage.setItem("xenith_selected_plan", plan);
  } catch {
    // Private browsing — ignore
  }
};

// ─── FeatureList sub-component ───────────────────────────────────────
const FeatureList = ({
  groups,
  highlighted,
}: {
  groups: FeatureGroup[];
  highlighted: boolean;
}) => (
  <div className="space-y-5">
    {groups.map((group) => (
      <div key={group.title}>
        <p
          className={`text-[11px] uppercase tracking-widest font-semibold mb-2 ${
            highlighted ? "text-background/50" : "text-muted-foreground/70"
          }`}
        >
          {group.title}
        </p>
        <ul className="space-y-2">
          {group.items.map((item) => (
            <li
              key={item.label}
              className={`flex items-start gap-2.5 text-sm ${
                !item.included
                  ? highlighted
                    ? "text-background/30"
                    : "text-muted-foreground/40"
                  : ""
              }`}
            >
              <span
                className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                  item.included
                    ? highlighted
                      ? "bg-background/20"
                      : "bg-secondary"
                    : "bg-transparent"
                }`}
              >
                {item.included ? (
                  <Check
                    className={`w-3 h-3 ${
                      highlighted ? "text-background" : "text-foreground"
                    }`}
                  />
                ) : (
                  <X
                    className={`w-3 h-3 ${
                      highlighted ? "text-background/30" : "text-muted-foreground/30"
                    }`}
                  />
                )}
              </span>
              <span>
                {item.label}
                {item.note && (
                  <span
                    className={`ml-1 text-xs ${
                      highlighted ? "text-background/40" : "text-muted-foreground"
                    }`}
                  >
                    ({item.note})
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

// ─── Section ─────────────────────────────────────────────────────────
export const PricingSection = () => {
  const [annual, setAnnual] = useState(false);

  const proDisplay = annual
    ? `$${ANNUAL_MONTHLY_PRICE}`
    : `$${MONTHLY_PRICE.toFixed(2)}`;

  return (
    <section
      id="pricing"
      className="py-32 md:py-48 px-6 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-foreground/[0.02] to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto max-w-5xl relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-8 mb-16"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-muted-foreground font-sans whitespace-nowrap">
            Pricing
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px flex-1 bg-border origin-left"
          />
        </motion.div>

        {/* Headline + billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] mb-6">
            Simple. Fair.
            <br />
            <span className="text-muted-foreground">No surprises.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
            Start free — upgrade when you're ready.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-1.5 py-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !annual
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                annual
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual{" "}
              <span className="ml-1 text-xs text-emerald-500 font-semibold">
                save 30%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* ── Free card ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="relative rounded-2xl overflow-hidden bg-card border border-border hover:border-foreground/20 transition-all duration-500"
          >
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-serif font-medium mb-2">Free</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-serif font-bold">$0</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Build the foundation
                </p>
              </div>

              <FeatureList groups={freeFeatures} highlighted={false} />

              <motion.a
                href="#waitlist"
                onClick={() => savePlan("free")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 bg-foreground text-background hover:opacity-90"
              >
                <span>Start Free</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* ── Pro card ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="relative rounded-2xl overflow-hidden bg-foreground text-background shadow-2xl shadow-foreground/20 transition-all duration-500"
          >
            {/* Badge */}
            <div className="absolute top-0 left-0 right-0 bg-[#22c55e] text-[#0a0a0a] text-xs font-semibold py-2.5 text-center">
              Most popular
            </div>

            <div className="p-8 pt-14">
              <div className="mb-8">
                <h3 className="text-2xl font-serif font-medium mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <motion.span
                    key={proDisplay}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-serif font-bold"
                  >
                    {proDisplay}
                  </motion.span>
                  <span className="text-background/60">/mo</span>
                </div>
                {annual && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-background/50"
                  >
                    ${ANNUAL_PRICE}/year — billed annually
                  </motion.p>
                )}
                <p className="text-sm text-background/60 mt-1">
                  For serious executors
                </p>
              </div>

              <FeatureList groups={proFeatures} highlighted />

              <motion.a
                href="#waitlist"
                onClick={() => savePlan("pro")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 bg-background text-foreground hover:bg-background/90"
              >
                <span>Join Waitlist for Pro</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Security footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground/50 mt-10"
        >
          End-to-end encrypted. Your data stays yours. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
};
