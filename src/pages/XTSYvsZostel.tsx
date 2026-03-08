import { Award, Building2, CheckCircle2, Globe, Heart, Shield, TrendingUp, Users, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import heroImage from "@/assets/xtsy-vs-zostel-hero-new.jpg";
import { useEffect } from "react";

const XTSYvsZostel = () => {
  useEffect(() => {
    document.title = "XTSY vs Zostel Comparison | Why XTSY Leads in Northeast India";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Compare XTSY and Zostel. XTSY supports solo travelers, luxury couples, large groups (6+), families, educational tours (32+ IIT/IIM), corporate tours, and cross-border travel. NEITA 2025 nominated.');
    }
  }, []);

  const handleWhatsAppBooking = () => {
    const message = encodeURIComponent("Hi! I'd like to book with XTSY after seeing your comparison with Zostel.");
    window.open(`https://wa.me/918837317070?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+918837317070';
  };

  const statistics = [
    { number: "32+", label: "IIT & IIM Tours" },
    { number: "40+", label: "School Tours" },
    { number: "8+", label: "Corporate Tours" },
    { number: "50+", label: "Guest Capacity" },
    { number: "7", label: "States Coverage" },
    { number: "270°", label: "India's First Glass Suite" },
  ];

  const audienceComparison = [
    {
      title: "Solo Travelers",
      icon: Users,
      xtsy: "Warmly welcomed with vibrant community spaces",
      zostel: "Solo-friendly environment",
      verdict: "Both welcome solo travelers",
      xtsyWins: false,
    },
    {
      title: "Luxury Couples & Honeymooners",
      icon: Heart,
      xtsy: "India's first 270° Glass Suite - premium romantic experience",
      zostel: "Limited luxury options, primarily hostel-focused",
      verdict: "XTSY leads with luxury",
      xtsyWins: true,
    },
    {
      title: "Large Groups (6+)",
      icon: Users,
      xtsy: "Encourages and supports groups of all sizes",
      zostel: "⚠️ Doesn't encourage groups more than 6+",
      verdict: "XTSY wins decisively",
      xtsyWins: true,
      highlight: true,
    },
    {
      title: "Family Tours with Elders",
      icon: Users,
      xtsy: "Multi-generational support, all ages welcome",
      zostel: "Limited family-friendly infrastructure",
      verdict: "XTSY provides comprehensive family care",
      xtsyWins: true,
    },
    {
      title: "Educational Tours",
      icon: Building2,
      xtsy: "32+ IIT & IIM Group Tours, 40+ School Tours hosted",
      zostel: "Not specialized for educational group tours",
      verdict: "XTSY is the educational tour leader",
      xtsyWins: true,
    },
    {
      title: "Corporate Tours",
      icon: Building2,
      xtsy: "8+ Corporate Tours successfully organized",
      zostel: "Limited corporate engagement",
      verdict: "XTSY offers professional corporate solutions",
      xtsyWins: true,
    },
  ];

  const uniqueAdvantages = [
    {
      icon: Award,
      title: "Award-Nominated Excellence",
      description: "Nominated for 'Best Budget Accommodation' by NEITA 2025",
      detail: "Official recognition by Northeast India Tourism Awards",
    },
    {
      icon: Building2,
      title: "Government Collaborations",
      description: "Collaborated with Arunachal Pradesh Tourism",
      detail: "Facilitated 'FAM Tour Under - Ek Bharat Shreshtha Bharat'",
    },
    {
      icon: Globe,
      title: "Cross-Border Tours",
      description: "International tour capabilities",
      detail: "Cross-border country tours with dedicated travel partners",
    },
    {
      icon: Shield,
      title: "Powered by XTSY One LLP",
      description: "Professionally managed hospitality brand",
      detail: "Corporate backing ensures quality and reliability",
    },
    {
      icon: TrendingUp,
      title: "Capacity & Scale",
      description: "Northeast India's biggest & highest-rated hostel",
      detail: "50+ guest capacity, 7 states coverage",
    },
  ];

  const comparisonFeatures = [
    { feature: "Solo Travelers", xtsy: true, zostel: true },
    { feature: "Luxury Stays", xtsy: true, zostel: false, xtsyNote: "270° Glass Suite" },
    { feature: "Groups 6+", xtsy: true, zostel: false, highlight: true, xtsyNote: "Encouraged" },
    { feature: "Family-Friendly", xtsy: true, zostel: false, zostelNote: "Limited" },
    { feature: "Educational Tours", xtsy: true, zostel: false, xtsyNote: "72+ Tours" },
    { feature: "Corporate Tours", xtsy: true, zostel: false, xtsyNote: "8+ Tours" },
    { feature: "International Tours", xtsy: true, zostel: false, xtsyNote: "Cross-border" },
    { feature: "Government Partnerships", xtsy: true, zostel: false, xtsyNote: "Arunachal Tourism" },
    { feature: "Award Recognition", xtsy: true, zostel: false, xtsyNote: "NEITA 2025" },
    { feature: "States Coverage", xtsy: "7 States", zostel: "Multiple" },
    { feature: "Professional Management", xtsy: true, zostel: true, xtsyNote: "XTSY One LLP" },
  ];

  const faqs = [
    {
      question: "How is XTSY actually different from Zostel?",
      answer: "Zostel = great for solo travelers. XTSY = great for everyone. Budget dorms to India's first 270° Glass Suite. Solo trips, couples, large groups (6+), families with elders, college tours, corporate retreats. Plus we have government partnerships and NEITA 2025 nomination. We're a complete ecosystem, not just a hostel.",
      quote: "Just one word for XTSY: THE BEST. It's one of the best stays I have been to lately.",
      quoteName: "Rahul"
    },
    {
      question: "Can you handle 10-20+ people groups?",
      answer: "That's our specialty. While others discourage groups over 6, we've hosted 32+ IIT/IIM tours, 40+ school trips, 8+ corporate retreats—groups of 10 to 50+. Our 50+ capacity means your whole squad stays together.",
      quote: "Very nice place for group stay!",
      quoteName: "Sahil"
    },
    {
      question: "Good for family trips with elders?",
      answer: "Yes! Multi-generational travel is our thing. Grandparents to kids—everyone's comfortable. Accessibility considerations, dedicated assistance, proper facilities. Traditional hostels can't do this.",
    },
    {
      question: "Do you organize educational tours?",
      answer: "We're the Northeast leaders. 32+ IIT/IIM group tours, 40+ school trips. We understand what institutions need—safety protocols, group coordination, learning experiences. We've done this a lot.",
    },
    {
      question: "Why are you award-nominated?",
      answer: "NEITA 2025 'Best Budget Accommodation' nomination. Recognition for excellence, diverse guest support, government collabs, consistently high ratings. Not just talk—actual validation.",
      quote: "Very good hospitality and excellent tour package management.",
      quoteName: "Dhruba"
    },
    {
      question: "Can you arrange international tours?",
      answer: "Yes! Cross-border capabilities through our travel partners. Thailand, Vietnam, beyond. Your whole journey is a vibe with us—not just the stay.",
    },
    {
      question: "Is XTSY just a hostel?",
      answer: "Way more. Budget dorm beds (₹675/night) to 270° Glass Suite luxury. Tours across 7 Northeast states. Government tourism partnerships. Memorable journeys for solo backpackers to corporate teams. Powered by XTSY One LLP.",
      quote: "The vibe of the hostel is youthful and welcoming. Whether you're solo or in a group, there's always someone to connect with.",
      quoteName: "Mariza"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="XTSY vs Zostel - Solo Travelers and Groups"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/50 via-orange-800/30 to-orange-50" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary text-white border-0 shadow-lg">
            India's Most Versatile Hospitality Brand
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl">
            XTSY vs Zostel:<br />Choose Your Journey
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light text-white drop-shadow-lg">
            Zostel stay is a vibe — we agree.<br />
            <span className="text-orange-300 font-bold text-2xl md:text-3xl">But your whole journey is a vibe with XTSY.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleWhatsAppBooking} className="bg-primary hover:bg-primary/90 text-white shadow-xl">
              <MessageCircle className="mr-2 h-5 w-5" />
              Book with XTSY
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white hover:bg-white/90 border-white text-gray-900 shadow-xl">
              Compare Benefits
            </Button>
          </div>
        </div>
      </section>

      {/* Who XTSY Serves vs Zostel's Limitations */}
      <section className="py-20 bg-white" id="comparison">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Who We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              XTSY welcomes everyone. Here's how we compare with Zostel across different traveler types.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audienceComparison.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={index} 
                  className={`transition-all hover:shadow-lg bg-gradient-to-br from-orange-50 to-white border-orange-200 hover:border-primary ${
                    item.highlight ? 'border-primary border-2 shadow-primary/20 shadow-lg' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      {item.xtsyWins && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    </div>
                    <CardTitle className="text-xl text-gray-900">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-primary">XTSY:</span>
                      </div>
                      <p className="text-sm text-gray-700">{item.xtsy}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">Zostel:</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.zostel}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className={`text-sm font-medium ${item.xtsyWins ? 'text-green-600' : 'text-gray-600'}`}>
                        {item.verdict}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* XTSY's Unique Advantages */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">XTSY's Unique Advantages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What sets XTSY apart from all competitors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueAdvantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <Card key={index} className="transition-all hover:shadow-lg hover:border-primary bg-gradient-to-br from-white to-orange-50 border-orange-200">
                  <CardHeader>
                    <div className="p-3 rounded-lg bg-primary/20 w-fit mb-3">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{advantage.title}</CardTitle>
                    <CardDescription className="text-base text-gray-600">{advantage.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{advantage.detail}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comprehensive Feature Comparison Table */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Feature-by-Feature Comparison</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See exactly how XTSY and Zostel stack up across key features
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-xl border border-orange-200">
              <thead>
                <tr className="bg-gradient-to-r from-orange-100 to-orange-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold text-primary">XTSY</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-900">Zostel</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-200 ${
                      item.highlight ? 'bg-primary/5' : ''
                    } hover:bg-orange-50 transition-colors`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{item.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {typeof item.xtsy === 'boolean' ? (
                        <div className="flex flex-col items-center gap-1">
                          {item.xtsy ? (
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          ) : (
                            <X className="h-6 w-6 text-red-500" />
                          )}
                          {item.xtsyNote && (
                            <span className="text-xs text-gray-600">{item.xtsyNote}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900">{item.xtsy}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {typeof item.zostel === 'boolean' ? (
                        <div className="flex flex-col items-center gap-1">
                          {item.zostel ? (
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                          ) : (
                            <X className="h-6 w-6 text-gray-400" />
                          )}
                          {item.zostelNote && (
                            <span className="text-xs text-gray-500">{item.zostelNote}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600">{item.zostel}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* "Your Whole Journey is a Vibe" Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-orange-100 via-orange-50 to-white">
        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-4xl mx-auto border-primary shadow-2xl bg-gradient-to-br from-primary to-orange-600">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <p className="text-2xl md:text-3xl text-white italic drop-shadow-md">
                  "Zostel stay is a vibe — we agree."
                </p>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-white to-transparent" />
                <p className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                  But your whole journey is a vibe with XTSY
                </p>
                <p className="text-lg text-white/90 max-w-2xl mx-auto pt-4 drop-shadow">
                  From solo adventures to family celebrations, from IIT reunions to corporate retreats — 
                  XTSY makes every journey unforgettable
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics & Social Proof */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">XTSY by the Numbers</h2>
            <p className="text-xl text-gray-600">
              Real achievements, real impact
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {statistics.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all bg-gradient-to-br from-orange-100 to-white border-orange-200 hover:border-primary">
                <CardContent className="p-6">
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2 drop-shadow">{stat.number}</p>
                  <p className="text-sm text-gray-700 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about choosing XTSY
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6 border border-orange-200 hover:border-primary shadow-sm">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-orange-600 to-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
            Ready to Experience the XTSY Difference?
          </h2>
          <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow">
            Join thousands of satisfied guests who chose XTSY for their Northeast India journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleWhatsAppBooking} className="bg-white hover:bg-white/90 text-primary shadow-xl font-bold">
              <MessageCircle className="mr-2 h-5 w-5" />
              Book Your XTSY Experience
            </Button>
            <Button size="lg" variant="outline" onClick={handleCall} className="bg-white/20 hover:bg-white/30 border-white text-white shadow-xl backdrop-blur-sm">
              <Phone className="mr-2 h-5 w-5" />
              Call +91 88373 17070
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white/20 hover:bg-white/30 border-white text-white shadow-xl backdrop-blur-sm">
              <a href="/xtsy-270">Explore XTSY 270°</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default XTSYvsZostel;
