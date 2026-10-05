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
  Star, Wifi, Shield, MapPin, Phone, MessageCircle, Check,
  Bed, CalendarCheck, IndianRupee, Clock, CreditCard, BadgeCheck,
} from 'lucide-react';

const HostelBookingShillong = memo(() => {
  const hostelSchema = {
    '@context': 'https://schema.org',
    '@type': 'Hostel',
    '@id': 'https://xtsy.one/hostel-booking#hostel',
    name: 'XTSY Travellers Hostel — Online Hostel Booking, Shillong',
    description:
      'Direct online hostel booking in Shillong, Meghalaya. Instant confirmation, no OTA commission, one free date change. Dorm beds from ₹399, private rooms from ₹2,500. 4.7★ from 237 Google reviews.',
    url: 'https://xtsy.one/hostel-booking',
    telephone: '+918837317070',
    email: 'booking@xtsy.one',
    priceRange: '₹399 - ₹9,999',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking, PayPal',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mawdiangdiang Road, New Shillong Township',
      addressLocality: 'Shillong',
      addressRegion: 'Meghalaya',
      postalCode: '793018',
      addressCountry: 'IN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 25.6025457, longitude: 91.9448902 },
    checkinTime: '11:00',
    checkoutTime: '10:00',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      reviewCount: '237',
      bestRating: '5',
    },
    makesOffer: [
      { '@type': 'Offer', name: '8-Bed Mixed Dorm Bed', price: '399', priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: 'https://xtsy.one/book' },
      { '@type': 'Offer', name: '6-Bed Mixed Dorm Bed', price: '499', priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: 'https://xtsy.one/book' },
      { '@type': 'Offer', name: 'Female-only Dorm Bed', price: '550', priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: 'https://xtsy.one/book' },
      { '@type': 'Offer', name: 'Private Double Room', price: '2500', priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: 'https://xtsy.one/book' },
    ],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: '24/7 Reception', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Hot Shower', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Female-only Dorm', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Locker Storage', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'CCTV Security', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Airport Transfer', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Restaurant On-site', value: true },
    ],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Hostel Booking', item: 'https://xtsy.one/hostel-booking' },
    ],
  };

  const faqs = [
    {
      q: 'How do I book a hostel in Shillong online?',
      a: 'Book directly at xtsy.one/book — pick dates, choose a dorm bed or private room, pay with UPI/card/net banking. Direct booking is cheaper than Booking.com or Hostelworld (no OTA commission) and gets instant WhatsApp confirmation.',
    },
    {
      q: 'How far in advance should I book?',
      a: 'Dorm beds: 3–7 days is usually fine outside peak. Private rooms and Experience by XTSY: 2–4 weeks ahead, especially Oct–May and long weekends.',
    },
    {
      q: 'What is the cheapest hostel booking in Shillong?',
      a: 'XTSY 8-bed mixed dorm beds start at ₹399/night — one of the cheapest verified hostel booking rates in Shillong with 4.7★ reviews, WiFi, hot shower and 24/7 security included.',
    },
    {
      q: 'Is same-day hostel booking possible?',
      a: 'Yes. Outside peak season, same-day online hostel booking usually goes through. Check live availability at xtsy.one/book or WhatsApp +91 88373 17070 for immediate confirmation.',
    },
    {
      q: 'What payment methods are accepted?',
      a: 'UPI (GPay/PhonePe/Paytm), all credit/debit cards, net banking, and cash on arrival for select rooms. International: PayPal or wire transfer.',
    },
    {
      q: 'Can I cancel or modify my booking?',
      a: 'The booking amount is non-refundable — there is no free cancellation. Bookings can be modified once within 90 days of the original check-in (request at least 48 hours before), subject to availability and any rate difference.',
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

  const rooms = [
    { name: '8-Bed Mixed Dorm', price: '₹399', per: 'per bed / night', tag: 'Cheapest' },
    { name: '6-Bed Mixed Dorm', price: '₹499', per: 'per bed / night', tag: 'Popular' },
    { name: 'Female-only Dorm', price: '₹599', per: 'per bed / night', tag: 'Solo-safe' },
    { name: 'Private Double Room', price: '₹2,399', per: 'per room / night', tag: 'Couples' },
    { name: 'Experience by XTSY', price: '₹5,999', per: 'stay only / night', tag: 'Signature' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <meta
          name="description"
          content="Online hostel booking in Shillong, Meghalaya. Instant confirmation, dorm beds from ₹399. Book direct — cheaper than Hostelworld & Booking.com. 4.7★ from 237 Google reviews."
        />
        <script type="application/ld+json">{JSON.stringify(hostelSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Header />

      <main>
        {/* Hero */}
        <section className="relative pt-28 pb-16 px-4 bg-gradient-to-br from-primary/10 via-background to-brand-ember/10">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
              <BadgeCheck className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Direct Hostel Booking · Instant Confirmation
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground font-playfair mb-4">
              Hostel Booking in Shillong — Direct from ₹399
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Book XTSY Travellers Hostel direct and skip the OTA commission. Instant WhatsApp confirmation,
              one free date change, 4.7★ from 237 Google reviews.
            </p>
            <div className="flex items-center justify-center gap-1 mb-6">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <span className="ml-2 text-sm text-muted-foreground">4.7 / 5 · 237 Google reviews</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/book"><CalendarCheck className="w-5 h-5 mr-2" /> Check Availability & Book</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://wa.me/918837317070?text=Hi%20XTSY%2C%20I%27d%20like%20to%20book%20a%20hostel%20bed%20in%20Shillong" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp to Book
                </a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Direct rate — no Hostelworld / Booking.com commission passed on
            </p>
          </div>
        </section>

        {/* Why book direct */}
        <section className="py-14 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 font-playfair">
              Why Book Your Hostel Direct with XTSY
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: IndianRupee, title: 'Cheaper than OTAs', desc: 'No commission markup vs Hostelworld / Booking.com.' },
                { icon: Clock, title: 'Instant Confirmation', desc: 'WhatsApp confirmation within minutes.' },
                { icon: Shield, title: 'One Free Date Change', desc: 'Booking amount is non-refundable; change dates once within 90 days.' },
                { icon: CreditCard, title: 'Flexible Payment', desc: 'UPI, cards, net banking, cash on arrival.' },
              ].map((f) => (
                <Card key={f.title} className="border-border/50">
                  <CardContent className="p-5">
                    <f.icon className="w-6 h-6 text-primary mb-3" />
                    <h3 className="font-semibold mb-1.5 text-sm">{f.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Rooms & pricing */}
        <section className="py-14 px-4 bg-card/40">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 font-playfair">
              Rooms Available for Booking
            </h2>
            <p className="text-center text-sm text-muted-foreground mb-8">
              Transparent nightly rates. All taxes included. Book any room in under 60 seconds.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((r) => (
                <Card key={r.name} className="border-border/50 hover:border-primary/40 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Bed className="w-5 h-5 text-primary" />
                      <span className="text-[10px] uppercase tracking-wide bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {r.tag}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{r.name}</h3>
                    <p className="text-2xl font-bold text-primary">{r.price}</p>
                    <p className="text-xs text-muted-foreground mb-4">{r.per}</p>
                    <Button asChild size="sm" className="w-full">
                      <Link to="/book">Book Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="py-14 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 font-playfair">
              Location — New Shillong Township
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardContent className="p-5">
                  <MapPin className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-semibold mb-2 text-sm">Address</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    XTSY Travellers Hostel, Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya 793018, India
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-5">
                  <Clock className="w-5 h-5 text-primary mb-2" />
                  <h3 className="font-semibold mb-2 text-sm">Getting Here</h3>
                  <ul className="text-sm text-muted-foreground space-y-1.5">
                    <li className="flex gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> 2.5 hrs from Guwahati Airport (GAU)</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> Near NIFT Shillong, IIM Shillong &amp; NEIGRIHMS</li>
                    <li className="flex gap-2"><Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> Airport pickup available on request</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <BookDirectComparison className="bg-muted/30" />

        {/* FAQ */}
        <section className="py-14 px-4 bg-card/40">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 font-playfair">
              Hostel Booking — Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group border border-border/50 rounded-lg p-4 bg-background">
                  <summary className="font-semibold text-sm cursor-pointer text-foreground list-none flex items-center justify-between">
                    {f.q}
                    <span className="text-primary group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/10 to-brand-ember/10">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-playfair">
              Ready to Book Your Bed in Shillong?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Instant confirmation. Cheaper than any OTA.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/book">Book Online Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:+918837317070"><Phone className="w-4 h-4 mr-2" /> +91 88373 17070</a>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Related: <Link to="/best-hostel-in-shillong" className="underline hover:text-primary">Best Hostel in Shillong</Link>
              {' · '}<Link to="/hotels-in-shillong" className="underline hover:text-primary">Hotels in Shillong</Link>
              {' · '}<Link to="/homestays-in-shillong" className="underline hover:text-primary">Homestays in Shillong</Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
});

HostelBookingShillong.displayName = 'HostelBookingShillong';
export default HostelBookingShillong;
