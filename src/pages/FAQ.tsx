import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEOContent from '@/components/SEOContent';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FAQ = () => {
  const faqSections = [
    {
      title: "Booking Worries?",
      icon: "📅",
      faqs: [
        {
          question: "Can I cancel my booking if plans change?",
          answer: "Absolutely! We offer flexible cancellation up to 24 hours before check-in for most bookings. For group bookings, we understand things happen - just give us a call and we'll work something out."
        },
        {
          question: "What if I need to modify my dates?",
          answer: "No stress! You can modify dates subject to availability. For domestic travel, changes are usually free up to 48 hours before. International bookings have different policies depending on the destination."
        },
        {
          question: "How do I know my booking is confirmed?",
          answer: "You'll get instant confirmation via email and SMS. Plus, you can always check your booking status in real-time through our dashboard. No guessing games here!"
        },
        {
          question: "Can I book for someone else?",
          answer: "Of course! Just make sure you have their details handy. Whether it's a surprise for your parents or booking for your team, we've got you covered."
        }
      ]
    },
    {
      title: "What's Included, For Real?",
      icon: "✨",
      faqs: [
        {
          question: "Do the room rates include breakfast?",
          answer: "Most of our packages include complimentary breakfast, but we're transparent about it. Check the package details - if breakfast is included, you'll see it clearly mentioned. No hidden surprises!"
        },
        {
          question: "Are there any hidden charges?",
          answer: "Nope, zero hidden fees. What you see is what you pay. GST is clearly mentioned, and any optional services (like spa treatments or adventure activities) are always your choice."
        },
        {
          question: "What about transportation?",
          answer: "For domestic packages, local transportation is usually included. International packages vary - some include airport transfers, others don't. We always specify exactly what's covered."
        },
        {
          question: "Are meals included in tour packages?",
          answer: "It depends on the package! Multi-day tours typically include breakfast and dinner. Day trips usually don't include meals unless specified. We're always upfront about what's covered."
        }
      ]
    },
    {
      title: "WiFi Speed? Yup, We Know It Matters.",
      icon: "📶",
      faqs: [
        {
          question: "How fast is the WiFi, honestly?",
          answer: "Most properties offer 25-50 Mbps - enough for video calls, streaming, and uploading those Instagram stories. Remote locations might be slower, but we'll warn you beforehand!"
        },
        {
          question: "Is WiFi available everywhere on the property?",
          answer: "Generally yes, but mountain resorts and remote locations might have spotty coverage in some areas. Pool areas and lobbies usually have the strongest signals."
        },
        {
          question: "Can I work remotely from your properties?",
          answer: "Absolutely! Many of our guests are digital nomads. We can recommend properties with dedicated workspaces and reliable internet. Just mention it when booking."
        },
        {
          question: "What if I need super-fast internet for work?",
          answer: "Let us know your requirements upfront. Some properties offer premium internet packages, and we can arrange dedicated connections for important business needs."
        }
      ]
    },
    {
      title: "Is it Safe? Heck Yes.",
      icon: "🛡️",
      faqs: [
        {
          question: "How safe are the destinations you recommend?",
          answer: "We only partner with vetted properties and destinations. Our team personally visits locations, and we maintain real-time safety updates. Your safety is non-negotiable for us."
        },
        {
          question: "What about solo female travelers?",
          answer: "We have specific recommendations for solo female travelers, including women-only accommodations and trusted local guides. Many of our properties have dedicated female-friendly policies."
        },
        {
          question: "Are adventure activities safe?",
          answer: "All our adventure partners are certified and insured. Equipment is regularly inspected, and guides are trained professionals. We don't compromise on safety for the sake of thrills."
        },
        {
          question: "What if there's an emergency during my trip?",
          answer: "We provide 24/7 emergency support. You'll have direct contact numbers, and our team can assist with everything from medical emergencies to lost documents."
        },
        {
          question: "How do you handle data privacy?",
          answer: "Your personal information is encrypted and secure. We don't sell your data to third parties, and you can request data deletion anytime. Privacy isn't optional for us."
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