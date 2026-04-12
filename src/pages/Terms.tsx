import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LEGAL_EMAIL, LEGAL_LAST_UPDATED } from "@/lib/legal";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Terms of Service | Xenith</title>
        <meta
          name="description"
          content="Read the terms that govern your use of Xenith, including account, acceptable use, and liability terms."
        />
        <link rel="canonical" href="https://xenith.life/terms" />
        <meta name="robots" content="index, follow" />
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-12">Last updated: {LEGAL_LAST_UPDATED}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using Xenith (&quot;Service&quot;), you agree to these
                Terms of Service (&quot;Terms&quot;). If you do not agree, do not use the
                Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                2. Eligibility and Accounts
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You must provide accurate information and keep your credentials
                secure. You are responsible for activities under your account.
                We may suspend or restrict accounts for abuse, fraud, or policy
                violations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                3. Service Description
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Xenith provides productivity, planning, reflection, and personal
                tracking tools. Features may change over time, including
                additions, removals, and experimental capabilities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                4. Acceptable Use
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to misuse the Service. Prohibited activity
                includes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>
                  Use the Service for any unlawful purpose or in violation of
                  any applicable laws.
                </li>
                <li>
                  Attempt unauthorized access, scraping, abuse, reverse
                  engineering, or disruption of infrastructure.
                </li>
                <li>
                  Circumvent account controls, security measures, or usage
                  limits.
                </li>
                <li>
                  Use Xenith to distribute malware, spam, or harmful content.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                5. User Content
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of content you create in Xenith. You grant
                us a limited license to host, process, and display your content
                solely to operate and improve the Service for you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Xenith and its software, design, brand, and related materials
                are protected by intellectual property laws. Except for your
                own content and lawful use rights, no license is granted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                7. Availability and Changes
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may modify, suspend, or discontinue parts of the Service at
                any time. We strive for reliability but do not guarantee
                uninterrupted availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                8. Pricing and Billing
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Some features may be free while others may become paid in the
                future. If paid features are introduced, pricing and billing
                terms will be disclosed before purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                9. Disclaimer
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Xenith is provided &quot;as is&quot; and &quot;as available&quot; without warranties
                of any kind, to the fullest extent permitted by law. Xenith is
                not medical, legal, financial, or mental health advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                10. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Xenith is not liable
                for indirect, incidental, special, consequential, or punitive
                damages, or for loss of profits, data, or goodwill arising from
                use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                11. Suspension and Termination
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You may stop using Xenith at any time. We may suspend or
                terminate access if these Terms are violated or if required for
                security, legal, or operational reasons.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                12. Changes to These Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms periodically. Continued use of Xenith
                after updates means you accept the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                13. Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of the United States,
                without regard to conflict-of-law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                14. Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                For legal questions about these Terms, contact us at{" "}
                <a
                  href={`mailto:${LEGAL_EMAIL}`}
                  className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                  {LEGAL_EMAIL}
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
              to="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
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

export default Terms;
