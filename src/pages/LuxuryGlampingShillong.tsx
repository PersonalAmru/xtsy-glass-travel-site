import { memo } from 'react';
import { Link } from '@/lib/router-compat';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, Heart, Mountain, Sparkles, MessageCircle, Camera, Moon, Sun, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LuxuryGlampingShillong = memo(() => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'XTSY 270° Glass Suite — Luxury Glamping Shillong',
    description: 'India\'s first 270° panoramic glass suite in Shillong, Meghalaya. Luxury glamping with mountain views, stargazing, and sunrise experiences.',
    url: 'https://xtsy.one/luxury-glamping-shillong',
    telephone: '+918837317070',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Shillong',
      addressRegion: 'Meghalaya',
      addressCountry: 'IN',
    },
    priceRange: '₹4,999/night',
    starRating: { '@type': 'Rating', ratingValue: '4.9' },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: '270° Panoramic Glass Walls', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Stargazing', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Mountain Views', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Private Bathroom', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Premium Breakfast', value: true },
    ],
  };

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is glamping in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Glamping in Shillong means luxury camping with full amenities. XTSY\'s 270° Glass Suite is India\'s first panoramic glass house — three glass walls offering mountain views, stargazing, and sunrise from your bed. It includes a private bathroom, queen bed, climate control, and premium breakfast.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much does glamping cost in Shillong?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'XTSY\'s 270° Glass Suite is priced at ₹4,999/night including premium breakfast, WiFi, and all amenities. This is the only panoramic glass suite in Northeast India.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the 270° Glass Suite good for couples?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely! The Glass Suite is perfect for romantic getaways, anniversaries, honeymoons, and proposals. Private glass walls face natural landscapes, not buildings. Couples get sunrise views, stargazing, and complete privacy with blackout curtains.',
        },
      },
    ],
  };

  const handleWhatsApp = () => window.open('https://wa.me/918837317070?text=Hi%2C%20I%20want%20to%20book%20the%20270%20Glass%20Suite', '_blank');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Luxury Glamping in Shillong — 270° Glass Suite | XTSY Meghalaya</title>
        <meta name="description" content="India's first 270° panoramic glass suite in Shillong. Luxury glamping with stargazing, mountain views, sunrise from bed. Perfect for couples, anniversaries, proposals. ₹4,999/night." />
        <meta name="keywords" content="glamping in Shillong, luxury glamping Meghalaya, glass suite Shillong, stargazing room India, romantic stay Shillong, luxury stay Meghalaya, couple friendly hotel Shillong, honeymoon Shillong, unique stays India" />
        <link rel="canonical" href="https://xtsy.one/luxury-glamping-shillong" />
        <meta property="og:title" content="270° Glass Suite — Luxury Glamping in Shillong" />
        <meta property="og:description" content="India's first panoramic glass suite. Stargazing, mountain views, sunrise from bed. Perfect for couples." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xtsy.one/luxury-glamping-shillong" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
      </Helmet>

      <Header />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex items-center gap-2 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>India's First 270° Panoramic Glass Suite</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Luxury Glamping in Shillong, Meghalaya
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
              Wake up to 270° mountain views through floor-to-ceiling glass walls. Stargaze from your bed. Watch sunrise paint the Khasi Hills. XTSY's Glass Suite is India's most unique luxury stay — and it's in the heart of Meghalaya.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleWhatsApp} className="gap-2">
                <MessageCircle className="h-4 w-4" /> Book Glass Suite
              </Button>
              <Link to="/xtsy-270">
                <Button variant="outline">View Full Details</Button>
              </Link>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl pb-16 space-y-16">

          {/* Experience */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">The 270° Glass Suite Experience</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Sun, title: 'Sunrise from Bed', desc: 'Three glass walls face east — watch the Khasi Hills glow golden without leaving your bed.' },
                { icon: Moon, title: 'Stargazing at Night', desc: 'Shillong\'s clear skies + panoramic glass = the most spectacular night sky view from any room in India.' },
                { icon: Mountain, title: 'Mountain Panorama', desc: 'Unobstructed 270° views of rolling hills, pine forests, and valleys. No buildings, no obstructions.' },
              ].map((exp) => (
                <div key={exp.title} className="text-center p-6 rounded-xl bg-muted/30">
                  <exp.icon className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="mt-3 font-bold text-foreground">{exp.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{exp.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What's Included */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">What's Included at ₹4,999/night</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                '270° panoramic glass walls',
                'Queen-size bed with premium linens',
                'Private ensuite bathroom with hot shower',
                'Climate control (heating + cooling)',
                'Premium breakfast at TAB Bistro',
                'High-speed WiFi',
                'Blackout curtains for privacy',
                'Welcome drink on arrival',
                'Access to all hostel common areas',
                'Mountain-view terrace',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Perfect For */}
          <section className="bg-muted/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground">Perfect For</h2>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Heart, label: 'Romantic Getaways' },
                { icon: Star, label: 'Anniversaries' },
                { icon: Sparkles, label: 'Proposals' },
                { icon: Camera, label: 'Instagram Content' },
              ].map((item) => (
                <div key={item.label} className="text-center p-4">
                  <item.icon className="h-6 w-6 text-primary mx-auto" />
                  <p className="mt-2 text-sm font-medium text-foreground">{item.label}</p>
                </div>
              ))}
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
            <h2 className="text-2xl font-bold text-foreground">Book the Glass Suite</h2>
            <p className="mt-2 text-muted-foreground">Limited to 1 suite — book early to secure your dates.</p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Button onClick={handleWhatsApp} className="gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp Booking</Button>
              <Link to="/book"><Button variant="outline">Book Online</Button></Link>
            </div>
          </section>

          {/* Internal Links */}
          <nav className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Related Pages</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Link to="/best-hostel-in-shillong" className="text-sm text-primary hover:underline">Best Hostel in Shillong</Link>
              <Link to="/hotels-in-shillong" className="text-sm text-primary hover:underline">Hotels in Shillong</Link>
              <Link to="/homestays-in-shillong" className="text-sm text-primary hover:underline">Homestays in Shillong</Link>
              <Link to="/destination-wedding-shillong" className="text-sm text-primary hover:underline">Destination Wedding</Link>
              <Link to="/meghalaya-couple-tour-package" className="text-sm text-primary hover:underline">Couple Tour Package</Link>
              <Link to="/xtsy-270" className="text-sm text-primary hover:underline">270° Suite Full Details</Link>
              <Link to="/gallery" className="text-sm text-primary hover:underline">Photo Gallery</Link>
            </div>
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
});

LuxuryGlampingShillong.displayName = 'LuxuryGlampingShillong';
export default LuxuryGlampingShillong;
