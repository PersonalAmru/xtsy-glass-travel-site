import { useParams, Link, Navigate } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorBox from '@/components/seo/AuthorBox';
import TrustSignals from '@/components/seo/TrustSignals';
import TopicalClusterNav from '@/components/seo/TopicalClusterNav';
import ConversionLinks from '@/components/seo/ConversionLinks';
import { findSEOPage, getRelatedPages, getPagesByCategory, type SEOPageData } from '@/data/seoPages';
import { RECOVERY_REDIRECTS } from '@/data/seoAffectedSlugs';
import { getWheelLinks } from '@/data/seoLinkingWheel';
import { getHeroImageForPage, getAIHeroURL, getSectionImage } from '@/utils/seoHeroImages';
import { Check, ChevronDown, ChevronUp, MessageCircle, Sparkles } from 'lucide-react';
import { useState, memo, useEffect } from 'react';

const categoryLabels: Record<string, string> = {
  hostels: 'Hostels', hotels: 'Hotels', homestays: 'Homestays', glamping: 'Glamping',
  accommodation: 'Accommodation', rentals: 'Rentals', tours: 'Tour Packages',
  'travel-guides': 'Travel Guides', destinations: 'Destinations', attractions: 'Attractions',
  itineraries: 'Itineraries', activities: 'Activities', hospitals: 'Near Hospitals',
  restaurants: 'Dining', weddings: 'Weddings & Events', transport: 'Transport',
  'competitor-capture': 'Hostel Comparison', 'food-dining': 'Food & Dining',
  seasonal: 'Seasonal Guides', events: 'Events', 'travel-agency': 'Travel Agency',
};

const buildSchema = (page: SEOPageData) => {
  const base: any = {
    '@context': 'https://schema.org',
    '@type': page.schemaType,
    name: page.h1,
    description: page.metaDescription,
    url: `https://xtsy.one/${page.slug}`,
  };

  if (['Hostel', 'Hotel', 'LodgingBusiness'].includes(page.schemaType)) {
    const todayISO = new Date().toISOString().split('T')[0];
    // Only attach reviews/ratings to TRUE property routes (avoid review-spam penalty
    // on programmatic informational pages like /from-delhi-to-shillong-hostel)
    const PROPERTY_ROUTES = new Set([
      'best-hostel-in-shillong',
      'xtsy-travellers-hostel',
      'experience-by-xtsy',
      'xtsy-270-glasshouse',
      'hostel-shillong',
    ]);
    const isRealProperty = PROPERTY_ROUTES.has(page.slug);

    Object.assign(base, {
      address: { '@type': 'PostalAddress', streetAddress: 'Mawdiangdiang Road', addressLocality: 'Shillong', addressRegion: 'Meghalaya', postalCode: '793018', addressCountry: 'IN' },
      telephone: '+91-8837317070',
      priceRange: '₹329 - ₹4,999',
      geo: { '@type': 'GeoCoordinates', latitude: 25.5788, longitude: 91.8933 },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Restaurant', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
      ],
      // Canonical published rates (synced with rateSanityCheck.ts)
      makesOffer: [
        {
          '@type': 'Offer',
          name: 'Dorm Bed (8-Bed Mixed)',
          priceCurrency: 'INR',
          price: '329',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          validFrom: todayISO,
          url: 'https://xtsy.one/book',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '329',
            priceCurrency: 'INR',
            unitText: 'night',
          },
        },
        {
          '@type': 'Offer',
          name: 'King Double Room',
          priceCurrency: 'INR',
          price: '2399',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/LimitedAvailability',
          validFrom: todayISO,
          url: 'https://xtsy.one/book',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '2399',
            priceCurrency: 'INR',
            unitText: 'night',
          },
        },
      ],
    });

    if (isRealProperty) {
      base.aggregateRating = { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '320', bestRating: '5', worstRating: '1' };
    }
  }

  if (page.schemaType === 'TouristTrip') {
    Object.assign(base, {
      touristType: 'Adventure',
      provider: { '@type': 'TravelAgency', name: 'XTSY Travel', url: 'https://xtsy.one', telephone: '+91-8837317070' },
    });
  }

  if (page.schemaType === 'TouristAttraction') {
    Object.assign(base, {
      isAccessibleForFree: true,
      address: { '@type': 'PostalAddress', addressRegion: 'Meghalaya', addressCountry: 'IN' },
    });
  }

  if (page.schemaType === 'Restaurant') {
    Object.assign(base, {
      servesCuisine: ['Indian', 'Continental', 'Local Khasi'],
      address: { '@type': 'PostalAddress', streetAddress: 'Mawdiangdiang Road', addressLocality: 'Shillong', addressRegion: 'Meghalaya', postalCode: '793018', addressCountry: 'IN' },
      telephone: '+91-8837317070',
    });
  }

  // Add dateModified to ALL schema types for freshness signals
  const dateModified = new Date().toISOString().split('T')[0];

  if (['TravelGuide', 'Article'].includes(page.schemaType)) {
    Object.assign(base, {
      author: { '@type': 'Organization', name: 'XTSY Travel', url: 'https://xtsy.one' },
      publisher: { '@type': 'Organization', name: 'XTSY Travel', url: 'https://xtsy.one', logo: { '@type': 'ImageObject', url: 'https://xtsy.one/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png' } },
      datePublished: '2025-01-01',
      dateModified,
    });
  } else {
    base.dateModified = dateModified;
  }

  // Speakable schema for AI citation eligibility (SGE, ChatGPT, Perplexity)
  base.speakable = {
    '@type': 'SpeakableSpecification',
    cssSelector: ['article h1', 'article h2', 'article p:first-of-type', 'article [data-quick-answer]'],
  };

  // Quick Answer for AI Answer Engines
  if (page.quickAnswer) {
    base.abstract = page.quickAnswer;
  }

  return base;
};

