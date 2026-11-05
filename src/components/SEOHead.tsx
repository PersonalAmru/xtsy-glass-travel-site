/**
 * SEOHead - Dynamic meta tags for React pages
 * Uses react-helmet for actual <head> injection
 */

import { Helmet } from '@/lib/seo/helmet';

interface ArticleMeta {
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  /** Route already owns title/description/canonical/og via TanStack head(); emit only JSON-LD. */
  structuredDataOnly?: boolean;
  article?: ArticleMeta;
}

const DEFAULT_TITLE = "XTSY — Best Hostel in Shillong, Meghalaya";
const DEFAULT_DESCRIPTION = "Stay at XTSY Travellers Hostel in New Shillong Township, Shillong. Book dorm beds, private rooms and Experience by XTSY directly, or plan a Meghalaya trip with our travel desk.";
const DEFAULT_OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png";
const SEO_CONFIG: Record<string, { title: string; description: string; keywords?: string }> = {
  home: {
    title: "Best Hostel in Shillong from ₹399/night | XTSY",
    description: "XTSY Travellers Hostel in New Shillong Township, Shillong — dorm beds, private rooms, Experience by XTSY and curated Meghalaya travel experiences. Check live rates and book direct.",
    keywords: "best hostel Shillong, biggest hostel northeast India, Shillong hostel, Meghalaya accommodation, budget stay Shillong",
  },
  travel: {
    title: "Meghalaya Tour Packages from ₹13,999 | XTSY",
    description: "Explore Meghalaya and Northeast India with curated itineraries, local experiences, transport and stays arranged by XTSY. Plan a trip around Dawki, Cherrapunji, living root bridges and more.",
    keywords: "Meghalaya tour packages, Northeast India tours, living root bridges tour, Cherrapunji tour, Dawki trip",
  },
  gallery: {
    title: "XTSY Photo Gallery — Hostel & Experience by XTSY Photos",
    description: "Browse photos of Meghalaya waterfalls, rivers, villages and viewpoints, alongside real images from XTSY stays and travel experiences in Shillong.",
    keywords: "XTSY photos, Shillong hostel gallery, glass suite photos, hostel rooms Meghalaya",
  },
  about: {
    title: "About XTSY — India's Biggest Hostel in Northeast",
    description: "Meet XTSY, a Shillong-based travel and hospitality brand operating XTSY Travellers Hostel and Experience by XTSY, with curated trips and services across Northeast India.",
    keywords: "XTSY about, biggest hostel northeast, Shillong hostel story, NEITA 2025",
  },
  booking: {
    title: "Book Shillong Hostel — Dorms ₹399+ | XTSY",
    description: "Check availability for XTSY dorm beds, private rooms and Experience by XTSY in New Shillong Township. Review your stay details and submit a direct booking enquiry.",
    keywords: "book hostel Shillong, hostel booking Meghalaya, Shillong room booking",
  },
  search: {
    title: "Search Rooms & Availability | XTSY Shillong",
    description: "Check room availability at XTSY Shillong. Compare dorms, private rooms, and Experience by XTSY. Instant booking confirmation.",
    keywords: "room search Shillong, hostel availability Meghalaya, XTSY rooms",
  },
  blog: {
    title: "Discover Meghalaya — Travel Guide & Destinations | XTSY",
    description: "14 must-visit Meghalaya destinations: Living Root Bridges, Dawki River, Nohkalikai Falls, Mawlynnong. Expert travel guides by XTSY.",
    keywords: "Meghalaya destinations, places to visit Meghalaya, living root bridges, Dawki, Nohkalikai Falls",
  },
  'pet-friendly': {
    title: "Pet-Friendly Hostel in Shillong | XTSY Travel",
    description: "Travel with your pet to XTSY Shillong. Dog-friendly rooms, open spaces, mountain walks. Northeast India's pet-friendly hostel.",
    keywords: "pet friendly hostel Shillong, dog friendly hotel Meghalaya, travel with pets India",
  },
  'female-travellers': {
    title: "Safe Stays for Women — Female Dorms | XTSY Shillong",
    description: "Female-only dorms with 24/7 security, CCTV, personal lockers. India's safest hostel for solo women travellers in Shillong.",
    keywords: "female hostel Shillong, women solo travel India, safe hostel women, girls dorm Meghalaya",
  },
  'work-from-home': {
    title: "Workation in Shillong — Co-Working Hostel | XTSY",
    description: "Remote work from XTSY Shillong. High-speed WiFi, mountain views, co-working space. The digital nomad's dream workation.",
    keywords: "workation Shillong, digital nomad hostel, co-working Meghalaya, remote work India",
  },
  'xtsy-vs-zostel': {
    title: "XTSY vs Zostel — Honest Hostel Comparison 2026",
    description: "How does XTSY compare to Zostel, The Hosteller, goSTOPS? Independent review of India's best hostels. Side-by-side comparison.",
    keywords: "XTSY vs Zostel, best hostel India comparison, Zostel alternative, hostel chain comparison",
  },
  'xtsy-270': {
    title: "Experience by XTSY — India's First Stargazing Room | XTSY",
    description: "India's first 270° panoramic glass suite in Shillong. Stargazing, mountain views, luxury glamping. Perfect for couples & anniversaries.",
    keywords: "glass suite Shillong, stargazing room India, luxury glamping Meghalaya, romantic stay Shillong",
  },
  'xtsy-rentals': {
    title: "Bike & Car Rentals in Shillong | XTSY Rentals",
    description: "Rent bikes, scooters & cars in Shillong. Royal Enfield, self-drive options. Explore Meghalaya at your own pace from ₹800/day.",
    keywords: "bike rental Shillong, car rental Meghalaya, Royal Enfield rent, self drive Shillong",
  },
  offers: {
    title: "Latest Offers & Deals — XTSY Hostel Shillong",
    description: "Exclusive discounts on XTSY stays and tours. Early bird deals, group discounts, seasonal offers. Save up to 30% on Meghalaya trips.",
    keywords: "XTSY offers, hostel deals Shillong, Meghalaya tour discount, budget stay deals",
  },
  properties: {
    title: "XTSY Properties — Hostels & Luxury Stays in Shillong",
    description: "Browse XTSY properties: Travellers Hostel and Experience by XTSY in New Shillong Township. Compare amenities, rooms, and book direct.",
    keywords: "XTSY properties, Shillong hostels, accommodation Meghalaya",
  },
  'privacy-policy': {
    title: "Privacy Policy | XTSY Travel",
    description: "Read how XTSY collects, uses, stores and protects personal information for accommodation bookings, travel enquiries and related services.",
    keywords: "XTSY privacy policy, data protection, DPDP compliance",
  },
  'terms-of-service': {
    title: "Terms of Service | XTSY Travel",
    description: "Terms and conditions for booking at XTSY Travellers Hostel Shillong. Cancellation policy, booking rules, and guest guidelines.",
    keywords: "XTSY terms, booking terms, hostel rules",
  },
  destinations: {
    title: "Top 10 Places to Visit in Meghalaya 2026 | XTSY Guide",
    description: "Complete Meghalaya travel guide: Living Root Bridges, Dawki, Cherrapunji, Mawlynnong & more. Plan your trip with XTSY.",
    keywords: "places to visit Meghalaya, Meghalaya tourist places, Meghalaya tourism, best time visit Meghalaya",
  },
  tours: {
    title: "Northeast India Tours from ₹7,999 | XTSY",
    description: "30+ curated tours across Meghalaya, Nagaland, Assam, Arunachal Pradesh & Sikkim. Living root bridges, safaris, tribal festivals. From ₹7,999.",
    keywords: "Northeast India tours, Meghalaya tour packages, Nagaland tours, Assam safari, Arunachal Pradesh trips, Sikkim tours",
  },
};

export const SEOHead = ({
  title,
  description,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  structuredData,
  structuredDataOnly = false,
  article,
}: SEOHeadProps) => {
  const finalTitle = title || DEFAULT_TITLE;
  const finalDescription = description || DEFAULT_DESCRIPTION;
  const schemas = structuredData
    ? (Array.isArray(structuredData) ? structuredData : [structuredData])
    : [];

  if (structuredDataOnly) {
    return (
      <Helmet>
        {schemas.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>
    );
  }

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {/* Canonicals are owned exclusively by TanStack route head(). */}
      {/* Global audience signals */}
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="coverage" content="Worldwide" />
      <meta name="distribution" content="Global" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {/* og:url is owned exclusively by TanStack route head(). */}
      <meta property="og:site_name" content="XTSY Travel" />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@xtsytravel" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
      {/* Article-specific meta */}
      {ogType === 'article' && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {ogType === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {ogType === 'article' && article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {ogType === 'article' && article?.section && (
        <meta property="article:section" content={article.section} />
      )}
      {ogType === 'article' && article?.tags?.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export const getSEOConfig = (page: keyof typeof SEO_CONFIG) => {
  return SEO_CONFIG[page] || SEO_CONFIG.home;
};

export default SEOHead;
