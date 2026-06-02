import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import SEOHead from '@/components/SEOHead';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Quote, MessageCircle, Sparkles, Mountain, Map, Plane, CreditCard, Star } from 'lucide-react';

const FAQ = () => {
  const faqSections = [
    {
      title: "The Glass Suite",
      icon: Sparkles,
      iconColor: "text-amber-500",
      faqs: [
        {
          question: "What makes the 270° Glass Suite worth it?",
          answer: "Three glass walls. 270° views. Sunrise over the mountains from your bed. It's India's first panoramic glass house—couples, proposals, anniversary vibes, or just treating yourself. The photos don't do it justice.",
          hasQuote: true,
          quote: "Absolutely beautiful view from their glass house. It was an unforgettable experience!",
          quoteName: "Aayush"
        },
        {
          question: "Is it actually private?",
          answer: "Yes! The glass faces natural landscapes, not buildings. You get stunning views without compromising privacy. We also provide blackout curtains for when you want total seclusion.",
        },
        {
          question: "What's included?",
          answer: "Premium breakfast, high-speed WiFi, climate control, all common areas access. Private ensuite bathroom. Queen bed fits 2 guests comfortably. It's the whole package.",
        },
        {
          question: "How do I book?",
          answer: "WhatsApp +91 88373 17070 or book on our website. It's ₹9,999/night (weekends) and ₹7,999/night (weekdays). Book 2-3 weeks ahead during peak season—it sells out fast.",
        }
      ]
    },
    {
      title: "Meghalaya Adventures",
      icon: Mountain,
      iconColor: "text-green-500",
      faqs: [
        {
          question: "What are the must-see spots?",
          answer: "Living Root Bridges (absolutely insane), Dawki's crystal-clear river (yes, it's real), Nohkalikai Falls (India's tallest plunge), and Mawlynnong (Asia's cleanest village). We arrange guided tours to all of them.",
          hasQuote: true,
          quote: "Amazing experience... Met a lot of new people who became a part of my life now.",
          quoteName: "Parichit"
        },
        {
          question: "When should I visit?",
          answer: "Oct-April for clear skies and best weather. But here's the thing—monsoon (June-Sept) is when Meghalaya transforms into a lush green paradise with waterfalls everywhere. Both seasons hit different.",
        },
        {
          question: "What adventure activities do you offer?",
          answer: "Trekking to Living Root Bridges, cave exploration in Jaintia Hills, river rafting, rock climbing, wilderness survival experiences. All with certified guides and proper safety gear. Not your basic tourist stuff.",
        },
        {
          question: "Can you do multi-day Meghalaya tours?",
          answer: "That's our specialty. Custom itineraries covering Shillong, Cherrapunji, Dawki, Mawlynnong, plus hidden gems like Krang Suri Falls. Transport, accommodation, meals, local guides—we handle everything.",
        }
      ]
    },
    {
      title: "Northeast Experiences",
      icon: Map,
      iconColor: "text-violet-500",
      faqs: [
        {
          question: "What unique cultural experiences do you offer?",
          answer: "Hornbill Festival in Nagaland (it's legendary), traditional Khasi culture in Meghalaya villages, Loktak's floating islands in Manipur, Arunachal's untouched tribal traditions. Each state is a completely different world.",
        },
        {
          question: "Is Northeast safe for international tourists?",
          answer: "Very safe. The people are genuinely welcoming—not just tourist-friendly, actually friendly. Some areas need permits for foreign nationals, which we handle completely for you.",
          hasQuote: true,
          quote: "XTSY made us feel safe and welcomed—it's honestly one of the safest places we've traveled to.",
          quoteName: "Olivia"
        },
        {
          question: "Do you handle permits?",
          answer: "100%. Arunachal Pradesh, parts of Nagaland, border regions—just give us your details 15-20 days before travel. We handle all the paperwork so you can focus on the experience.",
        },
        {
          question: "What about connectivity?",
          answer: "Most tourist areas have solid mobile coverage and internet. Remote villages? Limited connectivity, but honestly, that's part of the magic. We always ensure safety communication channels are available.",
        }
      ]
    },
    {
      title: "Booking & Logistics",
      icon: CreditCard,
      iconColor: "text-blue-500",
      faqs: [
        {
          question: "How far in advance should I book?",
          answer: "Glass Suite: 2-3 weeks ahead during peak season. Tour packages: 1-2 weeks usually works. Last-minute bookings? Possible, but availability might be limited.",
        },
        {
          question: "What's your cancellation policy?",
          answer: "All advance payments are non-refundable—no cancellations once paid. BUT you can modify your booking once within 90 days (date changes, room upgrades/downgrades subject to availability). Group and promo bookings are non-cancellable. No refunds for no-shows. We keep it transparent.",
        },
        {
          question: "Airport pickup available?",
          answer: "Yes! Guwahati Airport (closest to Meghalaya) and other northeastern airports. Our drivers know mountain roads like the back of their hand—safe, comfortable transfers guaranteed.",
          hasQuote: true,
          quote: "Staff was of great help as we had bad experience with the cab service from Guwahati to Shillong. Thanks to XTSY's timely help!",
          quoteName: "Malathi"
        },
        {
          question: "What payment methods work?",
          answer: "UPI, bank transfers, cards, cash. International guests: PayPal or wire transfer. Small advance secures your booking, balance on arrival. Groups get flexible payment plans.",
        },
        {
          question: "Group discounts?",
          answer: "6+ people get special rates on stays and tours. Corporate groups, colleges, adventure clubs—we've hosted 32+ IIT/IIM tours. We know how to handle groups. Hit us up for custom pricing.",
          hasQuote: true,
          quote: "Very nice place for group stay!",
          quoteName: "Sahil"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="FAQ — XTSY Hostel Shillong | Glass Suite, Rooms, Tours"
        description="Frequently asked questions about XTSY Hostel Shillong. Glass suite, dorm rooms, check-in/out, pet policy, Meghalaya tours, and booking help."
        keywords="XTSY FAQ, hostel Shillong questions, glass suite FAQ, Meghalaya travel FAQ, booking help XTSY"
        canonicalUrl="https://xtsy.one/faq"
      />
      
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container mx-auto max-w-4xl relative z-10">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              The Real Deal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Questions, Answered
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              No corporate fluff. Just straight answers backed by real guest experiences.
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid gap-8">
              {faqSections.map((section, sectionIndex) => {
                const IconComponent = section.icon;
                return (
                  <Card key={sectionIndex} className="border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-accent/30 to-transparent">
                      <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-background ${section.iconColor}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Accordion type="single" collapsible className="w-full space-y-2">
                        {section.faqs.map((faq, faqIndex) => (
                          <AccordionItem 
                            key={faqIndex} 
                            value={`${sectionIndex}-${faqIndex}`}
                            className="border border-border/30 rounded-lg px-4 data-[state=open]:bg-accent/20 transition-colors"
                          >
                            <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors hover:no-underline py-4">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4 space-y-3">
                              <p>{faq.answer}</p>
                              {faq.hasQuote && faq.quote && (
                                <div className="flex items-start gap-2 mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                  <Quote className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-sm italic text-foreground/80">"{faq.quote}"</p>
                                    <p className="text-xs text-muted-foreground mt-1">— {faq.quoteName}, Verified Guest</p>
                                  </div>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              We reply fast—usually within minutes on WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/918837317070" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
              <a 
                href="tel:+918837317070" 
                className="bg-background text-foreground border border-border px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                Call +91 88373 17070
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
