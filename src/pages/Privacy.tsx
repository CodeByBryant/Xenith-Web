import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LEGAL_LAST_UPDATED, PRIVACY_EMAIL } from "@/lib/legal";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Privacy Policy | Xenith</title>
        <meta
          name="description"
          content="Learn how Xenith collects, uses, stores, and protects your data when you use the Xenith platform."
        />
        <link rel="canonical" href="https://xenith.life/privacy" />
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
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-12">Last updated: {LEGAL_LAST_UPDATED}</p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                1. Scope
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                This Privacy Policy explains how Xenith (&quot;Xenith,&quot; &quot;we,&quot;
                &quot;us,&quot; &quot;our&quot;) handles personal information when you use our
                website and application (the &quot;Service&quot;). It applies to all
                users of Xenith.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                2. Data We Collect
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on how you use Xenith, we may collect:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>
                  <strong className="text-foreground">Account data</strong>,
                  such as email address, login credentials, and profile details.
                </li>
                <li>
                  <strong className="text-foreground">User-generated data</strong>,
                  such as intentions, routines, reflections, notes, projects,
                  and other content you create inside the Service.
                </li>
                <li>
                  <strong className="text-foreground">Product and usage data</strong>,
                  such as app interactions, performance events, and settings
                  preferences.
                </li>
                <li>
                  <strong className="text-foreground">Support and communication data</strong>,
                  such as feedback messages and customer support requests.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                3. How We Use Data
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We process personal information to provide and maintain Xenith,
                authenticate users, secure accounts, improve reliability,
                personalize user experience, respond to support requests, and
                comply with legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                4. Legal Bases
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We process data based on one or more of the following grounds,
                where applicable: performance of our contract with you,
                legitimate interests in operating and improving the Service,
                consent (for optional features), and compliance with legal
                obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                5. Sharing and Processors
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share data with
                trusted service providers solely to operate Xenith.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Request access to the personal data we hold about you.</li>
                <li>Request correction of inaccurate personal data.</li>
                <li>Request deletion of your account and related data.</li>
                <li>Export your data where technically feasible.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Current core infrastructure providers include Supabase (data and
                authentication), Vercel (hosting), and related operational
                tooling used to deliver the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                6. Data Retention
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain personal data for as long as needed to provide the
                Service and satisfy legal, tax, accounting, and security
                obligations. You may request deletion of your account at any
                time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                7. Security
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We apply reasonable technical and organizational measures to
                protect data, including access controls, encryption in transit,
                and secure infrastructure practices. No system is guaranteed
                secure, but we continuously improve our controls.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                8. Cookies and Local Storage
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Xenith uses limited browser storage for essential app behavior,
                such as theme and onboarding state. We do not use third-party
                advertising trackers for behavioral ad targeting.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                9. International Use
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you use Xenith from outside your home jurisdiction, you
                understand your data may be processed in locations where our
                providers operate. We use contractual and technical safeguards
                where appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                10. Children&apos;s Privacy
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Xenith is not intended for children under 13, and we do not
                knowingly collect personal information from children under 13.
                If we become aware of such collection, we will delete the data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                11. Policy Updates
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this policy periodically. Material changes will be
                reflected on this page by updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                12. Contact
              </h2>
              <p className="text-muted-foreground leading-relaxed mt-4">
                For privacy-related requests, contact us at{" "}
                <a
                  href={`mailto:${PRIVACY_EMAIL}`}
                  className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                  {PRIVACY_EMAIL}
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
