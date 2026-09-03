import { memo } from 'react';
import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BookDirectComparison from '@/components/hostel/BookDirectComparison';
import { hostelDealFaqs } from '@/data/hostelBookingFaqs';
import {
  MapPin, Navigation, Clock, Phone, MessageCircle, Star,
  Plane, Bus, Car, Footprints, Compass, Check, Wifi, Shield,
} from 'lucide-react';

/**
 * /hostel-near-me — geo-intent landing page.
 * Distinct positioning from /hostel-booking: this page answers the
 * "hostels near me / near Police Bazar / near Guwahati airport" query
 * with unique location, distance, and transit copy.
 */
const HostelNearMe = memo(() => {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': ['Hostel', 'LocalBusiness', 'LodgingBusiness'],
    '@id': 'https://xtsy.one/hostel-near-me#local',
    name: 'XTSY Travellers Hostel — Nearest Backpacker Hostel in Shillong',
    alternateName: ['XTSY Hostel Shillong', 'Hostel near Police Bazar Shillong'],
    description:
      'The closest verified backpacker hostel to Police Bazar, Ward\'s Lake and Shillong city centre. Walkable to cafés, transport hubs and viewpoints — dorm beds from ₹369, 4.8★ from 161 verified guests.',
    url: 'https://xtsy.one/hostel-near-me',
    telephone: '+918837317070',
    email: 'stay@xtsy.one',
    priceRange: '₹369 - ₹9,999',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
    image: [
      'https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mawkhar, near Police Bazar',
      addressLocality: 'Shillong',
      addressRegion: 'Meghalaya',
      postalCode: '793001',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 25.5788, longitude: 91.8933 },
    hasMap: 'https://maps.google.com/?q=25.5788,91.8933',
    areaServed: [
      { '@type': 'City', name: 'Shillong' },
      { '@type': 'AdministrativeArea', name: 'East Khasi Hills' },
      { '@type': 'AdministrativeArea', name: 'Meghalaya' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    checkinTime: '13:00',
    checkoutTime: '11:00',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '161',
      bestRating: '5',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: '24/7 Reception', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Luggage Storage', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Female-only Dorm', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Locker Storage', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'CCTV Security', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Airport Transfer', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'On-site Café (TAB Bistro)', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Bike / Car Rentals', value: true },
    ],
    knowsLanguage: ['English', 'Hindi', 'Khasi', 'Bengali', 'Assamese'],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Hostel Near Me', item: 'https://xtsy.one/hostel-near-me' },
    ],
  };

  const nearby = [
    { icon: Footprints, place: 'Police Bazar (city centre)', distance: '1.2 km', time: '5 min drive · 15 min walk' },
    { icon: Footprints, place: "Ward's Lake", distance: '1.4 km', time: '6 min drive' },
    { icon: Footprints, place: 'Don Bosco Museum', distance: '2.1 km', time: '8 min drive' },
    { icon: Bus, place: 'MTC Bus Stand', distance: '1.5 km', time: '6 min drive' },
    { icon: Car, place: 'Shared Sumo Stand (for Cherrapunji / Dawki)', distance: '1.8 km', time: '7 min drive' },
    { icon: Compass, place: 'Shillong Peak Viewpoint', distance: '8 km', time: '25 min drive' },
    { icon: Compass, place: 'Elephant Falls', distance: '11 km', time: '30 min drive' },
    { icon: Plane, place: 'Guwahati Airport (GAU)', distance: '124 km', time: '3 hr — pre-book transfer' },
    { icon: Plane, place: 'Shillong Airport (SHL, Umroi)', distance: '30 km', time: '1 hr drive' },
  ];

  const faqs = [
    {
      q: 'Where exactly is the nearest XTSY hostel to me in Shillong?',
      a: 'XTSY Travellers Hostel is in Mawkhar, ~1.2 km from Police Bazar — the most central hostel address in Shillong. GPS: 25.5788° N, 91.8933° E. Walking distance from most city cafés and viewpoints; 5-minute drive from the main taxi and bus stands.',
    },
    {
      q: 'Which is the closest hostel to Guwahati airport (GAU)?',
      a: 'From GAU, XTSY Shillong is the closest verified backpacker hostel with a direct pickup service — 124 km, ~3 hours via NH6. Pre-book a shared cab (₹700/seat) or private sedan (₹3,500) at the time of booking. No airport hostel in Guwahati beats the value of arriving straight in the hills.',
    },
    {
      q: 'Is there a hostel near Police Bazar Shillong?',
      a: 'Yes — XTSY Travellers Hostel is the nearest budget hostel to Police Bazar (1.2 km / 5 min drive). Walkable in daylight; use Ola/Uber or a local taxi (₹80–120) after dark.',
    },
    {
      q: 'How do I reach XTSY from where I am right now?',
      a: 'Open Google Maps and search "XTSY Travellers Hostel Shillong" or tap the "Get Directions" button on this page. From Guwahati Railway Station, take a shared Sumo (₹250, 3.5 hr) to Police Bazar and taxi 1.2 km to the hostel.',
    },
    {
      q: 'Are there other hostels near me in Shillong worth comparing?',
      a: 'Shillong has ~6 verified hostels. XTSY is the largest (India\'s biggest hostel in the northeast), highest rated (4.8★, 161 verified reviews) and closest to Police Bazar. Compare on /xtsy-vs-zostel or /best-hostel-in-shillong.',
    },
    {
      q: 'Can I walk-in without booking online?',
      a: 'Walk-ins are welcome subject to availability. Outside Oct–May peak, dorm beds are usually free. Call +91 88373 17070 before arriving so we can hold a bed for 2 hours — or book online with instant confirmation.',
    },
    ...hostelDealFaqs,
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <meta
          name="description"
          content="Looking for a hostel near you in Shillong? XTSY is 1.2 km from Police Bazar — the closest verified backpacker hostel with dorm beds from ₹369, 4.8★ from 161 verified guests. Get directions, distances & instant booking."
        />
        <meta
          name="keywords"
          content="hostel near me, hostel near me shillong, hostel near police bazar, backpacker hostel near me, closest hostel shillong, hostel near guwahati airport"
        />
        <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />

      <main>
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-4 bg-gradient-to-br from-primary/10 via-background to-brand-ember/10">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <MapPin className="h-4 w-4" /> 1.2 km from Police Bazar, Shillong
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Hostel Near Me in Shillong
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              XTSY Travellers Hostel is the <strong>closest verified backpacker hostel</strong> to
              Shillong city centre — walkable to Police Bazar, Ward's Lake and the Sumo stand for
              Cherrapunji & Dawki. Dorm beds from <strong>₹369</strong>, 4.8★ from 161 verified guests.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <a
                  href="https://maps.google.com/?q=25.5788,91.8933"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="mr-2 h-4 w-4" /> Get Directions
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/book">Check availability</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+918837317070">
                  <Phone className="mr-2 h-4 w-4" /> Call now
                </a>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>4.8 / 5 · 161 verified guest reviews</span>
            </div>
          </div>
        </section>

        {/* Nearby distances */}
        <section className="py-14 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold mb-2">Distance from key Shillong landmarks</h2>
            <p className="text-muted-foreground mb-8">
              Every distance is measured from our front door in Mawkhar. If you're searching
              "hostel near me" from any of these locations, XTSY is your closest verified match.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {nearby.map(({ icon: Icon, place, distance, time }) => (
                <Card key={place} className="border border-border/60">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{place}</div>
                      <div className="text-sm text-muted-foreground">
                        {distance} · {time}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why nearest matters */}
        <section className="py-14 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold mb-6">
              Why the "nearest hostel" actually matters in Shillong
            </h2>
            <div className="grid gap-6 md:grid-cols-2 text-muted-foreground">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  <Clock className="inline h-5 w-5 mr-1 text-primary" /> Late arrivals from Guwahati
                </h3>
                <p>
                  Most travellers land at GAU by evening and reach Shillong after 8 PM. Being 1.2 km
                  from Police Bazar means your driver knows the drop point, cabs are available, and
                  you're not stuck in Laitumkhrah or Nongthymmai far from food and taxis.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  <Compass className="inline h-5 w-5 mr-1 text-primary" /> Day trips to Cherrapunji & Dawki
                </h3>
                <p>
                  Shared Sumos to Cherrapunji, Dawki and Mawlynnong leave from the Bara Bazar stand
                  (1.8 km). Staying close means catching the 6 AM departure without a ₹300 taxi
                  from a far-flung hostel.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  <Wifi className="inline h-5 w-5 mr-1 text-primary" /> Café & remote-work density
                </h3>
                <p>
                  Café Shillong, Dylan's, ML05 and Cloud 9 are all under 2 km. If you're a digital
                  nomad searching "hostel near me with WiFi", the Mawkhar cluster wins on
                  fibre coverage and 4G/5G strength.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  <Shield className="inline h-5 w-5 mr-1 text-primary" /> Solo & female safety
                </h3>
                <p>
                  Central Shillong is well-lit, has active police presence around Police Bazar, and
                  taxis are metered until midnight. Female-only dorm, CCTV and 24/7 reception at
                  XTSY complete the picture.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nearby internal links */}
        <section className="py-14 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold mb-6">Explore your options</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Link to="/best-hostel-in-shillong" className="rounded-xl border p-5 hover:border-primary transition">
                <div className="font-semibold mb-1">Best Hostel in Shillong</div>
                <div className="text-sm text-muted-foreground">Full comparison of every verified hostel.</div>
              </Link>
              <Link to="/hostel-booking" className="rounded-xl border p-5 hover:border-primary transition">
                <div className="font-semibold mb-1">Book a Hostel Online</div>
                <div className="text-sm text-muted-foreground">Instant confirmation, free cancellation.</div>
              </Link>
              <Link to="/hotels-in-shillong" className="rounded-xl border p-5 hover:border-primary transition">
                <div className="font-semibold mb-1">Hotels in Shillong</div>
                <div className="text-sm text-muted-foreground">Prefer a private room? Compare rates.</div>
              </Link>
              <Link to="/female-travellers" className="rounded-xl border p-5 hover:border-primary transition">
                <div className="font-semibold mb-1">Female Travellers</div>
                <div className="text-sm text-muted-foreground">Female-only dorm + safety guide.</div>
              </Link>
              <Link to="/xtsy-270" className="rounded-xl border p-5 hover:border-primary transition">
                <div className="font-semibold mb-1">270° Glass Suite</div>
                <div className="text-sm text-muted-foreground">India's first stargazing suite — same address.</div>
              </Link>
              <Link to="/tours" className="rounded-xl border p-5 hover:border-primary transition">
                <div className="font-semibold mb-1">Meghalaya Tours</div>
                <div className="text-sm text-muted-foreground">Cherrapunji, Dawki & living root bridges.</div>
              </Link>
            </div>
          </div>
        </section>

        <BookDirectComparison />

        {/* FAQ */}
        <section className="py-14 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Frequently asked — hostel near me</h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-lg border bg-card p-4">
                  <summary className="cursor-pointer font-semibold list-none flex items-start justify-between gap-4">
                    <span>{f.q}</span>
                    <Check className="h-4 w-4 text-primary shrink-0 mt-1" />
                  </summary>
                  <p className="mt-2 text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-14 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-3">Ready when you are</h2>
            <p className="text-muted-foreground mb-6">
              Same-day bookings, walk-ins, or planning ahead — the nearest verified hostel to
              Shillong city centre is one tap away.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link to="/book">Check availability</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href="https://wa.me/918837317070?text=Hi%20XTSY%2C%20I%27m%20nearby%20—%20is%20there%20a%20bed%20available%20tonight%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp us
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
});

HostelNearMe.displayName = 'HostelNearMe';

export default HostelNearMe;
