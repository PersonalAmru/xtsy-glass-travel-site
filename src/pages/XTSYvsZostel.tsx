import { Award, Building2, CheckCircle2, Globe, Heart, Shield, TrendingUp, Users, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImage from "@/assets/xtsy-vs-zostel-hero.jpg";
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
      question: "How is XTSY different from Zostel?",
      answer: "XTSY offers unmatched versatility - from budget dormitories to India's first 270° Glass Suite. We support everyone: solo travelers, luxury couples, large groups (6+), families with elders, educational tours, and corporate retreats. With government partnerships, award nominations, and cross-border tour capabilities, XTSY is a complete hospitality ecosystem, not just a hostel chain.",
    },
    {
      question: "Can XTSY accommodate large groups of 10-20+ people?",
      answer: "Absolutely! Unlike competitors who discourage groups larger than 6, XTSY actively encourages and specializes in large groups. We've successfully hosted 32+ IIT & IIM tours, 40+ school tours, and 8+ corporate tours with groups ranging from 10 to 50+ people. Our 50+ guest capacity ensures your entire group stays together.",
    },
    {
      question: "Is XTSY suitable for family trips with elderly parents?",
      answer: "Yes! XTSY is designed for multi-generational travel. We support families of all ages with appropriate facilities, accessibility considerations, and dedicated assistance. Whether it's grandparents, parents, or kids, everyone finds comfort at XTSY - something traditional hostels aren't equipped to handle.",
    },
    {
      question: "Does XTSY organize educational tours?",
      answer: "XTSY is Northeast India's leader in educational tours with a proven track record: 32+ IIT & IIM group tours and 40+ school tours successfully organized. We understand the unique requirements of educational institutions - from safety protocols to group coordination to learning experiences.",
    },
    {
      question: "What makes XTSY award-nominated?",
      answer: "XTSY has been nominated for 'Best Budget Accommodation' by NEITA (Northeast India Tourism Awards) 2025. This recognition comes from our commitment to excellence, diverse guest support, government collaborations, and consistently high ratings. It validates our position as Northeast India's premier hospitality brand.",
    },
    {
      question: "Can XTSY arrange international tours?",
      answer: "Yes! XTSY has cross-border tour capabilities through our dedicated travel partners. We've successfully organized international tours and can help plan your journey beyond Indian borders. This is part of our commitment to making 'your whole journey a vibe,' not just your stay.",
    },
    {
      question: "Is XTSY just a hostel or something more?",
      answer: "XTSY is a complete hospitality ecosystem powered by XTSY One LLP. We offer everything from budget dormitory beds (₹675/night) to India's first 270° Glass Suite (luxury experience). Beyond accommodation, we organize tours across 7 Northeast states, facilitate government tourism initiatives, and create memorable journeys for everyone from solo backpackers to corporate teams.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="XTSY vs Zostel Comparison"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <Badge className="mb-4 bg-primary text-primary-foreground">
              India's Most Versatile Hospitality Brand
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              XTSY vs Zostel:<br />Choose Your Journey
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
              Zostel stay is a vibe — we agree.<br />
              <span className="text-primary font-semibold">But your whole journey is a vibe with XTSY.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleWhatsAppBooking} className="bg-primary hover:bg-primary/90">
                <MessageCircle className="mr-2 h-5 w-5" />
                Book with XTSY
              </Button>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20">
                Compare Benefits
              </Button>
            </div>
          </div>
        </section>

        {/* Who XTSY Serves vs Zostel's Limitations */}
        <section className="py-20 bg-muted/30" id="comparison">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Who We Serve</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                XTSY welcomes everyone. Here's how we compare with Zostel across different traveler types.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {audienceComparison.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={index} 
                    className={`transition-all hover:shadow-lg ${
                      item.highlight ? 'border-primary border-2 shadow-primary/20 shadow-lg' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        {item.xtsyWins && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                      </div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-primary">XTSY:</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.xtsy}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">Zostel:</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.zostel}</p>
                      </div>
                      <div className="pt-2 border-t">
                        <p className={`text-sm font-medium ${item.xtsyWins ? 'text-green-600' : 'text-muted-foreground'}`}>
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
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">XTSY's Unique Advantages</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                What sets XTSY apart from all competitors
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {uniqueAdvantages.map((advantage, index) => {
                const Icon = advantage.icon;
                return (
                  <Card key={index} className="transition-all hover:shadow-lg hover:border-primary/50">
                    <CardHeader>
                      <div className="p-3 rounded-lg bg-primary/10 w-fit mb-3">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{advantage.title}</CardTitle>
                      <CardDescription className="text-base">{advantage.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{advantage.detail}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comprehensive Feature Comparison Table */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Feature-by-Feature Comparison</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See exactly how XTSY and Zostel stack up across key features
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-card rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-primary/10">
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-primary">XTSY</th>
                    <th className="px-6 py-4 text-center font-semibold">Zostel</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-border ${
                        item.highlight ? 'bg-primary/5' : ''
                      } hover:bg-muted/50 transition-colors`}
                    >
                      <td className="px-6 py-4 font-medium">{item.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {typeof item.xtsy === 'boolean' ? (
                          <div className="flex flex-col items-center gap-1">
                            {item.xtsy ? (
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            ) : (
                              <X className="h-6 w-6 text-red-500" />
                            )}
                            {item.xtsyNote && (
                              <span className="text-xs text-muted-foreground">{item.xtsyNote}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm">{item.xtsy}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof item.zostel === 'boolean' ? (
                          <div className="flex flex-col items-center gap-1">
                            {item.zostel ? (
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            ) : (
                              <X className="h-6 w-6 text-muted-foreground" />
                            )}
                            {item.zostelNote && (
                              <span className="text-xs text-muted-foreground">{item.zostelNote}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm">{item.zostel}</span>
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
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10" />
          <div className="container mx-auto px-4 relative z-10">
            <Card className="max-w-4xl mx-auto border-primary/20 shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="space-y-6">
                  <p className="text-2xl md:text-3xl text-muted-foreground italic">
                    "Zostel stay is a vibe — we agree."
                  </p>
                  <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
                  <p className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    But your whole journey is a vibe with XTSY
                  </p>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto pt-4">
                    From solo adventures to family celebrations, from IIT reunions to corporate retreats — 
                    XTSY makes every journey unforgettable
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Statistics & Social Proof */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">XTSY by the Numbers</h2>
              <p className="text-xl text-muted-foreground">
                Real achievements, real impact
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {statistics.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to know about choosing XTSY
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg px-6 border">
                    <AccordionTrigger className="text-left hover:text-primary">
                      <span className="font-semibold">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience the XTSY Difference?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied guests who chose XTSY for their Northeast India journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleWhatsAppBooking} className="bg-primary hover:bg-primary/90">
                <MessageCircle className="mr-2 h-5 w-5" />
                Book Your XTSY Experience
              </Button>
              <Button size="lg" variant="outline" onClick={handleCall}>
                <Phone className="mr-2 h-5 w-5" />
                Call +91 88373 17070
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/xtsy-270">Explore XTSY 270°</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
  );
};

export default XTSYvsZostel;
