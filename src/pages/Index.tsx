import HeroSection from "@/components/HeroSection";
import FeaturedPackagesSection from "@/components/FeaturedPackagesSection";
import WhyXTSYSection from "@/components/WhyXTSYSection";
import RecommendedStaysSection from "@/components/RecommendedStaysSection";
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
        {/* Featured Tour Packages - Above the fold after hero */}
        <LazyWrapper eager fallback={<SectionFallback height="h-96" />}>
          <FeaturedPackagesSection />
        </LazyWrapper>
        {/* Why XTSY - Value propositions */}
        <LazyWrapper fallback={<SectionFallback />}>
          <WhyXTSYSection />
        </LazyWrapper>
        {/* Recommended Stays - Rooms as secondary */}
        <LazyWrapper fallback={<SectionFallback height="h-80" />}>
          <RecommendedStaysSection />
        </LazyWrapper>
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