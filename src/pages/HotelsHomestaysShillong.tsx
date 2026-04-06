import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Hotel, Home, Star, Check, ArrowRight, MapPin, Users, Shield, Coffee, Bed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HotelsHomestaysShillong = memo(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Places to Stay in Shillong',
    description: 'Complete guide to hotels, homestays, guest houses, and hostels in Shillong, Meghalaya.',
    url: 'https://xtsy.one/hotels-homestays-shillong',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'LodgingBusiness',
          name: 'XTSY Travellers Hostel',
          description: 'India\'s biggest hostel — budget dorms, private rooms, 270° glass suite',
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
        name: 'What are the best places to stay in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Shillong offers hotels, homestays, guest houses, and hostels. For budget travellers, XTSY Hostel offers dorms from ₹450. For luxury, the 270° Glass Suite offers India\'s first panoramic glamping experience. Hotels range from ₹1,500-₹5,000/night.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is a hostel better than a hotel in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hostels like XTSY offer better value — budget stays with community vibes, free WiFi, common kitchen, and curated tours. Hotels offer more privacy but at 3-5x the cost. XTSY bridges both with private rooms and a luxury glass suite.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the cheapest accommodation in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The cheapest quality accommodation in Shillong is XTSY Hostel with dorm beds starting at ₹450/night. This includes free WiFi, hot showers, personal lockers, and access to common areas.',
        },
      },
    ],
  };

  const stayTypes = [
    {
      type: 'Budget Hostel',
      icon: Bed,
      price: '₹450-₹800/night',
      pros: ['Social atmosphere', 'Kitchen access', 'Tour desks', 'Budget-friendly'],
      cons: ['Shared spaces', 'Less privacy in dorms'],
      best: 'Backpackers, solo travellers, groups',
      recommendation: 'XTSY Travellers Hostel',
      link: '/best-hostel-in-shillong',
    },
    {
      type: 'Guest House',
      icon: Home,
      price: '₹1,000-₹2,500/night',
      pros: ['Local experience', 'Home-cooked meals', 'Personal touch'],
      cons: ['Limited amenities', 'No tours/activities'],
      best: 'Families, senior travellers',
      recommendation: null,
      link: null,
    },
    {
      type: 'Hotel',
      icon: Hotel,
      price: '₹2,000-₹6,000/night',
      pros: ['Room service', 'Restaurant', 'Parking'],
      cons: ['Expensive', 'Generic experience', 'No community'],
      best: 'Business travellers, short stays',
      recommendation: null,
      link: null,
    },
    {
      type: 'Luxury Glamping',
      icon: Star,
      price: '₹8,500/night',
      pros: ['270° panoramic views', 'Unique experience', 'Stargazing', 'Instagram-worthy'],
      cons: ['Premium pricing'],
      best: 'Couples, anniversaries, proposals',
      recommendation: 'XTSY 270° Glass Suite',
      link: '/luxury-glamping-shillong',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hotels, Homestays & Guest Houses in Shillong 2026 — Complete Guide</title>
        <meta name="description" content="Complete guide to accommodation in Shillong — hotels, homestays, guest houses, hostels, and luxury glamping. Compare prices, amenities, and find the best place to stay in Meghalaya." />
        <meta name="keywords" content="hotel in Shillong, homestay in Shillong, guest house Shillong, places to stay Shillong, Shillong accommodation, budget hotel Shillong, luxury hotel Shillong, Meghalaya stay, where to stay Shillong" />
        <link rel="canonical" href="https://xtsy.one/hotels-homestays-shillong" />
        <meta property="og:title" content="Hotels, Homestays & Stays in Shillong — Complete Guide" />
        <meta property="og:description" content="Compare hotels, homestays, hostels, and glamping in Shillong. Find the perfect stay for your Meghalaya trip." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://xtsy.one/hotels-homestays-shillong" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
      </Helmet>

      <Header />

      <main className="pt-20">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Hotels, Homestays & Places to Stay in Shillong
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Planning a trip to Shillong? Here's your complete guide to accommodation in Meghalaya's capital — from ₹450 hostel dorms to luxury glamping suites, with honest comparisons to help you choose.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl pb-16 space-y-16">

          {/* Accommodation Types */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Types of Accommodation in Shillong</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {stayTypes.map((stay) => (
                <Card key={stay.type} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <stay.icon className="h-6 w-6 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">{stay.type}</h3>
                      <span className="ml-auto text-sm font-medium text-primary">{stay.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Best for: {stay.best}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium text-foreground mb-1">Pros</p>
                        {stay.pros.map((p) => (
                          <div key={p} className="flex items-center gap-1 text-muted-foreground">
                            <Check className="h-3 w-3 text-primary" />{p}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Cons</p>
                        {stay.cons.map((c) => (
                          <p key={c} className="text-muted-foreground">• {c}</p>
                        ))}
                      </div>
                    </div>
                    {stay.recommendation && (
                      <Link to={stay.link!} className="mt-4 flex items-center gap-2 text-sm text-primary font-medium hover:underline">
                        Our pick: {stay.recommendation} <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Why Choose XTSY */}
          <section className="bg-muted/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground">Why Travellers Choose XTSY Over Hotels</h2>
            <p className="mt-2 text-muted-foreground">XTSY isn't just a hostel — it's a complete travel ecosystem.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Bed, title: 'Every Budget', desc: 'Dorms ₹450 → Glass Suite ₹8,500' },
                { icon: Coffee, title: 'On-Site Restaurant', desc: 'TAB Bistro multi-cuisine dining' },
                { icon: Users, title: 'Community & Events', desc: 'Meet fellow travellers, group tours' },
                { icon: Shield, title: 'Safe for All', desc: 'Female dorms, pet-friendly, 24/7 security' },
                { icon: MapPin, title: 'Tour Packages', desc: 'Curated Meghalaya tours from ₹7,999' },
                { icon: Star, title: '4.8★ Rating', desc: '320+ verified Google reviews' },
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

          {/* Quick Tips */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Tips for Booking Accommodation in Shillong</h2>
            <div className="mt-4 space-y-3 text-muted-foreground">
              <p>• <strong className="text-foreground">Book direct</strong> for the best prices — OTA platforms charge 15-25% commission that inflates room rates.</p>
              <p>• <strong className="text-foreground">October to March</strong> is peak season. Book at least 2-3 weeks in advance, especially for weekends.</p>
              <p>• <strong className="text-foreground">Location matters</strong> — stay in or near Police Bazaar/Mawkhar for easy access to transport, food, and attractions.</p>
              <p>• <strong className="text-foreground">Check for inclusions</strong> — XTSY includes WiFi, hot water, and kitchen access free. Most hotels charge extra.</p>
              <p>• <strong className="text-foreground">For Meghalaya tours</strong>, choose a stay that offers packages — saves you 30-40% vs booking separately.</p>
            </div>
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
            <h2 className="text-2xl font-bold text-foreground">Find Your Perfect Stay in Shillong</h2>
            <p className="mt-2 text-muted-foreground">From budget dorms to luxury glamping — XTSY has it all.</p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link to="/best-hostel-in-shillong"><Button className="gap-2">Budget Hostel</Button></Link>
              <Link to="/luxury-glamping-shillong"><Button variant="outline">Luxury Glamping</Button></Link>
              <Link to="/book"><Button variant="outline">Book Now</Button></Link>
            </div>
          </section>

          {/* Internal Links */}
          <nav className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Pages</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/best-hostel-in-shillong" className="text-sm text-primary hover:underline">Best Hostel in Shillong</Link>
              <Link to="/luxury-glamping-shillong" className="text-sm text-primary hover:underline">Luxury Glamping</Link>
              <Link to="/destination-wedding-shillong" className="text-sm text-primary hover:underline">Destination Wedding</Link>
              <Link to="/tab-bistro" className="text-sm text-primary hover:underline">Restaurant in Shillong</Link>
              <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">Tour Packages</Link>
              <Link to="/things-to-do-in-meghalaya" className="text-sm text-primary hover:underline">Things to Do</Link>
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
});

HotelsHomestaysShillong.displayName = 'HotelsHomestaysShillong';
export default HotelsHomestaysShillong;