const buildFAQSchema = (faqs: SEOPageData['faqs']) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question', name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
});

const buildBreadcrumbSchema = (page: SEOPageData, categoryLabel: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
    { '@type': 'ListItem', position: 2, name: categoryLabel, item: 'https://xtsy.one/things-to-do-in-meghalaya' },
    { '@type': 'ListItem', position: 3, name: page.h1 },
  ],
});

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'XTSY Travellers Hostel',
  url: 'https://xtsy.one',
  logo: 'https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png',
  sameAs: ['https://www.instagram.com/xtsytravellershostel', 'https://www.facebook.com/xtsytravellershostel'],
  contactPoint: { '@type': 'ContactPoint', telephone: '+91-8837317070', contactType: 'customer service' },
};

const DEFAULT_OG_IMAGE = 'https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png';

const FAQItem = memo(({ faq }: { faq: { question: string; answer: string } }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left">
        <span className="font-medium text-foreground text-sm">{faq.question}</span>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && <div className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</div>}
    </div>
  );
});
FAQItem.displayName = 'FAQItem';

const LINK_TYPE_LABELS: Record<string, string> = {
  homepage: '🏠', 'master-pillar': '📖', pillar: '📚', destination: '📍', attraction: '🎯', itinerary: '🗓️',
};

