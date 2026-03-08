import { Award, Building2, CheckCircle2, Globe, Heart, Shield, TrendingUp, Users, X, Phone, MessageCircle, MapPin, Star, Zap, Clock, Coffee, Mountain, Camera, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@/assets/xtsy-vs-zostel-hero-new.jpg";
import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";

const XTSYvsZostel = () => {
  useEffect(() => {
    document.title = "XTSY vs Zostel | Northeast India's Complete Hospitality Brand";
  }, []);

  const handleWhatsAppBooking = () => {
    const message = encodeURIComponent("Hi! I'd like to book with XTSY after seeing your comparison with Zostel.");
    window.open(`https://wa.me/918837317070?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+918837317070';
  };

  // Northeast India presence comparison
  const northeastPresence = [
    { state: "Meghalaya", xtsy: "Shillong HQ — Hostel + Luxury + 270° Suite", zostel: "1 hostel (Shillong)", xtsyWins: true },
    { state: "Arunachal Pradesh", xtsy: "Govt. FAM Tour partner (Ek Bharat Shreshtha Bharat)", zostel: "No presence", xtsyWins: true },
    { state: "Assam", xtsy: "Tour packages via Guwahati hub", zostel: "1 hostel", xtsyWins: false },
    { state: "Nagaland", xtsy: "Curated Hornbill Festival tours", zostel: "Limited seasonal", xtsyWins: true },
    { state: "Mizoram", xtsy: "Cross-border tour routes", zostel: "No presence", xtsyWins: true },
    { state: "Manipur", xtsy: "Tour itineraries included", zostel: "No presence", xtsyWins: true },
    { state: "Sikkim", xtsy: "Tour packages available", zostel: "1 hostel", xtsyWins: false },
  ];

  const statistics = [
    { number: "32+", label: "IIT & IIM Tours Hosted", icon: Building2 },
    { number: "40+", label: "School Tours Organized", icon: Users },
    { number: "8+", label: "Corporate Retreats", icon: Zap },
    { number: "50+", label: "Guest Capacity", icon: Coffee },
    { number: "7", label: "NE States Coverage", icon: MapPin },
    { number: "270°", label: "India's First Glass Suite", icon: Mountain },
  ];

  const audienceComparison = [
    {
      title: "Solo Travelers",
      icon: Users,
      xtsy: "Warmly welcomed with vibrant community spaces, bonfire nights, and curated solo itineraries",
      zostel: "Solo-friendly hostel environment",
      verdict: "Both welcome solos — XTSY adds curated experiences",
      xtsyWins: false,
    },
    {
      title: "Luxury Couples & Honeymooners",
      icon: Heart,
      xtsy: "India's first 270° panoramic glass suite, lake-view private rooms, premium romantic packages",
      zostel: "Primarily hostel-focused, limited luxury options",
      verdict: "XTSY leads decisively with luxury",
      xtsyWins: true,
    },
    {
      title: "Large Groups (6+)",
      icon: Users,
      xtsy: "Encourages and actively supports groups of all sizes — 10, 20, 50+",
      zostel: "⚠️ Doesn't encourage groups larger than 6",
      verdict: "XTSY wins decisively — built for groups",
      xtsyWins: true,
      highlight: true,
    },
    {
      title: "Family Tours with Elders",
      icon: Users,
      xtsy: "Multi-generational support — grandparents to kids, accessibility, dedicated assistance",
      zostel: "Limited family-friendly infrastructure",
      verdict: "XTSY provides comprehensive family care",
      xtsyWins: true,
    },
    {
      title: "Educational Tours",
      icon: Building2,
      xtsy: "32+ IIT/IIM tours, 40+ school trips — safety protocols, group coordination, learning experiences",
      zostel: "Not specialized for educational group tours",
      verdict: "XTSY is the educational tour leader",
      xtsyWins: true,
    },
    {
      title: "Corporate Retreats",
      icon: Building2,
      xtsy: "8+ corporate tours with professional coordination, team-building activities, dedicated spaces",
      zostel: "Limited corporate engagement",
      verdict: "XTSY offers professional corporate solutions",
      xtsyWins: true,
    },
    {
      title: "International Travelers",
      icon: Plane,
      xtsy: "Cross-border tour capabilities, English-speaking staff, e-Visa guidance, multi-state itineraries",
      zostel: "Basic hostel amenities for international guests",
      verdict: "XTSY provides end-to-end international travel support",
      xtsyWins: true,
    },
    {
      title: "Pet-Friendly Travel",
      icon: Heart,
      xtsy: "Dedicated pet-friendly stays — one of few in Northeast India",
      zostel: "No pet-friendly options",
      verdict: "XTSY is pet-friendly, Zostel isn't",
      xtsyWins: true,
    },
  ];

  const uniqueAdvantages = [
    {
      icon: Award,
      title: "NEITA 2025 Nominated",
      description: "Best Budget Accommodation — Northeast India Tourism Awards",
      detail: "Official government recognition for hospitality excellence across Northeast India",
    },
    {
      icon: Building2,
      title: "Government Partnerships",
      description: "Official collaborator with Arunachal Pradesh Tourism",
      detail: "Facilitated 'FAM Tour Under Ek Bharat Shreshtha Bharat' — state-level tourism partnership",
    },
    {
      icon: Globe,
      title: "Cross-Border Capabilities",
      description: "International tours to Thailand, Vietnam & beyond",
      detail: "Dedicated travel partners for cross-border journeys — your entire trip is handled",
    },
    {
      icon: Shield,
      title: "Powered by XTSY One LLP",
      description: "Professionally registered & managed hospitality brand",
      detail: "Corporate backing ensures quality, reliability, and accountability — not just a hostel name",
    },
    {
      icon: TrendingUp,
      title: "Northeast India's Biggest & Highest-Rated",
      description: "50+ guest capacity across dorms and luxury suites",
      detail: "Highest-rated hostel in Northeast India on Booking.com (9.4/10), Google (4.8/5), and more",
    },
    {
      icon: Camera,
      title: "270° Glass Suite — India's First",
      description: "Panoramic lake-view architectural marvel",
      detail: "Not available at any Zostel or competitor — an XTSY-exclusive luxury experience",
    },
  ];

  const comparisonFeatures = [
    { feature: "Solo Travelers", xtsy: true, zostel: true },
    { feature: "Luxury Stays (Suites)", xtsy: true, zostel: false, xtsyNote: "270° Glass Suite" },
    { feature: "Groups 6+ Encouraged", xtsy: true, zostel: false, highlight: true, xtsyNote: "10–50+" },
    { feature: "Family-Friendly (All Ages)", xtsy: true, zostel: false, zostelNote: "Limited" },
    { feature: "Educational Tours", xtsy: true, zostel: false, xtsyNote: "72+ Tours" },
    { feature: "Corporate Retreats", xtsy: true, zostel: false, xtsyNote: "8+ Retreats" },
    { feature: "International Tours", xtsy: true, zostel: false, xtsyNote: "Cross-border" },
    { feature: "Pet-Friendly Stays", xtsy: true, zostel: false },
    { feature: "Government Tourism Partner", xtsy: true, zostel: false, xtsyNote: "Arunachal Pradesh" },
    { feature: "Award Recognition", xtsy: true, zostel: false, xtsyNote: "NEITA 2025" },
    { feature: "NE States Coverage", xtsy: "7 States", zostel: "3-4 Hostels" },
    { feature: "Tour Package Ecosystem", xtsy: true, zostel: false, xtsyNote: "40+ Packages" },
    { feature: "Female-Only Dorms", xtsy: true, zostel: true },
    { feature: "Professional Management (LLP)", xtsy: true, zostel: true, xtsyNote: "XTSY One LLP" },
  ];

  const faqs = [
    {
      question: "How is XTSY actually different from Zostel in Northeast India?",
      answer: "Zostel is a great hostel chain for solo travelers. XTSY is a complete hospitality ecosystem — budget dorms to India's first 270° Glass Suite, solo trips to 50+ person groups, families with elders, IIT/IIM tours, corporate retreats, cross-border international tours, pet-friendly stays, and government tourism partnerships. We're NEITA 2025 nominated and operate across 7 Northeast states.",
      quote: "Just one word for XTSY: THE BEST. It's one of the best stays I have been to lately.",
      quoteName: "Rahul"
    },
    {
      question: "Does Zostel operate across all 7 Northeast states like XTSY?",
      answer: "No. Zostel has a limited presence with a few hostels in select NE states. XTSY covers all 7 states through our tour package ecosystem, government partnerships (Arunachal Pradesh Tourism), and curated multi-state itineraries — Meghalaya, Arunachal, Assam, Nagaland, Manipur, Mizoram, and Sikkim.",
    },
    {
      question: "Can you handle 10–50+ people groups? Zostel limits to 6.",
      answer: "That's our specialty. While Zostel discourages groups over 6, we've hosted 32+ IIT/IIM tours, 40+ school trips, 8+ corporate retreats — groups of 10 to 50+. Our 50+ capacity means your whole squad stays together, eats together, and experiences Northeast India together.",
      quote: "Very nice place for group stay!",
      quoteName: "Sahil"
    },
    {
      question: "Is the 270° Glass Suite real? Zostel has nothing like it.",
      answer: "Absolutely real and India's first. A panoramic glass suite overlooking Umiam Lake with 270° unobstructed views. This is an XTSY-exclusive — no Zostel, no competitor in India offers anything comparable. It's luxury redefined in Northeast India.",
    },
    {
      question: "Good for family trips with elders? Zostel feels too 'hostel-like'.",
      answer: "Yes! Multi-generational travel is our thing. Grandparents to kids — everyone's comfortable. Private rooms, lake-view suites, accessibility considerations, dedicated assistance. Traditional hostels like Zostel aren't designed for this; XTSY is.",
    },
    {
      question: "Why is XTSY award-nominated and Zostel isn't (in NE India)?",
      answer: "NEITA 2025 'Best Budget Accommodation' nomination recognizes our excellence across diverse guest segments, government collaborations, consistently high ratings (9.4/10 Booking.com, 4.8/5 Google), and our impact on Northeast India tourism. This is verified, official recognition.",
      quote: "Very good hospitality and excellent tour package management.",
      quoteName: "Dhruba"
    },
    {
      question: "Can XTSY arrange my entire Northeast trip, not just a stay?",
      answer: "Yes — that's the core difference. Zostel provides a bed. XTSY provides your entire journey: multi-state itineraries across 7 NE states, curated experiences (Hornbill Festival, Living Root Bridges, Dawki), transportation, guides, meals, and even cross-border international extensions to Thailand/Vietnam.",
      quote: "The vibe of the hostel is youthful and welcoming. Whether you're solo or in a group, there's always someone to connect with.",
      quoteName: "Mariza"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="XTSY vs Zostel — Northeast India's Complete Hospitality Brand Comparison"
        description="Compare XTSY and Zostel across Northeast India. XTSY covers 7 states, hosts groups 50+, offers 270° Glass Suite, government partnerships, and NEITA 2025 nomination."
        keywords="XTSY vs Zostel, Northeast India hostel, Shillong hostel comparison, best hostel Meghalaya"
        canonicalUrl="https://xtsy.one/xtsy-vs-zostel"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="XTSY vs Zostel - Complete Northeast India Hospitality"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary text-primary-foreground border-0 shadow-lg text-sm px-4 py-1.5">
            Northeast India's Most Versatile Brand
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl font-playfair">
            XTSY vs Zostel
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-3 max-w-3xl mx-auto text-white/90 drop-shadow-lg">
            Zostel gives you a stay. XTSY gives you an entire journey.
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary drop-shadow-lg mb-8">
            7 States. 40+ Packages. India's First 270° Suite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleWhatsAppBooking} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl font-semibold">
              <MessageCircle className="mr-2 h-5 w-5" />
              Book with XTSY
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('ne-presence')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white/10 hover:bg-white/20 border-white text-white shadow-xl backdrop-blur-sm">
              See Northeast Presence
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-4 rounded-xl bg-muted/30 border border-border/50">
                  <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.number}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Northeast India Presence Map */}
      <section className="py-16 md:py-20" id="ne-presence">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Brand Presence</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-playfair">
              Northeast India: <span className="text-primary">State by State</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Zostel has a few hostels. XTSY has an ecosystem across all 7 states.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-2xl overflow-hidden shadow-xl border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-5 py-4 text-left font-semibold text-foreground text-sm">State</th>
                  <th className="px-5 py-4 text-center font-semibold text-primary text-sm">XTSY</th>
                  <th className="px-5 py-4 text-center font-semibold text-muted-foreground text-sm">Zostel</th>
                </tr>
              </thead>
              <tbody>
                {northeastPresence.map((item, index) => (
                  <tr key={index} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4 font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      {item.state}
                    </td>
                    <td className="px-5 py-4 text-center text-sm text-foreground">{item.xtsy}</td>
                    <td className="px-5 py-4 text-center text-sm text-muted-foreground">{item.zostel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              XTSY operates across <strong className="text-foreground">all 7 NE states</strong> through tours, partnerships, and multi-state itineraries
            </p>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-16 md:py-20 bg-muted/20" id="comparison">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Audience Comparison</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-playfair">
              Who We <span className="text-primary">Serve</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              XTSY welcomes every kind of traveler. Here's how we compare.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {audienceComparison.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={index} 
                  className={`transition-all hover:shadow-lg bg-card border-border hover:border-primary/40 ${
                    item.highlight ? 'border-primary border-2 shadow-primary/10 shadow-lg' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {item.xtsyWins && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <CardTitle className="text-base text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">XTSY</span>
                      <p className="text-xs text-muted-foreground mt-1">{item.xtsy}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">Zostel</span>
                      <p className="text-xs text-muted-foreground mt-1">{item.zostel}</p>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className={`text-xs font-medium ${item.xtsyWins ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
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

      {/* Unique Advantages */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Why XTSY Wins</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-playfair">
              XTSY's <span className="text-primary">Unique Edge</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              What Zostel and every competitor simply cannot match
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {uniqueAdvantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <Card key={index} className="transition-all hover:shadow-lg hover:border-primary/40 bg-card border-border">
                  <CardHeader>
                    <div className="p-3 rounded-xl bg-primary/10 w-fit mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg text-foreground">{advantage.title}</CardTitle>
                    <CardDescription className="text-sm">{advantage.description}</CardDescription>
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

      {/* Feature Comparison Table */}
      <section className="py-16 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Head to Head</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-playfair">
              Feature-by-Feature <span className="text-primary">Comparison</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-2xl overflow-hidden shadow-xl border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-5 py-4 text-left font-semibold text-foreground text-sm">Feature</th>
                  <th className="px-5 py-4 text-center font-semibold text-primary text-sm">XTSY</th>
                  <th className="px-5 py-4 text-center font-semibold text-muted-foreground text-sm">Zostel</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`border-t border-border ${item.highlight ? 'bg-primary/5' : ''} hover:bg-muted/20 transition-colors`}
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground text-sm">{item.feature}</td>
                    <td className="px-5 py-3.5 text-center">
                      {typeof item.xtsy === 'boolean' ? (
                        <div className="flex flex-col items-center gap-1">
                          {item.xtsy ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <X className="h-5 w-5 text-destructive" />
                          )}
                          {item.xtsyNote && (
                            <span className="text-xs text-muted-foreground">{item.xtsyNote}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-foreground">{item.xtsy}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {typeof item.zostel === 'boolean' ? (
                        <div className="flex flex-col items-center gap-1">
                          {item.zostel ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/40" />
                          )}
                          {item.zostelNote && (
                            <span className="text-xs text-muted-foreground">{item.zostelNote}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">{item.zostel}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Journey Quote */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-4xl mx-auto border-primary/30 shadow-2xl bg-gradient-to-br from-primary to-primary/80">
            <CardContent className="p-8 sm:p-12 text-center">
              <p className="text-xl sm:text-2xl md:text-3xl text-primary-foreground/90 italic mb-4">
                "Zostel stay is a vibe — we agree."
              </p>
              <div className="h-px w-32 mx-auto bg-primary-foreground/30 my-6" />
              <p className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary-foreground font-playfair">
                But your whole journey is a vibe with XTSY
              </p>
              <p className="text-base sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto mt-6">
                From solo adventures to family celebrations, IIT reunions to corporate retreats, 
                across 7 states of Northeast India — XTSY makes every journey unforgettable.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">FAQ</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-playfair">
              Honest <span className="text-primary">Answers</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-xl px-6 border border-border hover:border-primary/30 shadow-sm">
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    <span className="font-semibold text-foreground text-sm sm:text-base">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    <p>{faq.answer}</p>
                    {faq.quote && (
                      <blockquote className="mt-4 pl-4 border-l-2 border-primary/40 italic text-foreground/80">
                        "{faq.quote}"
                        <span className="block text-xs text-muted-foreground mt-1 not-italic">— {faq.quoteName}</span>
                      </blockquote>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary-foreground font-playfair">
            Ready for the XTSY Difference?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            Join thousands of guests who chose XTSY for their Northeast India journey — 
            from solo backpackers to 50-person corporate teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleWhatsAppBooking} className="bg-background hover:bg-background/90 text-foreground shadow-xl font-bold">
              <MessageCircle className="mr-2 h-5 w-5" />
              Book Your XTSY Experience
            </Button>
            <Button size="lg" variant="outline" onClick={handleCall} className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground text-primary-foreground shadow-xl backdrop-blur-sm">
              <Phone className="mr-2 h-5 w-5" />
              Call +91 88373 17070
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-primary-foreground text-primary-foreground shadow-xl backdrop-blur-sm">
              <a href="/xtsy-270">Explore 270° Suite</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default XTSYvsZostel;
