import { memo } from "react";
import { Helmet } from '@/lib/seo/helmet';
import SEOHead, { getSEOConfig } from "@/components/SEOHead";
import { useScrollDepthTracking } from "@/hooks/useScrollDepthTracking";
import { googleReviews } from "@/data/googleReviews";
import SiteHeader from "@/components/v2/SiteHeader";
import SiteFooter from "@/components/v2/SiteFooter";
import CtaBand from "@/components/v2/CtaBand";
import HomeHero from "@/components/v2/home/HomeHero";
import {
  LastMinuteBar, StatsStrip, PromiseMarquee, Trending, Stays, CampsiteBanner, StateExplorer,
  PrimeRail, GlampFeature, BistroFeature, ToursRow, TonightDeals, ExpeditionsBanner, Reviews,
  HomeFaq, SeoLinks, HOME_FAQS,
} from "@/components/v2/home/HomeSections";

const Index = memo(() => {
  // Track scroll depth milestones (25%, 50%, 75%, 100%)
  useScrollDepthTracking({ pageId: 'homepage' });
  
  const seoConfig = getSEOConfig('home');

  // Individual Review schema items built from real Google Business Profile
  // reviews so the homepage Hostel entity is eligible for review rich results
  // (the aggregateRating below already summarises all 237 Google reviews).
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
      streetAddress: 'Mawdiangdiang Road, New Shillong Township',
      addressLocality: 'Shillong',
      addressRegion: 'Meghalaya',
      postalCode: '793018',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 25.6025457, longitude: 91.9448902 },
    priceRange: '₹399 - ₹5,999',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.7', reviewCount: '237', bestRating: '5' },
    review: reviewSchemaItems,
    checkinTime: '11:00',
    checkoutTime: '10:00',
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
    mainEntity: HOME_FAQS.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <SEOHead structuredDataOnly 
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonicalUrl="https://xtsy.one/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(hostelSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(homeFaqSchema)}</script>
      </Helmet>
      
      <div className="xt min-h-screen">
        <SiteHeader />
        <LastMinuteBar />
        <main>
          <HomeHero />
          <StatsStrip />
          <PromiseMarquee />
          <Trending />
          <Stays />
          <CampsiteBanner />
          <StateExplorer />
          <PrimeRail />
          <GlampFeature />
          <BistroFeature />
          <ToursRow />
          <TonightDeals />
          <ExpeditionsBanner />
          <Reviews />
          <HomeFaq />
          <SeoLinks />
          <CtaBand />
        </main>
        <SiteFooter />
      </div>
    </>
  );
});

Index.displayName = 'Index';

export default Index;
