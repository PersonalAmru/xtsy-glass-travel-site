import HeroSection from "@/components/HeroSection";
import HomeTourPackages from "@/components/HomeTourPackages";
import AboutXTSYSection from "@/components/AboutXTSYSection";
import XTSYPrimeSection from "@/components/XTSYPrimeSection";
import ReviewsSection from "@/components/ReviewsSection";
import GroupBookingSection from "@/components/GroupBookingSection";
import AdventureCallToAction from "@/components/AdventureCallToAction";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyWrapper from "@/components/LazyWrapper";
import SEOContent from "@/components/SEOContent";
import FAQSection from "@/components/FAQSection";

// Minimal mobile-friendly fallback
const SectionFallback = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-muted/30 rounded-lg mx-4`} />
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOContent page="home" />
      <Header />
      <main style={{ contain: 'layout style' }}>
        <HeroSection />
        
        {/* Tour Packages - FocusRail cards from Travel.tsx */}
        <LazyWrapper eager fallback={<SectionFallback height="h-96" />}>
          <HomeTourPackages />
        </LazyWrapper>
        
        {/* About XTSY - Replaces "Where to Stay" */}
        <LazyWrapper fallback={<SectionFallback />}>
          <AboutXTSYSection />
        </LazyWrapper>
        
        {/* XTSY Prime - Premium offerings with popup modals */}
        <LazyWrapper fallback={<SectionFallback height="h-80" />}>
          <XTSYPrimeSection />
        </LazyWrapper>
        
        {/* Guest Reviews */}
        <LazyWrapper fallback={<SectionFallback />}>
          <ReviewsSection />
        </LazyWrapper>
        
        <LazyWrapper fallback={<SectionFallback height="h-48" />}>
          <GroupBookingSection />
        </LazyWrapper>
        
        <LazyWrapper fallback={<SectionFallback height="h-48" />}>
          <AdventureCallToAction />
        </LazyWrapper>
        
        <LazyWrapper fallback={<SectionFallback />}>
          <FAQSection />
        </LazyWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
