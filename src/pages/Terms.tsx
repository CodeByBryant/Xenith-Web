import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
            <span className="font-chomsky text-lg">Xenith</span>
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
          <p className="text-muted-foreground mb-12">
            Last updated: February 16, 2026
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using Xenith ("the Service"), you agree to be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use the Service. These terms apply to all
                visitors, users, and others who access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                2. Description of Service
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Xenith is a minimalist productivity platform designed for
                students and young professionals. The Service allows users to
                set intentions, build sustainable routines, track progress
                across multiple life dimensions, and cultivate intentional
                living habits. The Service is currently in beta and features may
                change without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                3. Waitlist & Early Access
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                By joining our waitlist, you are expressing interest in
                receiving early access to Xenith. Joining the waitlist does not
                guarantee access to the Service. We reserve the right to grant
                access at our sole discretion. Early access pricing and features
                are subject to change before the official public launch.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                4. User Accounts
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                When the Service launches, you may need to create an account.
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>
                  Maintaining the confidentiality of your account credentials.
                </li>
                <li>All activities that occur under your account.</li>
                <li>
                  Notifying us immediately of any unauthorized use of your
                  account.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                5. Acceptable Use
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mt-4">
                <li>
                  Use the Service for any unlawful purpose or in violation of
                  any applicable laws.
                </li>
                <li>
                  Attempt to gain unauthorized access to any part of the
                  Service.
                </li>
                <li>
                  Interfere with or disrupt the Service or servers or networks
                  connected to the Service.
                </li>
                <li>
                  Scrape, data-mine, or use automated means to access the
                  Service without our written consent.
                </li>
                <li>
                  Impersonate any person or entity or misrepresent your
                  affiliation with a person or entity.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                6. Intellectual Property
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content, features, and
                functionality are owned by Xenith and are protected by
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws. Our branding, logos, and the
                name "Xenith" may not be used without our prior written
                permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                7. User Content
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                When the Service is live, you may input personal data such as
                intentions, reflections, and goals. You retain all rights to
                your content. We do not claim ownership over your data. We will
                not share, sell, or use your personal content for any purpose
                other than providing the Service to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                8. Pricing & Payments
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Xenith offers both free and paid tiers. Pricing details are
                available on our website and are subject to change. If you sign
                up during the beta period, your early access pricing will be
                honored as described at the time of your registration.
                Subscriptions may be cancelled at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                9. Disclaimer of Warranties
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided on an "as is" and "as available" basis
                without warranties of any kind, either express or implied. We do
                not warrant that the Service will be uninterrupted, secure, or
                error-free. Xenith is a productivity tool and does not provide
                medical, psychological, or professional advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                10. Limitation of Liability
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Xenith shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, including but not limited to loss of profits,
                data, or other intangible losses, resulting from your use of the
                Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                11. Termination
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your access to the Service
                immediately, without prior notice or liability, for any reason,
                including breach of these Terms. Upon termination, your right to
                use the Service will immediately cease. You may request export
                of your data before termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                12. Changes to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will
                notify users of material changes by posting the updated terms on
                this page and updating the "Last updated" date. Your continued
                use of the Service after changes constitutes acceptance of the
                new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                13. Governing Law
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of the United States, without regard to its
                conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-medium mb-4">
                14. Contact Us
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please
                contact us at{" "}
                <a
                  href="mailto:legal@xenith.app"
                  className="text-foreground underline underline-offset-4 hover:text-foreground/80"
                >
                  legal@xenith.app
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
