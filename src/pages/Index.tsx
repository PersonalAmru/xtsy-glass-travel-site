
import HeroSection from "@/components/HeroSection";
import RoomsSection from "@/components/RoomsSection";
import ServicesSection from "@/components/ServicesSection";
import ReviewsSection from "@/components/ReviewsSection";
import GroupBookingSection from "@/components/GroupBookingSection";
import AdventureCallToAction from "@/components/AdventureCallToAction";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <RoomsSection />
        <ServicesSection />
        <ReviewsSection />
        <GroupBookingSection />
        <AdventureCallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
