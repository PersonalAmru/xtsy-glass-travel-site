import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationGallery from '@/components/destinations/DestinationGallery';
import DestinationCard from '@/components/destinations/DestinationCard';
import { MapPin, Calendar, Navigation, Lightbulb, Mountain, BookOpen } from 'lucide-react';
import {
  getDestinationBySlug,
  getDestinationImages,
  meghalayaDestinations,
} from '@/data/meghalayaDestinations';

const DestinationDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const destination = slug ? getDestinationBySlug(slug) : null;

  if (!destination) {
    return <Navigate to="/things-to-do-in-meghalaya" replace />;
  }

  const images = getDestinationImages(destination.slug, 6);
  const nearby = destination.nearbyAttractions
    .map(name => meghalayaDestinations.find(d => d.name === name))
    .filter(Boolean) as typeof meghalayaDestinations;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.shortDescription,
    touristType: [destination.category],
    geo: { '@type': 'GeoCoordinates' },
    image: images.map(img => ({
      '@type': 'ImageObject',
      url: img.src,
      name: img.alt,
    })),
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

  const pageTitle = `${destination.name} Travel Guide — Places to Visit in Meghalaya`;
  const pageDescription = `${destination.shortDescription} Complete guide with photos, how to reach, best time to visit, and travel tips.`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${destination.name}, ${destination.name} Meghalaya, places to visit ${destination.region}, ${destination.category} Meghalaya`} />
        <link rel="canonical" href={`https://xtsy.one/places-to-visit/${destination.slug}`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://xtsy.one/places-to-visit/${destination.slug}`} />
        <meta property="og:image" content={images[0]?.src} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero Image */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-muted">
          <img
            src={images[0]?.src}
            alt={`${destination.name} Meghalaya aerial view`}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 container mx-auto max-w-5xl">
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Things to Do', href: '/things-to-do-in-meghalaya' },
              { label: destination.name },
            ]} />
            <h1 className="mt-3 text-3xl md:text-5xl font-bold text-foreground">
              {destination.name} Travel Guide
            </h1>
            <div className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{destination.region}, Meghalaya</span>
              <span className="mx-1">·</span>
              <span className="capitalize">{destination.category}</span>
            </div>
          </div>
        </div>

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

          {/* Internal Links */}
          <nav className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Guides</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">Things to Do in Meghalaya</Link>
              <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">Meghalaya Tour Packages</Link>
              <Link to="/shillong-tour-package" className="text-sm text-primary hover:underline">Shillong Tour Package</Link>
              <Link to="/best-time-to-visit-meghalaya" className="text-sm text-primary hover:underline">Best Time to Visit</Link>
              <Link to="/meghalaya-photo-gallery" className="text-sm text-primary hover:underline">Photo Gallery</Link>
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DestinationDetail;
