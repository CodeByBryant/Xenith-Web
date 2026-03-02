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
        <meta name="description" content="A minimalist productivity platform for students and young professionals. Track intentions, build sustainable routines, and grow across all dimensions of life." />
        <link rel="canonical" href="https://xenith-nu.vercel.app/" />
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
