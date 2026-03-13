import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Privacy Policy — Xenith</title>
        <meta
          name="description"
          content="Learn how Xenith collects, uses, and protects your personal data."
        />
        <link rel="canonical" href="https://xenith.life/privacy" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto max-w-4xl px-6 py-6 flex items-center gap-4">
          <Link
            to="/"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-chomsky text-3xl leading-none">X</span>
            <span className="font-serif text-lg">Xenith</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto max-w-4xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-12">
            Last updated: February 16, 2026
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                1. Information We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you join our waitlist, we collect only the information you
                provide directly:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Email address</strong> —
                  to notify you when Xenith launches and send relevant updates.
                </li>
                <li>
                  <strong className="text-foreground">UTM parameters</strong> —
                  referral source data from the URL (e.g., which campaign or
                  link brought you here).
                </li>
                <li>
                  <strong className="text-foreground">Selected plan</strong> —
                  if you indicated interest in a specific pricing tier.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>Send you launch updates and early access invitations.</li>
                <li>
                  Understand where our users are coming from to improve our
                  outreach.
                </li>
                <li>Improve and personalize your experience with Xenith.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We will <strong className="text-foreground">never</strong> sell,
                rent, or share your personal information with third parties for
                their marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                3. Data Storage & Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data is stored securely using Supabase, which provides
                enterprise-grade security including encryption at rest and in
                transit. We implement appropriate technical and organizational
                measures to protect your personal data against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                4. Cookies & Tracking
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not use cookies for tracking. We do not use any
                third-party analytics or advertising trackers on our website.
                The only data persisted in your browser is your theme preference
                (light/dark mode) stored in localStorage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                5. Your Rights
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>Request access to the personal data we hold about you.</li>
                <li>Request correction or deletion of your personal data.</li>
                <li>Unsubscribe from our waitlist at any time.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:privacy@xenith.life"
                  className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                  privacy@xenith.life
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                6. Third-Party Services
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>
                  <strong className="text-foreground">Supabase</strong> —
                  database and authentication (
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                  >
                    Privacy Policy
                  </a>
                  )
                </li>
                <li>
                  <strong className="text-foreground">Vercel</strong> — hosting
                  and deployment (
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                  >
                    Privacy Policy
                  </a>
                  )
                </li>
                <li>
                  <strong className="text-foreground">Google Fonts</strong> —
                  font delivery (
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                  >
                    Privacy Policy
                  </a>
                  )
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                7. Children's Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Xenith is not directed to children under 13. We do not knowingly
                collect personal information from children under 13. If we learn
                that we have collected personal information from a child under
                13, we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                8. Changes to This Policy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                9. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this privacy policy, please
                contact us at{" "}
                <a
                  href="mailto:privacy@xenith.app"
                  className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                  privacy@xenith.app
                </a>
                .
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Xenith. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              to="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
