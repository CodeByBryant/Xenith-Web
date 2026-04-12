import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PreviewSection } from "@/components/sections/PreviewSection";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Xenith - Discipline | Intention | Execution</title>
        <meta
          name="description"
          content="Xenith is a live execution platform for students and professionals. Plan intentions, run focus sessions, manage projects, and track growth across every life dimension."
        />
        <link rel="canonical" href="https://xenith.life/" />
      </Helmet>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <PreviewSection />
        <AudienceSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
