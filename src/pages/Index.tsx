
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import RoomsSection from "@/components/RoomsSection";
import ReviewsSection from "@/components/ReviewsSection";
import AdventureSection from "@/components/AdventureSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <HeroSection />
      <ServicesSection />
      <RoomsSection />
      <ReviewsSection />
      <AdventureSection />
      <Footer />
    </div>
  );
};

export default Index;
