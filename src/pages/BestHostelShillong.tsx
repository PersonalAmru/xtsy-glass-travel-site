import { memo } from 'react';
import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookDirectComparison from '@/components/hostel/BookDirectComparison';
import { hostelDealFaqEntities } from '@/data/hostelBookingFaqs';
import { Star, Wifi, Shield, Coffee, Users, MapPin, Phone, MessageCircle, Check, Award, Bed, Mountain, Backpack, IndianRupee, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const BestHostelShillong = memo(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Hostel',
    '@id': 'https://xtsy.one/best-hostel-in-shillong#hostel',
    name: 'XTSY Travellers Hostel',
    description: 'One of the best cheap hostels in Shillong, Meghalaya — budget dorm beds from ₹369, private rooms, and India\'s first 270° glass suite. Central location, 24/7 security, 4.8★ rated.',
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
    priceRange: '₹369 - ₹4,999',
    currenciesAccepted: 'INR',
    starRating: { '@type': 'Rating', ratingValue: '4.8' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '161',
      bestRating: '5',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Hot Shower', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Common Kitchen', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Locker Storage', value: true },
      { '@type': 'LocationFeatureSpecification', name: '24/7 Reception', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Female-only Dorm', value: true },
    ],
    makesOffer: [
      { '@type': 'Offer', name: '6-Bed Mixed Dorm Bed', price: '369', priceCurrency: 'INR' },
      { '@type': 'Offer', name: '4-Bed Female Dorm Bed', price: '550', priceCurrency: 'INR' },
      { '@type': 'Offer', name: 'Private Double Room', price: '2500', priceCurrency: 'INR' },
    ],
    checkinTime: '13:00',
    checkoutTime: '11:00',
    numberOfRooms: 20,
    petsAllowed: true,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://xtsy.one/' },
      { '@type': 'ListItem', position: 2, name: 'Hostels in Shillong', item: 'https://xtsy.one/best-hostel-in-shillong' },
    ],
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Which are the best cheap hostels in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'XTSY Travellers Hostel is among the best cheap hostels in Shillong, with a 4.8★ rating from 161 verified guests. Budget dorm beds start at ₹369/night, making it one of the most affordable backpacker hostels in Meghalaya without cutting corners on safety or location.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does a dorm bed in a Shillong hostel cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A dorm bed in a Shillong hostel at XTSY starts from ₹369/night in the 6-bed mixed dorm. Female-only dorms are ₹550/night, private double rooms from ₹2,500/night, and the premium 270° Glass Suite is ₹4,999/night.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do Shillong hostels have mixed and female-only dorms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. XTSY offers 6-bed and 8-bed mixed dormitories for backpackers plus dedicated 4-bed female-only dorms with privacy curtains and secure keycard access — ideal for solo female travellers looking for a safe, cheap hostel in Shillong.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is XTSY hostel safe for solo and backpacker travellers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. XTSY has 24/7 CCTV, personal lockers at every bed, female-only dorms, and round-the-clock staff. It\'s rated among the safest backpacker hostels in Shillong for solo and female travellers.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I book a hostel in Shillong online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can complete online hostel booking directly on xtsy.one — pick your dates and dorm or room, check live availability, and confirm instantly. Booking direct guarantees the best price with no OTA markups. You can also book a hostel in Shillong over WhatsApp or by phone.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is XTSY hostel located in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'XTSY Travellers Hostel is in Mawkhar, central Shillong — walking distance to Police Bazaar, cafés and transport, and a short drive from Umiam Lake, Elephant Falls and the Dawki–Cherrapunji circuits.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does the Shillong hostel allow pets?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! XTSY is India\'s first pet-friendly travellers hostel. Dogs, cats, and other pets are welcome with prior booking.',
        },
      },
      ...hostelDealFaqEntities,
    ],
  };

  const dormRooms = [
    { name: '6-Bed Mixed Dormitory', price: '₹369', desc: 'Backpacker favourite — personal locker, reading light, charging port & privacy curtain per bunk.', icon: Bed },
    { name: '8-Bed Mixed Dormitory', price: '₹369', desc: 'Best value social dorm for backpackers — same in-bed amenities, biggest community vibe.', icon: Users },
    { name: '4-Bed Female-Only Dorm', price: '₹550', desc: 'Women-only, extra privacy curtains, secure keycard access — safest cheap hostel option.', icon: Shield },
  ];

  const privateRooms = [
    { name: 'Private Double Room', price: '₹2,500', desc: 'Ensuite bathroom, mountain views, queen bed — hostel social vibe with private comfort.', icon: Mountain },
    { name: 'Panorama by XTSY', price: '₹4,999', desc: 'India\'s first 270° panoramic glass suite — stargazing from bed.', icon: Star },
  ];

  const amenities = [
    { icon: Wifi, label: 'High-Speed WiFi' },
    { icon: Coffee, label: 'Common Kitchen' },
    { icon: Shield, label: '24/7 Security & CCTV' },
    { icon: Users, label: 'Community Lounge' },
    { icon: Mountain, label: 'Mountain View Terrace' },
    { icon: Award, label: 'NEITA 2025 Nominated' },
  ];

  const handleWhatsApp = () => window.open('https://wa.me/918837317070?text=Hi%2C%20I%20want%20to%20book%20a%20hostel%20in%20Shillong%20at%20XTSY', '_blank');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
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
              Hostels in Shillong — Cheap Dorm Beds from ₹369
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Searching for cheap hostels in Shillong? XTSY Travellers Hostel is Shillong's top-rated backpacker hostel — 4.8★ from 161 verified guests, with budget mixed dorms from ₹369/night, safe female-only dorms, private rooms, and India's first 270° panoramic glass suite. Central Mawkhar location, minutes from Police Bazaar.
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Mawkhar, Shillong</span>
              <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> 4.8 (161 verified reviews)</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/book">
                <Button className="gap-2"><CalendarCheck className="h-4 w-4" /> Book a Hostel Bed Online</Button>
              </Link>
              <Button onClick={handleWhatsApp} variant="outline" className="gap-2">
                <MessageCircle className="h-4 w-4" /> Book on WhatsApp
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-16">

          {/* Dorm Beds — backpacker-focused section */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Bed className="h-6 w-6 text-primary" /> Dorm Beds — Cheap Backpacker Stays in Shillong
            </h2>
            <p className="mt-2 text-muted-foreground max-w-3xl">
              Our dormitories are the most affordable way to stay in Shillong. Every bunk comes with a privacy curtain, personal locker, reading light and charging port — the social, budget-friendly base backpackers and solo travellers love. Choose a lively mixed dorm or a secure female-only dorm.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dormRooms.map((room) => (
                <Card key={room.name} className="border-border/50">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
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
            <div className="mt-5">
              <Link to="/book">
                <Button className="gap-2"><CalendarCheck className="h-4 w-4" /> Check Dorm Availability</Button>
              </Link>
            </div>
          </section>

          {/* Backpacker guide section */}
          <section className="rounded-2xl border border-border/50 bg-muted/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Backpack className="h-6 w-6 text-primary" /> A Backpacker Hostel Built for the Road
            </h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
                <p>
                  XTSY is a genuine backpacker hostel, not a repurposed guesthouse. You get a buzzing common lounge, communal kitchen, mountain-view terrace, and a crowd of travellers swapping Dawki, Nohkalikai and Cherrapunji route tips every evening.
                </p>
                <p>
                  It's the perfect cheap Shillong base for backpackers doing the Meghalaya loop — lock in a dorm bed, drop your pack, and head out to the living root bridges, waterfalls and crystal-clear rivers.
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  'Dorm beds from ₹369 — one of the cheapest hostels in Shillong',
                  'Free high-speed WiFi & co-working corners for digital nomads',
                  'Self-catering common kitchen to keep costs down',
                  'Lockers, curtains & 24/7 staff for safe solo travel',
                  'Bike & car rentals + curated Meghalaya tours from the front desk',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Private Rooms */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <IndianRupee className="h-6 w-6 text-primary" /> Private Rooms & Suites
            </h2>
            <p className="mt-2 text-muted-foreground">Want the hostel vibe with private comfort? Choose an ensuite room or the panoramic glass suite.</p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {privateRooms.map((room) => (
                <Card key={room.name} className="border-border/50">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
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
            <h2 className="text-2xl font-bold text-foreground">Why XTSY is the Best Cheap Hostel in Shillong</h2>
            <div className="mt-4 space-y-3">
              {[
                'Dorm beds from ₹369 — among the cheapest hostels in Shillong',
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
                    ['Starting Price', '₹369/night', '₹500-800/night'],
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

          <BookDirectComparison className="!py-0 !px-0" />

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Hostels in Shillong — Frequently Asked Questions</h2>
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
            <h2 className="text-2xl font-bold text-foreground">Book a Hostel in Shillong — Direct & Cheapest</h2>
            <p className="mt-2 text-muted-foreground">Online hostel booking with the best price guaranteed. No OTAs, no markups, instant confirmation.</p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Link to="/book">
                <Button className="gap-2"><CalendarCheck className="h-4 w-4" /> Book Online</Button>
              </Link>
              <Button onClick={handleWhatsApp} variant="outline" className="gap-2">
                <MessageCircle className="h-4 w-4" /> WhatsApp Booking
              </Button>
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
