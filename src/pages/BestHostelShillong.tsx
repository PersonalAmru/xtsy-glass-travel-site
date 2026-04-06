import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, Wifi, Shield, Coffee, Users, MapPin, Phone, MessageCircle, Check, Award, Bed, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BestHostelShillong = memo(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Hostel',
    name: 'XTSY Travellers Hostel',
    description: 'India\'s biggest hostel in Shillong, Meghalaya. Budget dorms from ₹450, private rooms, luxury 270° glass suite.',
    url: 'https://xtsy.one/best-hostel-in-shillong',
    telephone: '+918837317070',
    email: 'xtsytravellershostel@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mawkhar, Shillong',
      addressLocality: 'Shillong',
      addressRegion: 'Meghalaya',
      postalCode: '793001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.5788,
      longitude: 91.8933,
    },
    priceRange: '₹450 - ₹8,500',
    starRating: { '@type': 'Rating', ratingValue: '4.8' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '320',
      bestRating: '5',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Hot Shower', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Common Kitchen', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Locker Storage', value: true },
      { '@type': 'LocationFeatureSpecification', name: '24/7 Reception', value: true },
    ],
    checkinTime: '13:00',
    checkoutTime: '11:00',
    numberOfRooms: 20,
    petsAllowed: true,
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the best hostel in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'XTSY Travellers Hostel is rated the best hostel in Shillong with a 4.8★ rating. It\'s India\'s biggest hostel in Northeast India, offering budget dorms from ₹450, private rooms, and India\'s first 270° panoramic glass suite.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a hostel in Shillong cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Hostel beds in Shillong start from ₹450/night for a dorm bed at XTSY. Private rooms start at ₹2,500/night, and the premium 270° Glass Suite is ₹8,500/night.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is XTSY hostel safe for solo travellers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. XTSY has 24/7 CCTV, personal lockers, female-only dorms, and round-the-clock staff. It\'s rated the safest hostel in Shillong for solo and female travellers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does XTSY hostel allow pets?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! XTSY is India\'s first pet-friendly travellers hostel. Dogs, cats, and other pets are welcome with prior booking.',
        },
      },
    ],
  };

  const roomTypes = [
    { name: '6-Bed Mixed Dorm', price: '₹450', desc: 'Personal locker, reading light, charging port', icon: Bed },
    { name: '4-Bed Female Dorm', price: '₹550', desc: 'Women-only, extra privacy curtains, secure access', icon: Shield },
    { name: 'Private Double Room', price: '₹2,500', desc: 'Ensuite bathroom, mountain views, queen bed', icon: Mountain },
    { name: '270° Glass Suite', price: '₹8,500', desc: 'India\'s first panoramic glass suite, stargazing', icon: Star },
  ];

  const amenities = [
    { icon: Wifi, label: 'High-Speed WiFi' },
    { icon: Coffee, label: 'Common Kitchen' },
    { icon: Shield, label: '24/7 Security & CCTV' },
    { icon: Users, label: 'Community Lounge' },
    { icon: Mountain, label: 'Mountain View Terrace' },
    { icon: Award, label: 'NEITA 2025 Nominated' },
  ];

  const handleWhatsApp = () => window.open('https://wa.me/918837317070?text=Hi%2C%20I%20want%20to%20book%20at%20XTSY%20Hostel%20Shillong', '_blank');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Best Hostel in Shillong 2026 — Budget Dorms from ₹450 | XTSY</title>
        <meta name="description" content="XTSY is the best hostel in Shillong, Meghalaya. India's biggest hostel with budget dorms from ₹450, private rooms, 270° glass suite. 4.8★ rated. Book direct for best price." />
        <meta name="keywords" content="best hostel in Shillong, hostel in Shillong, budget hostel Shillong, backpacker hostel Meghalaya, cheap hostel Shillong, dorm bed Shillong, hostel near Shillong, budget stay Shillong, Shillong accommodation budget" />
        <link rel="canonical" href="https://xtsy.one/best-hostel-in-shillong" />
        <meta property="og:title" content="Best Hostel in Shillong — XTSY | Dorms from ₹450" />
        <meta property="og:description" content="India's biggest hostel in Shillong. Budget dorms, private rooms, 270° glass suite. 4.8★ rated by 320+ guests." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xtsy.one/best-hostel-in-shillong" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-4">
              <Award className="h-4 w-4" />
              <span>NEITA 2025 Nominated · India's Biggest Hostel in Northeast</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Best Hostel in Shillong, Meghalaya
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              XTSY Travellers Hostel is Shillong's top-rated hostel with 320+ reviews and a 4.8★ rating. From budget dorms at ₹450/night to India's first 270° panoramic glass suite — we offer every type of stay for backpackers, couples, and groups visiting Meghalaya.
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Mawkhar, Shillong</span>
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> 4.8 (320+ reviews)</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleWhatsApp} className="gap-2">
                <MessageCircle className="h-4 w-4" /> Book on WhatsApp
              </Button>
              <Link to="/book">
                <Button variant="outline" className="gap-2">Book Online</Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-16">

          {/* Room Types */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Room Types & Pricing</h2>
            <p className="mt-2 text-muted-foreground">Something for every budget — from ₹450 dorm beds to luxury glamping.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roomTypes.map((room) => (
                <Card key={room.name} className="border-border/50">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <room.icon className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-foreground">{room.name}</h3>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{room.desc}</p>
                      </div>
                      <span className="text-lg font-bold text-primary whitespace-nowrap">{room.price}<span className="text-xs text-muted-foreground font-normal">/night</span></span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">What's Included</h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map((a) => (
                <div key={a.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <a.icon className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{a.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Why XTSY */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Why XTSY is the Best Hostel in Shillong</h2>
            <div className="mt-4 space-y-3">
              {[
                'India\'s biggest hostel in Northeast India with 20+ rooms',
                'Only hostel in Shillong with a 270° panoramic glass suite',
                'Pet-friendly — India\'s first pet-friendly travellers hostel',
                'Female-only dorms with dedicated security & privacy',
                'On-site restaurant (TAB Bistro) with multi-cuisine menu',
                'Co-working spaces with high-speed WiFi for digital nomads',
                'Curated Meghalaya tour packages starting ₹7,999',
                'Bike & car rentals for self-drive exploration',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">XTSY vs Other Hostels in Shillong</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-foreground">Feature</th>
                    <th className="text-center py-3 px-2 text-primary font-bold">XTSY</th>
                    <th className="text-center py-3 px-2 text-muted-foreground">Others</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ['Starting Price', '₹450/night', '₹500-800/night'],
                    ['Glass Suite', '✅ 270° Panoramic', '❌'],
                    ['Pet Friendly', '✅', '❌'],
                    ['Female Dorms', '✅ Dedicated', 'Limited'],
                    ['On-site Restaurant', '✅ TAB Bistro', '❌'],
                    ['Tour Packages', '✅ Curated', '❌'],
                    ['Google Rating', '4.8★', '3.5-4.2★'],
                    ['Bike Rentals', '✅', '❌'],
                  ].map(([feature, xtsy, others]) => (
                    <tr key={feature} className="border-b border-border/30">
                      <td className="py-2.5 px-2">{feature}</td>
                      <td className="py-2.5 px-2 text-center text-foreground font-medium">{xtsy}</td>
                      <td className="py-2.5 px-2 text-center">{others}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
            <h2 className="text-2xl font-bold text-foreground">Book the Best Hostel in Shillong</h2>
            <p className="mt-2 text-muted-foreground">Direct booking = best price guaranteed. No middlemen, no markups.</p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Button onClick={handleWhatsApp} className="gap-2">
                <MessageCircle className="h-4 w-4" /> WhatsApp Booking
              </Button>
              <Link to="/book">
                <Button variant="outline">Book Online</Button>
              </Link>
              <a href="tel:+918837317070">
                <Button variant="outline" className="gap-2"><Phone className="h-4 w-4" /> Call Us</Button>
              </a>
            </div>
          </section>

          {/* Internal Links */}
          <nav className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Explore More</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/hotels-in-shillong" className="text-sm text-primary hover:underline">Hotels in Shillong</Link>
              <Link to="/homestays-in-shillong" className="text-sm text-primary hover:underline">Homestays in Shillong</Link>
              <Link to="/luxury-glamping-shillong" className="text-sm text-primary hover:underline">Luxury Glamping Shillong</Link>
              <Link to="/xtsy-270" className="text-sm text-primary hover:underline">270° Glass Suite</Link>
              <Link to="/female-travellers" className="text-sm text-primary hover:underline">Female Travellers</Link>
              <Link to="/pet-friendly" className="text-sm text-primary hover:underline">Pet-Friendly Stays</Link>
              <Link to="/meghalaya-tour-packages" className="text-sm text-primary hover:underline">Tour Packages</Link>
              <Link to="/tab-bistro" className="text-sm text-primary hover:underline">TAB Bistro Restaurant</Link>
              <Link to="/xtsy-vs-zostel" className="text-sm text-primary hover:underline">XTSY vs Zostel</Link>
              <Link to="/work-from-home" className="text-sm text-primary hover:underline">Workation in Shillong</Link>
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
});

BestHostelShillong.displayName = 'BestHostelShillong';
export default BestHostelShillong;
