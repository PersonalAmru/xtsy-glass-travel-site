import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Home, Star, Check, ArrowRight, MapPin, Users, Coffee, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HomestaysInShillong = memo(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Homestays in Shillong',
    description: 'Best homestays and guest houses in Shillong, Meghalaya — authentic local experiences with home-cooked meals.',
    url: 'https://xtsy.one/homestays-in-shillong',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'LodgingBusiness',
          name: 'XTSY Travellers Hostel',
          description: 'Hostel with homestay vibes — community kitchen, local food, and cultural experiences',
          priceRange: '₹450 - ₹8,500',
          starRating: { '@type': 'Rating', ratingValue: '4.8' },
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
        name: 'What are the best homestays in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Shillong has homestays ranging from ₹800-₹2,500/night. Local Khasi homestays offer authentic cultural experiences with home-cooked meals. XTSY combines homestay warmth with modern hostel amenities.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are homestays safe in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Shillong is one of India\'s safest cities. Homestays are family-run and welcoming. For added safety, XTSY offers 24/7 security, female-only dorms, and verified guest policies.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do homestays in Shillong include food?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most homestays include breakfast — often traditional Khasi cuisine like jadoh, tungrymbai, and ki kpu. Some offer full-board options. XTSY has an on-site restaurant (TAB Bistro) plus a community kitchen.',
        },
      },
    ],
  };

  const homestayTypes = [
    {
      type: 'Khasi Family Homestay',
      price: '₹800 - ₹1,500/night',
      features: ['Home-cooked Khasi meals', 'Cultural immersion', 'Family atmosphere', 'Local tips'],
      best: 'Cultural travellers, food lovers',
    },
    {
      type: 'Guest House',
      price: '₹1,000 - ₹2,500/night',
      features: ['Private rooms', 'Breakfast included', 'Garden views', 'Peaceful ambiance'],
      best: 'Families, senior travellers, couples',
    },
    {
      type: 'Community Hostel (XTSY)',
      price: '₹450 - ₹2,500/night',
      features: ['Homestay vibes + modern amenities', 'Community kitchen', 'On-site restaurant', 'Tour desk'],
      best: 'Solo travellers, backpackers, groups',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Best Homestays in Shillong 2026 — Guest Houses & Local Stays</title>
        <meta name="description" content="Find the best homestays and guest houses in Shillong. Authentic Khasi experiences, home-cooked meals, from ₹800/night. Compare options for your Meghalaya trip." />
        <meta name="keywords" content="homestay in Shillong, guest house Shillong, Shillong homestay, best homestay Meghalaya, Khasi homestay, cheap homestay Shillong, family homestay Shillong, local stay Shillong" />
        <link rel="canonical" href="https://xtsy.one/homestays-in-shillong" />
        <meta property="og:title" content="Best Homestays in Shillong 2026 — Guest Houses & Local Stays" />
        <meta property="og:description" content="Authentic homestays and guest houses in Shillong with home-cooked meals and cultural experiences." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://xtsy.one/homestays-in-shillong" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
      </Helmet>

      <Header />

      <main className="pt-20">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Best Homestays & Guest Houses in Shillong
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Experience Shillong like a local — stay in authentic Khasi homestays, cozy guest houses, or community hostels with home-cooked meals and cultural warmth.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl pb-16 space-y-16">

          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Types of Homestays in Shillong</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {homestayTypes.map((stay) => (
                <Card key={stay.type} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Home className="h-6 w-6 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">{stay.type}</h3>
                    </div>
                    <p className="text-sm font-medium text-primary mb-3">{stay.price}</p>
                    <p className="text-xs text-muted-foreground mb-3">Best for: {stay.best}</p>
                    <div className="space-y-1">
                      {stay.features.map((f) => (
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
            <h2 className="text-2xl font-bold text-foreground">What Makes Shillong Homestays Special</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Utensils, title: 'Khasi Cuisine', desc: 'Jadoh, tungrymbai, dohneiiong — real local food' },
                { icon: Users, title: 'Cultural Exchange', desc: 'Learn about Khasi matrilineal traditions' },
                { icon: Coffee, title: 'Morning Chai', desc: 'Fresh tea with pine-forest valley views' },
                { icon: Home, title: 'Family Warmth', desc: 'Hosts treat you like extended family' },
                { icon: MapPin, title: 'Hidden Gems', desc: 'Local tips to off-beat waterfalls & caves' },
                { icon: Star, title: 'Authentic Reviews', desc: 'Genuine traveller experiences on Google' },
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
            <h2 className="text-2xl font-bold text-foreground">Tips for Booking Homestays in Shillong</h2>
            <div className="mt-4 space-y-3 text-muted-foreground">
              <p>• <strong className="text-foreground">Ask about meals</strong> — most homestays include breakfast. Confirm dinner availability in advance.</p>
              <p>• <strong className="text-foreground">Check location</strong> — some homestays are remote. Ensure transport access or ask if pickup is included.</p>
              <p>• <strong className="text-foreground">Book early for festivals</strong> — Shillong Cherry Blossom Festival (Nov) and Ka Pomblang Nongkrem fill up fast.</p>
              <p>• <strong className="text-foreground">Respect local customs</strong> — Khasi homes may have specific guest etiquette. Hosts will guide you warmly.</p>
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
            <h2 className="text-2xl font-bold text-foreground">Find Your Perfect Homestay</h2>
            <p className="mt-2 text-muted-foreground">From Khasi family homes to community hostels — experience authentic Shillong.</p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link to="/best-hostel-in-shillong"><Button className="gap-2">Community Hostel</Button></Link>
              <Link to="/luxury-glamping-shillong"><Button variant="outline">Luxury Glamping</Button></Link>
              <Link to="/book"><Button variant="outline">Book Now</Button></Link>
            </div>
          </section>

          <nav className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Pages</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/hotels-in-shillong" className="text-sm text-primary hover:underline">Hotels in Shillong</Link>
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

HomestaysInShillong.displayName = 'HomestaysInShillong';
export default HomestaysInShillong;
