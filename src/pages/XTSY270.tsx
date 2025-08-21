
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
      
      {/* Mobile-Optimized Hero Section */}
      <main className="pt-12 pb-20 relative overflow-hidden">
        {/* Mobile-Optimized Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/8 via-yellow-300/4 to-orange-200/12">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-pulse opacity-15"
              style={{
                width: `${60 + i * 15}px`,
                height: `${60 + i * 15}px`,
                background: `linear-gradient(135deg, hsl(45 100% ${70 + i * 4}%), hsl(35 90% ${75 + i * 3}%))`,
                left: `${15 + i * 20}%`,
                top: `${8 + i * 15}%`,
                animationDelay: `${i * 1}s`,
                animationDuration: `${3 + i * 0.5}s`,
                filter: 'blur(30px)'
              }}
            />
          ))}
        </div>

        {/* Mobile Hero Content */}
        <section className="relative z-10 px-4 py-6">
          <div className="max-w-sm mx-auto">
            {/* Mobile Badges */}
            <div className="flex flex-col gap-2 mb-6 animate-fade-in">
              <Badge variant="outline" className="bg-primary/15 border-primary/40 text-primary font-medium backdrop-blur-sm text-xs py-1.5">
                <Award className="w-3 h-3 mr-1" />
                India's First 270° Glass House
              </Badge>
              <Badge variant="outline" className="bg-primary/15 border-primary/40 text-primary font-medium backdrop-blur-sm text-xs py-1.5">
                <Mountain className="w-3 h-3 mr-1" />
                Premium Mountain Views
              </Badge>
            </div>

            {/* Mobile Hero Title */}
            <div className="text-center mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-2xl font-bold mb-3 text-muted-foreground leading-tight">
                XTSY 270°
              </h1>
              <h2 className="text-xl font-bold mb-3 text-muted-foreground">
                Panorama Glass Ensuite
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Experience India's most innovative architectural marvel with stunning 270° mountain panoramas.
              </p>
            </div>

            {/* Mobile Pricing */}
            <div className="flex flex-col gap-3 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Card className="bg-gradient-to-br from-card/90 to-card backdrop-blur-sm border-primary/15 shadow-md">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Weekday Rate
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    ₹{XTSY270_DATA.weekdayPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    per night • Mon-Fri
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card/90 to-card backdrop-blur-sm border-primary/15 shadow-md">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">
                      Weekend Rate
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    ₹{XTSY270_DATA.weekendPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    per night • Sat-Sun
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Hero Image */}
            <figure className="animate-fade-in mb-6" style={{ animationDelay: '0.6s' }}>
              <div className="relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-card/40 to-card backdrop-blur-sm border border-primary/10">
                <MobileImageCarousel
                  images={XTSY270_DATA.images}
                  alt="XTSY 270° Panorama Glass Ensuite"
                  aspectRatio="video"
                  showIndicators={true}
                  showArrows={false}
                  autoPlay={true}
                  autoPlayInterval={4000}
                  className="w-full h-48"
                />
              </div>
              <figcaption className="mt-3 text-center text-xs text-muted-foreground px-2">
                India's first 270° panoramic glass house
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Mobile Content Sections */}
        <section className="px-4 pb-8 relative z-10">
          <div className="max-w-sm mx-auto space-y-8">
            
            {/* The Vision - Mobile */}
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  The Vision
                </h2>
                <p className="text-sm text-muted-foreground">
                  Pioneering architectural innovation in Meghalaya
                </p>
              </div>
              
              <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-primary/15 shadow-lg">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3 text-foreground">India's First 270° Glass House</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    A masterpiece of contemporary architecture offering unparalleled connection with nature while 
                    maintaining the highest standards of comfort and privacy.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Badge variant="outline" className="bg-primary/15 border-primary/40 text-primary font-medium backdrop-blur-sm text-center justify-center p-3 flex-col text-xs">
                      <Eye className="w-4 h-4 text-primary mb-1" />
                      270° Views
                    </Badge>
                    <Badge variant="outline" className="bg-primary/15 border-primary/40 text-primary font-medium backdrop-blur-sm text-center justify-center p-3 flex-col text-xs">
                      <Award className="w-4 h-4 text-primary mb-1" />
                      First in India
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile Amenities Grid */}
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Luxury Features
                </h2>
                <p className="text-sm text-muted-foreground">
                  Crafted for discerning travelers
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {XTSY270_DATA.luxuryFeatures.slice(0, 6).map((feature, index) => (
                  <Card key={index} className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-primary/15 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-3 text-center">
                      <div className="mb-2">
                        <feature.icon className="w-5 h-5 text-primary mx-auto" />
                      </div>
                      <h3 className="text-xs font-semibold mb-1">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground leading-tight">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Mobile Experience Details */}
            <div className="animate-fade-in">
              <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-primary/15 shadow-lg">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Badge variant="outline" className="bg-primary/15 border-primary/40 text-primary font-medium backdrop-blur-sm w-full justify-center p-3 flex-col">
                      <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                      <h3 className="text-sm font-semibold mb-1">Occupancy</h3>
                      <p className="text-xs text-muted-foreground">Up to 2 guests</p>
                    </Badge>
                    <Badge variant="outline" className="bg-primary/15 border-primary/40 text-primary font-medium backdrop-blur-sm w-full justify-center p-3 flex-col">
                      <Bed className="w-5 h-5 text-primary mx-auto mb-1" />
                      <h3 className="text-sm font-semibold mb-1">Bedding</h3>
                      <p className="text-xs text-muted-foreground">Queen bed with premium linens</p>
                    </Badge>
                    <Badge variant="outline" className="bg-primary/15 border-primary/40 text-primary font-medium backdrop-blur-sm w-full justify-center p-3 flex-col">
                      <Bath className="w-5 h-5 text-primary mx-auto mb-1" />
                      <h3 className="text-sm font-semibold mb-1">Ensuite</h3>
                      <p className="text-xs text-muted-foreground">Private luxury bathroom</p>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mobile CTA */}
            <div className="text-center animate-fade-in pt-4">
              <Button 
                size="lg" 
                onClick={handleBookingClick}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary hover:border-primary/70 py-4 text-base font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ring-4 ring-primary/20 hover:ring-primary/30"
              >
                Reserve Your Luxury Experience
              </Button>
              <p className="text-xs text-muted-foreground mt-3 px-2">
                Limited availability • Book 48 hours in advance
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
