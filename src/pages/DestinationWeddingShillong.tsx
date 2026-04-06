import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Heart, Utensils, Music, Camera, MapPin, Users, Star, MessageCircle, Check, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DestinationWeddingShillong = memo(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    name: 'XTSY — Destination Wedding & Event Venue Shillong',
    description: 'Intimate destination weddings and events in Shillong, Meghalaya. Mountain backdrop, forest dining, and full-service catering by TAB Bistro.',
    url: 'https://xtsy.one/destination-wedding-shillong',
    telephone: '+918837317070',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Shillong',
      addressRegion: 'Meghalaya',
      addressCountry: 'IN',
    },
    maximumAttendeeCapacity: 100,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Mountain Views', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'In-house Catering', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Accommodation', value: true },
    ],
  };

  const cateringSchema = {
    '@context': 'https://schema.org',
    '@type': 'FoodService',
    name: 'TAB Bistro Catering by XTSY',
    description: 'Multi-cuisine catering for weddings, corporate events, and private parties in Shillong.',
    serviceType: 'Event Catering',
    areaServed: { '@type': 'City', name: 'Shillong' },
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can I have a destination wedding in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Shillong is emerging as a top destination wedding location in India. XTSY offers intimate wedding packages with mountain backdrops, forest dining by TAB Bistro, guest accommodation, and event coordination for up to 100 guests.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a destination wedding in Meghalaya cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A destination wedding at XTSY Shillong starts from ₹3-5 lakhs for an intimate gathering of 30-50 guests, including venue, accommodation, catering, and basic decor. Custom packages are available for larger events.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does XTSY offer event catering in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. TAB Bistro by XTSY provides full-service catering for weddings, corporate events, birthday parties, and private gatherings. Multi-cuisine menu including Indian, Continental, Chinese, and Northeast specialties.',
        },
      },
    ],
  };

  const services = [
    { icon: Mountain, title: 'Mountain Venue', desc: 'Open-air ceremony with panoramic Khasi Hills backdrop. Pine forests, misty mornings, golden sunsets.' },
    { icon: Utensils, title: 'TAB Bistro Catering', desc: 'Multi-cuisine menu — Indian, Continental, Chinese, Northeast specials. Customizable for any dietary requirement.' },
    { icon: Users, title: 'Guest Accommodation', desc: 'Dorms, private rooms, and the 270° Glass Suite for the couple. All guests stay on-site.' },
    { icon: Camera, title: 'Photo-Ready Spaces', desc: 'Glass suite, mountain terrace, forest trail — every corner is Instagram-worthy for wedding photography.' },
    { icon: Music, title: 'Event Coordination', desc: 'Full event planning support — decor, music, lighting, seating, and day-of coordination.' },
    { icon: Heart, title: 'Intimate Setting', desc: 'Perfect for 20-100 guests. Intimate, personal, and unforgettable — no generic banquet halls.' },
  ];

  const eventTypes = [
    'Destination Weddings',
    'Engagement Ceremonies',
    'Anniversary Celebrations',
    'Pre-Wedding Shoots',
    'Corporate Off-sites',
    'Birthday Parties',
    'Team Building Events',
    'Private Dining Events',
  ];

  const handleWhatsApp = () => window.open('https://wa.me/918837317070?text=Hi%2C%20I%20am%20interested%20in%20a%20destination%20wedding%20at%20XTSY%20Shillong', '_blank');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Destination Wedding in Shillong — Venue, Catering & Stays | XTSY</title>
        <meta name="description" content="Plan your dream destination wedding in Shillong, Meghalaya. Mountain venue, TAB Bistro catering, guest accommodation, and 270° Glass Suite for the couple. Intimate weddings for 20-100 guests." />
        <meta name="keywords" content="destination wedding Shillong, destination wedding Meghalaya, wedding venue Shillong, event catering Shillong, wedding venue northeast India, intimate wedding Meghalaya, mountain wedding India, event venue Shillong, corporate event Shillong, party venue Shillong" />
        <link rel="canonical" href="https://xtsy.one/destination-wedding-shillong" />
        <meta property="og:title" content="Destination Wedding in Shillong — XTSY Meghalaya" />
        <meta property="og:description" content="Intimate mountain weddings with TAB Bistro catering, guest stays, and India's 270° Glass Suite for the couple." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xtsy.one/destination-wedding-shillong" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(cateringSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-4">
              <Heart className="h-4 w-4" />
              <span>Intimate Mountain Weddings & Events</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Destination Wedding in Shillong, Meghalaya
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Say "I do" with the misty Khasi Hills as your backdrop. XTSY offers intimate destination weddings, corporate events, and private celebrations — with on-site accommodation, mountain views, and full-service catering by TAB Bistro.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleWhatsApp} className="gap-2">
                <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
              </Button>
              <a href="tel:+918837317070">
                <Button variant="outline">Call for Custom Package</Button>
              </a>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl pb-16 space-y-16">

          {/* Services */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">What We Offer</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <Card key={s.title} className="border-border/50">
                  <CardContent className="p-5">
                    <s.icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-3 font-bold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Event Types */}
          <section className="bg-muted/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground">Events We Host</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {eventTypes.map((e) => (
                <span key={e} className="px-4 py-2 rounded-full bg-background border border-border text-sm text-foreground">
                  {e}
                </span>
              ))}
            </div>
          </section>

          {/* Why Shillong */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Why Choose Shillong for Your Wedding</h2>
            <div className="mt-4 space-y-3">
              {[
                'Pleasant weather year-round — average 15-25°C, no extreme heat',
                'Stunning natural backdrops — hills, pine forests, waterfalls, sunrise viewpoints',
                'Well connected — 2.5 hours from Guwahati Airport (daily flights from Delhi, Mumbai, Kolkata)',
                'Affordable compared to Goa, Rajasthan, or Kerala wedding venues',
                'Unique & memorable — very few destination weddings in Northeast India',
                'Safe & welcoming — Meghalaya has one of India\'s lowest crime rates',
                'Combine wedding + honeymoon — Dawki, Cherrapunji, living root bridges nearby',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Couple Suite Highlight */}
          <section className="bg-primary/5 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 text-primary mb-3">
              <Star className="h-5 w-5" />
              <span className="font-medium">For the Couple</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">The 270° Glass Suite — Your Wedding Night</h3>
            <p className="mt-2 text-muted-foreground">
              India's first panoramic glass suite makes the perfect wedding night stay. Three glass walls, mountain views, stargazing from bed, premium breakfast, and complete privacy. An experience no hotel can match.
            </p>
            <Link to="/luxury-glamping-shillong" className="mt-4 inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline">
              Learn more about the Glass Suite →
            </Link>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-6">
              {(faqData.mainEntity as any[]).map((faq, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-foreground">{faq.name}</h3>
                  <p className="mt-1 text-muted-foreground text-sm">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-primary/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Plan Your Dream Wedding in Shillong</h2>
            <p className="mt-2 text-muted-foreground">Every wedding is custom — tell us your vision and we'll make it happen.</p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Button onClick={handleWhatsApp} className="gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp Enquiry</Button>
              <a href="tel:+918837317070"><Button variant="outline">Call +91 883-731-7070</Button></a>
            </div>
          </section>

          {/* Internal Links */}
          <nav className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Pages</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/tab-bistro" className="text-sm text-primary hover:underline">TAB Bistro — Restaurant & Catering</Link>
              <Link to="/luxury-glamping-shillong" className="text-sm text-primary hover:underline">Luxury Glamping</Link>
              <Link to="/best-hostel-in-shillong" className="text-sm text-primary hover:underline">Guest Accommodation</Link>
              <Link to="/meghalaya-couple-tour-package" className="text-sm text-primary hover:underline">Couple Tour Package</Link>
              <Link to="/meghalaya-photo-gallery" className="text-sm text-primary hover:underline">Photo Gallery</Link>
              <Link to="/hotels-in-shillong" className="text-sm text-primary hover:underline">Hotels in Shillong</Link>
              <Link to="/homestays-in-shillong" className="text-sm text-primary hover:underline">Homestays in Shillong</Link>
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
});

DestinationWeddingShillong.displayName = 'DestinationWeddingShillong';
export default DestinationWeddingShillong;
