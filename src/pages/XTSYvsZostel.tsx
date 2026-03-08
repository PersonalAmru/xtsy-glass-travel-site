import { Award, Building2, CheckCircle2, Globe, Heart, Shield, TrendingUp, Users, X, Phone, MessageCircle, MapPin, Star, Zap, Clock, Coffee, Mountain, Camera, Plane, AlertTriangle, DollarSign, Home, Compass } from "lucide-react";
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

  // Northeast India presence comparison — updated with pricing & model info
  const northeastPresence = [
    { state: "Meghalaya", xtsy: "Shillong HQ — Hostel + Luxury + 270° Suite", zostel: "1 franchise hostel (Shillong)", xtsyModel: "Owner-operated, govt partner", zostelModel: "Franchise", xtsyWins: true },
    { state: "Arunachal Pradesh", xtsy: "Govt. FAM Tour partner (Ek Bharat Shreshtha Bharat)", zostel: "No presence", xtsyModel: "Govt. collaboration", zostelModel: "—", xtsyWins: true },
    { state: "Assam", xtsy: "Tour packages via Guwahati hub", zostel: "1 franchise hostel", xtsyModel: "Tour ecosystem", zostelModel: "Franchise", xtsyWins: false },
    { state: "Nagaland", xtsy: "Curated Hornbill Festival tours", zostel: "Limited seasonal via Zo Trips", xtsyModel: "Year-round packages", zostelModel: "Fixed-date group bus tours", xtsyWins: true },
    { state: "Mizoram", xtsy: "Cross-border tour routes", zostel: "No presence", xtsyModel: "Tour ecosystem", zostelModel: "—", xtsyWins: true },
    { state: "Manipur", xtsy: "Tour itineraries included", zostel: "No presence", xtsyModel: "Tour ecosystem", zostelModel: "—", xtsyWins: true },
    { state: "Sikkim", xtsy: "Tour packages available", zostel: "1 franchise hostel", xtsyModel: "Tour ecosystem", zostelModel: "Franchise", xtsyWins: false },
    { state: "Tripura", xtsy: "Emerging tour routes planned", zostel: "No presence", xtsyModel: "Expansion", zostelModel: "—", xtsyWins: true },
  ];

  const statistics = [
    { number: "32+", label: "IIT & IIM Tours Hosted", icon: Building2 },
    { number: "40+", label: "School Tours Organized", icon: Users },
    { number: "8+", label: "Corporate Retreats", icon: Zap },
    { number: "50+", label: "Guest Capacity", icon: Coffee },
    { number: "8", label: "NE States Coverage", icon: MapPin },
    { number: "270°", label: "India's First Glass Suite", icon: Mountain },
  ];

  const audienceComparison = [
    {
      title: "Solo Travelers",
      icon: Users,
      xtsy: "Warmly welcomed with vibrant community spaces, bonfire nights, and curated solo itineraries",
      zostel: "Solo-friendly hostel environment with common areas",
      verdict: "Both welcome solos — XTSY adds curated NE experiences",
      xtsyWins: false,
    },
    {
      title: "Luxury Couples & Honeymooners",
      icon: Heart,
      xtsy: "India's first 270° panoramic glass suite, lake-view private rooms, premium romantic packages",
      zostel: "Zo Selections (premium tier coming) — still no luxury suites, no 270° equivalent",
      verdict: "XTSY leads decisively — Zo Selections can't match 270° Suite",
      xtsyWins: true,
    },
    {
      title: "Large Groups (6+)",
      icon: Users,
      xtsy: "Encourages and actively supports groups of all sizes — 10, 20, 50+",
      zostel: "⚠️ Actively discourages groups larger than 6 people — hostel model limits capacity",
      verdict: "XTSY wins decisively — built for groups of any size",
      xtsyWins: true,
      highlight: true,
    },
    {
      title: "Family Tours with Elders",
      icon: Users,
      xtsy: "Multi-generational support — grandparents to kids, accessibility, dedicated assistance",
      zostel: "Hostel-focused — limited family infrastructure, no elder-friendly design",
      verdict: "XTSY provides comprehensive family care",
      xtsyWins: true,
    },
    {
      title: "Educational Tours",
      icon: Building2,
      xtsy: "32+ IIT/IIM tours, 40+ school trips — safety protocols, group coordination, learning experiences",
      zostel: "Not specialized for educational group tours — hostel model only",
      verdict: "XTSY is the educational tour leader in NE India",
      xtsyWins: true,
    },
    {
      title: "Corporate Retreats",
      icon: Building2,
      xtsy: "8+ corporate tours with professional coordination, team-building activities, dedicated spaces",
      zostel: "No dedicated corporate offering — shared hostel spaces only",
      verdict: "XTSY offers professional corporate solutions",
      xtsyWins: true,
    },
    {
      title: "International Travelers",
      icon: Plane,
      xtsy: "Cross-border tour capabilities, English-speaking local staff, e-Visa guidance, multi-state itineraries",
      zostel: "Zo Trips: pre-packaged bus tours (₹19,047/person for Meghalaya) — outsourced logistics, fixed dates",
      verdict: "XTSY provides local, flexible support vs Zostel's outsourced group tours",
      xtsyWins: true,
    },
    {
      title: "Pet-Friendly Travel",
      icon: Heart,
      xtsy: "Dedicated pet-friendly stays — one of few in Northeast India",
      zostel: "No pet-friendly options across any tier",
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
    { feature: "Luxury Stays (Suites)", xtsy: true, zostel: false, xtsyNote: "270° Glass Suite", zostelNote: "Zo Selections (coming)" },
    { feature: "Groups 6+ Encouraged", xtsy: true, zostel: false, highlight: true, xtsyNote: "10–50+", zostelNote: "Discourages >6" },
    { feature: "Family-Friendly (All Ages)", xtsy: true, zostel: false, zostelNote: "Hostel-only" },
    { feature: "Educational Tours", xtsy: true, zostel: false, xtsyNote: "72+ Tours" },
    { feature: "Corporate Retreats", xtsy: true, zostel: false, xtsyNote: "8+ Retreats" },
    { feature: "International Tours", xtsy: true, zostel: false, xtsyNote: "Cross-border" },
    { feature: "Pet-Friendly Stays", xtsy: true, zostel: false },
    { feature: "Owner-Operated (Not Franchise)", xtsy: true, zostel: false, xtsyNote: "XTSY One LLP", zostelNote: "Franchise model" },
    { feature: "Government Tourism Partner", xtsy: true, zostel: false, xtsyNote: "Arunachal Pradesh" },
    { feature: "Award Recognition", xtsy: true, zostel: false, xtsyNote: "NEITA 2025" },
    { feature: "NE States Coverage", xtsy: "8 States", zostel: "3–4 Franchises" },
    { feature: "Year-Round Availability", xtsy: true, zostel: false, zostelNote: "Fixed-date trips only" },
    { feature: "Custom Itineraries", xtsy: true, zostel: false, xtsyNote: "Fully customizable", zostelNote: "Pre-packaged only" },
    { feature: "Local Staff & Guides", xtsy: true, zostel: false, xtsyNote: "Local team", zostelNote: "Outsourced" },
    { feature: "Price Transparency", xtsy: true, zostel: false, xtsyNote: "Clear pricing", zostelNote: "Hidden add-ons" },
    { feature: "Tour Package Ecosystem", xtsy: true, zostel: false, xtsyNote: "40+ Packages" },
    { feature: "Female-Only Dorms", xtsy: true, zostel: true },
    { feature: "Professional Management (LLP)", xtsy: true, zostel: true, xtsyNote: "XTSY One LLP" },
  ];

  // Business model comparison data
  const businessModelData = [
    { aspect: "Ownership", xtsy: "Owner-operated by XTSY One LLP — single, accountable entity", zostel: "Franchise/aggregator — Zostel Plus, Homes, Selections are partner-operated properties" },
    { aspect: "Quality Control", xtsy: "Direct control over every guest experience, staff training, and maintenance", zostel: "Varies by franchise partner — inconsistent quality across locations" },
    { aspect: "NE Tour Model", xtsy: "Local infrastructure + govt partnerships + year-round packages", zostel: "Zo Trips: outsourced group bus tours — pre-packaged, fixed dates, third-party logistics" },
    { aspect: "Revenue Model", xtsy: "Direct hospitality revenue — aligned with guest satisfaction", zostel: "Franchise fees + commission — incentive is scale, not quality" },
    { aspect: "Staff", xtsy: "Local team — knows the region, culture, hidden gems", zostel: "Mixed — franchise staff may not be locally rooted" },
    { aspect: "Pricing", xtsy: "Transparent, no hidden charges", zostel: "Base price + activity fees + transport charges (Zo Trips adds up)" },
  ];

  // Zo Trips vs XTSY packages comparison
  const tripComparison = [
    { aspect: "Price", xtsy: "Custom packages — pay for what you need", zostel: "₹19,047/person fixed (Experience Meghalaya)" },
    { aspect: "Dates", xtsy: "Year-round, any date you choose", zostel: "Fixed departure dates only" },
    { aspect: "Group Size", xtsy: "Solo to 50+ — your choice", zostel: "Pre-formed groups, bussed together" },
    { aspect: "Itinerary", xtsy: "Fully customizable — add/remove stops", zostel: "Fixed itinerary, no changes allowed" },
    { aspect: "Logistics", xtsy: "Local team handles everything — transport, guides, meals", zostel: "Outsourced to third-party operators" },
    { aspect: "Accommodation", xtsy: "No franchise model — dorms to 270° Suite, curated private tours from solo to groups of 50+", zostel: "Franchise hostels or partner stays" },
    { aspect: "Local Knowledge", xtsy: "Staff lives here — knows hidden gems, seasonal tips", zostel: "Tour leaders may not be from the region" },
  ];

  const whyNotZostel = [
    {
      icon: MapPin,
      title: "Zostel buses you in. XTSY is already here.",
      description: "Zostel's NE presence is franchise hostels and pre-packaged Zo Trips that bus groups in on fixed dates. XTSY is locally rooted — we live here, we built here, we know every trail and waterfall.",
    },
    {
      icon: DollarSign,
      title: "₹19K for a packaged trip vs journeys at your pace",
      description: "Zostel's 'Experience Meghalaya' costs ₹19,047/person for a fixed-date group tour with outsourced logistics. XTSY offers flexible, customizable packages — you decide the dates, the stops, and the pace.",
    },
    {
      icon: Star,
      title: "Franchise quality varies. XTSY is consistently 9.4+",
      description: "Zostel's franchise model means quality depends on the local partner. XTSY is owner-operated — consistently rated 9.4/10 on Booking.com, 4.8/5 on Google, 9.6/10 on Agoda across every guest segment.",
    },
    {
      icon: AlertTriangle,
      title: "No luxury. No 270° Suite. No pets. No groups 50+.",
      description: "Zostel's model caps at hostel beds and pre-packaged tours. No luxury suites, no pet-friendly stays, no support for groups over 6. XTSY covers every traveler — from solo to 50+ groups, dorms to India's first 270° Glass Suite.",
    },
  ];

  const faqs = [
    {
      question: "How is XTSY actually different from Zostel in Northeast India?",
      answer: "Zostel is a franchise-operated hostel chain focused on solo backpackers. XTSY is a complete, owner-operated hospitality ecosystem — budget dorms to India's first 270° Glass Suite, solo trips to 50+ person groups, families with elders, IIT/IIM tours, corporate retreats, cross-border international tours, pet-friendly stays, and government tourism partnerships. We're NEITA 2025 nominated and operate across 8 Northeast states.",
      quote: "Just one word for XTSY: THE BEST. It's one of the best stays I have been to lately.",
      quoteName: "Rahul"
    },
    {
      question: "Is Zostel a franchise? Does that affect quality?",
      answer: "Yes. Zostel operates multiple tiers — Zostel (hostels), Zostel Plus (premium partner properties), Zostel Homes (homestays), and Zo Trips (outsourced group tours). Each is run by a different franchise partner, meaning quality, cleanliness, and service vary location to location. XTSY is directly owned and operated by XTSY One LLP — one team, one standard, consistently high quality.",
    },
    {
      question: "Does Zostel operate across all 8 Northeast states like XTSY?",
      answer: "No. Zostel has franchise hostels in only 3-4 NE locations. Their 'Zo Trips' offer pre-packaged bus tours to Meghalaya at ₹19,047/person on fixed dates — that's not local presence. XTSY covers all 8 states through our tour package ecosystem, government partnerships (Arunachal Pradesh Tourism), and curated multi-state itineraries — Meghalaya, Arunachal, Assam, Nagaland, Manipur, Mizoram, Sikkim, and Tripura.",
    },
    {
      question: "What's the difference between Zo Trips and XTSY tour packages?",
      answer: "Zo Trips are pre-packaged group bus tours with fixed dates, fixed itineraries, and outsourced logistics — 'Experience Meghalaya' costs ₹19,047/person. XTSY packages are fully customizable: choose your dates, group size (solo to 50+), stops, accommodation tier (dorm to 270° Suite), and pace. Our local team handles everything directly — no outsourcing.",
    },
    {
      question: "Can you handle 10–50+ people groups? Zostel limits to 6.",
      answer: "That's our specialty. While Zostel's hostel model actively discourages groups over 6 (shared dorms aren't designed for large groups), we've hosted 32+ IIT/IIM tours, 40+ school trips, 8+ corporate retreats — groups of 10 to 50+. Our 50+ capacity means your whole squad stays together, eats together, and experiences Northeast India together.",
      quote: "Very nice place for group stay!",
      quoteName: "Sahil"
    },
    {
      question: "Is the 270° Glass Suite real? Zostel has nothing like it.",
      answer: "Absolutely real and India's first. A panoramic glass suite overlooking Umiam Lake with 270° unobstructed views. Zostel's upcoming 'Zo Selections' premium tier still won't match this — it's partner-operated premium stays, not purpose-built architectural marvels. The 270° Suite is an XTSY-exclusive.",
    },
    {
      question: "Good for family trips with elders? Zostel feels too 'hostel-like'.",
      answer: "Yes! Multi-generational travel is our thing. Grandparents to kids — everyone's comfortable. Private rooms, lake-view suites, accessibility considerations, dedicated assistance. Zostel's franchise model is designed for 20-something backpackers sharing dorms — not for families.",
    },
    {
      question: "Why is XTSY award-nominated and Zostel isn't (in NE India)?",
      answer: "NEITA 2025 'Best Budget Accommodation' nomination recognizes our excellence across diverse guest segments, government collaborations, consistently high ratings (9.4/10 Booking.com, 4.8/5 Google, 9.6/10 Agoda), and our impact on Northeast India tourism. Franchise operations don't earn this level of government recognition.",
      quote: "Very good hospitality and excellent tour package management.",
      quoteName: "Dhruba"
    },
    {
      question: "Can XTSY arrange my entire Northeast trip, not just a stay?",
      answer: "Yes — that's the core difference. Zostel provides a franchise bed and Zo Trips buses you around on fixed dates. XTSY provides your entire journey: multi-state itineraries across 8 NE states, curated experiences (Hornbill Festival, Living Root Bridges, Dawki), transportation, local guides, meals, and even cross-border international extensions to Thailand/Vietnam.",
      quote: "The vibe of the hostel is youthful and welcoming. Whether you're solo or in a group, there's always someone to connect with.",
      quoteName: "Mariza"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="XTSY vs Zostel — Local Hospitality vs Franchise Chain | Northeast India"
        description="Compare XTSY's owner-operated ecosystem vs Zostel's franchise model in Northeast India. 8 states, 270° Glass Suite, groups 50+, govt partnerships vs pre-packaged bus tours."
        keywords="XTSY vs Zostel, Northeast India hostel, Shillong hostel comparison, best hostel Meghalaya, Zostel franchise, Zo Trips alternative"
        canonicalUrl="https://xtsy.one/xtsy-vs-zostel"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[75vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="XTSY vs Zostel - Local Hospitality vs Franchise Chain in Northeast India"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary text-primary-foreground border-0 shadow-lg text-sm px-4 py-1.5">
            Owner-Operated vs Franchise Chain
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl font-playfair">
            XTSY vs Zostel
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-3 max-w-3xl mx-auto text-white/90 drop-shadow-lg">
            Zostel franchises a bed. XTSY owns your entire journey.
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary drop-shadow-lg mb-8">
            8 States. 40+ Packages. India's First 270° Suite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleWhatsAppBooking} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl font-semibold">
              <MessageCircle className="mr-2 h-5 w-5" />
              Book with XTSY
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('business-model')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white/10 hover:bg-white/20 border-white text-white shadow-xl backdrop-blur-sm">
              See the Real Difference
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

      {/* NEW: The Business Model Difference */}
      <section className="py-16 md:py-20" id="business-model">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">The Core Difference</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-playfair">
              Owner-Operated vs <span className="text-primary">Franchise Chain</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Zostel runs 5 sub-brands (Zostel, Plus, Homes, Trips, House) through franchise partners. 
              XTSY is one brand, one team, one standard — directly operated by XTSY One LLP.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* XTSY Card */}
            <Card className="border-primary/40 border-2 shadow-xl bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">XTSY One LLP</CardTitle>
                    <CardDescription>Owner-Operated Ecosystem</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {businessModelData.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{item.aspect}</span>
                      <p className="text-sm text-muted-foreground">{item.xtsy}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Zostel Card */}
            <Card className="border-border shadow-lg bg-card">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-lg bg-muted">
                    <Home className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">Zostel</CardTitle>
                    <CardDescription>Franchise / Aggregator Model</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {businessModelData.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">{item.aspect}</span>
                      <p className="text-sm text-muted-foreground">{item.zostel}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* NEW: Zo Trips vs XTSY Packages */}
      <section className="py-16 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Trip Comparison</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-playfair">
              Zo Trips vs <span className="text-primary">XTSY Travel</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Zostel's "Experience Meghalaya" costs <strong className="text-foreground">₹19,047/person</strong> for a pre-packaged bus tour with fixed dates and outsourced logistics. 
              Here's what you actually get.
            </p>
          </div>

          <div className="overflow-x-auto max-w-4xl mx-auto">
            <table className="w-full bg-card rounded-2xl overflow-hidden shadow-xl border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-5 py-4 text-left font-semibold text-foreground text-sm">Aspect</th>
                  <th className="px-5 py-4 text-center font-semibold text-primary text-sm">XTSY Travel</th>
                  <th className="px-5 py-4 text-center font-semibold text-muted-foreground text-sm">Zo Trips (₹19,047/person)</th>
                </tr>
              </thead>
              <tbody>
                {tripComparison.map((item, index) => (
                  <tr key={index} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-foreground text-sm">{item.aspect}</td>
                    <td className="px-5 py-3.5 text-center text-sm text-foreground">{item.xtsy}</td>
                    <td className="px-5 py-3.5 text-center text-sm text-muted-foreground">{item.zostel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              Zostel has a few franchise hostels. XTSY has an ecosystem across all 8 states.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-card rounded-2xl overflow-hidden shadow-xl border border-border">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-4 text-left font-semibold text-foreground text-sm">State</th>
                  <th className="px-4 py-4 text-center font-semibold text-primary text-sm">XTSY</th>
                  <th className="px-4 py-4 text-center font-semibold text-primary/60 text-xs">Model</th>
                  <th className="px-4 py-4 text-center font-semibold text-muted-foreground text-sm">Zostel</th>
                  <th className="px-4 py-4 text-center font-semibold text-muted-foreground/60 text-xs">Model</th>
                </tr>
              </thead>
              <tbody>
                {northeastPresence.map((item, index) => (
                  <tr key={index} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      {item.state}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-foreground">{item.xtsy}</td>
                    <td className="px-4 py-4 text-center text-xs text-primary/70">{item.xtsyModel}</td>
                    <td className="px-4 py-4 text-center text-sm text-muted-foreground">{item.zostel}</td>
                    <td className="px-4 py-4 text-center text-xs text-muted-foreground/60">{item.zostelModel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              XTSY operates across <strong className="text-foreground">all 8 NE states</strong> — no franchise model. We plan curated private tours from solo to groups of 50+, with govt partnerships and multi-state itineraries.
            </p>
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
              What Zostel's franchise model simply cannot replicate
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

      {/* NEW: Why Not Zostel for Northeast? */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-destructive/30 text-destructive">Real Talk</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 font-playfair">
              Why Not Zostel for <span className="text-primary">Northeast India?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We respect Zostel for what they've built. But for Northeast India, the franchise model falls short.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {whyNotZostel.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="border-border hover:border-primary/40 transition-all hover:shadow-lg bg-card">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2.5 rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
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
                "A franchise gives you a bed. We give you a journey."
              </p>
              <div className="h-px w-32 mx-auto bg-primary-foreground/30 my-6" />
              <p className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary-foreground font-playfair">
                Your Northeast story starts with XTSY
              </p>
              <p className="text-base sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto mt-6">
                From solo adventures to family celebrations, IIT reunions to corporate retreats, 
                across 8 states of Northeast India — owner-operated, locally rooted, consistently rated 9.4+.
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
            Join thousands of guests who chose owner-operated XTSY over franchise stays for their Northeast India journey — 
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
