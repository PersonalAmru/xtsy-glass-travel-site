import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Sparkles, Quote, ChevronDown } from 'lucide-react';

const FAQSection = () => {
  const [showAll, setShowAll] = useState(false);

  const faqData = [
    {
      question: "What's the XTSY 270° Glass Suite all about?",
      answer: "Picture this: floor-to-ceiling glass walls, 270° mountain views, and you waking up to sunrises over the Himalayas. It's India's first panoramic glass house—perfect for couples, proposals, or just that main-character moment. Weekend: ₹9,999/night, Weekday: ₹7,999/night. Trust us, the reels will go crazy.",
      hasQuote: true,
      quote: "Absolutely beautiful view from their glass house. It was an unforgettable experience!",
      quoteName: "Aayush"
    },
    {
      question: "What kind of stays do you have?",
      answer: "We've got options for every budget. Luxury: 270° Glass Suite (₹7,999-9,999). Hostel vibes: Private rooms (₹3,500) or 6-bed dorms (₹700/bed). Economy: Female dorm (₹325/bed) or mixed dorm (₹399/bed). All in Shillong with 24/7 security—no sketchy vibes here.",
      hasQuote: true,
      quote: "The hostel has a very welcoming atmosphere... cleanliness is always maintained.",
      quoteName: "Ritika"
    },
    {
      question: "How do I book?",
      answer: "Super easy—WhatsApp us at +91 88373 17070 (fastest response), book on our website, or email booking@xtsy.one. We confirm instantly for available dates. Pro tip: Glass Suite needs 2-3 weeks advance during peak season because it books out fast.",
    },
    {
      question: "Do you do tour packages?",
      answer: "Oh, we go hard on tours. 30+ packages across 12 states in Northeast India. From living root bridges to Hornbill Festival—we create custom itineraries with local guides who actually know the hidden spots. Not your basic touristy stuff.",
      hasQuote: true,
      quote: "Very good hospitality and excellent tour package management.",
      quoteName: "Dhruba"
    },
    {
      question: "Is it safe for solo and female travelers?",
      answer: "100%. We have 24/7 security, CCTV everywhere, female-only dorms, verified local guides, and emergency support. Northeast India is one of the safest regions—the locals are genuinely welcoming. Our female guests keep coming back.",
      hasQuote: true,
      quote: "XTSY made us feel safe and welcomed—it's honestly one of the safest places we've traveled to.",
      quoteName: "Olivia"
    },
    {
      question: "What's your cancellation policy?",
      answer: "Straight up: all advance payments are non-refundable, and we don't accept cancellations once you've paid. BUT—you can modify your booking once within 90 days. Date change? Room upgrade/downgrade? We got you (subject to availability and fare difference). Just WhatsApp us or email booking@xtsy.one.",
    },
    {
      question: "What places do you cover in Northeast?",
      answer: "Meghalaya is our home turf (Living Root Bridges, Cherrapunji, Dawki, Mawlynnong). But we also cover Arunachal, Assam, Nagaland, Sikkim, Manipur, and more. Monsoon treks? High-altitude expeditions? We've got you.",
    },
    {
      question: "What's included in tours?",
      answer: "Everything that matters: comfy transport, local guides who speak the language, handpicked stays, detailed itineraries, safety gear for adventures, and 24/7 support. Meals and entry tickets depend on the package—we keep it transparent.",
    },
    {
      question: "Check-in/check-out times?",
      answer: "Check-in: 2 PM | Check-out: 11 AM. Need early check-in? Subject to availability (might cost extra). Late check-in is free until 11 PM, ₹500 after. We're here 24/7 so you can show up whenever.",
    },
    {
      question: "Best time to visit Northeast?",
      answer: "Oct-May: Best weather, clear skies, perfect for exploring. Jun-Sept: Monsoon = insane waterfalls (Cherrapunji hits different). Nov-Feb: Winter wonderland vibes with clear Himalayan views. We operate year-round—each season has its own magic.",
    },
    {
      question: "Do you do group bookings?",
      answer: "We literally specialize in groups. Corporate retreats, college trips, family reunions, adventure squads—we've hosted 32+ IIT/IIM tours and 40+ school trips. 8+ people get discounted rates. Bonfire nights, BBQs, team activities? Say less.",
      hasQuote: true,
      quote: "Very nice place for group stay!",
      quoteName: "Sahil"
    },
    {
      question: "Why XTSY over other hostels?",
      answer: "We're not just a hostel—we're Northeast specialists. India's first 270° Glass Suite, 4-tier accommodation, 12 states coverage, eco-tourism practices, and genuine cultural immersion. Plus, we're nominated for 'Best Budget Accommodation' by NEITA 2025. That's the difference.",
      hasQuote: true,
      quote: "Just one word for XTSY: THE BEST. It's one of the best stays I have been to lately.",
      quoteName: "Rahul"
    },
    {
      question: "Airport pickup available?",
      answer: "Yes! We arrange transfers from Guwahati Airport (130km) and Shillong Airport. All tour packages include transportation with experienced drivers who know mountain roads. Separate pickup services also available on request.",
    },
    {
      question: "What payment methods work?",
      answer: "UPI, cards, net banking, cash (subject to availability). International guests? PayPal or wire transfer works. Glass Suite and tours need advance payment. Groups can do flexible payment plans—just ask.",
    },
    {
      question: "Good for remote work?",
      answer: "Perfect for digital nomads. 100+ Mbps WiFi, co-working spaces, 24/7 power backup, study lights, charging points everywhere. Mountain views while you work? Yes. Monthly stay discounts? Also yes. Strong network coverage across Shillong.",
      hasQuote: true,
      quote: "Wi-Fi connectivity is smooth. As a student, I never faced any issues.",
      quoteName: "Ritika"
    },
    {
      question: "What amenities come with each tier?",
      answer: "Economy: Bed + Balcony + WiFi (basics only). Hostel: Charging points, study lights, common areas, terrace, bonfire nights. Luxury: Full service—room service, premium breakfast, concierge, complimentary upgrades, VIP treatment.",
    }
  ];

  // Show only 4 FAQs initially
  const visibleFAQs = showAll ? faqData : faqData.slice(0, 4);

  return (
    <section className="pt-10 pb-12 px-4 bg-background -mt-1" id="faq">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            Got Questions?
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Real Answers, No BS
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Everything you need to know before your Northeast adventure
          </p>
        </div>

        <Card className="glass-card border-border/50 shadow-lg">
          <CardContent className="p-3 md:p-5">
            <Accordion type="single" collapsible className="w-full space-y-1.5">
              {visibleFAQs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`faq-${index}`} 
                  className="border border-border/30 rounded-lg px-3 data-[state=open]:bg-accent/30 transition-colors"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold hover:text-primary transition-colors py-3 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pt-1 pb-3 space-y-2">
                    <p>{faq.answer}</p>
                    {faq.hasQuote && faq.quote && (
                      <div className="flex items-start gap-2 p-2.5 bg-primary/5 rounded-lg border border-primary/10">
                        <Quote className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs italic text-foreground/80">"{faq.quote}"</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">— {faq.quoteName}, Verified Guest</p>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {!showAll && (
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(true)}
                  className="text-primary hover:text-primary/80 text-xs"
                >
                  Show All {faqData.length} Questions
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground mb-3">
            Still curious? Hit us up—we reply fast
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a 
              href="https://wa.me/918837317070" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
            <a 
              href="tel:+918837317070" 
              className="bg-background text-foreground border border-border px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent transition-colors"
            >
              Call +91 88373 17070
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
