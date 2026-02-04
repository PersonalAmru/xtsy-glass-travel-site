/**
 * SEOHead - Dynamic meta tags for React pages
 * Uses react-helmet for actual <head> injection
 */

import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

const DEFAULT_TITLE = "XTSY Travel - Best Hostel in India | Biggest Hostel in Shillong, Meghalaya";
const DEFAULT_DESCRIPTION = "XTSY Travel - India's best hostel experience in Shillong, Meghalaya. The biggest hostel in North East India offering luxury accommodations, budget stays, and unforgettable travel experiences.";
const DEFAULT_OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png";
const SITE_URL = "https://xtsy.one";

const SEO_CONFIG: Record<string, { title: string; description: string; keywords?: string }> = {
  home: {
    title: "XTSY Travel - Best Hostel in India | #1 Gen Z Choice in Shillong, Meghalaya",
    description: "XTSY Travel - India's best Gen Z-friendly hostel in Shillong, Meghalaya. The biggest hostel in North East India with Instagram-worthy accommodations, sustainable practices, and authentic experiences.",
    keywords: "best hostel India, biggest hostel Shillong, Gen Z hostel, digital nomad hostel, solo travel India",
  },
  travel: {
    title: "Best Tour Packages from India's Top Hostel | XTSY Travellers Hostel",
    description: "Explore Northeast India with curated tour packages from XTSY Travellers Hostel. Living root bridges, waterfalls, tribal cultures, and authentic experiences for young travelers.",
    keywords: "Northeast India tours, Meghalaya tour packages, living root bridges tour, Shillong travel packages",
  },
  gallery: {
    title: "Photo Gallery - XTSY Travellers Hostel | Best Gen Z Hostel in India",
    description: "Explore stunning visuals of XTSY Travellers Hostel. See why young travelers choose us for Instagram-worthy stays and authentic experiences.",
    keywords: "Instagram worthy hostel, hostel photos India, Shillong accommodation photos",
  },
  about: {
    title: "About XTSY | India's First 270° Glass Ensuite & Biggest Hostel in North East",
    description: "Discover XTSY – India's biggest hostel in North East India featuring India's first 270° stargazing glass suite and premium group accommodations.",
    keywords: "XTSY about, biggest hostel northeast, 270° glass room Shillong, xtsyonellp",
  },
  booking: {
    title: "Book Your Stay | XTSY Travellers Hostel - Best Hostel in Shillong",
    description: "Book your stay at India's best hostel. Choose from luxury glass suites, premium dormitories, and budget-friendly options in Shillong, Meghalaya.",
    keywords: "book hostel Shillong, hostel booking India, dormitory booking Meghalaya",
  },
  search: {
    title: "Search Rooms | XTSY Travellers Hostel",
    description: "Find the perfect room at XTSY. Compare prices, check availability, and book your stay at India's biggest hostel in Shillong.",
    keywords: "room search hostel, Shillong rooms, hostel availability",
  },
};

export const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
}: SEOHeadProps) => {
  const finalTitle = title || DEFAULT_TITLE;
  const finalDescription = description || DEFAULT_DESCRIPTION;
  const finalCanonical = canonicalUrl || SITE_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content="XTSY Travel" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

// Helper function to get SEO config by page
export const getSEOConfig = (page: keyof typeof SEO_CONFIG) => {
  return SEO_CONFIG[page] || SEO_CONFIG.home;
};

export default SEOHead;
