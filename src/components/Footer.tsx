import { motion } from "framer-motion";

const footerLinks = [
  { label: "About", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

const socialLinks = [
  { label: "X", href: "#" },
  { label: "IG", href: "#" },
  { label: "TT", href: "#" },
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
          <div className="flex items-center gap-3">
            <span className="font-chomsky text-4xl text-foreground leading-none">X</span>
            <div>
              <span className="font-chomsky text-xl text-foreground block">Xenith</span>
              <span className="text-xs text-muted-foreground tracking-widest uppercase">
                Discipline • Intention • Execution
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex justify-center md:justify-end gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xs font-medium hover:bg-foreground hover:text-background transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Xenith. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built for the ambitious. By the ambitious.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
