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
              <Badge variant="outline" className="glass-card bg-white/80 border-white/60 text-gray-800 font-semibold backdrop-blur-md">
                <Award className="w-3 h-3 mr-1" />
                India's First 270° Glass House
              </Badge>
              <Badge variant="outline" className="glass-card bg-white/80 border-white/60 text-gray-800 font-semibold backdrop-blur-md">
                <Star className="w-3 h-3 mr-1" />
                Architectural Excellence
              </Badge>
              <Badge variant="outline" className="glass-card bg-white/80 border-white/60 text-gray-800 font-semibold backdrop-blur-md">
                <Mountain className="w-3 h-3 mr-1" />
                Premium Mountain Views
              </Badge>
            </div>

            {/* Hero Title */}
            <div className="text-center mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
                XTSY 270°
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Panorama Glass Ensuite
              </h2>
              <p className="text-lg md:text-xl text-gray-800 font-medium max-w-3xl mx-auto leading-relaxed">
                Experience India's most innovative architectural marvel — a 200% luxury ensuite with stunning 270° mountain panoramas that redefine hospitality excellence.
              </p>
            </div>

            {/* Pricing Display */}
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Card className="glass-card bg-white/80 backdrop-blur-md border-white/60 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-gray-800">
                      Weekday Rate
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    ₹{XTSY270_DATA.weekdayPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    per night • Monday - Friday
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card bg-white/80 backdrop-blur-md border-white/60 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-gray-800">
                      Weekend Rate
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    ₹{XTSY270_DATA.weekendPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    per night • Saturday - Sunday
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hero Image Carousel */}
            <figure className="animate-fade-in" style={{ animationDelay: '0.6s' }} aria-label="XTSY 270° Panorama Glass Ensuite luxury experience">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl glass-card bg-white/10 backdrop-blur-sm border-white/20">
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
              <figcaption className="mt-4 text-center text-gray-700 font-medium">
                India's first 270° panoramic glass house — where architecture meets nature in perfect harmony
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Luxury Content Sections */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            
            {/* The Vision Section - Enhanced Luxury Design */}
            <div className="mb-20 animate-fade-in relative">
              {/* Elegant Background Elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/5 via-yellow-300/3 to-orange-200/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-400/5 via-red-300/3 to-pink-200/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
              </div>

              <div className="text-center mb-16">
                <div className="inline-block mb-6">
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative">
                    The Vision
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                  </h2>
                </div>
                <p className="text-2xl md:text-3xl text-gray-700 font-light max-w-4xl mx-auto leading-relaxed tracking-wide">
                  Pioneering architectural innovation in the heart of Meghalaya's pristine landscapes
                </p>
              </div>
              
              {/* Premium Card with Enhanced Luxury Styling */}
              <Card className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50/95 to-white border-2 border-gray-200/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl">
                {/* Luxury Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-transparent to-orange-500/20 rounded-lg blur-sm"></div>
                <div className="absolute inset-[1px] bg-gradient-to-br from-white via-gray-50/98 to-white rounded-lg"></div>
                
                <CardContent className="relative p-8 md:p-12 lg:p-16 bg-gradient-to-br from-black/95 via-gray-900/90 to-black/95 backdrop-blur-xl border border-white/20 shadow-2xl">
                  {/* Glassmorphism overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 rounded-lg pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-lg pointer-events-none" />
                  
                  {/* Luxury glass reflection effects */}
                  <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl opacity-60" />
                  <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-tl from-amber-400/20 to-transparent rounded-full blur-xl opacity-40" />
                  
                  <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight tracking-tight">
                          India's First 270° Panorama Glass Ensuite
                        </h3>
                        <p className="text-gray-200 text-lg md:text-xl font-medium leading-relaxed mb-8 tracking-wide">
                          Conceived as a masterpiece of contemporary architecture, XTSY 270° redefines luxury accommodation through 
                          innovative glass engineering. Our transparent sanctuary offers an unparalleled connection with nature while 
                          maintaining the highest standards of comfort and privacy.
                        </p>
                      </div>
                      
                      {/* Premium Feature Badges */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200/80 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-amber-300/60">
                          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                            <Eye className="w-10 h-10 text-amber-500 mx-auto drop-shadow-sm" />
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-2">270° Views</div>
                          <div className="text-sm text-gray-600 font-medium">Panoramic Excellence</div>
                        </div>
                        
                        <div className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200/80 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-orange-300/60">
                          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                            <Award className="w-10 h-10 text-orange-500 mx-auto drop-shadow-sm" />
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-2">First in India</div>
                          <div className="text-sm text-gray-600 font-medium">Architectural Pioneer</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Elegant Feature List */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200/60 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Mountain className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900 mb-1">Panoramic Mountain Vistas</div>
                            <div className="text-sm text-gray-600 font-medium">Uninterrupted 270° natural beauty</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200/60 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Sun className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900 mb-1">Sunrise to Sunset Immersion</div>
                            <div className="text-sm text-gray-600 font-medium">Complete daylight experience in glass</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200/60 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Moon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900 mb-1">Stargazing Sanctuary</div>
                            <div className="text-sm text-gray-600 font-medium">Crystal-clear night sky views</div>
                          </div>
                        </div>
                      </div>
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
                <p className="text-xl text-gray-800 font-medium max-w-3xl mx-auto">
                  Every detail crafted for the discerning traveler seeking uncompromising excellence
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {XTSY270_DATA.luxuryFeatures.map((feature, index) => (
                  <Card key={index} className="glass-card bg-white/80 backdrop-blur-md border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-8 h-8 text-primary mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-700 font-medium">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Experience Details - Enhanced Luxury Section */}
            <div className="mb-20 animate-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Luxury Accommodation Details
                </h2>
                <p className="text-xl text-gray-800 font-medium max-w-3xl mx-auto">
                  Meticulously crafted spaces designed for the ultimate comfort and sophistication
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="glass-card bg-white/80 backdrop-blur-md border-white/60 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-12 h-12 text-primary mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Exclusive Occupancy</h3>
                    <p className="text-gray-700 text-lg font-medium leading-relaxed">
                      Intimate sanctuary for up to <span className="font-bold text-primary">2 distinguished guests</span> seeking unparalleled luxury and privacy
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card bg-white/80 backdrop-blur-md border-white/60 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      <Bed className="w-12 h-12 text-primary mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Premium Bedding</h3>
                    <p className="text-gray-700 text-lg font-medium leading-relaxed">
                      Sumptuous <span className="font-bold text-primary">Queen bed</span> adorned with the finest Egyptian cotton linens and handcrafted comfort
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card bg-white/80 backdrop-blur-md border-white/60 shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      <Bath className="w-12 h-12 text-primary mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">Luxury Ensuite</h3>
                    <p className="text-gray-700 text-lg font-medium leading-relaxed">
                      Private spa-inspired bathroom with <span className="font-bold text-primary">panoramic views</span> and premium Italian fixtures
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom CTA Section */}
            <div className="mt-16 mb-8 text-center animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Reserve Your Experience
                </h2>
                <p className="text-xl text-gray-800 font-medium max-w-3xl mx-auto mb-8">
                  Every detail crafted for the discerning traveler seeking uncompromising excellence
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={handleBookingClick}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-2 border-primary hover:border-primary/70 px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 ring-4 ring-primary/20 hover:ring-primary/30"
              >
                Reserve Your Luxury Experience
              </Button>
              <p className="text-sm text-gray-800 font-medium mt-4">
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
