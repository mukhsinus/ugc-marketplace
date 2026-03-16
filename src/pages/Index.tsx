// src/pages/Index.tsx
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import BenefitsSection from "@/components/landing/BenefitsSection";
import FeaturedCreators from "@/components/landing/FeaturedCreators";
import CTASection from "@/components/landing/CTASection";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">

      <Navbar />

      <main className="flex-1">

        <HeroSection />
        <HowItWorks />
        <BenefitsSection />
        <FeaturedCreators />
        <CTASection />

      </main>

      <Footer />

    </div>
  );
};

export default Index;