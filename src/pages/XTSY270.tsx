import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { XTSY270_DATA } from '@/data/rooms/xtsy270';
import xtsyStargazing from '@/assets/xtsy-270-stargazing.jpeg';
import xtsyAerial from '@/assets/xtsy-270-aerial.jpeg';
import xtsyMilkyway from '@/assets/xtsy-270-glass-night-new.png';
import xtsyMilkyway2 from '@/assets/xtsy-270-new4.png';
import xtsyInterior from '@/assets/xtsy-270-interior.jpeg';
import MobileImageCarousel from '@/components/MobileImageCarousel';
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
  const {
    formatPrice
  } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isB2BFormOpen, setIsB2BFormOpen] = useState(false);
  const title = XTSY270_DATA.seoTitle;
  const description = XTSY270_DATA.seoDescription;
  const canonicalUrl = XTSY270_DATA.canonicalUrl;
  const keywords = (XTSY270_DATA as any).seoKeywords || '';
  const handleBookingClick = () => {
    const message = `🏕️ *XTSY Xperience – Glasshouse Glamping Inquiry*

Hi XTSY Team! I'd love to experience India's first 270° glasshouse glamping retreat! 🌟

🏔️ *What I'm Interested In:*
• XTSY Xperience – 270° Glamping Retreat
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
    name: 'XTSY Xperience – 270° Glasshouse Glamping Retreat',
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
  return <div className="min-h-screen bg-gradient-to-b from-stone-50 via-amber-50/40 to-stone-100">
      <SEOHead title={title} description={description} keywords={keywords} canonicalUrl={canonicalUrl} ogType="product" />
      <Header />
      
      {/* Luxury Hero Section */}
      <main className="pt-16 relative overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-200/20 via-transparent to-amber-100/10" />

        {/* Hero Section */}
        <section className="relative z-10 pt-2 pb-16">
          <div className="container mx-auto max-w-7xl px-4">
            {/* Luxury Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
              <Badge variant="outline" className="bg-white border-stone-200 text-stone-800 font-semibold shadow-sm">
                <Award className="w-3 h-3 mr-1" />
                India's First Glasshouse Glamping
              </Badge>
              <Badge variant="outline" className="bg-white border-stone-200 text-stone-800 font-semibold shadow-sm">
                <Star className="w-3 h-3 mr-1" />
                Intimate. Immersive. Iconic
              </Badge>
              <Badge variant="outline" className="bg-white border-stone-200 text-stone-800 font-semibold shadow-sm">
                <Mountain className="w-3 h-3 mr-1" />
                Scotland of The East
              </Badge>
            </div>

            {/* Hero Title */}
            <div className="text-center mb-12 animate-fade-in" style={{
            animationDelay: '0.2s'
          }}>
               <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-stone-900 leading-tight">
                 XTSY Xperience
               </h1>
               <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-stone-800">
                 India's First 270° Glasshouse Glamping Retreat
               </h2>
               <p className="text-lg md:text-xl text-stone-700 font-medium max-w-3xl mx-auto leading-relaxed mb-4">
                Sleep under the stars. Wake to mountains.
               </p>
               <p className="text-base md:text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
                Experience our innovative architectural marvel inside pine forests &amp; mountains where you can stargaze open skies from your bed in Shillong — Scotland of The East.
               </p>
            </div>

            {/* Pricing Display */}
            <div className="text-center mb-8 animate-fade-in" style={{
            animationDelay: '0.35s'
          }}>
               <h3 className="text-2xl md:text-3xl font-bold mb-3 text-stone-900">Mountains. Forest. Sky. Stars.</h3>
               <p className="text-base md:text-lg text-stone-600 font-medium max-w-2xl mx-auto">
                A luxury glamping retreat without compromise — designed for couples
               </p>
            </div>
            <div className="flex justify-center mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-card/80 backdrop-blur-2xl border border-border/30 shadow-lg shadow-black/5 rounded-2xl p-8 text-center">
                  <span className="inline-block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
                    Starting from
                  </span>
                  <div className="flex items-baseline justify-center gap-2 mb-1">
                     <span className="text-xl md:text-2xl font-medium tracking-tight text-muted-foreground line-through">
                       {formatPrice(11999)}
                     </span>
                     <span className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                       {formatPrice(7499)}
                     </span>
                   </div>
                   <span className="text-sm text-muted-foreground font-medium">per night · inclusive of taxes</span>
                   <div className="mt-2">
                     <span className="text-xs font-semibold tracking-widest uppercase text-primary">Limited time Offer</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Hero Image Carousel */}
            <figure className="animate-fade-in" style={{
            animationDelay: '0.6s'
          }} aria-label="XTSY 270° Panorama Glass Ensuite luxury experience">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200/40">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                <MobileImageCarousel images={[xtsyStargazing, xtsyAerial, xtsyMilkyway, xtsyMilkyway2, xtsyInterior]} alt="XTSY 270° Panorama Glass Ensuite — India's first luxury glass house with 270-degree mountain views" aspectRatio="video" showIndicators={true} showArrows={true} autoPlay={true} autoPlayInterval={5000} className="w-full h-[60vh] md:h-[70vh]" />
              </div>
              <figcaption className="mt-4 text-center text-gray-700 font-medium">
                India's first 270° glasshouse glamping retreat — where architecture disappears into nature
              </figcaption>
              <p className="mt-2 text-center text-sm text-gray-600 font-medium">
                Purely designed and curated by Team XTSY in the pine forests of Shillong
              </p>
            </figure>
          </div>
        </section>

        {/* Section Separator */}
        <div className="container mx-auto max-w-7xl px-4">
          <Separator className="my-8" />
        </div>

        {/* Luxury Content Sections */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            
            {/* The Vision Section - Enhanced Luxury Design */}
            <div className="mb-20 animate-fade-in relative">
              {/* Elegant Background Elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/5 via-yellow-300/3 to-orange-200/8 rounded-full blur-3xl animate-pulse" style={{
                animationDuration: '4s'
              }}></div>
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-400/5 via-red-300/3 to-pink-200/8 rounded-full blur-3xl animate-pulse" style={{
                animationDuration: '5s',
                animationDelay: '1s'
              }}></div>
              </div>

              <div className="text-center mb-12">
               <h2 className="text-4xl md:text-5xl font-bold mb-6 text-stone-900">
                   Luxury Glamping Reimagined
                 </h2>
                 <p className="text-xl text-stone-700 font-medium max-w-3xl mx-auto">
                   One side opens to rolling mountains. The other overlooks pine forests. Above you — open sky and stargazing.
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
                          Where Glamping Meets Moons &amp; Stars
                        </h3>
                        <p className="text-gray-200 text-lg md:text-xl font-medium leading-relaxed mb-8 tracking-wide">
                          This is not only a stay — but an experience designed to be remembered. Wake up to golden sunlight over the hills. 
                          Sleep under stars from the comfort of premium bedding. Our luxury glamping retreat provides privacy, intimacy, 
                          and breathtaking views — all in one space. Perfect for anniversary surprises, proposals, honeymoons, or romantic weekends.
                        </p>
                      </div>
                      
                      {/* Premium Feature Badges */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200/80 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-amber-300/60">
                          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                            <Eye className="w-10 h-10 text-amber-500 mx-auto drop-shadow-sm" />
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-2">270° Panorama</div>
                          <div className="text-sm text-gray-600 font-medium">Mountains, Forest &amp; Sky</div>
                        </div>
                        
                        <div className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200/80 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:border-orange-300/60">
                          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                            <Award className="w-10 h-10 text-orange-500 mx-auto drop-shadow-sm" />
                          </div>
                          <div className="text-lg font-bold text-gray-900 mb-2">Couples Retreat</div>
                          <div className="text-sm text-gray-600 font-medium">Intimate &amp; Romantic</div>
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
                            <div className="text-lg font-bold text-gray-900 mb-1">Rolling Mountain Vistas</div>
                            <div className="text-sm text-gray-600 font-medium">Wake up to golden sunlight over the hills</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200/60 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Sun className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900 mb-1">Pine Forest Immersion</div>
                            <div className="text-sm text-gray-600 font-medium">Architecture that disappears into nature</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200/60 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Moon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900 mb-1">Stargazing from Your Bed</div>
                            <div className="text-sm text-gray-600 font-medium">Sleep under stars with premium comfort</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section Separator */}
            <Separator className="my-16" />

            {/* Luxury Amenities Grid */}
            <div className="mb-20 animate-fade-in">
              <div className="text-center mb-12">
               <h2 className="text-4xl md:text-5xl font-bold mb-6 text-stone-900">
                    Luxury Without Compromise
                 </h2>
                 <p className="text-xl text-stone-700 font-medium max-w-3xl mx-auto">
                   XTSY Xperience gives you mountains, forest, sky, stars — and still the comforts of a premium stay
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {XTSY270_DATA.luxuryFeatures.map((feature, index) => <Card key={index} className="bg-white border-stone-200 shadow-md hover:shadow-lg transition-all duration-300 group">
                     <CardContent className="p-6 text-center">
                       <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                         <feature.icon className="w-8 h-8 text-primary mx-auto" />
                       </div>
                       <h3 className="text-lg font-semibold mb-2 text-stone-900">{feature.title}</h3>
                       <p className="text-sm text-stone-600 font-medium">{feature.description}</p>
                    </CardContent>
                  </Card>)}
              </div>
            </div>


            {/* Bottom CTA Section */}
            <div className="mt-16 mb-24 text-center animate-fade-in">
              <div className="text-center mb-8">
               <h2 className="text-4xl md:text-5xl font-bold mb-6 text-stone-900">
                   A Glamping Stay Unlike Any Other
                  </h2>
                  <p className="text-xl text-stone-700 font-medium max-w-3xl mx-auto mb-8">
                    Whether it's an anniversary surprise, a proposal, a honeymoon getaway, or a romantic weekend retreat — this is where unforgettable memories begin. Only one suite available per night in India.
                  </p>
              </div>
              <p className="text-sm text-stone-600 font-medium mt-4">
                Limited availability • Book 48 hours in advance for exclusive concierge services
              </p>
            </div>

            {/* Floating Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 bg-transparent pointer-events-none">
              <div className="mx-auto max-w-5xl flex justify-center">
                <Button size="lg" onClick={() => setIsB2BFormOpen(true)} className="pointer-events-auto rounded-xl px-8 md:px-12 py-4 md:py-6 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 ring-4 ring-primary/20 hover:ring-primary/30 relative overflow-hidden group">
                  <span className="relative z-10 bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent animate-pulse text-center text-lg md:text-xl">
                    Will it be yours?
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SECURITY: Safe usage of dangerouslySetInnerHTML - Only stringifies static room structured data (roomLd) with no user-generated content */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify(roomLd)
    }} />
      <XTSY270Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <B2BBookingForm isOpen={isB2BFormOpen} onClose={() => setIsB2BFormOpen(false)} customTitle="Will it be yours? - XTSY 270° Glass Suite" customDescription="India's First 270° Panoramic Glass House - Exclusive luxury experience" customIcon={Sparkles} maxGuests={2} fixedGuests={true} isCoupleFocused={true} />
    </div>;
};
export default XTSY270;