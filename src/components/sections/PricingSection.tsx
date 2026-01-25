import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    tagline: "Start building discipline",
    features: [
      "Unlimited daily intentions",
      "Basic focus timer",
      "Life balance tracking",
      "Daily reflection prompts",
      "7-day analytics",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "/mo",
    tagline: "For serious executors",
    features: [
      "Everything in Free",
      "Advanced analytics & patterns",
      "Calendar sync",
      "Unlimited history",
      "Export all data",
      "Priority support",
      "Early access features",
    ],
    cta: "Join Waitlist for Pro",
    highlighted: true,
    badge: "50% off for early supporters",
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 md:py-48 px-6 relative overflow-hidden">
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
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Free during beta. Lock in 50% off Pro forever by joining now.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`relative rounded-2xl overflow-hidden ${
                plan.highlighted
                  ? "bg-foreground text-background shadow-2xl shadow-foreground/20"
                  : "bg-card border border-border hover:border-foreground/20"
              } transition-all duration-500`}
            >
              {plan.badge && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-0 left-0 right-0 bg-[#22c55e] text-[#0a0a0a] text-xs font-semibold py-2.5 text-center"
                >
                  {plan.badge}
                </motion.div>
              )}

              <div className={`p-8 ${plan.badge ? "pt-14" : ""}`}>
                <div className="mb-8">
                  <h3 className="text-2xl font-serif font-medium mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                      className="text-5xl font-serif font-bold"
                    >
                      {plan.price}
                    </motion.span>
                    {plan.period && (
                      <span className={plan.highlighted ? "text-background/60" : "text-muted-foreground"}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${plan.highlighted ? "text-background/60" : "text-muted-foreground"}`}>
                    {plan.tagline}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? "bg-background/20" : "bg-secondary"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? "text-background" : "text-foreground"}`} />
                      </div>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
