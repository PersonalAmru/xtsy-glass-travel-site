 import { memo, lazy } from "react";
import { Helmet } from "react-helmet";
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
  
  const hostelSchema = {
    '@context': 'https://schema.org',
    '@type': 'Hostel',
    name: 'XTSY Travellers Hostel',
    description: seoConfig.description,
    url: 'https://xtsy.one',
    telephone: '+918837317070',
    email: 'xtsytravellershostel@gmail.com',
    image: 'https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mawkhar, Shillong',
      addressLocality: 'Shillong',
      addressRegion: 'Meghalaya',
      postalCode: '793001',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 25.5788, longitude: 91.8933 },
    priceRange: '₹450 - ₹8,500',
    starRating: { '@type': 'Rating', ratingValue: '4.8' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '320', bestRating: '5' },
    checkinTime: '13:00',
    checkoutTime: '11:00',
    numberOfRooms: 20,
    petsAllowed: true,
    sameAs: [
      'https://www.instagram.com/xtsytravellershostel',
      'https://www.facebook.com/xtsytravellershostel',
      'https://g.co/kgs/XTSY',
    ],
  };

  return (
    <div className="min-h-screen">
      <SEOHead 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalUrl="https://xtsy.one/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(hostelSchema)}</script>
      </Helmet>
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
