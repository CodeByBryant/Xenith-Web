import { motion } from "framer-motion";
import { XenithLogo } from "./XenithLogo";

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
      className="py-16 px-6 border-t border-border"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <XenithLogo size="sm" />
            <span className="font-chomsky text-2xl">Xenith</span>
          </div>

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

          <div className="flex gap-3">
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

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Xenith. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
