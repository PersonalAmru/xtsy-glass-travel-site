import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { XTSY270_DATA } from '@/data/rooms/xtsy270';
import xtsyStargazing from '@/assets/xtsy-270-stargazing.jpeg';
import xtsyAerial from '@/assets/xtsy-270-aerial.jpeg';
import xtsyMilkyway from '@/assets/xtsy-270-glass-night-new.png';
import xtsyMilkyway2 from '@/assets/xtsy-270-new4.png';
import xtsyInterior from '@/assets/xtsy-270-interior.jpeg';
import InteractiveSelector from '@/components/ui/interactive-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Mountain, Star, Award, Eye, Sun, Moon, Wifi, Coffee, Bath, Bed, Users, MapPin, Sparkles } from 'lucide-react';
import XTSY270Modal from '@/components/XTSY270Modal';
import whatsappIcon from '@/assets/whatsapp-icon.svg';
import { routeGTMEvent } from '@/utils/gtmEventRouter';
import B2BBookingForm from '@/components/B2BBookingForm';
import { useApp } from '@/contexts/AppContext';
import SEOHead from '@/components/SEOHead';

const XTSY270: React.FC = () => {
  const { formatPrice } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isB2BFormOpen, setIsB2BFormOpen] = useState(false);
  const title = XTSY270_DATA.seoTitle;
  const description = XTSY270_DATA.seoDescription;
  const canonicalUrl = XTSY270_DATA.canonicalUrl;
  const keywords = (XTSY270_DATA as any).seoKeywords || '';

  const handleBookingClick = () => {
    const message = `🏕️ *Experience by XTSY – Glasshouse Glamping Inquiry*

Hi XTSY Team! I'd love to experience India's first 270° glasshouse glamping retreat! 🌟

🏔️ *What I'm Interested In:*
• Experience by XTSY – 270° Glamping Retreat
• Luxury glamping in Shillong, Meghalaya
• Stargazing from bed & pine forest views
• Romantic couples retreat

💰 *Rate:*
• Starting from ₹${XTSY270_DATA.price.toLocaleString()}/night

Could you please share:
📅 Availability for my preferred dates
💳 Booking process & payment options
🎁 Special romantic packages

Can't wait to sleep under the stars! 🌌✨`;
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=918837317070&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  const roomLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Experience by XTSY – 270° Glasshouse Glamping Retreat',
    description: 'India\'s first 270° panoramic glasshouse glamping retreat in Shillong, Meghalaya. Sleep under stars, wake to mountains — luxury glamping for couples.',
    url: canonicalUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Shillong',
      addressRegion: 'Meghalaya',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.5788,
      longitude: 91.8933
    },
    amenityFeature: XTSY270_DATA.features.map(f => ({
      '@type': 'LocationFeatureSpecification',
      name: f,
      value: true
    })),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/LimitedAvailability',
      priceCurrency: XTSY270_DATA.priceCurrency,
      price: XTSY270_DATA.price,
      description: 'Luxury glamping retreat for couples — per night, inclusive of taxes'
    },
    keywords: 'glamping India, luxury glamping Shillong, glasshouse glamping, romantic glamping, stargazing glamping, couples retreat'
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={description} keywords={keywords} canonicalUrl={canonicalUrl} ogType="product" />
      <Header />
      
      <main className="pt-16 relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />

        {/* Hero Section */}
        <section className="relative z-10 pt-2 pb-16">
          <div className="container mx-auto max-w-7xl px-4">
            {/* Luxury Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
              <Badge variant="outline" className="bg-card border-border text-foreground font-semibold shadow-xs">
                <Award className="w-3 h-3 mr-1 text-primary" />
                India's First Glasshouse Glamping
              </Badge>
              <Badge variant="outline" className="bg-card border-border text-foreground font-semibold shadow-xs">
                <Star className="w-3 h-3 mr-1 text-primary" />
                Intimate. Immersive. Iconic
              </Badge>
              <Badge variant="outline" className="bg-card border-border text-foreground font-semibold shadow-xs">
                <Mountain className="w-3 h-3 mr-1 text-primary" />
                Scotland of The East
              </Badge>
            </div>

            {/* Hero Title */}
            <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-foreground leading-tight">
                Experience by XTSY
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-foreground/80">
                India's First 270° Glasshouse Glamping Retreat
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed mb-4">
                Sleep under the stars. Wake to mountains.
              </p>
              <p className="text-base md:text-lg text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">
                Experience our innovative architectural marvel inside pine forests &amp; mountains where you can stargaze open skies from your bed in Shillong — Scotland of The East.
              </p>
            </div>

            {/* Pricing Display */}
            <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.35s' }}>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">Mountains. Forest. Sky. Stars.</h3>
              <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                A luxury glamping retreat without compromise — designed for couples
              </p>
            </div>

            {/* Glassmorphic Pricing Card */}
            <div className="flex justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/15 via-brand-gold/10 to-primary/15 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-card/80 backdrop-blur-2xl border border-border/30 shadow-lg rounded-2xl p-8 text-center">
                  <span className="inline-block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                    Starting from
                  </span>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                    <span className="text-xl md:text-2xl font-medium tracking-tight text-muted-foreground line-through">
                      {formatPrice(11999)}
                    </span>
                    <span className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                      {formatPrice(4999)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">per night · inclusive of taxes</span>
                  <div className="mt-2">
                    <span className="text-xs font-semibold tracking-widest uppercase text-primary">Limited time Offer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Interactive Image Selector */}
            <figure className="animate-fade-in" style={{ animationDelay: '0.6s' }} aria-label="XTSY 270° Panorama Glass Ensuite luxury experience">
              <InteractiveSelector
                options={[
                  { title: 'Stargazing Suite', description: 'Sleep under open skies from your bed', image: xtsyStargazing, icon: <Star className="w-6 h-6" /> },
                  { title: 'Aerial View', description: 'Architecture that disappears into nature', image: xtsyAerial, icon: <Eye className="w-6 h-6" /> },
                  { title: 'Glass & Milky Way', description: '270° panoramic glass under the stars', image: xtsyMilkyway, icon: <Moon className="w-6 h-6" /> },
                  { title: 'Night Glow', description: 'Luxury glamping illuminated by starlight', image: xtsyMilkyway2, icon: <Sparkles className="w-6 h-6" /> },
                  { title: 'Interior Luxury', description: 'Premium comfort meets pine forest views', image: xtsyInterior, icon: <Mountain className="w-6 h-6" /> },
                ]}
              />
              <figcaption className="mt-4 text-center text-muted-foreground font-medium">
                India's first 270° glasshouse glamping retreat — where architecture disappears into nature
              </figcaption>
              <p className="mt-2 text-center text-sm text-muted-foreground/70">
                Purely designed and curated by Team XTSY in the pine forests of Shillong
              </p>
            </figure>
          </div>
        </section>

        {/* Section Separator */}
        <div className="container mx-auto max-w-7xl px-4">
          <Separator className="my-8 bg-border/50" />
        </div>

        {/* Luxury Content Sections */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            
            {/* The Vision Section */}
            <div className="mb-20 animate-fade-in relative">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Luxury Glamping Reimagined
                </h2>
                <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto">
                  One side opens to rolling mountains. The other overlooks pine forests. Above you — open sky and stargazing.
                </p>
              </div>
              
              {/* Premium Card */}
              <Card className="relative overflow-hidden bg-card border border-border/50 shadow-2xl">
                <CardContent className="relative p-8 md:p-12 lg:p-16 bg-gradient-to-br from-card via-surface-elevated to-card">
                  {/* Subtle accent glow */}
                  <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl" />
                  
                  <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground leading-tight tracking-tight">
                          Where Glamping Meets Moons &amp; Stars
                        </h3>
                        <p className="text-muted-foreground text-lg md:text-xl font-medium leading-relaxed mb-8 tracking-wide">
                          This is not only a stay — but an experience designed to be remembered. Wake up to golden sunlight over the hills. 
                          Sleep under stars from the comfort of premium bedding. Our luxury glamping retreat provides privacy, intimacy, 
                          and breathtaking views — all in one space. Perfect for anniversary surprises, proposals, honeymoons, or romantic weekends.
                        </p>
                      </div>
                      
                      {/* Premium Feature Badges */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="group bg-card border border-border/60 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-primary/40">
                          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                            <Eye className="w-10 h-10 text-primary mx-auto" />
                          </div>
                          <div className="text-lg font-bold text-foreground mb-2">270° Panorama</div>
                          <div className="text-sm text-muted-foreground font-medium">Mountains, Forest &amp; Sky</div>
                        </div>
                        
                        <div className="group bg-card border border-border/60 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-brand-gold/40">
                          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                            <Award className="w-10 h-10 text-brand-gold mx-auto" />
                          </div>
                          <div className="text-lg font-bold text-foreground mb-2">Couples Retreat</div>
                          <div className="text-sm text-muted-foreground font-medium">Intimate &amp; Romantic</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Feature List */}
                    <div className="space-y-6">
                      <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-success to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Mountain className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-foreground mb-1">Rolling Mountain Vistas</div>
                            <div className="text-sm text-muted-foreground font-medium">Wake up to golden sunlight over the hills</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-brand-ember rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Sun className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-foreground mb-1">Pine Forest Immersion</div>
                            <div className="text-sm text-muted-foreground font-medium">Architecture that disappears into nature</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Moon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-foreground mb-1">Stargazing from Your Bed</div>
                            <div className="text-sm text-muted-foreground font-medium">Sleep under stars with premium comfort</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section Separator */}
            <Separator className="my-16 bg-border/50" />

            {/* Luxury Amenities Grid */}
            <div className="mb-20 animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Luxury Without Compromise
                </h2>
                <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto">
                  Experience by XTSY gives you mountains, forest, sky, stars — and still the comforts of a premium stay
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {XTSY270_DATA.luxuryFeatures.map((feature, index) => (
                  <Card key={index} className="bg-card border-border/50 shadow-md hover:shadow-lg transition-all duration-300 group hover:border-primary/30">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-8 h-8 text-primary mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="mt-16 mb-24 text-center animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  A Glamping Stay Unlike Any Other
                </h2>
                <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto mb-8">
                  Whether it's an anniversary surprise, a proposal, a honeymoon getaway, or a romantic weekend retreat — this is where unforgettable memories begin. Only one suite available per night in India.
                </p>
              </div>
              <p className="text-sm text-muted-foreground/70 font-medium mt-4">
                Limited availability • Book 48 hours in advance for exclusive concierge services
              </p>
            </div>

            {/* Floating Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 bg-transparent pointer-events-none">
              <div className="mx-auto max-w-5xl flex justify-center">
                <Button size="lg" onClick={() => setIsB2BFormOpen(true)} className="pointer-events-auto rounded-xl px-8 md:px-12 py-4 md:py-6 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-brand-ember hover:from-primary/90 hover:to-brand-ember/90 ring-4 ring-primary/20 hover:ring-primary/30 relative overflow-hidden group">
                  <span className="relative z-10 text-center text-lg md:text-xl font-bold text-primary-foreground">
                    Reserve Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(roomLd) }} />
      <XTSY270Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <B2BBookingForm isOpen={isB2BFormOpen} onClose={() => setIsB2BFormOpen(false)} customTitle="Will it be yours? - XTSY 270° Glass Suite" customDescription="India's First 270° Panoramic Glass House - Exclusive luxury experience" customIcon={Sparkles} maxGuests={2} fixedGuests={true} isCoupleFocused={true} />
    </div>
  );
};

export default XTSY270;
