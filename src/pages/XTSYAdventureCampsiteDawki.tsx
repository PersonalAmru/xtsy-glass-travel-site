/**
 * XTSY Adventure Campsite — Dawki
 * Experience-first property page (NOT a room card layout).
 * Phase 1 of Dawki integration.
 */

import { memo, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "@/lib/router-compat";
import {
  Tent, Flame, Waves, Utensils, Users, MapPin,
  Phone, MessageCircle, Star, ChevronRight, Sparkles,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import UnifiedImage from "@/components/UnifiedImage";
import InstagramPreviewModal from "@/components/InstagramPreviewModal";

import { DAWKI_CAMPING_IMAGES, getPropertyById } from "@/data/properties";

const WHATSAPP_BASE = "https://wa.me/918837317070";
const wa = (msg: string) => `${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`;

const PRICING = [
  {
    title: "Camping + Breakfast",
    price: 1000,
    perks: ["Tent pitch on Umngot riverside", "Hot Indian breakfast", "Welcome chai", "Bonfire access (1 hr)"],
    highlight: true,
  },
  {
    title: "Only Camping",
    price: 800,
    perks: ["Tent pitch on Umngot riverside", "Welcome chai", "Shared washrooms"],
    highlight: false,
  },
];

const HIGHLIGHTS = [
  { icon: Tent, title: "80+ Guest Capacity", desc: "Group-friendly site with multiple tent zones" },
  { icon: Flame, title: "Bonfire Nights", desc: "Pre-bookable bonfire under starlit Khasi skies" },
  { icon: Waves, title: "Water Activities", desc: "Kayaking, boating & cliff swims on Umngot (chargeable)" },
  { icon: Utensils, title: "Hot Dinner", desc: "Locally cooked Indian dinner on request" },
  { icon: Users, title: "Shared Washrooms", desc: "Clean shared washrooms just outside the site" },
  { icon: MapPin, title: "Walking Distance to River", desc: "2-min walk to India–Bangladesh border viewpoint" },
];

const FAQS = [
  {
    q: "Where exactly is the XTSY Adventure Campsite located?",
    a: "On the banks of the Umngot River in Dawki, Meghalaya — Asia's clearest river. ~85 km from Shillong (3 hrs by road).",
  },
  {
    q: "What's included in the ₹1,000 Camping + Breakfast plan?",
    a: "A pre-pitched tent, sleeping mat, hot breakfast, welcome chai and access to the bonfire (1 hr). Washrooms are shared and located just outside the campsite.",
  },
  {
    q: "Is dinner available?",
    a: "Yes, hot dinner can be arranged at extra cost. We recommend pre-ordering on WhatsApp at +91 88373 17070 so we plan ingredients.",
  },
  {
    q: "Are bonfires and water activities free?",
    a: "Bonfires beyond the included hour are chargeable. Boat rides, kayaking and cliff swims on the Umngot are chargeable and weather-dependent.",
  },
  {
    q: "How do I get to Dawki from Shillong?",
    a: "Shared sumos run from Bara Bazaar (₹400–₹600/seat). A private cab takes 3 hours and costs ₹3,500–₹4,500 round trip. We can arrange transport on request.",
  },
  {
    q: "Is the campsite safe for solo and female travellers?",
    a: "Yes. We run an attended site with 24/7 staff, nightly head counts and well-lit common areas. Female-only tents available with prior request.",
  },
];

const CampsiteSEO = {
  "@context": "https://schema.org",
  "@type": "Campground",
  name: "XTSY Adventure Campsite — Dawki",
  description: "Riverside camping on the Umngot River in Dawki, Meghalaya. Camping + Breakfast from ₹1,000 per person per night.",
  url: "https://xtsy.one/xtsy-adventure-campsite-dawki",
  telephone: "+918837317070",
  image: DAWKI_CAMPING_IMAGES.slice(0, 5),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dawki",
    addressRegion: "Meghalaya",
    postalCode: "793109",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 25.1858, longitude: 92.0223 },
  priceRange: "₹800 - ₹1,000",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Bonfire", value: true },
    { "@type": "LocationFeatureSpecification", name: "Water Activities", value: true },
    { "@type": "LocationFeatureSpecification", name: "Shared Washrooms", value: true },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "24", bestRating: "5" },
};

