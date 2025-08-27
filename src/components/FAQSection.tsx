
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FAQSection = () => {
  const faqData = [
    {
      question: "What are hostel quiet hours?",
      answer: "XTSY Economy Dorms: Quiet hours are strictly enforced from 11 PM to 6 AM daily. XTSY Travellers Hostel: More flexible policy with consideration for fellow guests. XTSY Luxury: No strict quiet hours, premium privacy experience."
    },
    {
      question: "Are food/alcohol allowed in rooms?",
      answer: "XTSY Economy: No food allowed in dorms (₹2000 fine), alcohol only in designated areas. XTSY Travellers: Food allowed in designated areas, alcohol permitted in Bonfire & Terrace zones after 8 PM (₹10,000 fine for violations + legal action). XTSY Luxury: All privileges included with room service options."
    },
    {
      question: "What rules apply to dorm beds?",
      answer: "Use only your assigned bed (₹500 fine for using unassigned beds). Keep your area clean and organized. Respect privacy curtains and personal space. Report any issues to reception immediately. All properties monitored by 24/7 CCTV for safety."
    },
    {
      question: "Do both properties offer the same amenities?",
      answer: "No, amenities vary by property: XTSY Economy has basic facilities with upgrade requirements for premium services. XTSY Travellers Hostel includes most amenities (free room upgrades, breakfast, charging points, study lights). XTSY Luxury includes all services plus exclusive premium options."
    },
    {
      question: "What's your smoking policy?",
      answer: "Smoking is only allowed in designated outdoor areas. ₹2000 fine for smoking inside any room or indoor area. Designated smoking zones are available on terraces and specified outdoor areas. Zero tolerance policy for violations."
    },
    {
      question: "What amenities are included at XTSY Luxury?",
      answer: "XTSY Luxury includes ALL services: Free room upgrades, complimentary breakfast, high-speed WiFi, charging points, study lights, access to all common areas, terrace, bonfire nights, BBQ experiences, dome photoshoot, convenience store discounts, dedicated tour concierge, and exclusive premium facilities."
    },
    {
      question: "How do I upgrade from Economy to Travellers Hostel?",
      answer: "Upgrades are subject to availability. Economy guests can upgrade to Travellers Hostel for access to complimentary breakfast, charging points, study lights, and free access to common areas, terrace, and bonfire nights. Contact reception for upgrade pricing."
    },
    {
      question: "What are the check-in and check-out times?",
      answer: "Standard check-in: 2:00 PM | Check-out: 11:00 AM | Early check-in available (subject to availability, additional charges may apply) | Late check-in until 11:00 PM free, after 11:00 PM ₹500 fee | 24/7 reception for emergencies | Self check-in available for verified bookings"
    },
    {
      question: "Is there a security deposit?",
      answer: "Individual bookings: No security deposit required | Group bookings (8+ people): Security deposit may be required | Damage charges: ₹200 for lost key cards, ₹500 for damaged linens/towels | Guests liable for property damage"
    },
    {
      question: "What happens if I damage something?",
      answer: "Damage charges apply: Lost key card ₹200, damaged bed linens/towels ₹500 per item, common area damage charged to responsible party. Room cleanliness violations ₹500 littering fine. XTSY not liable for lost personal items."
    },
    {
      question: "What makes XTSY Travellers Hostel special?",
      answer: "XTSY offers India's first tech-integrated hostel experience with our signature 270° Panorama Glass Suite, sustainable practices, and authentic Northeast India cultural immersion. We're not just accommodation - we're your gateway to hidden gems."
    },
    {
      question: "What is the 270° Glass Suite?",
      answer: "Our signature room features floor-to-ceiling glass walls on three sides, offering breathtaking mountain and valley views. Perfect for sunrise and sunset experiences right from your bed, with complete privacy and luxury amenities."
    },
    {
      question: "Do you help plan Meghalaya tours?",
      answer: "Absolutely! We create custom itineraries covering Living Root Bridges, Cherrapunji waterfalls, Dawki's crystal river, Mawlynnong village, and hidden gems. All tours include transportation, guides, and authentic local experiences."
    },
    {
      question: "Is Northeast India safe for solo travelers?",
      answer: "Very safe! We provide 24/7 security, CCTV monitoring, female-only dorms, and local guides who know the terrain intimately. Our team ensures every traveler feels secure and supported throughout their journey."
    },
    {
      question: "What's your booking and cancellation policy?",
      answer: "Book online or via WhatsApp. Glass Suite requires 2-3 weeks advance booking. Free cancellation 7+ days before check-in. Partial refund (50%) for cancellations less than 7 days. No refund for cancellations less than 24 hours. Seasonal surcharges may apply."
    },
    {
      question: "Do you cater to digital nomads?",
      answer: "Yes! We offer high-speed WiFi, co-working spaces, 24/7 power backup, and a community of like-minded remote workers. Perfect for workations with stunning mountain views and reliable infrastructure."
    }
  ];

  return (
    <section className="pt-12 pb-16 px-4 bg-background -mt-1" id="faq">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick answers to help you plan your perfect Northeast India adventure.
          </p>
        </div>

        <Card className="glass-card border-border/50 shadow-xl">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border-border/30">
                  <AccordionTrigger className="text-left text-base font-semibold hover:text-primary transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="tel:+918837317070" 
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Call +91 88373 17070
            </a>
            <a 
              href="mailto:booking@xtsy.one" 
              className="bg-background text-foreground border border-border px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
            >
              Email booking@xtsy.one
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
