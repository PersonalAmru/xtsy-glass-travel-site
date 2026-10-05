import { memo } from 'react';
import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Hotel, Star, Check, ArrowRight, MapPin, Shield, Wifi, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PANORAMA_STAY_ONLY } from '@/data/panoramaPricing';
const GLAMP_NIGHT = `₹${PANORAMA_STAY_ONLY.toLocaleString('en-IN')}`;

const HotelsInShillong = memo(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Hotels in Shillong',
    description: 'Complete guide to hotels in Shillong — budget hotels, mid-range, and luxury stays in Meghalaya\'s capital.',
    url: 'https://xtsy.one/hotels-in-shillong',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'LodgingBusiness',
          name: 'XTSY Travellers Hostel',
          description: 'India\'s biggest hostel — private rooms, Experience by XTSY, and budget dorms',
          priceRange: '₹399 - ₹4,999',
        },
      },
    ],
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the best hotels in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Shillong has hotels ranging from ₹1,500 to ₹8,000/night. For a unique experience, XTSY offers private rooms with hostel-community vibes plus Experience by XTSY, India's first stargaze glamp for luxury travellers from ${GLAMP_NIGHT}/night.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Which area is best for hotels in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Police Bazaar is the busiest area for shopping and transport; New Shillong Township is quieter and greener. XTSY is on Mawdiangdiang Road, New Shillong Township, near NIFT Shillong, IIM Shillong and NEIGRIHMS — Police Bazaar is a cab ride away.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a hotel room cost in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Budget hotels start at ₹1,200-₹2,000/night. Mid-range hotels cost ₹2,500-₹4,500. Luxury stays range from ₹5,000-₹8,500. XTSY offers rooms across all budgets starting at ₹399 for dorms.',
        },
      },
    ],
  };

  const hotelCategories = [
    {
      type: 'Budget Hotels',
      price: '₹1,200 - ₹2,000/night',
      features: ['Basic rooms', 'WiFi (sometimes extra)', 'No food included'],
      best: 'Short stays, transit travellers',
    },
    {
      type: 'Mid-Range Hotels',
      price: '₹2,500 - ₹4,500/night',
      features: ['Room service', 'Restaurant', 'Parking', 'Hot water'],
      best: 'Families, business travellers',
    },
    {
      type: 'Luxury Hotels',
      price: '₹5,000+/night',
      features: ['Premium rooms', 'Spa/wellness', 'Panoramic views', 'Concierge'],
      best: 'Couples, special occasions',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hotels in Shillong from ₹399/night | XTSY</title>
        <meta name="description" content="Find the best hotels in Shillong — budget, mid-range, and luxury. Compare prices from ₹1,200 to ₹5,000+ a night. Book direct for best rates in Meghalaya's capital." />
        <meta name="keywords" content="hotel in Shillong, best hotel Shillong, budget hotel Shillong, luxury hotel Shillong, Shillong hotel booking, hotels near Police Bazaar, cheap hotel Shillong, 3 star hotel Shillong" />
        <link rel="canonical" href="https://xtsy.one/hotels-in-shillong" />
        <meta property="og:title" content="Best Hotels in Shillong 2026 — Budget to Luxury" />
        <meta property="og:description" content="Complete guide to hotels in Shillong. Compare budget, mid-range, and luxury options." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://xtsy.one/hotels-in-shillong" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
      </Helmet>

      <Header />

      <main className="pt-20">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Best Hotels in Shillong — Budget to Luxury
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Looking for a hotel in Shillong? Compare budget, mid-range, and luxury options — with honest pricing and tips to get the best deal in Meghalaya's capital.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl pb-16 space-y-16">

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Hotel Categories in Shillong</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotelCategories.map((cat) => (
                <Card key={cat.type} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Hotel className="h-6 w-6 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">{cat.type}</h3>
                    </div>
                    <p className="text-sm font-medium text-primary mb-3">{cat.price}</p>
                    <p className="text-xs text-muted-foreground mb-3">Best for: {cat.best}</p>
                    <div className="space-y-1">
                      {cat.features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-3 w-3 text-primary" />{f}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="bg-muted/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground">Why XTSY Beats Traditional Hotels</h2>
            <p className="mt-2 text-muted-foreground">Get hotel-quality rooms with hostel-community vibes — at better prices.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Hotel, title: 'Private Rooms', desc: 'Hotel-quality rooms from ₹1,200/night' },
                { icon: Star, title: 'Experience by XTSY', desc: 'India\'s first panoramic luxury suite' },
                { icon: Wifi, title: 'Free WiFi & Hot Water', desc: 'Hotels charge extra — we don\'t' },
                { icon: Shield, title: '24/7 Security', desc: 'Safe for solo, female & family travellers' },
                { icon: MapPin, title: 'Tour Packages', desc: 'Curated Meghalaya tours from ₹7,999' },
                { icon: Car, title: 'Transport Help', desc: 'Airport/station pickup coordination' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <item.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground">Tips for Booking Hotels in Shillong</h2>
            <div className="mt-4 space-y-3 text-muted-foreground">
              <p>• <strong className="text-foreground">Book direct</strong> — OTAs add 15-25% markup. Always check the property's own website.</p>
              <p>• <strong className="text-foreground">Peak season (Oct–Mar)</strong> — book 2-3 weeks ahead. Weekends fill up fast.</p>
              <p>• <strong className="text-foreground">Location</strong> — Police Bazaar suits shoppers; New Shillong Township (where XTSY is) suits travellers who want a quieter base with cabs arranged by the desk.</p>
              <p>• <strong className="text-foreground">Check inclusions</strong> — many hotels charge extra for WiFi, hot water, and breakfast.</p>
            </div>
          </section>

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

          <section className="bg-primary/10 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Book Your Shillong Hotel</h2>
            <p className="mt-2 text-muted-foreground">From budget rooms to Experience by XTSY.</p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link to="/best-hostel-in-shillong"><Button className="gap-2">Budget Stays</Button></Link>
              <Link to="/luxury-glamping-shillong"><Button variant="outline">Luxury Glamping</Button></Link>
              <Link to="/book"><Button variant="outline">Book Now</Button></Link>
            </div>
          </section>

          <nav className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Pages</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/homestays-in-shillong" className="text-sm text-primary hover:underline">Homestays in Shillong</Link>
              <Link to="/best-hostel-in-shillong" className="text-sm text-primary hover:underline">Best Hostel in Shillong</Link>
              <Link to="/luxury-glamping-shillong" className="text-sm text-primary hover:underline">Luxury Glamping</Link>
              <Link to="/destination-wedding-shillong" className="text-sm text-primary hover:underline">Destination Wedding</Link>
              <Link to="/restaurant-in-shillong" className="text-sm text-primary hover:underline">Restaurant in Shillong</Link>
              <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">Tour Packages</Link>
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
});

HotelsInShillong.displayName = 'HotelsInShillong';
export default HotelsInShillong;
