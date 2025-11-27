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
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "As a solo female traveler, I felt incredibly safe at XTSY. The staff was supportive, and I made amazing friends in the women-only dorm!"
    },
    {
      name: "Sarah Johnson",
      location: "London",
      rating: 5,
      text: "The best hostel experience I've had in India! Clean, safe, and the female community here is so welcoming. Highly recommend for solo women travelers."
    },
    {
      name: "Ananya Das",
      location: "Kolkata",
      rating: 5,
      text: "XTSY understands what female travelers need. From safety to comfort, everything was perfect. I extended my stay by a week!"
    }
  ];

  const faqs = [
    {
      question: "Are there women-only dormitories available?",
      answer: "Yes! We have dedicated female-only dormitories with 4-bed and 6-bed options. These spaces are exclusively for female guests and come with secure access control."
    },
    {
      question: "What safety measures are in place for female travelers?",
      answer: "We have 24/7 security personnel, CCTV surveillance in common areas, secure access to female dormitories, well-lit premises, and female staff members available round the clock."
    },
    {
      question: "Can I travel solo to XTSY as a female traveler?",
      answer: "Absolutely! XTSY is one of the safest hostels for solo female travelers in Northeast India. We have a strong community of female solo travelers, and our staff ensures everyone feels secure and welcomed."
    },
    {
      question: "Are there any special facilities for women?",
      answer: "Yes, we provide female hygiene products, hair dryers, full-length mirrors, private bathroom facilities, a wellness space for yoga and meditation, and a comfortable common area exclusively for female guests."
    },
    {
      question: "How do you ensure privacy in shared spaces?",
      answer: "Female dormitories have secure locks, individual curtains for each bed, personal lockers, beautiful mountain views"
    },
    {
      question: "Is it safe to explore Shillong as a female traveler?",
      answer: "Shillong is one of the safest cities in India for female travelers. Our staff provides local travel tips, recommended routes, and can arrange trusted transport services. We also organize group tours for guests who prefer to explore together."
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

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-pink-100 text-pink-700 border-pink-200">
              Real Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Female Travelers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-pink-100 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-gray-900">{testimonial.name}</CardTitle>
                  <CardDescription className="text-pink-600">{testimonial.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
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
