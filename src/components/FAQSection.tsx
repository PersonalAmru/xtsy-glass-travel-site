
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FAQSection = () => {
  const faqData = [
    {
      question: "What is the XTSY 270° Glass Suite?",
      answer: "India's first 270° panoramic glass house offering breathtaking mountain views from floor-to-ceiling glass walls. Features luxury ensuite bathroom, queen bed, premium breakfast, high-speed WiFi, and Netflix. Perfect for couples and special occasions. Weekend rate: ₹9,999/night, Weekday rate: ₹7,999/night."
    },
    {
      question: "What accommodation options do you offer?",
      answer: "We have 4 tiers: XTSY Luxury (270° Glass Suite - ₹7,999-9,999/night), XTSY Hostel (Private rooms ₹3,500/night, 6-bed dorm ₹700/bed), XTSY Economy (6-bed female dorm ₹325/bed, 8-bed mixed dorm ₹399/bed). All properties located in Shillong, Meghalaya with 24/7 security."
    },
    {
      question: "How do I book accommodation and tours?",
      answer: "Book easily via: 1) Our website booking system 2) WhatsApp at +91 88373 17070 3) Email booking@xtsy.one 4) Google Form. We offer instant confirmation for available dates. Glass Suite requires 2-3 weeks advance booking during peak season."
    },
    {
      question: "Do you offer customized tour packages?",
      answer: "Yes! We create personalized itineraries across 12+ states in Northeast India with 30+ tour package options. Our services include transportation, experienced local guides, accommodation, and authentic cultural experiences. Contact us to design your perfect adventure."
    },
    {
      question: "What destinations do you cover in Northeast India?",
      answer: "We specialize in Meghalaya (Living Root Bridges, Cherrapunji, Dawki, Mawlynnong, Shillong) and cover 12 states including Arunachal Pradesh, Assam, Nagaland, Sikkim, Manipur, and more. From monsoon treks to high-altitude expeditions, we curate authentic Northeast experiences."
    },
    {
      question: "What's included in your tour packages?",
      answer: "Our comprehensive packages include: comfortable transportation, experienced local guides fluent in regional languages, handpicked accommodations, detailed itineraries, safety equipment for adventure activities, and 24/7 support. Meals and entry tickets specified per package."
    },
    {
      question: "What are your check-in/check-out times and policies?",
      answer: "Check-in: 2:00 PM | Check-out: 11:00 AM. Early check-in subject to availability (additional charges may apply). Late check-in free until 11:00 PM, ₹500 fee after. 24/7 reception available. Self check-in available for verified bookings."
    },
    {
      question: "What is your cancellation and refund policy?",
      answer: "Free cancellation 7+ days before check-in with full refund. 50% refund for cancellations 3-7 days before. No refund for cancellations less than 48 hours. Glass Suite bookings require 30% advance payment. Tour packages have separate cancellation terms based on itinerary complexity."
    },
    {
      question: "Is Northeast India safe for solo and female travelers?",
      answer: "Absolutely! We provide 24/7 security, CCTV monitoring throughout properties, female-only dormitories, verified local guides, and emergency support. Northeast India is one of India's safest regions with welcoming communities. Our experienced team ensures every traveler feels secure."
    },
    {
      question: "When is the best time to visit Northeast India?",
      answer: "October to May: Best weather for sightseeing and trekking. June to September: Monsoon season - spectacular for waterfall experiences (Cherrapunji, Nohkalikai Falls). November to February: Winter wonderland, clear Himalayan views. We operate year-round with season-specific experiences."
    },
    {
      question: "Do you arrange group bookings and events?",
      answer: "Yes! We specialize in group bookings for corporate retreats, college trips, family reunions, and adventure groups. Discounted rates for 8+ people. Special packages available including bonfire nights, BBQ experiences, and team-building activities. Contact us for customized group proposals."
    },
    {
      question: "What makes XTSY different from other travel companies?",
      answer: "We're Northeast India specialists with authentic local expertise, not a generic tour operator. Our unique offerings: India's first 270° Glass Suite, 4-tier accommodation options, 12+ states coverage, sustainable eco-tourism practices, tech-integrated booking, and genuine cultural immersion experiences with local communities."
    },
    {
      question: "Do you provide airport pickup and transportation?",
      answer: "Yes! We arrange airport transfers from Guwahati Airport (130km from Shillong) and Shillong Airport. All tour packages include comfortable transportation in well-maintained vehicles with experienced drivers. Separate transportation services also available on request."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept multiple payment options: UPI, Credit/Debit Cards, Net Banking, and Cash on arrival (subject to availability). International guests can pay via PayPal or wire transfer. Glass Suite and tour packages require advance payment. Flexible payment plans available for group bookings."
    },
    {
      question: "Do you cater to digital nomads and remote workers?",
      answer: "Absolutely! All properties feature high-speed WiFi (50+ Mbps), co-working spaces, 24/7 power backup, study lights, charging points, and quiet workspaces. Perfect for workations with inspiring mountain views. Monthly stay discounts available. Strong network coverage across Shillong."
    },
    {
      question: "What amenities are included at each property tier?",
      answer: "Economy: Bed, Balcony, WiFi only (no other amenities). Hostel: Charging points, study lights, common areas, terrace access, bonfire nights. Luxury: ALL services included - room service, premium breakfast, exclusive facilities, complimentary upgrades, concierge service, and VIP experiences."
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
