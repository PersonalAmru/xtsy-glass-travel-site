import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOContent from '@/components/SEOContent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FAQ = () => {
  const faqSections = [
    {
      title: "XTSY 270° Glass Suite",
      icon: "🏔️",
      faqs: [
        {
          question: "What makes the 270° Glass Suite special?",
          answer: "Our signature 270° Panorama Glass Ensuite offers unparalleled mountain and valley views from Shillong. The room features floor-to-ceiling glass walls on three sides, giving you breathtaking sunrise and sunset views right from your bed."
        },
        {
          question: "Is the glass room private enough?",
          answer: "Absolutely! While you get stunning panoramic views, the suite is positioned for complete privacy. The glass walls face natural landscapes, not other buildings, and we provide blackout curtains for when you want complete privacy."
        },
        {
          question: "What's included with the Glass Suite booking?",
          answer: "Your stay includes complimentary breakfast, high-speed Wi-Fi, climate control, and access to all our common areas. The suite has a private ensuite bathroom and can accommodate up to 2 guests with a premium queen bed."
        },
        {
          question: "How do I book the Glass Suite?",
          answer: "You can book directly through our website or contact us via WhatsApp. The suite is our premium offering at ₹18,000 per night, and advance booking is recommended as it's our most popular room."
        }
      ]
    },
    {
      title: "Meghalaya Tourism & Adventures",
      icon: "🌿",
      faqs: [
        {
          question: "What are the must-visit places in Meghalaya?",
          answer: "Don't miss the Living Root Bridges in Cherrapunji, the crystal-clear Umngot River in Dawki, Nohkalikai Falls (India's tallest plunge waterfall), and Mawlynnong (Asia's cleanest village). We can arrange guided tours to all these incredible spots."
        },
        {
          question: "When is the best time to visit Meghalaya?",
          answer: "October to April offers the clearest skies and most comfortable weather. However, monsoon season (June-September) transforms the landscape into a lush green paradise - perfect for waterfall enthusiasts! Each season offers unique experiences."
        },
        {
          question: "Do you arrange adventure activities?",
          answer: "Yes! We organize trekking to Living Root Bridges, cave exploration in Jaintia Hills, river rafting, rock climbing, and wilderness survival experiences. All activities are conducted with certified guides and proper safety equipment."
        },
        {
          question: "Can you help with multi-day Meghalaya tours?",
          answer: "Absolutely! We create custom itineraries covering Shillong, Cherrapunji, Dawki, Mawlynnong, and hidden gems like Krang Suri Falls. Tours include transportation, accommodation, meals, and local guides who know the best spots."
        }
      ]
    },
    {
      title: "Northeast India Experiences",
      icon: "🎭",
      faqs: [
        {
          question: "What unique cultural experiences do you offer?",
          answer: "Experience tribal festivals like Hornbill Festival in Nagaland, traditional Khasi culture in Meghalaya villages, Manipur's floating islands at Loktak Lake, and Arunachal's untouched tribal traditions. Each state offers distinct cultural richness."
        },
        {
          question: "Is Northeast India safe for international tourists?",
          answer: "Yes, Northeast India is very safe for tourists. We work with local guides who know the terrain and culture intimately. Some areas require permits for foreign nationals, which we handle entirely for you."
        },
        {
          question: "Do you arrange permits for restricted areas?",
          answer: "Yes, we handle all permit requirements for areas like Arunachal Pradesh, parts of Nagaland, and certain border regions. Just provide your details 15-20 days before travel, and we'll take care of the paperwork."
        },
        {
          question: "What about connectivity and communication?",
          answer: "Most tourist areas have good mobile coverage and internet. Remote villages might have limited connectivity, but that's part of the authentic experience! We always ensure safety communication channels are available."
        }
      ]
    },
    {
      title: "Booking & Travel Logistics",
      icon: "📋",
      faqs: [
        {
          question: "How far in advance should I book?",
          answer: "For our Glass Suite, book at least 2-3 weeks ahead during peak season. For tour packages, 1-2 weeks is usually sufficient. Last-minute bookings are possible but may have limited availability."
        },
        {
          question: "What's your cancellation policy?",
          answer: "Room bookings can be cancelled up to 48 hours before check-in for full refund. Tour packages have different policies based on the complexity - typically 72 hours for local tours, 7 days for multi-state packages."
        },
        {
          question: "Do you provide transportation from airports?",
          answer: "Yes! We arrange pickup from Guwahati Airport (closest to Meghalaya) and other northeastern airports. Our drivers are familiar with mountain roads and provide safe, comfortable transfers to your accommodation."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept UPI, bank transfers, credit/debit cards, and cash payments. For international guests, we can arrange secure payment gateways. A small advance secures your booking, with balance payable on arrival."
        },
        {
          question: "Do you offer group discounts?",
          answer: "Yes! Groups of 6+ get special rates on accommodation and tours. Corporate groups, educational institutions, and adventure clubs get additional discounts. Contact us for custom group packages and pricing."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOContent page="faq" />
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 text-center bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              You've got questions. We've got real answers. No corporate copy-paste vibes here.
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid gap-8">
              {faqSections.map((section, sectionIndex) => (
                <Card key={sectionIndex} className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
                      <span className="text-3xl">{section.icon}</span>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {section.faqs.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`${sectionIndex}-${faqIndex}`}>
                          <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              Can't find what you're looking for? Our team is here to help with personalized answers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+1234567890" 
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Call Us Now
              </a>
              <a 
                href="mailto:help@xtsy.com" 
                className="bg-background text-foreground border border-border px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                Email Support
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;