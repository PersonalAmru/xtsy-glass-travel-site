import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import { GONE_SLUGS } from '@/data/seoGoneSlugs';
import { useGoneStatus } from '@/hooks/useGoneStatus';
import { AnimatePresence, motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationGallery from '@/components/destinations/DestinationGallery';
import { useValidatedImages } from '@/hooks/useValidatedImages';
import DestinationCard from '@/components/destinations/DestinationCard';
import { MapPin, Calendar, Navigation, Lightbulb, Mountain, BookOpen, BedDouble, CalendarCheck } from 'lucide-react';
import StayEatExplore from '@/components/seo/StayEatExplore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { getDestinationGeo } from '@/data/destinationGeo';
import {
  getDestinationBySlug,
  getDestinationImages,
  meghalayaDestinations,
} from '@/data/meghalayaDestinations';

const DestinationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const destination = slug ? getDestinationBySlug(slug) : null;

  // Runtime 410 escalation: an admin can flag /places-to-visit/<slug> as Gone
  // in Supabase (seo_redirects) without a redeploy. Hook must run every render.
  const runtimeStatus = useGoneStatus(
    `/places-to-visit/${slug ?? ''}`,
    slug && GONE_SLUGS.has(slug) ? 410 : 404,
  );

  // 410 Gone — slug explicitly retired (compile-time list or runtime flag).
  if ((slug && GONE_SLUGS.has(slug)) || runtimeStatus === 410) {
    return <NotFound statusCode={410} />;
  }

  // Unknown destination slug → render a proper 404 (NOT a soft-404 redirect to
  // the pillar page, which wastes crawl budget and confuses Search Console).
  if (!destination) {
    return <NotFound />;
  }

  const images = getDestinationImages(destination.slug, 6);
  const nearby = destination.nearbyAttractions
    .map(name => meghalayaDestinations.find(d => d.name === name))
    .filter(Boolean) as typeof meghalayaDestinations;

  // Genuine, on-page FAQs generated from this destination's data. Rendered
  // visibly below AND emitted as FAQPage schema (Google requires the answer
  // text to be visible on the page to be eligible for the rich result).
  const topThings = destination.thingsToDo.slice(0, 3).join(', ');
  const faqs: { q: string; a: string }[] = [
    {
      q: `What is the best time to visit ${destination.name}?`,
      a: destination.bestTimeToVisit,
    },
    {
      q: `How do I reach ${destination.name} from Shillong?`,
      a: destination.howToReach,
    },
    {
      q: `What are the top things to do at ${destination.name}?`,
      a: `Popular things to do at ${destination.name} include ${topThings}. ${destination.shortDescription}`,
    },
    // Destination-specific extra FAQs (deep content for high-priority pages)
    ...(destination.extraFaqs ?? []),
    {
      q: `Where can I stay near ${destination.name}?`,
      a: `XTSY Travellers Hostel in Shillong is an affordable, well-located base for exploring ${destination.name} and the rest of ${destination.region}, with dorms from ₹369/night and curated Meghalaya tours that cover the region's top sights.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  // Category-aware internal links to concentrate authority on pillar pages.
  const categoryLink =
    destination.category === 'waterfall'
      ? { to: '/meghalaya-waterfalls', label: 'Waterfalls in Meghalaya' }
      : destination.category === 'viewpoint' || destination.category === 'peak'
      ? { to: '/meghalaya-viewpoints', label: 'Viewpoints in Meghalaya' }
      : { to: '/things-to-do-in-meghalaya', label: 'Things to Do in Meghalaya' };


  const geo = getDestinationGeo(destination.slug);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    '@id': `https://xtsy.one/places-to-visit/${destination.slug}#attraction`,
    name: destination.name,
    description: destination.shortDescription,
    url: `https://xtsy.one/places-to-visit/${destination.slug}`,
    touristType: [destination.category],
    isAccessibleForFree: true,
    publicAccess: true,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.lat,
      longitude: geo.lng,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lng}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: destination.region,
      addressRegion: 'Meghalaya',
      addressCountry: 'IN',
    },
    containedInPlace: {
      '@type': 'Place',
      name: `${destination.region}, Meghalaya`,
    },
    image: images.map(img => ({
      '@type': 'ImageObject',
      url: img.src,
      name: img.alt,
    })),
    datePublished: '2024-01-15',
    dateModified: '2026-06-25',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Things to Do in Meghalaya', item: 'https://xtsy.one/things-to-do-in-meghalaya' },
      { '@type': 'ListItem', position: 3, name: destination.name, item: `https://xtsy.one/places-to-visit/${destination.slug}` },
    ],
  };

  // Freshness signal — informational attraction pages rank better when Google
  // sees a recent update. Bumped each content refresh.
  const SEO_YEAR = 2026;
  const lastUpdated = `June ${SEO_YEAR}`;

  // Keyword-first title: lead with the exact head term (e.g. "Nohkalikai Falls"),
  // then high-CTR intent modifiers searchers want for an attraction. Adaptive so
  // long destination names don't blow past the SERP truncation width.
  // Priority pages can override with a hand-tuned, keyword-validated title.
  const titleModifiers =
    destination.name.length > 20
      ? 'Meghalaya Travel Guide'
      : `Meghalaya — How to Reach, Timings & Photos`;
  const pageTitle = destination.seoTitle ?? `${destination.name}, ${titleModifiers}`;

  const rawDescription =
    destination.seoDescription ??
    `${destination.name}, Meghalaya: ${destination.shortDescription} Best time to visit, how to reach, timings & travel tips — updated ${lastUpdated}.`;
  const pageDescription =
    rawDescription.length > 160
      ? `${rawDescription.slice(0, 157).replace(/\s+\S*$/, '')}…`
      : rawDescription;

  const pageKeywords =
    destination.seoKeywords ??
    `${destination.name}, ${destination.name} Meghalaya, places to visit ${destination.region}, ${destination.category} Meghalaya`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />

        <link rel="canonical" href={`https://xtsy.one/places-to-visit/${destination.slug}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://xtsy.one/places-to-visit/${destination.slug}`} />
        <meta property="og:image" content={images[0]?.src} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero Image Slideshow */}
        <HeroSlideshow images={images} destination={destination} />

        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-12">

          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Overview
            </h2>
            <div className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
              {destination.description}
            </div>
          </section>

          {/* Primary booking CTA — converts destination traffic into hostel bookings */}
          <DestinationBookingCTA destination={destination} placement="top" />


          {/* Deep-dive editorial sections (content depth for priority pages) */}
          {destination.deepDive && destination.deepDive.length > 0 && (
            <section className="space-y-8">
              {destination.deepDive.map((block, i) => (
                <div key={i}>
                  <h2 className="text-2xl font-bold text-foreground">{block.heading}</h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">{block.body}</p>
                </div>
              ))}
            </section>
          )}

          {/* Gallery */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Photo Gallery</h2>
            <DestinationGallery
              images={images}
              destinationName={destination.name}
              className="mt-4"
            />
          </section>

          {/* Best Time to Visit */}
          <section>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Best Time to Visit
            </h2>
            <p className="mt-3 text-muted-foreground">{destination.bestTimeToVisit}</p>
          </section>

          {/* Things to Do */}
          <section>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Mountain className="h-5 w-5 text-primary" /> Things to Do
            </h2>
            <ul className="mt-4 space-y-2">
              {destination.thingsToDo.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* How to Reach */}
          <section>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" /> How to Reach
            </h2>
            <p className="mt-3 text-muted-foreground">{destination.howToReach}</p>
          </section>

          {/* Travel Tips */}
          <section>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" /> Travel Tips
            </h2>
            <ul className="mt-4 space-y-2">
              {destination.travelTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-primary/60 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          {/* Nearby Attractions */}
          {nearby.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground">Nearby Attractions</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearby.map((dest) => (
                  <DestinationCard key={dest.slug} destination={dest} />
                ))}
              </div>
            </section>
          )}

          {/* FAQ — visible Q&A backed by FAQPage schema for rich SERP results */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">
              {destination.name} — Frequently Asked Questions
            </h2>
            <div className="mt-4 space-y-5">
              {faqs.map(({ q, a }, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-foreground">{q}</h3>
                  <p className="mt-1 text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-primary/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Book a Meghalaya Tour</h2>
            <p className="mt-2 text-muted-foreground">Experience {destination.name} and more with XTSY curated packages.</p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link to="/meghalaya-tour-packages" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                View Tour Packages
              </Link>
              <Link to="/things-to-do-in-meghalaya" className="px-6 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors">
                All Places to Visit
              </Link>
            </div>
          </section>

          {/* Stay · Eat · Catering · Tours — commercial internal-linking module */}
          <StayEatExplore context={destination.name} />


          {/* Internal Links */}
          <nav className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Guides</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to={categoryLink.to} className="text-sm text-primary hover:underline">{categoryLink.label}</Link>
              <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">Things to Do in Meghalaya</Link>
              <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">Meghalaya Tour Packages</Link>
              <Link to="/shillong-tour-package" className="text-sm text-primary hover:underline">Shillong Tour Package</Link>
              <Link to="/best-time-to-visit-meghalaya" className="text-sm text-primary hover:underline">Best Time to Visit</Link>
              <Link to="/meghalaya-travel-guide" className="text-sm text-primary hover:underline">Meghalaya Travel Guide</Link>
              <Link to="/best-hostel-in-shillong" className="text-sm text-primary hover:underline">Best Hostel in Shillong</Link>
              <Link to="/tours" className="text-sm text-primary hover:underline">Northeast India Tours</Link>
              <Link to="/meghalaya-photo-gallery" className="text-sm text-primary hover:underline">Photo Gallery</Link>
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const HeroSlideshow = ({ images, destination }: { images: { src: string; alt: string }[]; destination: any }) => {
  const { validImages, loading } = useValidatedImages(images);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % validImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [validImages.length]);

  return (
    <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-muted">
      {/* Always show two layers for crossfade — no blackout */}
      {validImages.length > 0 && (
        <>
          {/* Background layer: next image preloaded underneath */}
          <img
            src={validImages[(currentIndex + 1) % validImages.length]?.src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Foreground layer: current image with fade */}
          <AnimatePresence initial={false}>
            <motion.img
              key={currentIndex}
              src={validImages[currentIndex].src}
              alt={validImages[currentIndex].alt}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </AnimatePresence>
        </>
      )}
      {loading && validImages.length === 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 container mx-auto max-w-5xl">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Things to Do', href: '/things-to-do-in-meghalaya' },
          { label: destination.name },
        ]} />
        <h1 className="mt-3 text-3xl md:text-5xl font-bold text-foreground">
          {destination.name}
        </h1>
        <p className="mt-1 text-base md:text-lg font-medium text-muted-foreground">
          Meghalaya Travel Guide · Updated June 2026
        </p>
        <div className="mt-2 flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{destination.region}, Meghalaya</span>
          <span className="mx-1">·</span>
          <span className="capitalize">{destination.category}</span>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
