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
    name: 'XTSY Travellers Hostel — New Shillong Township',
    alternateName: ['XTSY Hostel Shillong', 'XTSY New Shillong Township'],
    description:
      'Backpacker hostel on Mawdiangdiang Road, New Shillong Township, near NIFT Shillong, IIM Shillong, NEIGRIMS, NEIAH and Martin Luther Christian University — dorm beds from ₹399, 4.8★ from 161 verified guests.',
    url: 'https://xtsy.one/hostel-near-me',
    telephone: '+918837317070',
    email: 'stay@xtsy.one',
    priceRange: '₹399 - ₹9,999',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
    image: [
      'https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mawdiangdiang Road, New Shillong Township',
      addressLocality: 'Shillong',
      addressRegion: 'Meghalaya',
      postalCode: '793018',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 25.6025457, longitude: 91.9448902 },
    hasMap: 'https://maps.app.goo.gl/UnP9PfbSJdafMFMM6',
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
    checkinTime: '11:00',
    checkoutTime: '10:00',
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
    { icon: Footprints, place: 'NIFT Shillong', distance: 'Nearby', time: 'New Shillong Township' },
    { icon: Footprints, place: 'IIM Shillong', distance: 'Nearby', time: 'New Shillong Township' },
    { icon: Footprints, place: 'NEIGRIMS', distance: 'Nearby', time: 'Mawdiangdiang' },
    { icon: Footprints, place: 'NEIAH', distance: 'Nearby', time: 'Mawdiangdiang' },
    { icon: Footprints, place: 'Martin Luther Christian University', distance: 'Nearby', time: 'Short drive' },
    { icon: Car, place: 'Police Bazar (city centre)', distance: 'Cab ride', time: 'XTSY desk can book a cab' },
    { icon: Plane, place: 'Shillong Airport (SHL, Umroi)', distance: 'Drive', time: 'Pre-book a transfer' },
    { icon: Plane, place: 'Guwahati Airport (GAU)', distance: 'Road trip', time: 'Pre-book a transfer' },
  ];

  const faqs = [
    {
      q: 'Where exactly is XTSY in Shillong?',
      a: 'XTSY Travellers Hostel, Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya – 793018. Nearby: NIFT Shillong, IIM Shillong, NEIGRIMS, NEIAH and Martin Luther Christian University. It is not in central Shillong — Police Bazar is a cab ride away.',
    },
    {
      q: 'Which is the closest hostel to Guwahati airport (GAU)?',
      a: 'From GAU, XTSY Shillong is the closest verified backpacker hostel with a direct pickup service — 124 km, ~3 hours via NH6. Pre-book a shared cab (₹700/seat) or private sedan (₹3,500) at the time of booking. No airport hostel in Guwahati beats the value of arriving straight in the hills.',
    },
    {
      q: 'Is XTSY near Police Bazar?',
      a: 'No. XTSY is in New Shillong Township, not central Shillong. Police Bazar is a cab ride away, and the XTSY desk can book the cab for you.',
    },
    {
      q: 'How do I reach XTSY from where I am right now?',
      a: 'Open Google Maps and search "XTSY Travellers Hostel Shillong" or tap the "Get Directions" button on this page. From Guwahati Railway Station, take a shared Sumo to Shillong and a cab to Mawdiangdiang Road, New Shillong Township — or ask the XTSY desk to arrange a direct transfer.',
    },
    {
      q: 'Are there other hostels near me in Shillong worth comparing?',
      a: 'Shillong has ~6 verified hostels. XTSY is the largest (India\'s biggest hostel in the northeast), highest rated (4.8★, 161 verified reviews) and sits in quiet New Shillong Township. Compare on /xtsy-vs-zostel or /best-hostel-in-shillong.',
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
          content="Looking for a hostel near you in Shillong? XTSY Travellers Hostel is on Mawdiangdiang Road, New Shillong Township, near NIFT and IIM Shillong — dorm beds from ₹399, 4.8★ from 161 verified guests. Directions and instant booking."
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
              <MapPin className="h-4 w-4" /> Mawdiangdiang Road, New Shillong Township
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Hostel Near Me in Shillong
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              XTSY Travellers Hostel is on <strong>Mawdiangdiang Road, New Shillong Township</strong>, near
              NIFT Shillong, IIM Shillong, NEIGRIMS, NEIAH and Martin Luther Christian University —
              a quiet, green base with TAB Bistro on site. Dorm beds from <strong>₹399</strong>, 4.8★ from 161 verified guests.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <a
                  href="https://maps.app.goo.gl/UnP9PfbSJdafMFMM6"
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
            <h2 className="text-3xl font-bold mb-2">What's near XTSY</h2>
            <p className="text-muted-foreground mb-8">
              XTSY is in New Shillong Township, not central Shillong. These are the landmarks around us,
              and how to reach the places most travellers ask about.
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
              Why travellers choose XTSY in New Shillong Township
            </h2>
            <div className="grid gap-6 md:grid-cols-2 text-muted-foreground">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  <Clock className="inline h-5 w-5 mr-1 text-primary" /> Late arrivals from Guwahati
                </h3>
                <p>
                  Most travellers land at GAU by evening and reach Shillong after dark. Share your
                  arrival time with the XTSY desk and we can arrange the transfer straight to
                  Mawdiangdiang Road, so you are not hunting for a cab at night.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  <Compass className="inline h-5 w-5 mr-1 text-primary" /> Day trips to Cherrapunji & Dawki
                </h3>
                <p>
                  The XTSY travel desk books early-morning cabs and guided day trips to Cherrapunji,
                  Dawki and Mawlynnong, so you leave from the hostel instead of a city Sumo stand.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  <Wifi className="inline h-5 w-5 mr-1 text-primary" /> Quiet for remote work
                </h3>
                <p>
                  New Shillong Township is calmer and greener than the city centre, with TAB Bistro on
                  site for coffee and meals. Laitumkhrah cafés and Police Bazar are a cab ride away.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  <Shield className="inline h-5 w-5 mr-1 text-primary" /> Solo & female safety
                </h3>
                <p>
                  Female-only dorm, CCTV in common areas and a staffed desk at XTSY. The desk can book
                  trusted cabs whenever you head into town.
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
                <div className="text-sm text-muted-foreground">Instant confirmation, direct rates.</div>
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
                <div className="font-semibold mb-1">Experience by XTSY</div>
                <div className="text-sm text-muted-foreground">India's first stargaze glamp — same address.</div>
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
