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
          <div className="h-px flex-1 bg-border" />
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
              className={`relative rounded-2xl overflow-hidden ${
                plan.highlighted
                  ? "bg-foreground text-background"
                  : "bg-card border border-border"
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-0 right-0 bg-[#22c55e] text-background text-xs font-medium py-2 text-center">
                  {plan.badge}
                </div>
              )}

              <div className={`p-8 ${plan.badge ? "pt-14" : ""}`}>
                <div className="mb-8">
                  <h3 className="text-2xl font-serif font-medium mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-serif font-bold">{plan.price}</span>
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
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? "bg-background/20" : "bg-secondary"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? "text-background" : "text-foreground"}`} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
