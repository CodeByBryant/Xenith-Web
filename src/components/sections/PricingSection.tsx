import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Everything you need to start",
    features: [
      "Unlimited intentions",
      "Basic focus timer",
      "Life balance tracking",
      "Daily reflection",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "/month",
    description: "For serious self-improvers",
    features: [
      "Advanced analytics",
      "Calendar sync",
      "Export all data",
      "Priority support",
      "Early access features",
    ],
    highlighted: true,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-32 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            Simple, fair pricing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Free during beta. Early supporters get 50% off Pro forever.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-foreground text-background border-2 border-foreground"
                  : "bg-card border border-border hover:border-foreground/20"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-background text-foreground text-xs font-medium rounded-full">
                  Popular
                </div>
              )}

              <h3 className="text-2xl font-serif font-medium mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-serif font-bold">{plan.price}</span>
                {plan.period && (
                  <span className={plan.highlighted ? "text-background/70" : "text-muted-foreground"}>
                    {plan.period}
                  </span>
                )}
              </div>
              <p className={`text-sm mb-6 ${plan.highlighted ? "text-background/70" : "text-muted-foreground"}`}>
                {plan.description}
              </p>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className={`w-4 h-4 ${plan.highlighted ? "text-background" : "text-foreground"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
