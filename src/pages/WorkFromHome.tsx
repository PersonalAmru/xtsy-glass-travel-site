import { useState, useEffect } from "react";
import { Wifi, Mountain, Coffee, Users, Zap, Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WorkFromHome = () => {
  const [selectedDuration, setSelectedDuration] = useState<'week' | 'month' | 'quarter'>('month');

  const features = [
    {
      icon: Wifi,
      title: "High-Speed Internet",
      description: "Reliable 100+ Mbps fiber connectivity with backup power",
      color: "text-blue-500"
    },
    {
      icon: Mountain,
      title: "Mountain Views",
      description: "Work with inspiring Himalayan vistas from your desk",
      color: "text-green-500"
    },
    {
      icon: Coffee,
      title: "Co-Working Spaces",
      description: "Dedicated quiet zones and collaborative work areas",
      color: "text-amber-500"
    },
    {
      icon: Users,
      title: "Remote Community",
      description: "Connect with fellow digital nomads and entrepreneurs",
      color: "text-purple-500"
    },
    {
      icon: Zap,
      title: "24/7 Power Backup",
      description: "Uninterrupted work with generator and UPS backup",
      color: "text-yellow-500"
    },
    {
      icon: Clock,
      title: "Flexible Check-in/out",
      description: "Work on your schedule with extended hours access",
      color: "text-indigo-500"
    }
  ];

  const packages = [
    {
      duration: "week",
      label: "Weekly Package",
      price: "₹7,499",
      perDay: "₹1,071/day",
      benefits: ["7 nights accommodation", "Unlimited WiFi", "Co-working access", "Breakfast included"]
    },
    {
      duration: "month",
      label: "Monthly Package",
      price: "₹22,999",
      perDay: "₹767/day",
      benefits: ["30 nights accommodation", "Unlimited WiFi", "Private workspace", "All meals included", "Laundry service"]
    },
    {
      duration: "quarter",
      label: "Quarterly Package",
      price: "₹59,999",
      perDay: "₹667/day",
      benefits: ["90 nights accommodation", "Unlimited WiFi", "Dedicated desk", "All meals included", "Priority support", "Storage space"]
    }
  ];

  const amenities = [
    "High-speed fiber internet (100+ Mbps)",
    "Dedicated co-working spaces",
    "Private meeting rooms",
    "24/7 power backup",
    "Ergonomic workstations",
    "Printing & scanning facilities",
    "Mountain view workspaces",
    "Coffee & tea all day",
    "Weekly networking events",
    "Laundry service",
    "Daily housekeeping",
    "Secure storage lockers"
  ];

  const faqs = [
    {
      question: "What internet speeds can I expect in Shillong?",
      answer: "We provide Airtel fiber with 100+ Mbps speeds. Shillong has stable connectivity, and we have JioFiber backup + UPS for uninterrupted work during occasional power cuts."
    },
    {
      question: "How's the weather for remote work?",
      answer: "Shillong enjoys pleasant weather year-round (15-25°C). Monsoons (June-Sept) bring heavy rainfall but our covered workspaces and reliable power backup ensure productivity."
    },
    {
      question: "What about food delivery options?",
      answer: "Swiggy and Zomato work perfectly in Shillong! We also provide homemade meals at our in-house café with local Meghalayan delicacies."
    },
    {
      question: "Is Shillong safe for solo remote workers?",
      answer: "Absolutely! Meghalaya is one of India's safest states. Many solo travelers, especially women, choose XTSY for extended stays. Our community is welcoming and secure."
    },
    {
      question: "Can I take weekend trips while working remotely?",
      answer: "Yes! We help plan weekend trips to Cherrapunji (wettest place on Earth), Dawki (crystal clear river), Mawlynnong (Asia's cleanest village), and other stunning locations. Your luggage stays safe with us."
    },
    {
      question: "What's the co-working atmosphere like?",
      answer: "Quiet zones available 24/7, collaborative spaces for team calls, and a community of like-minded digital nomads. Join our weekly networking events and weekend treks!"
    }
  ];

  const testimonials = [
    {
      name: "Ritika",
      role: "Student • Booking.com Verified",
      content: "The hostel has a very welcoming atmosphere with friendly staff and a helpful property manager. The food is excellent, cleanliness is always maintained, and Wi-Fi connectivity is smooth. As a student, I never faced any issues.",
      rating: 10,
      highlight: "Wi-Fi connectivity is smooth",
      source: "Booking.com"
    },
    {
      name: "KaDusH Music",
      role: "Business Traveler • Google Verified",
      content: "Perfect for solo business travel! Rooms 5.0, Service 5.0, Location 5.0. Great value and high-tech amenities. Everything a remote worker needs.",
      rating: 5,
      highlight: "Business | Solo",
      source: "Google"
    },
    {
      name: "Deepak D",
      role: "Digital Nomad • Google Verified",
      content: "This hostel is a hidden gem for backpackers. The common area felt like a big living room where it was easy to meet other travelers. This isn't just a place to sleep—it's a place to connect.",
      rating: 5,
      highlight: "High-tech",
      source: "Google"
    }
  ];

  useEffect(() => {
    document.title = "Work From Home in Shillong | Remote Work at XTSY Prime | Digital Nomad Hostel";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Work remotely from the Himalayas at XTSY Prime, Shillong. High-speed internet, co-working spaces, mountain views. Perfect for digital nomads & remote workers.');
    }
  }, []);

  return (
    <>
      <Header />

      {/* Hero Section - Apple-inspired */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0.65) 100%), url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in text-white drop-shadow-2xl" style={{ letterSpacing: '-0.02em' }}>
              Work From the Himalayas
            </h1>
            <p className="text-2xl md:text-4xl mb-6 max-w-3xl mx-auto animate-fade-in text-white/95 font-light" style={{ animationDelay: "0.15s", letterSpacing: '-0.01em' }}>
              Your Remote Office in Shillong's Mountains
            </p>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/90 animate-fade-in font-light" style={{ animationDelay: "0.25s" }}>
              High-speed internet • Co-working spaces • Mountain views • Remote community
            </p>
            
            {/* Frosted glass CTA container */}
            <div className="inline-block backdrop-blur-xl bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl animate-fade-in" style={{ animationDelay: "0.35s" }}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-lg font-semibold"
                  onClick={() => window.open('https://wa.me/918837317070?text=Hi! I want to inquire about Work From Home packages at XTSY', '_blank')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Book Your Workation
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/5 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/20 hover:border-white/60 transition-all duration-300 rounded-full px-8 py-6 text-lg font-medium"
                  onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Packages
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics bar */}
        <div className="absolute bottom-8 left-0 right-0 z-20">
          <div className="container mx-auto px-4">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 shadow-2xl max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
                <div className="animate-fade-in" style={{ animationDelay: "0.45s" }}>
                  <div className="text-2xl md:text-3xl font-bold mb-1">100+ Mbps</div>
                  <div className="text-xs md:text-sm text-white/80 font-light">Fiber Internet</div>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                  <div className="text-2xl md:text-3xl font-bold mb-1">24/7</div>
                  <div className="text-xs md:text-sm text-white/80 font-light">Power Backup</div>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: "0.55s" }}>
                  <div className="text-2xl md:text-3xl font-bold mb-1">50+ Nomads</div>
                  <div className="text-xs md:text-sm text-white/80 font-light">Hosted</div>
                </div>
                <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
                  <div className="text-2xl md:text-3xl font-bold mb-1">4.9★</div>
                  <div className="text-xs md:text-sm text-white/80 font-light">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Apple-inspired with glassmorphism */}
      <section className="py-20 bg-gradient-to-b from-background via-accent/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground" style={{ letterSpacing: '-0.02em' }}>
              Why Remote Workers Choose XTSY
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
              Everything you need for productive remote work in the mountains
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-fade-in bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 rounded-3xl overflow-hidden" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 w-fit group-hover:scale-110 transition-transform duration-500">
                    <feature.icon className={`h-10 w-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section - Apple-inspired pricing cards */}
      <section id="packages" className="py-20 bg-gradient-to-b from-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground" style={{ letterSpacing: '-0.02em' }}>
              Work From Home Packages
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
              Flexible packages designed for remote workers and digital nomads
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <Card 
                key={pkg.duration}
                className={`group relative hover:shadow-2xl transition-all duration-500 cursor-pointer bg-card/50 backdrop-blur-sm rounded-3xl overflow-hidden ${
                  selectedDuration === pkg.duration 
                    ? 'ring-2 ring-primary scale-[1.05] border-primary shadow-xl shadow-primary/20' 
                    : 'border border-primary/10 hover:border-primary/30 hover:scale-[1.02]'
                }`}
                onClick={() => setSelectedDuration(pkg.duration as any)}
              >
                {pkg.duration === 'month' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold shadow-lg shadow-primary/50">
                      Most Popular
                    </div>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-foreground">{pkg.label}</h3>
                  <div className="mb-6">
                    <div className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                      {pkg.price}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">{pkg.perDay}</div>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {pkg.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start group-hover:translate-x-1 transition-transform duration-300">
                        <span className="text-primary mr-3 text-lg flex-shrink-0">✓</span>
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full rounded-full py-6 text-lg font-semibold hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://wa.me/918837317070?text=Hi! I want to book the ${pkg.label} at XTSY`, '_blank');
                    }}
                  >
                    Book {pkg.label}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section - Apple-inspired grid */}
      <section className="py-20 bg-gradient-to-b from-background via-accent/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground" style={{ letterSpacing: '-0.02em' }}>
              Complete Work From Home Amenities
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Everything included for your remote work comfort
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {amenities.map((amenity, index) => (
              <div 
                key={index} 
                className="group flex items-center gap-4 p-5 bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl hover:bg-accent/10 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-primary to-primary/70 flex-shrink-0 shadow-lg shadow-primary/30 group-hover:scale-125 transition-transform duration-300" />
                <span className="text-foreground font-medium">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Real verified reviews */}
      <section className="py-20 bg-gradient-to-b from-accent/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground" style={{ letterSpacing: '-0.02em' }}>
              Remote Workers Love XTSY
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Hear from digital nomads who made Shillong their remote office
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] animate-fade-in bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30 rounded-3xl overflow-hidden" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  {/* Rating stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(Math.min(testimonial.rating, 5))].map((_, i) => (
                      <span key={i} className="text-yellow-500 text-xl">★</span>
                    ))}
                  </div>
                  
                  {/* Highlight badge */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      {testimonial.highlight}
                    </span>
                  </div>
                  
                  {/* Review content */}
                  <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                  
                  {/* Author info */}
                  <div className="border-t border-primary/10 pt-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground text-lg">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                    <div className="text-xs text-primary font-medium px-2 py-1 rounded bg-primary/5">
                      {testimonial.source}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact Section - Apple-inspired */}
      <section className="py-20 bg-gradient-to-b from-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center backdrop-blur-sm bg-card/30 rounded-3xl p-12 border border-primary/10">
              <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
                <MapPin className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground" style={{ letterSpacing: '-0.02em' }}>
                Located in Shillong, Meghalaya
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                The "Scotland of the East" - Perfect climate year-round (15-25°C), vibrant culture, 
                and stunning landscapes for work-life balance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                  onClick={() => window.open('https://wa.me/918837317070?text=Hi! I want to learn more about working remotely from XTSY', '_blank')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="rounded-full px-8 py-6 text-lg font-medium border-2 hover:scale-105 transition-all duration-300"
                  onClick={() => window.open('https://www.google.com/maps/place/XTSY+Travellers+Hostel', '_blank')}
                >
                  View Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Apple-inspired */}
      <section className="py-20 bg-gradient-to-b from-accent/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground" style={{ letterSpacing: '-0.02em' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Everything you need to know about working remotely from XTSY
            </p>
          </div>
          <Accordion type="single" collapsible className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl px-6 data-[state=open]:border-primary/30 transition-all duration-300"
              >
                <AccordionTrigger className="text-left text-lg md:text-xl font-semibold hover:no-underline py-6 text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base md:text-lg pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section - Apple-inspired with gradient */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg animate-fade-in" style={{ letterSpacing: '-0.02em' }}>
            Ready to Work From Paradise?
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-white/95 font-light animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Join our community of remote workers and experience the perfect blend of productivity and adventure
          </p>
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-white/90 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-full px-12 py-8 text-xl font-semibold"
              onClick={() => window.open('https://wa.me/918837317070?text=Hi! I want to book a Work From Home package at XTSY', '_blank')}
            >
              <Phone className="mr-3 h-6 w-6" />
              Book Your Workation Now
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default WorkFromHome;
