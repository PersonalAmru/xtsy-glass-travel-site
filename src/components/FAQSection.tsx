
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FAQSection = () => {
  const faqData = [
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
      answer: "Book online or via WhatsApp. Glass Suite requires 2-3 weeks advance booking. Room cancellations accepted up to 48 hours before check-in for full refund. Tour packages have varying policies based on complexity."
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
              href="tel:+1234567890" 
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Call Now
            </a>
            <a 
              href="mailto:help@xtsy.com" 
              className="bg-background text-foreground border border-border px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