const XTSYAdventureCampsiteDawki = memo(() => {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const property = getPropertyById("xtsy-adventure-campsite-dawki");

  const openPreview = useCallback((i: number) => setPreviewIndex(i), []);
  const closePreview = useCallback(() => setPreviewIndex(null), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEOHead
        title="XTSY Adventure Campsite Dawki — Riverside Camping from ₹800"
         description="Camp on the crystal-clear Umngot river in Dawki, Meghalaya. Camping + breakfast ₹1,000, only camping ₹800 per person per night. Bonfire, kayaking and dinner on request."
        keywords="xtsy adventure campsite, camping in dawki, dawki camping, umngot river camping, dawki tent stay, riverside camping meghalaya"
        canonicalUrl="https://xtsy.one/xtsy-adventure-campsite-dawki"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(CampsiteSEO)}</script>
      </Helmet>

      <Header />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <UnifiedImage
          src={DAWKI_CAMPING_IMAGES[3]}
          alt="XTSY Adventure Campsite on the Umngot River, Dawki, Meghalaya"
          className="absolute inset-0 w-full h-full object-cover"
          priority
          
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
        <div className="relative z-10 h-full flex flex-col justify-end max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Now Open in Dawki
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-3">
              XTSY Adventure Campsite
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mb-6">
               Pitch your tent beside Asia's clearest river. Bonfires, kayaks and starlit skies — from ₹800 per person per night.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <a href={wa("Hi! I want to book the XTSY Adventure Campsite in Dawki.")}>
                  <MessageCircle className="w-4 h-4 mr-2" /> Book on WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <a href="tel:+918837317070">
                  <Phone className="w-4 h-4 mr-2" /> Call Booking Desk
                </a>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-white/80">
              <span className="inline-flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.8 · 24 reviews</span>
              <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> Dawki, Meghalaya</span>
              <span className="inline-flex items-center gap-1"><Users className="w-4 h-4" /> 80+ guests</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Camp where the river runs clearest</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The XTSY Adventure Campsite sits on the banks of the Umngot River in Dawki — the crystalline waterway
              made famous by its boats that appear to float in mid-air. Wake up to mist over the river, paddle a kayak
              before breakfast, and end the day around a Khasi bonfire under one of India's clearest night skies.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Designed for groups, couples and solo travellers, our 80-guest site keeps things experiential, not hotel-like.
              Tents are pre-pitched, washrooms are shared just outside the site, and everything else (bonfire, water sports,
              dinner) is à la carte so you only pay for what you actually want.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {DAWKI_CAMPING_IMAGES.slice(1, 5).map((src, i) => (
              <button
                key={src}
                onClick={() => openPreview(i + 1)}
                className="relative aspect-square rounded-2xl overflow-hidden group"
              >
                <UnifiedImage
                  src={src}
                  alt={`Dawki campsite view ${i + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 sm:px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Transparent Pricing</h2>
            <p className="text-muted-foreground">Per person, per night. GST inclusive.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {PRICING.map((p) => (
              <div
                key={p.title}
                className={`relative rounded-3xl p-8 border ${
                  p.highlight ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-card"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-6 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-primary text-primary-foreground">
                    Most Booked
                  </span>
                )}
                <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-4xl font-bold">₹{p.price}</span>
                  <span className="text-sm text-muted-foreground">/ person / night</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={p.highlight ? "default" : "outline"}>
                  <a href={wa(`Hi! I want to book the "${p.title}" at XTSY Adventure Campsite Dawki.`)}>
                    Book this plan
                  </a>
                </Button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Add-ons billed on arrival: bonfire (extended), kayaking, boating, cliff swims, hot dinner.
          </p>
        </div>
      </section>

      {/* Experience Highlights */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">The Camping Experience</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors">
              <Icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4 sm:px-6 bg-muted/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">Inside the Campsite</h2>
              <p className="text-muted-foreground">Real photos from XTSY guests in Dawki.</p>
            </div>
            <span className="text-sm text-muted-foreground hidden sm:block">{DAWKI_CAMPING_IMAGES.length} photos</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {DAWKI_CAMPING_IMAGES.map((src, i) => (
              <button
                key={src}
                onClick={() => openPreview(i)}
                className="relative aspect-[4/5] rounded-xl overflow-hidden group bg-muted/20"
              >
                <UnifiedImage
                  src={src}
                  alt={`XTSY Adventure Campsite Dawki photo ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-3xl p-10 sm:p-14 bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Reserve your tent for Dawki</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Limited tents per night. Message us on WhatsApp for instant confirmation, group rates and add-ons.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href={wa("Hi! I want to reserve a tent at XTSY Adventure Campsite Dawki.")}>
                <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Booking Desk
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/things-to-do-in-meghalaya">Explore Meghalaya guide</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {previewIndex !== null && (
        <InstagramPreviewModal
          isOpen
          onClose={closePreview}
          images={DAWKI_CAMPING_IMAGES}
          initialIndex={previewIndex}
          alt="XTSY Adventure Campsite Dawki"
        />
      )}
    </div>
  );
});

XTSYAdventureCampsiteDawki.displayName = "XTSYAdventureCampsiteDawki";

export default XTSYAdventureCampsiteDawki;
