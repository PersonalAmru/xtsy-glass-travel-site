import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { XTSY270_DATA } from '@/data/rooms/xtsy270';
import MobileImageCarousel from '@/components/MobileImageCarousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Mountain, Star, Award, Eye, Sun, Moon, Wifi, Coffee, Bath, Bed, Users, MapPin } from 'lucide-react';

const XTSY270: React.FC = () => {
  const [isWeekend, setIsWeekend] = useState(false);
  const title = XTSY270_DATA.seoTitle;
  const description = XTSY270_DATA.seoDescription;
  const canonicalUrl = XTSY270_DATA.canonicalUrl;

  // Check if current day is weekend for dynamic pricing
  useEffect(() => {
    const today = new Date().getDay();
    setIsWeekend(today === 0 || today === 6); // Sunday = 0, Saturday = 6
  }, []);

  const currentPrice = isWeekend ? XTSY270_DATA.weekendPrice : XTSY270_DATA.weekdayPrice;

  const updateOrCreateMeta = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const addOrUpdateCanonical = (url: string) => {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  };

  useEffect(() => {
    document.title = title;
    updateOrCreateMeta('description', description);
    addOrUpdateCanonical(canonicalUrl);
  }, []);

  const handleBookingClick = () => {
    const message = `🏔️ *XTSY 270° Panorama Glass Ensuite Booking Inquiry* 🏔️

Hi XTSY Team! ✨

I'm interested in booking the XTSY 270° - India's first panoramic glass house experience! 

🏨 *Property Details:*
• XTSY 270° Panorama Glass Ensuite
• India's first 270° glass house with mountain views
• Premium luxury accommodation in Shillong, Meghalaya

💰 *Current Rates:*
• Weekday: ₹${XTSY270_DATA.weekdayPrice.toLocaleString()}/night
• Weekend: ₹${XTSY270_DATA.weekendPrice.toLocaleString()}/night

🛏️ *Room Features:*
• Queen bed accommodation for up to 2 guests
• Private ensuite bathroom
• 270° panoramic mountain views
• Architectural excellence with transparent sanctuary design

Could you please help me with:
• Availability for my preferred dates
• Final pricing and booking process
• Any special packages or add-on services

Looking forward to experiencing this incredible architectural marvel! 🌿

Thank you! 😊`;

    const whatsappUrl = `https://wa.me/918837317070?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const roomLd = {
    '@context': 'https://schema.org',
    '@type': 'HotelRoom',
    name: XTSY270_DATA.name,
    description,
    url: canonicalUrl,
    occupancy: {
      '@type': 'QuantitativeValue',
      minValue: XTSY270_DATA.occupancy.min,
      maxValue: XTSY270_DATA.occupancy.max,
    },
    bed: {
      '@type': 'BedDetails',
      type: XTSY270_DATA.bed.type,
      numberOfBeds: XTSY270_DATA.bed.count,
    },
    amenityFeature: XTSY270_DATA.features.map((f) => ({ '@type': 'LocationFeatureSpecification', name: f, value: true })),
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: XTSY270_DATA.priceCurrency,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-100/60">
      <Header />
      
      {/* Luxury Hero Section */}
      <main className="pt-16 relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-yellow-300/5 to-orange-200/15">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse opacity-20"
              style={{
                width: `${80 + i * 20}px`,
                height: `${80 + i * 20}px`,
                background: `linear-gradient(135deg, hsl(45 100% ${65 + i * 5}%), hsl(35 90% ${70 + i * 3}%))`,
                left: `${10 + i * 15}%`,
                top: `${5 + i * 12}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${3 + i * 0.3}s`,
                filter: 'blur(40px)'
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-8 pb-16">
          <div className="container mx-auto max-w-7xl px-4">
            {/* Luxury Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
              <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary font-semibold backdrop-blur-sm">
                <Award className="w-3 h-3 mr-1" />
                India's First 270° Glass House
              </Badge>
              <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary font-semibold backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1" />
                Architectural Excellence
              </Badge>
              <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary font-semibold backdrop-blur-sm">
                <Mountain className="w-3 h-3 mr-1" />
                Premium Mountain Views
              </Badge>
            </div>

            {/* Hero Title */}
            <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-muted-foreground leading-tight">
                XTSY 270°
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-muted-foreground">
                Panorama Glass Ensuite
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Experience India's most innovative architectural marvel — a 200% luxury ensuite with stunning 270° mountain panoramas that redefine hospitality excellence.
              </p>
            </div>

            {/* Pricing Display */}
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Card className="bg-gradient-to-br from-card/80 to-card backdrop-blur-sm border-primary/20 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Weekday Rate
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    ₹{XTSY270_DATA.weekdayPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per night • Monday - Friday
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card/80 to-card backdrop-blur-sm border-primary/20 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Weekend Rate
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    ₹{XTSY270_DATA.weekendPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    per night • Saturday - Sunday
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hero Image Carousel */}
            <figure className="animate-fade-in" style={{ animationDelay: '0.6s' }} aria-label="XTSY 270° Panorama Glass Ensuite luxury experience">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-card/50 to-card backdrop-blur-sm border border-primary/10">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                <MobileImageCarousel
                  images={XTSY270_DATA.images}
                  alt="XTSY 270° Panorama Glass Ensuite — India's first luxury glass house with 270-degree mountain views"
                  aspectRatio="video"
                  showIndicators={true}
                  showArrows={true}
                  autoPlay={true}
                  autoPlayInterval={5000}
                  className="w-full h-[60vh] md:h-[70vh]"
                />
              </div>
              <figcaption className="mt-4 text-center text-muted-foreground">
                India's first 270° panoramic glass house — where architecture meets nature in perfect harmony
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Luxury Content Sections */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            
            {/* The Vision Section */}
            <div className="mb-20 animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  The Vision
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Pioneering architectural innovation in the heart of Meghalaya's pristine landscapes
                </p>
              </div>
              
              <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-primary/20 shadow-xl">
                <CardContent className="p-4 md:p-6">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-foreground">India's First 270° Glass House</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Conceived as a masterpiece of contemporary architecture, XTSY 270° redefines luxury accommodation through 
                        innovative glass engineering. Our transparent sanctuary offers an unparalleled connection with nature while 
                        maintaining the highest standards of comfort and privacy.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary font-semibold backdrop-blur-sm text-center justify-center p-4 flex-col">
                          <Eye className="w-6 h-6 text-primary mb-2" />
                          <div className="text-sm font-medium">270° Views</div>
                        </Badge>
                        <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary font-semibold backdrop-blur-sm text-center justify-center p-4 flex-col">
                          <Award className="w-6 h-6 text-primary mb-2" />
                          <div className="text-sm font-medium">First in India</div>
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary font-semibold backdrop-blur-sm w-full justify-start p-4">
                        <Mountain className="w-5 h-5 text-primary mr-2" />
                        <span className="text-sm">Panoramic mountain vistas</span>
                      </Badge>
                      <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary font-semibold backdrop-blur-sm w-full justify-start p-4">
                        <Sun className="w-5 h-5 text-primary mr-2" />
                        <span className="text-sm">Sunrise to sunset immersion</span>
                      </Badge>
                      <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary font-semibold backdrop-blur-sm w-full justify-start p-4">
                        <Moon className="w-5 h-5 text-primary mr-2" />
                        <span className="text-sm">Stargazing sanctuary</span>
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Luxury Amenities Grid */}
            <div className="mb-20 animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Luxury Amenities
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Every detail crafted for the discerning traveler seeking uncompromising excellence
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {XTSY270_DATA.luxuryFeatures.map((feature, index) => (
                  <Card key={index} className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-8 h-8 text-primary mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Experience Details */}
            <div className="mb-20 animate-fade-in">
              <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-primary/20 shadow-xl">
                <CardContent className="p-3 md:p-4">
                  <div className="grid lg:grid-cols-3 gap-3">
                    <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary font-semibold backdrop-blur-sm text-center justify-center p-3 flex-col">
                      <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                      <h3 className="text-base font-semibold mb-1">Occupancy</h3>
                      <p className="text-muted-foreground text-sm">Up to 2 guests in supreme comfort</p>
                    </Badge>
                    <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary font-semibold backdrop-blur-sm text-center justify-center p-3 flex-col">
                      <Bed className="w-6 h-6 text-primary mx-auto mb-2" />
                      <h3 className="text-base font-semibold mb-1">Bedding</h3>
                      <p className="text-muted-foreground text-sm">Queen bed with premium linens</p>
                    </Badge>
                    <Badge variant="outline" className="bg-primary/20 border-primary/50 text-primary font-semibold backdrop-blur-sm text-center justify-center p-3 flex-col">
                      <Bath className="w-6 h-6 text-primary mx-auto mb-2" />
                      <h3 className="text-base font-semibold mb-1">Ensuite</h3>
                      <p className="text-muted-foreground text-sm">Private luxury bathroom</p>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom CTA Section */}
            <div className="mt-16 mb-8 text-center animate-fade-in">
              <Button 
                size="lg" 
                onClick={handleBookingClick}
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary hover:border-primary/70 px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 ring-4 ring-primary/20 hover:ring-primary/30"
              >
                Reserve Your Luxury Experience
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Limited availability • Book 48 hours in advance for exclusive concierge services
              </p>
            </div>
          </div>
        </section>
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(roomLd) }} />
      <Footer />
    </div>
  );
};

export default XTSY270;
