 import { memo, Suspense, lazy } from "react";
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyWrapper from "@/components/LazyWrapper";
import SEOContent from "@/components/SEOContent";
import SEOHead, { getSEOConfig } from "@/components/SEOHead";
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";

// Lazy load below-fold sections for better initial load
const HomeTourPackages = lazy(() => import("@/components/HomeTourPackages"));
const XTSYPrimeSection = lazy(() => import("@/components/XTSYPrimeSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const AdventureCallToAction = lazy(() => import("@/components/AdventureCallToAction"));
const FAQSection = lazy(() => import("@/components/FAQSection"));

// Minimal mobile-friendly fallback
const SectionFallback = memo(({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-muted/30 rounded-lg mx-4`} />
));

SectionFallback.displayName = 'SectionFallback';

const Index = memo(() => {
  // Track scroll depth milestones (25%, 50%, 75%, 100%)
  useScrollDepthTracking({ pageId: 'homepage' });
  
  const seoConfig = getSEOConfig('home');
  
  return (
    <div className="min-h-screen">
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalUrl="https://xtsy.one/"
      />
      <SEOContent page="home" />
      <Header />
      <main style={{ contain: 'layout style' }}>
        <HeroSection />
        
        {/* XTSY Prime - Premium offerings (right after hero) */}
        <LazyWrapper eager fallback={<SectionFallback height="h-80" />}>
          <XTSYPrimeSection />
        </LazyWrapper>
        
        {/* Tour Packages - FocusRail cards */}
        <LazyWrapper eager fallback={<SectionFallback height="h-96" />}>
          <HomeTourPackages />
        </LazyWrapper>
        
        {/* Adventure CTA */}
        <LazyWrapper fallback={<SectionFallback height="h-48" />}>
          <AdventureCallToAction />
        </LazyWrapper>
        
        {/* Guest Reviews */}
        <LazyWrapper fallback={<SectionFallback />}>
          <ReviewsSection />
        </LazyWrapper>
        
        <LazyWrapper fallback={<SectionFallback />}>
          <FAQSection />
        </LazyWrapper>
      </main>
      <Footer />
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
