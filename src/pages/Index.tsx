
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import RoomsSection from "@/components/RoomsSection";
import ReviewsSection from "@/components/ReviewsSection";
import AdventureSection from "@/components/AdventureSection";
import GroupBookingSection from "@/components/GroupBookingSection";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import DealsSection from "@/components/DealsSection";
import GallerySection from "@/components/GallerySection";
import AboutSection from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      <HeroSection />
      <ServicesSection />
      <RoomsSection />
      <DealsSection />
      <GallerySection />
      <ReviewsSection />
      <AdventureSection />
      <AboutSection />
      <GroupBookingSection />
      <Footer />
      <AIChatBot />
    </div>
  );
};

export default Index;
