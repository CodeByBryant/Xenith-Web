import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const betaFeatures = [
  "Unlimited access across app tools",
  "No monthly or annual charge during beta",
  "Your feedback directly shapes the roadmap",
];

export const PricingSection = () => {
  return (
    <section
      id="pricing"
      className="py-32 md:py-48 px-6 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-foreground/[0.02] to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto max-w-5xl relative">
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
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] mb-6">
            Completely free
            <br />
            <span className="text-muted-foreground">during beta.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We’re stress testing Xenith before monetization. Every feature
            is currently unlocked at no cost.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -6, transition: { duration: 0.3 } }}
          className="max-w-2xl mx-auto rounded-2xl overflow-hidden bg-card border border-border"
        >
          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-serif font-medium mb-2">Beta Access</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-serif font-bold">$0</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Free while beta is active
              </p>
            </div>

            <ul className="space-y-3">
              {betaFeatures.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center bg-secondary">
                    <Check className="w-3 h-3 text-foreground" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8"
            >
              <Link
                to="/signin"
                className="w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 bg-foreground text-background hover:opacity-90"
              >
                <span>Start free beta</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground/70 mt-10"
        >
          Monetization will be introduced after beta, with advance notice.
        </motion.p>
      </div>
    </section>
  );
};
