
import Navbar from "@/components/Navbar";
import UlomuHero from "@/components/Ulomu/Hero";
import AIFeatures from "@/components/Ulomu/AIFeatures";
import HowItWorks from "@/components/Ulomu/HowItWorks";
import PropertyOwnerBenefits from "@/components/Ulomu/PropertyOwnerBenefits";
import Testimonials from "@/components/Ulomu/Testimonials";
import CtaSection from "@/components/Ulomu/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <UlomuHero />
        <AIFeatures />
        <HowItWorks />
        <PropertyOwnerBenefits />
        <Testimonials />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
