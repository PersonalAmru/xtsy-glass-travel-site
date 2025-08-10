import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { XTSY270_DATA } from '@/data/rooms/xtsy270';

const XTSY270: React.FC = () => {
  const title = XTSY270_DATA.seoTitle;
  const description = XTSY270_DATA.seoDescription;
  const canonicalUrl = XTSY270_DATA.canonicalUrl;

  const updateOrCreateMeta = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const addOrUpdateCanonical = (url: string) => {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  };

  useEffect(() => {
    document.title = title;
    updateOrCreateMeta('description', description);
    addOrUpdateCanonical(canonicalUrl);
  }, []);

  const roomLd = {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: XTSY270_DATA.name,
    description,
    url: canonicalUrl,
    occupancy: {
      '@type': 'QuantitativeValue',
      minValue: XTSY270_DATA.occupancy.min,
      maxValue: XTSY270_DATA.occupancy.max,
    },
    bed: {
      '@type': 'BedDetails',
      type: XTSY270_DATA.bed.type,
      numberOfBeds: XTSY270_DATA.bed.count,
    },
    amenityFeature: XTSY270_DATA.features.map((f) => ({ '@type': 'LocationFeatureSpecification', name: f, value: true })),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: XTSY270_DATA.priceCurrency,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <header className="py-14 px-4 text-center bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{XTSY270_DATA.name}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A signature luxury glass room with 270-degree panoramic views over Shillong's mountains and valleys.
              Designed for couples and discerning travelers seeking privacy, comfort, and an unforgettable horizon.
            </p>
          </div>
        </header>

        <main className="px-4 py-12">
          <article className="container mx-auto max-w-4xl prose dark:prose-invert">
            <section aria-labelledby="overview">
              <h2 id="overview">Overview</h2>
              <p>
                The XTSY 270° Panorama Glass Ensuite is our most exclusive accommodation: floor-to-ceiling glass on three sides,
                a private ensuite bath, and curated amenities that elevate your Shillong experience. Wake to first light over
                lush hills, unwind under the stars, and soak in uninterrupted scenery from the comfort of your bed.
              </p>
            </section>

            <section aria-labelledby="features" className="mt-8">
              <h2 id="features">Key Features</h2>
              <ul>
                <li>Expansive 270° glass architecture with insulated privacy glazing</li>
                <li>Private ensuite bathroom with premium fittings</li>
                <li>Queen bed with hotel-grade linen and dual pillows</li>
                <li>High-speed Wi‑Fi for seamless streaming and remote work</li>
                <li>Complimentary breakfast and access to common social spaces</li>
                <li>Climate control and blackout options for restful sleep</li>
              </ul>
            </section>

            <section aria-labelledby="details" className="mt-8">
              <h2 id="details">Room Details</h2>
              <dl>
                <dt>Occupancy</dt>
                <dd>Up to 2 guests</dd>
                <dt>View</dt>
                <dd>Mountain and valley panorama</dd>
                <dt>Bathroom</dt>
                <dd>Private ensuite</dd>
              </dl>
            </section>

            <aside aria-label="Booking information" className="mt-8">
              <p className="text-muted-foreground">
                Tip: For best sunrise and sunset light, request edge-side orientation at booking. Availability is limited.
              </p>
            </aside>
          </article>
        </main>

        <section className="py-8" aria-hidden="true">
          <div className="container mx-auto max-w-4xl">
            <a href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Book XTSY 270°
            </a>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(roomLd) }} />
      <Footer />
    </div>
  );
};

export default XTSY270;