const WheelLinksNav = memo(({ slug }: { slug: string }) => {
  const links = getWheelLinks(slug);
  if (links.length === 0) return null;
  return (
    <nav className="mt-10 border border-border rounded-xl p-5 bg-muted/20" aria-label="Related destinations">
      <h3 className="text-sm font-semibold text-foreground mb-3">🔗 Explore Related Pages</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {links.map(link => (
          <Link
            key={link.slug}
            to={`/${link.slug}`}
            className="flex items-center gap-1.5 text-sm text-primary hover:underline py-1"
          >
            <span aria-hidden="true">{LINK_TYPE_LABELS[link.type]}</span>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
});
WheelLinksNav.displayName = 'WheelLinksNav';

const ProgrammaticSEOPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? findSEOPage(slug) : undefined;

  // Hook order must be stable across renders — declare hooks BEFORE any early return
  const curatedHero = page ? getHeroImageForPage(page.slug, page.category) : '';
  const aiHero = page ? getAIHeroURL(page.slug) : '';
  const [heroSrc, setHeroSrc] = useState(curatedHero);

  useEffect(() => {
    if (!page) return;
    // Probe AI hero; fall back silently to curated if missing
    const img = new Image();
    img.onload = () => setHeroSrc(aiHero);
    img.onerror = () => setHeroSrc(curatedHero);
    img.src = aiHero;
  }, [page, aiHero, curatedHero]);

  // GSC RECOVERY: redirect known dead slugs to closest canonical page so
  // Google consolidates link equity instead of seeing a soft-404.
  // 1. Hard-coded recovery map (compiled in)
  if (!page && slug && RECOVERY_REDIRECTS[slug]) {
    return <Navigate to={RECOVERY_REDIRECTS[slug]} replace />;
  }

  // 2. DB-managed redirects via /admin/seo/recovery — checked async, falls through to NotFound (which renders proper 404 chrome) if missing.
  if (!page) return <NotFound />;

  // Wave 1A — Thin-content guard. Pages with <3 sections OR <600 chars total body fall through to NotFound
  // to avoid Google soft-404 / "doorway page" penalties.
  const totalBodyLen =
    (page.intro?.length || 0) +
    page.sections.reduce((acc, s) => acc + (s.content?.length || 0), 0);
  if (page.sections.length < 3 || totalBodyLen < 600) {
    return <NotFound />;
  }

  const related = getRelatedPages(page.slug);
  const categoryLabel = categoryLabels[page.category] || page.category;
  const heroImage = heroSrc || curatedHero;

  // Programmatic pages must NOT show specific prices (they drift, mislead, and
  // create indexing risk on aggregator pages). Strip ₹ amounts and "from ₹X"
  // phrasing — replace with generic "starting at best rate" so WhatsApp/booking
  // becomes the source of truth.
  const stripPrice = (s: string): string => s
    ?.replace(/(from|starting at|just|only|@|at)?\s*₹\s?[\d,]+(\s?\/\s?(night|person|pp|stay|day))?/gi, 'on request')
    ?.replace(/\bRs\.?\s*[\d,]+\b/gi, 'on request')
    ?.replace(/\bINR\s*[\d,]+\b/gi, 'on request')
    ?.replace(/\b(?:starting|priced)\s+(?:at\s+)?on request/gi, 'on request')
    ?? s;

  const safeIntro = stripPrice(page.intro || '');
  const safeQuickAnswer = stripPrice(page.quickAnswer || '');

  const waBookHref = `https://wa.me/918837317070?text=${encodeURIComponent(`Hi XTSY! I want to BOOK: ${page.h1}`)}`;
  const waQuoteHref = `https://wa.me/918837317070?text=${encodeURIComponent(`Hi XTSY! Please share a QUOTE for: ${page.h1}`)}`;
  const waLink = waQuoteHref;

  const categoryPages = getPagesByCategory(page.category)
    .filter(p => p.slug !== page.slug)
    .slice(0, 6);


  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.metaDescription} />
        <meta name="keywords" content={page.keywords.join(', ')} />
        <link rel="canonical" href={`https://xtsy.one/${page.slug}`} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:url" content={`https://xtsy.one/${page.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={heroImage || DEFAULT_OG_IMAGE} />
        <meta property="og:site_name" content="XTSY Travel" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.title} />
        <meta name="twitter:description" content={page.metaDescription} />
        <meta name="twitter:image" content={heroImage || DEFAULT_OG_IMAGE} />
        <meta name="author" content="XTSY Travel Team" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <script type="application/ld+json">{JSON.stringify(buildSchema(page))}</script>
        <script type="application/ld+json">{JSON.stringify(buildBreadcrumbSchema(page, categoryLabel))}</script>
        <script type="application/ld+json">{JSON.stringify(ORG_SCHEMA)}</script>
        {page.faqs.length > 0 && (
          <script type="application/ld+json">{JSON.stringify(buildFAQSchema(page.faqs))}</script>
        )}
      </Helmet>

      <Header />

      {/* Hero Banner */}
      <div className="relative w-full h-[40vh] min-h-[280px] max-h-[420px] overflow-hidden">
        <img
          src={heroImage}
          alt={page.h1}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          onError={(e) => {
            // Wave 1M — never display:none; cascade through AI hero → curated → brand placeholder
            const target = e.currentTarget;
            const BRAND_FALLBACK = '/lovable-uploads/8059ea95-94d4-46f8-bea8-7c19b95dc4d2.png';
            if (target.src !== aiHero && aiHero) {
              target.src = aiHero;
            } else if (target.src !== curatedHero && curatedHero) {
              target.src = curatedHero;
            } else if (!target.src.endsWith(BRAND_FALLBACK)) {
              target.src = BRAND_FALLBACK;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 max-w-4xl pb-6">
          <Breadcrumbs items={[
            { label: 'Home', href: '/' },
            { label: categoryLabel, href: '/things-to-do-in-meghalaya' },
            { label: page.h1 },
          ]} />
          <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight drop-shadow-sm">
            {page.h1}
          </h1>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>Updated: April 2026</span>
            <span>•</span>
            <span>By XTSY Travel Team</span>
            <span>•</span>
            <span>Based in Shillong, Meghalaya</span>
          </div>
        </div>
      </div>

      <main className="pt-6 pb-32">
        <article className="container mx-auto px-4 max-w-4xl pb-10">
          <p className="text-lg text-muted-foreground leading-relaxed">{safeIntro}</p>

          {/* AI Quick Answer for Travelers — Speakable schema target, AI Answer Engine optimised */}
          {safeQuickAnswer && (
            <div className="mt-6 border-l-4 border-primary bg-primary/5 rounded-r-xl p-5" data-quick-answer>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2">
                <Sparkles className="h-4 w-4" />
                Quick Answer for Travelers
              </div>
              <p className="text-foreground leading-relaxed">{safeQuickAnswer}</p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                Get instant help on WhatsApp
              </a>
            </div>
          )}

          {/* Trust Signals */}
          <TrustSignals />

          {/* Quick Conversion Links */}
          <ConversionLinks />

          {/* Primary CTA Banner — no prices, WhatsApp first */}
          <div className="mt-8 bg-primary/10 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-foreground">Plan this with XTSY</p>
              <p className="text-sm text-muted-foreground">Get a tailored quote, real-time availability, and local-expert advice — usually within minutes on WhatsApp.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <a
                href={waBookHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-center"
              >
                Book Now
              </a>
              <a
                href={waQuoteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors text-center"
              >
                Check Quote
              </a>
            </div>
          </div>

          {/* Content Sections — Wave 3B injects contextual images on every other section */}
          <div className="mt-10 space-y-8">
            {page.sections.map((section, i) => {
              const showImg = i > 0 && i % 2 === 1;
              const sectionImg = showImg ? getSectionImage(page.slug, i, heroImage) : null;
              return (
                <section key={i}>
                  <h2 className="text-xl font-bold text-foreground mb-3">{section.heading}</h2>
                  {sectionImg && (
                    <img
                      src={sectionImg}
                      alt={`${section.heading} — ${page.h1}`}
                      loading="lazy"
                      className="w-full h-56 sm:h-64 object-cover rounded-xl mb-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <p className="text-muted-foreground leading-relaxed">{stripPrice(section.content)}</p>
                  {section.listItems && (
                    <ul className="mt-3 space-y-2">
                      {section.listItems.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>

          {/* Topical Cluster Navigation */}
          <TopicalClusterNav category={page.category} currentSlug={page.slug} />

          {/* Author Box - E-E-A-T */}
          <AuthorBox />

          {/* FAQ Section */}
          {page.faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {page.faqs.map((faq, i) => (
                  <FAQItem key={i} faq={faq} />
                ))}
              </div>
            </section>
          )}

          {/* Bottom CTA — no prices, WhatsApp first */}
          <section className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Plan Your Meghalaya Trip with XTSY</h2>
            <p className="mt-2 text-muted-foreground">Talk to our local team for live availability, custom itineraries, and the best rate for your dates — usually within minutes on WhatsApp.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a href={waBookHref} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Book Now
              </a>
              <a href={waQuoteHref} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors">
                Check Quote
              </a>
            </div>
          </section>

          {/* Internal Linking Wheel */}
          <WheelLinksNav slug={page.slug} />

          {/* Same-Category Pages */}
          {categoryPages.length > 0 && (
            <nav className="mt-10 border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">More {categoryLabel}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categoryPages.map(rp => (
                  <Link key={rp.slug} to={`/${rp.slug}`} className="text-sm text-primary hover:underline">
                    {rp.h1}
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {/* Related Pages */}
          {related.length > 0 && (
            <nav className="mt-8 border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Related Pages</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {related.map(rp => (
                  <Link key={rp.slug} to={`/${rp.slug}`} className="text-sm text-primary hover:underline">
                    {rp.h1}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ProgrammaticSEOPage;
