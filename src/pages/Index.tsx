import { Header } from "@/components/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PreviewSection } from "@/components/sections/PreviewSection";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <PreviewSection />
        {/* <AudienceSection /> */}
        {/* <TestimonialsSection /> */}
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
