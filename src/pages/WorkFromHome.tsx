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
      price: "₹8,999",
      perDay: "₹1,285/day",
      benefits: ["7 nights accommodation", "Unlimited WiFi", "Co-working access", "Breakfast included"]
    },
    {
      duration: "month",
      label: "Monthly Package",
      price: "₹28,999",
      perDay: "₹966/day",
      benefits: ["30 nights accommodation", "Unlimited WiFi", "Private workspace", "All meals included", "Laundry service"]
    },
    {
      duration: "quarter",
      label: "Quarterly Package",
      price: "₹79,999",
      perDay: "₹888/day",
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
      question: "What internet speeds can I expect?",
      answer: "We provide high-speed fiber internet with speeds of 100+ Mbps. We also have backup internet connections and power backup to ensure you stay connected during your work hours."
    },
    {
      question: "Are there dedicated workspaces?",
      answer: "Yes! We have multiple co-working zones including quiet zones for focused work, collaborative spaces for team calls, and private meeting rooms that can be booked in advance."
    },
    {
      question: "Can I extend my stay?",
      answer: "Absolutely! You can extend your stay at pro-rated rates. Monthly and quarterly packages offer the best value for long-term remote workers."
    },
    {
      question: "Is food included in the packages?",
      answer: "Weekly packages include breakfast. Monthly and quarterly packages include all meals (breakfast, lunch, and dinner). We also have a shared kitchen for those who prefer cooking."
    },
    {
      question: "What's the typical profile of guests?",
      answer: "Our work-from-home guests include digital nomads, startup founders, remote employees, freelancers, and consultants from various industries. We foster a vibrant community of ambitious professionals."
    },
    {
      question: "Are there nearby cafes or alternative workspaces?",
      answer: "Shillong has several great cafes and co-working spaces within walking distance. We can recommend the best spots for variety and provide local insights."
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Product Designer, Bangalore",
      content: "Spent 3 months working remotely from XTSY. The internet was rock solid, the mountain views inspiring, and the community incredible. Best decision for my productivity!",
      rating: 5
    },
    {
      name: "Arjun Malhotra",
      role: "Software Engineer, Delhi",
      content: "As a remote engineer, reliable internet is non-negotiable. XTSY delivered perfectly. The co-working space was professional, and weekends exploring Northeast were amazing.",
      rating: 5
    },
    {
      name: "Sarah Thompson",
      role: "Content Strategist, UK",
      content: "Working from the Himalayas was a dream! XTSY made it practical with excellent facilities. The community of remote workers made it easy to transition and stay motivated.",
      rating: 5
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

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600')`,
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Work From the Himalayas
          </h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Your Remote Office in Shillong's Mountains
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            High-speed internet • Co-working spaces • Mountain views • Remote community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => window.open('https://wa.me/918837317070?text=Hi! I want to inquire about Work From Home packages at XTSY', '_blank')}
            >
              <Phone className="mr-2 h-5 w-5" />
              Book Your Workation
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View Packages
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Remote Workers Choose XTSY</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for productive remote work in the mountains
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <feature.icon className={`h-12 w-12 mb-4 ${feature.color}`} />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Work From Home Packages</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Flexible packages designed for remote workers and digital nomads
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <Card 
                key={pkg.duration}
                className={`relative hover:shadow-2xl transition-all cursor-pointer ${
                  selectedDuration === pkg.duration ? 'ring-2 ring-primary scale-105' : ''
                }`}
                onClick={() => setSelectedDuration(pkg.duration as any)}
              >
                {pkg.duration === 'month' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.label}</h3>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-primary">{pkg.price}</div>
                    <div className="text-sm text-muted-foreground">{pkg.perDay}</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {pkg.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
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

      {/* Amenities Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Complete Work From Home Amenities</h2>
            <p className="text-xl text-muted-foreground">
              Everything included for your remote work comfort
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {amenities.map((amenity, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Remote Workers Love XTSY</h2>
            <p className="text-xl text-muted-foreground">
              Hear from digital nomads who made Shillong their remote office
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-500">★</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Located in Shillong, Meghalaya</h2>
            <p className="text-lg text-muted-foreground mb-8">
              The "Scotland of the East" - Perfect climate year-round, vibrant culture, 
              and stunning landscapes for work-life balance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.open('https://wa.me/918837317070?text=Hi! I want to learn more about working remotely from XTSY', '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open('https://www.google.com/maps/place/XTSY+Travellers+Hostel', '_blank')}
              >
                View Location
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about working remotely from XTSY
            </p>
          </div>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Work From Paradise?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community of remote workers and experience the perfect blend of productivity and adventure
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => window.open('https://wa.me/918837317070?text=Hi! I want to book a Work From Home package at XTSY', '_blank')}
          >
            <Phone className="mr-2 h-5 w-5" />
            Book Your Workation Now
          </Button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default WorkFromHome;
