import Header from '@/components/Header';
import { Shield, Users, Heart, Sparkles, Phone, MessageCircle, Check, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import heroImage from '@/assets/female-travellers-hero.jpg';
import safeDormImage from '@/assets/female-safe-amenities.jpg';
import communityImage from '@/assets/female-community-bonding.jpg';
import SEOHead from '@/components/SEOHead';

const FemaleTravellers = () => {

  const handleWhatsAppBooking = () => {
    window.open('https://wa.me/918837317070?text=Hi%2C%20I%20would%20like%20to%20book%20for%20female%20travelers', '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+918837317070';
  };

  const safetyFeatures = [
    { icon: Shield, title: "24/7 Security", description: "Round-the-clock security personnel and CCTV surveillance for your peace of mind" },
    { icon: Users, title: "Women-Only Spaces", description: "Dedicated female dormitories and common areas for privacy and comfort" },
    { icon: Heart, title: "Female Staff Support", description: "Experienced female staff members available to assist you anytime" },
    { icon: Sparkles, title: "Verified Community", description: "Connect with verified female travelers and build lasting friendships" }
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
      name: "Olivia", location: "Female Dormitory", rating: 5,
      text: "When my friends and I planned our North East India trip, we were hesitant. But XTSY Travellers Hostel changed everything! We instantly felt safe and welcomed—it's honestly one of the safest places we've traveled to. The hostel itself is awesome—clean, cozy, and full of good vibes.",
      highlight: "Safety First", avatar: "O", source: "Booking.com", verified: true
    },
    {
      name: "Ritika", location: "Female Dormitory", rating: 5,
      text: "The hostel has a very welcoming atmosphere with friendly staff and a helpful property manager. The food is excellent, cleanliness is always maintained, and Wi-Fi connectivity is smooth. As a student, I never faced any issues.",
      highlight: "Solo Student", avatar: "R", source: "Booking.com", verified: true
    },
    {
      name: "Amritha", location: "4-Bed Female Dormitory", rating: 5,
      text: "XTSY made me ecstatic! The property and staffs really surprised me by providing a very warm experience. The owner, my host Eurica and all other staffs are really friendly and goes above and beyond to make you feel at home.",
      highlight: "Warm Welcome", avatar: "A", source: "Booking.com", verified: true
    }
  ];

  const faqs = [
    { question: "Do you have women-only dorms?", answer: "Yes! 4-bed and 6-bed female-only dorms with secure access control. Your space, your privacy, your peace of mind.", quote: "When my friends and I planned our North East India trip, we were hesitant. But XTSY changed everything!", quoteName: "Olivia" },
    { question: "What safety measures do you have?", answer: "24/7 security, CCTV in common areas, secure female dorm access, well-lit premises, and female staff on call round the clock. We take safety seriously—not just as a policy, but as a priority." },
    { question: "Is it safe for solo female travelers?", answer: "100%. We've hosted countless solo female travelers who keep coming back. Northeast India is one of India's safest regions, and our staff ensures everyone feels secure and welcomed. No sketchy vibes, ever.", quote: "XTSY made us feel safe and welcomed—it's honestly one of the safest places we've traveled to.", quoteName: "Olivia" },
    { question: "What facilities are designed for women?", answer: "Hygiene products, hair dryers, full-length mirrors, private bathrooms, wellness space for yoga/meditation, and a comfortable common area just for female guests. We thought of everything.", quote: "The hostel has a very welcoming atmosphere with friendly staff... As a student, I never faced any issues.", quoteName: "Ritika" },
    { question: "How private are shared spaces?", answer: "Female dorms have secure locks, individual bed curtains, personal lockers, and mountain views. Your own bubble within a community." },
    { question: "Is Shillong safe to explore solo?", answer: "Shillong is one of India's safest cities for women. Our staff shares local tips, safe routes, and trusted transport options. We also organize group tours if you'd rather explore with others.", quote: "XTSY made me ecstatic! The staff really surprised me by providing a very warm experience.", quoteName: "Amritha" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Safe Stays for Women — Female-Only Dorms in Shillong | XTSY"
        description="Female-only dorms with 24/7 security, CCTV, personal lockers. India's safest hostel for solo women travellers in Shillong, Meghalaya."
        keywords="female hostel Shillong, women solo travel India, safe hostel women, girls dorm Meghalaya, female traveller hostel northeast India"
        canonicalUrl="https://xtsy.one/female-travellers"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Female Travelers at XTSY" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-card/80 to-background/90" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-foreground">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
            XTSY Prime for Women
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in text-foreground">
            Travel Safe, <span className="text-primary">Travel Bold</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Northeast India's safest haven for female travelers. Where safety meets adventure and sisterhood.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={handleWhatsAppBooking} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl">
              <MessageCircle className="mr-2 h-5 w-5" />
              Book via WhatsApp
            </Button>
            <Button size="lg" variant="outline" onClick={handleCall} className="border-border text-foreground hover:bg-accent shadow-xl">
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
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Your Safety, Our Priority
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Female Travelers Choose XTSY
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Designed specifically for women who want to explore the world safely and confidently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyFeatures.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-xl bg-card">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-brand-ember rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Comfort & Care
              </Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Amenities Designed for Women
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Every detail thoughtfully curated to ensure your comfort, privacy, and peace of mind during your stay.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-foreground font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img src={safeDormImage} alt="Women-Only Safe Space" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-xl shadow-xl border border-border">
                <p className="text-4xl font-bold text-primary">100%</p>
                <p className="text-muted-foreground font-medium">Safe & Secure</p>
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
              <img src={communityImage} alt="Female Travelers Community" className="rounded-2xl shadow-2xl" />
            </div>
            
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-accent text-accent-foreground border-border">
                Sisterhood & Support
              </Badge>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Join Our Community of Women Explorers
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Connect with like-minded female travelers from around the world. Share stories, make lifelong friends, and embark on adventures together.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-foreground">
                  <Heart className="h-6 w-6 text-primary" />
                  <span className="font-medium">Regular women-only group activities and tours</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Users className="h-6 w-6 text-primary" />
                  <span className="font-medium">Community events and cultural experiences</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span className="font-medium">Wellness sessions and self-care workshops</span>
                </li>
              </ul>
              <Button onClick={handleWhatsAppBooking} className="bg-gradient-to-r from-primary to-brand-ember text-primary-foreground hover:from-primary/90 hover:to-brand-ember/90 shadow-lg" size="lg">
                Join Our Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-card via-surface-elevated to-card" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
              Real Stories
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.03em' }}>
              What Female Travelers Say
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              Trusted by hundreds of solo female travelers across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <Card className="relative h-full bg-card/80 border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-xl">
                  <CardContent className="p-6 sm:p-7 md:p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-brand-ember flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-base sm:text-lg">{testimonial.name}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border/50">
                        {testimonial.verified && (
                          <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">{testimonial.source}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-brand-gold text-brand-gold" />
                      ))}
                    </div>
                    
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1 mb-5">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="pt-4 border-t border-border/50">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
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
            <Badge className="mb-4 bg-accent text-accent-foreground border-border">
              Got Questions?
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border/50 rounded-lg px-6 bg-card hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-foreground hover:text-primary font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-card via-surface-elevated to-card border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Ready for Your Safe Adventure?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground">
            Join hundreds of female travelers who have made XTSY their home away from home
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" onClick={handleWhatsAppBooking} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl">
              <MessageCircle className="mr-2 h-5 w-5" />
              Book Now
            </Button>
            <Button size="lg" variant="outline" onClick={handleCall} className="border-border text-foreground hover:bg-accent shadow-xl">
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
