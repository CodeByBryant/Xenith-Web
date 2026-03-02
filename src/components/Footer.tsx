import { motion } from "framer-motion";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Waitlist", href: "#waitlist" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const socialLinks = [
  { label: "X", ariaLabel: "X (Twitter)", href: "https://x.com/xenithapp", external: true },
  { label: "IG", ariaLabel: "Instagram", href: "https://instagram.com/xenithapp", external: true },
  { label: "TT", ariaLabel: "TikTok", href: "https://tiktok.com/@xenithapp", external: true },
];

export const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12 px-6 border-t border-border bg-background"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3"
          >
            <span className="font-chomsky text-4xl text-foreground leading-none">
              X
            </span>
            <div>
              <span className="font-serif text-xl text-foreground block">
                Xenith
              </span>
              <span className="text-xs text-muted-foreground tracking-widest uppercase">
                Discipline • Intention • Execution
              </span>
            </div>
          </motion.div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                whileHover={{ y: -1 }}
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex justify-center md:justify-end gap-2">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                aria-label={link.ariaLabel}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xs font-medium hover:bg-foreground hover:text-background transition-all duration-200"
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground">
            © 2026 Xenith. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built for the ambitious. By the ambitious.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};
