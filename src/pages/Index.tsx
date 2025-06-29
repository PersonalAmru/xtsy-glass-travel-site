
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import RoomsSection from "@/components/RoomsSection";
import ReviewsSection from "@/components/ReviewsSection";
import AdventureSection from "@/components/AdventureSection";
import GroupBookingSection from "@/components/GroupBookingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      <HeroSection />
      <ServicesSection />
      <RoomsSection />
      <ReviewsSection />
      <AdventureSection />
      <GroupBookingSection />
      <Footer />
    </div>
  );
};

export default Index;
