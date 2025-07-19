
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RoomsSection from "@/components/RoomsSection";
import ServicesSection from "@/components/ServicesSection";
import ReviewsSection from "@/components/ReviewsSection";
import GroupBookingSection from "@/components/GroupBookingSection";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      <HeroSection />
      <RoomsSection />
      <ServicesSection />
      <ReviewsSection />
      <GroupBookingSection />
      <Footer />
      <AIChatBot />
    </div>
  );
};

export default Index;
