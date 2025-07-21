
import HeroSection from "@/components/HeroSection";
import PropertySection from "@/components/PropertySection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import ReviewsSection from "@/components/ReviewsSection";
import GroupBookingSection from "@/components/GroupBookingSection";
import AdventureSection from "@/components/AdventureSection";
import AdventureCallToAction from "@/components/AdventureCallToAction";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <PropertySection />
        <ServicesSection />
        <AboutSection />
        <GallerySection />
        <ReviewsSection />
        <GroupBookingSection />
        <AdventureSection />
        <AdventureCallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
