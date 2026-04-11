import { useParams, Link } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthorBox from '@/components/seo/AuthorBox';
import TrustSignals from '@/components/seo/TrustSignals';
import TopicalClusterNav from '@/components/seo/TopicalClusterNav';
import ConversionLinks from '@/components/seo/ConversionLinks';
import { findSEOPage, getRelatedPages, getPagesByCategory, type SEOPageData } from '@/data/seoPages';
import { getWheelLinks } from '@/data/seoLinkingWheel';
import { getHeroImageForPage } from '@/utils/seoHeroImages';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, memo } from 'react';

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
    Object.assign(base, {
      address: { '@type': 'PostalAddress', streetAddress: 'Mawdiangdiang Road', addressLocality: 'Shillong', addressRegion: 'Meghalaya', postalCode: '793018', addressCountry: 'IN' },
      telephone: '+91-8837317070',
      priceRange: '₹450 - ₹8,500',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '320', bestRating: '5' },
      geo: { '@type': 'GeoCoordinates', latitude: 25.5788, longitude: 91.8933 },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Restaurant', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
      ],
    });
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
    cssSelector: ['article h1', 'article h2', 'article p:first-of-type'],
  };

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

  if (!page) return <NotFound />;

  const related = getRelatedPages(page.slug);
  const categoryLabel = categoryLabels[page.category] || page.category;
  const heroImage = getHeroImageForPage(page.slug, page.category);
  
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
            const target = e.currentTarget;
            target.style.display = 'none';
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

      <main className="pt-6">
        <article className="container mx-auto px-4 max-w-4xl pb-10">
          <p className="text-lg text-muted-foreground leading-relaxed">{page.intro}</p>

          {/* Trust Signals */}
          <TrustSignals />

          {/* Quick Conversion Links */}
          <ConversionLinks />

          {/* CTA Banner */}
          <div className="mt-8 bg-primary/10 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold text-foreground">Ready to explore?</p>
              <p className="text-sm text-muted-foreground">Book your stay at XTSY Travellers Hostel — rated 4.8★ on Google</p>
            </div>
            <a
              href={page.ctaLink}
              target={page.ctaLink.startsWith('http') ? '_blank' : undefined}
              rel={page.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              {page.ctaText}
            </a>
          </div>

          {/* Content Sections */}
          <div className="mt-10 space-y-8">
            {page.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-xl font-bold text-foreground mb-3">{section.heading}</h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
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
            ))}
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

          {/* Bottom CTA */}
          <section className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Plan Your Meghalaya Trip with XTSY</h2>
            <p className="mt-2 text-muted-foreground">Stay at Shillong's #1 rated hostel. Dorms from ₹499, private rooms from ₹1,499.</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a href={page.ctaLink} target={page.ctaLink.startsWith('http') ? '_blank' : undefined} rel={page.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                {page.ctaText}
              </a>
              <a href="https://wa.me/918787537633?text=Hi, I need help planning my Meghalaya trip" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors">
                Chat on WhatsApp
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
