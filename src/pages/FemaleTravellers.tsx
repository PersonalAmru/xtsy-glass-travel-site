import { useEffect } from 'react';
import Header from '@/components/Header';
import { Shield, Users, Heart, Sparkles, Phone, MessageCircle, Check, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import heroImage from '@/assets/female-travellers-hero.jpg';
import safeDormImage from '@/assets/female-safe-amenities.jpg';
import communityImage from '@/assets/female-community-bonding.jpg';

const FemaleTravellers = () => {
  useEffect(() => {
    document.title = "Female Travellers - XTSY Prime | Safe & Empowering Travel";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'XTSY Prime welcomes female travelers with safe spaces, women-only dormitories, and empowering travel experiences in Northeast India.');
    }
  }, []);

  const handleWhatsAppBooking = () => {
    window.open('https://wa.me/918837317070?text=Hi%2C%20I%20would%20like%20to%20book%20for%20female%20travelers', '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+918837317070';
  };

  const safetyFeatures = [
    {
      icon: Shield,
      title: "24/7 Security",
      description: "Round-the-clock security personnel and CCTV surveillance for your peace of mind"
    },
    {
      icon: Users,
      title: "Women-Only Spaces",
      description: "Dedicated female dormitories and common areas for privacy and comfort"
    },
    {
      icon: Heart,
      title: "Female Staff Support",
      description: "Experienced female staff members available to assist you anytime"
    },
    {
      icon: Sparkles,
      title: "Verified Community",
      description: "Connect with verified female travelers and build lasting friendships"
    }
  ];

  const amenities = [
    "Secure lockers with individual keys",
    "Well-lit corridors and common areas",
    "Female hygiene products available",
    "Hair dryers and styling tools",
    "Private bathroom facilities",
    "Comfortable reading corners",
    "Wellness and meditation space",
    "Travel safety guidance and local tips"
  ];

  const testimonials = [
    {
      name: "Olivia",
      location: "Female Dormitory",
      rating: 5,
      text: "When my friends and I planned our North East India trip, we were hesitant. But XTSY Travellers Hostel changed everything! We instantly felt safe and welcomed—it's honestly one of the safest places we've traveled to. The hostel itself is awesome—clean, cozy, and full of good vibes.",
      highlight: "Safety First",
      avatar: "O",
      source: "Booking.com",
      verified: true
    },
    {
      name: "Ritika",
      location: "Female Dormitory",
      rating: 5,
      text: "The hostel has a very welcoming atmosphere with friendly staff and a helpful property manager. The food is excellent, cleanliness is always maintained, and Wi-Fi connectivity is smooth. As a student, I never faced any issues.",
      highlight: "Solo Student",
      avatar: "R",
      source: "Booking.com",
      verified: true
    },
    {
      name: "Amritha",
      location: "4-Bed Female Dormitory",
      rating: 5,
      text: "XTSY made me ecstatic! The property and staffs really surprised me by providing a very warm experience. The owner, my host Eurica and all other staffs are really friendly and goes above and beyond to make you feel at home.",
      highlight: "Warm Welcome",
      avatar: "A",
      source: "Booking.com",
      verified: true
    }
  ];

  const faqs = [
    {
      question: "Do you have women-only dorms?",
      answer: "Yes! 4-bed and 6-bed female-only dorms with secure access control. Your space, your privacy, your peace of mind.",
      quote: "When my friends and I planned our North East India trip, we were hesitant. But XTSY changed everything!",
      quoteName: "Olivia"
    },
    {
      question: "What safety measures do you have?",
      answer: "24/7 security, CCTV in common areas, secure female dorm access, well-lit premises, and female staff on call round the clock. We take safety seriously—not just as a policy, but as a priority.",
    },
    {
      question: "Is it safe for solo female travelers?",
      answer: "100%. We've hosted countless solo female travelers who keep coming back. Northeast India is one of India's safest regions, and our staff ensures everyone feels secure and welcomed. No sketchy vibes, ever.",
      quote: "XTSY made us feel safe and welcomed—it's honestly one of the safest places we've traveled to.",
      quoteName: "Olivia"
    },
    {
      question: "What facilities are designed for women?",
      answer: "Hygiene products, hair dryers, full-length mirrors, private bathrooms, wellness space for yoga/meditation, and a comfortable common area just for female guests. We thought of everything.",
      quote: "The hostel has a very welcoming atmosphere with friendly staff... As a student, I never faced any issues.",
      quoteName: "Ritika"
    },
    {
      question: "How private are shared spaces?",
      answer: "Female dorms have secure locks, individual bed curtains, personal lockers, and mountain views. Your own bubble within a community.",
    },
    {
      question: "Is Shillong safe to explore solo?",
      answer: "Shillong is one of India's safest cities for women. Our staff shares local tips, safe routes, and trusted transport options. We also organize group tours if you'd rather explore with others.",
      quote: "XTSY made me ecstatic! The staff really surprised me by providing a very warm experience.",
      quoteName: "Amritha"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Female Travelers at XTSY" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 via-purple-900/70 to-pink-900/80" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            XTSY Prime for Women
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Travel Safe, <span className="text-pink-300">Travel Bold</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-pink-100 max-w-3xl mx-auto">
            Northeast India's safest haven for female travelers. Where safety meets adventure and sisterhood.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleWhatsAppBooking}
              className="bg-white text-pink-700 hover:bg-pink-100 hover:text-pink-800 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Book via WhatsApp
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={handleCall}
              className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-pink-700 backdrop-blur-sm shadow-xl"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call +91 88373 17070
            </Button>
          </div>
        </div>
      </section>

      {/* Safety Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">
              Your Safety, Our Priority
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Female Travelers Choose XTSY
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed specifically for women who want to explore the world safely and confidently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="border-pink-100 hover:border-pink-300 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-100/50 to-purple-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">
                Comfort & Care
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Amenities Designed for Women
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Every detail thoughtfully curated to ensure your comfort, privacy, and peace of mind during your stay.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-800 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={safeDormImage} 
                alt="Women-Only Safe Space" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border-2 border-pink-200">
                <p className="text-4xl font-bold text-pink-600">100%</p>
                <p className="text-gray-700 font-medium">Safe & Secure</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src={communityImage} 
                alt="Female Travelers Community" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
            
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
                Sisterhood & Support
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Join Our Community of Women Explorers
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Connect with like-minded female travelers from around the world. Share stories, make lifelong friends, and embark on adventures together.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-800">
                  <Heart className="h-6 w-6 text-pink-500" />
                  <span className="font-medium">Regular women-only group activities and tours</span>
                </li>
                <li className="flex items-center gap-3 text-gray-800">
                  <Users className="h-6 w-6 text-pink-500" />
                  <span className="font-medium">Community events and cultural experiences</span>
                </li>
                <li className="flex items-center gap-3 text-gray-800">
                  <Sparkles className="h-6 w-6 text-pink-500" />
                  <span className="font-medium">Wellness sessions and self-care workshops</span>
                </li>
              </ul>
              <Button 
                onClick={handleWhatsAppBooking}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 shadow-lg"
                size="lg"
              >
                Join Our Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Premium Glassmorphism Design */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-950 via-purple-900 to-pink-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,72,153,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.15),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm mb-4">
              Real Stories
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
              What Female Travelers Say
            </h2>
            <p className="text-lg text-white/60 font-light max-w-2xl mx-auto">
              Trusted by hundreds of solo female travelers across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/30 via-purple-500/20 to-pink-500/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500" />
                
                <Card className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/10">
                  <CardContent className="p-6 sm:p-7 md:p-8 flex flex-col h-full">
                    {/* Header with avatar and source */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-pink-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-pink-500/30">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-base sm:text-lg">{testimonial.name}</div>
                          <div className="text-xs sm:text-sm text-white/50">{testimonial.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                        {testimonial.verified && (
                          <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="text-[10px] sm:text-xs text-white/60 font-medium">{testimonial.source}</span>
                      </div>
                    </div>
                    
                    {/* Rating stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.5)]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    
                    {/* Review content */}
                    <p className="text-sm sm:text-base text-white/80 leading-relaxed flex-1 mb-5">
                      "{testimonial.text}"
                    </p>
                    
                    {/* Highlight tag */}
                    <div className="pt-4 border-t border-white/5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                        {testimonial.highlight}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
              Got Questions?
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-pink-100 rounded-lg px-6 bg-white/80 backdrop-blur-sm hover:border-pink-300 transition-colors"
              >
                <AccordionTrigger className="text-left text-gray-900 hover:text-pink-600 font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready for Your Safe Adventure?
          </h2>
          <p className="text-xl mb-8 text-pink-100">
            Join hundreds of female travelers who have made XTSY their home away from home
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg"
              onClick={handleWhatsAppBooking}
              className="bg-white text-pink-700 hover:bg-pink-100 hover:text-pink-800 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Book Now
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={handleCall}
              className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-pink-700 backdrop-blur-sm shadow-xl"
            >
              <Phone className="mr-2 h-5 w-5" />
              Speak to Our Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FemaleTravellers;
