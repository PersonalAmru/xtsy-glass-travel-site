import { memo, lazy } from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyWrapper from "@/components/LazyWrapper";
import LastMinuteBanner from "@/components/LastMinuteBanner";

import SEOHead, { getSEOConfig } from "@/components/SEOHead";
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";
import { googleReviews } from "@/data/googleReviews";

// Lazy load below-fold sections for better initial load
const DestinationExplorer = lazy(() => import("@/components/DestinationExplorer"));
const XTSYPrimeSection = lazy(() => import("@/components/XTSYPrimeSection"));
const TrendingDestinations = lazy(() => import("@/components/TrendingDestinations"));
const TripBuilder = lazy(() => import("@/components/TripBuilder"));
const HomeTourPackages = lazy(() => import("@/components/HomeTourPackages"));
const AdventureCallToAction = lazy(() => import("@/components/AdventureCallToAction"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));
const AvailableStaysNow = lazy(() => import("@/components/AvailableStaysNow"));
const TonightsDeals = lazy(() => import("@/components/TonightsDeals"));
const DawkiCampsiteCard = lazy(() => import("@/components/DawkiCampsiteCard"));

const FAQSection = lazy(() => import("@/components/FAQSection"));
const SEOFooterLinks = lazy(() => import("@/components/SEOFooterLinks"));

// Minimal mobile-friendly fallback
const SectionFallback = memo(({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-muted/30 rounded-lg mx-4`} />
));

SectionFallback.displayName = 'SectionFallback';

const Index = memo(() => {
  // Track scroll depth milestones (25%, 50%, 75%, 100%)
  useScrollDepthTracking({ pageId: 'homepage' });
  
  const seoConfig = getSEOConfig('home');

  // Individual Review schema items built from real Google Business Profile
  // reviews so the homepage Hostel entity is eligible for review rich results
  // (the aggregateRating below already summarises all 320 reviews).
  const reviewSchemaItems = googleReviews
    .filter((r) => r.comment && r.comment.length > 40)
    .slice(0, 6)
    .map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(r.rating),
        bestRating: '5',
      },
      reviewBody: r.comment,
      itemReviewed: { '@type': 'Hostel', name: 'XTSY Travellers Hostel' },
    }));

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
    priceRange: '₹329 - ₹4,999',
    starRating: { '@type': 'Rating', ratingValue: '4.8' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '320', bestRating: '5' },
    review: reviewSchemaItems,
    checkinTime: '13:00',
    checkoutTime: '11:00',
    numberOfRooms: 20,
    petsAllowed: true,
    smokingAllowed: false,
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: '24/7 Reception', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Hot Shower', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Common Kitchen', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Luggage Storage', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Locker Storage', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Female-only Dorm', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'CCTV Security', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Airport Transfer', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Restaurant On-site (TAB Bistro)', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Bonfire & BBQ Terrace', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Power Backup', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
    ],
    availableLanguage: ['English', 'Hindi', 'Khasi', 'Assamese', 'Bengali'],
    sameAs: [
      'https://www.instagram.com/xtsytravellershostel',
      'https://www.facebook.com/xtsytravellershostel',
      'https://g.co/kgs/XTSY',
    ],
  };


  const homeFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best time to visit Shillong, Meghalaya?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The best time to visit Shillong is October to May for clear skies and pleasant weather. June to September is monsoon season — ideal for experiencing Cherrapunji\'s waterfalls at full force. XTSY Travellers Hostel is open year-round.',
        },
      },
      {
        '@type': 'Question',
        name: 'How to reach Shillong from Guwahati?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Shillong is 100 km from Guwahati Airport (GAU), approximately 2.5 hours by road via NH6. Shared taxis run every 30 minutes from ISBT Guwahati. XTSY can arrange airport transfers for guests.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a hostel in Shillong cost per night?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'At XTSY Travellers Hostel, dormitory beds start from ₹329/night, private rooms from ₹2,500/night, and the exclusive 270° Glass Stargazing Suite from ₹4,999/night. Prices vary by season.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the biggest hostel in Northeast India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'XTSY Travellers Hostel in Shillong is the biggest hostel in Northeast India, featuring multiple room types including dormitories, private rooms, and India\'s first 270° panoramic glass suite.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does XTSY offer Meghalaya tour packages?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, XTSY offers 30+ curated tour packages including Living Root Bridge treks, Dawki river expeditions, cave explorations, and multi-day Meghalaya itineraries starting from ₹13,999.',
        },
      },
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
        <script type="application/ld+json">{JSON.stringify(homeFaqSchema)}</script>
      </Helmet>
      
      <Header />
      <main style={{ contain: 'layout style' }}>
        <HeroSection />
        
        {/* Last-Minute Banner — urgency signal right after hero */}
        <div className="max-w-5xl mx-auto px-4 mt-4 mb-2">
          <LastMinuteBanner />
        </div>
        
        {/* Wave 2E — Demoted XTSYPrime + HomeTourPackages from eager.
            Only the first 2 below-fold sections hydrate eagerly to keep TBT low. */}
        {/* Wave 3 — All below-fold sections deferred via IntersectionObserver.
            Eager hydration was starving the hero LCP paint. */}
        <LazyWrapper fallback={<SectionFallback height="h-[420px]" />}>
          <TrendingDestinations />
        </LazyWrapper>
        
        <LazyWrapper fallback={<SectionFallback height="h-80" />}>
          <AvailableStaysNow />
        </LazyWrapper>
        
        {/* Dawki Adventure Campsite — featured prominently right below Shillong stays */}
        <LazyWrapper fallback={<SectionFallback height="h-80" />}>
          <DawkiCampsiteCard />
        </LazyWrapper>
        
        <LazyWrapper fallback={<SectionFallback height="h-64" />}>
          <DestinationExplorer />
        </LazyWrapper>
        
        <LazyWrapper fallback={<SectionFallback height="h-96" />}>
          <TripBuilder />
        </LazyWrapper>
        
        <LazyWrapper fallback={<SectionFallback height="h-80" />}>
          <XTSYPrimeSection />
        </LazyWrapper>
        
        <LazyWrapper fallback={<SectionFallback height="h-96" />}>
          <HomeTourPackages />
        </LazyWrapper>
        
        {/* Tonight's Deals — urgency-driven deals */}
        <LazyWrapper fallback={<SectionFallback height="h-64" />}>
          <TonightsDeals />
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
        
        {/* SEO Footer Links - crawl hub */}
        <LazyWrapper fallback={<SectionFallback height="h-48" />}>
          <SEOFooterLinks />
        </LazyWrapper>
      </main>
      <Footer />
    </div>
  );
});

Index.displayName = 'Index';

export default Index;
