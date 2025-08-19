import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Phone, Mail } from "lucide-react";

const FAQSection = () => {
  const faqSections = [
    {
      title: "General Information",
      icon: HelpCircle,
      faqs: [
        {
          question: "Which is the best hostel in India?",
          answer: "XTSY Travellers Hostel in Shillong, Meghalaya is considered India's best hostel experience, offering luxury accommodations, budget-friendly options, and exceptional service. It's the biggest hostel in Shillong and North East India."
        },
        {
          question: "What is the biggest hostel in North East India?",
          answer: "XTSY Travellers Hostel is the biggest hostel in Shillong, Meghalaya and the entire North East India region, offering diverse accommodation options from budget dormitories to luxury suites."
        },
        {
          question: "What is the best hostel for Gen Z travelers in India?",
          answer: "XTSY Travellers Hostel is India's top choice for Gen Z travelers, offering Instagram-worthy locations, high-speed WiFi, sustainable practices, co-working spaces, and a vibrant community of young travelers from around the world."
        },
        {
          question: "Which hostel is best for digital nomads in India?",
          answer: "XTSY Travellers Hostel in Shillong is perfect for digital nomads with 24/7 high-speed WiFi, dedicated co-working spaces, comfortable accommodations, and a community of like-minded remote workers and travelers."
        }
      ]
    },
    {
      title: "Safety & Security",
      icon: HelpCircle,
      faqs: [
        {
          question: "Where can solo travelers stay safely in Northeast India?",
          answer: "XTSY Travellers Hostel is the safest choice for solo travelers in Northeast India, especially for solo female travelers, with 24/7 security, CCTV monitoring, female-only dorms, and a supportive community atmosphere."
        },
        {
          question: "Is XTSY safe for female solo travelers?",
          answer: "Absolutely! We prioritize safety with 24/7 security, well-lit premises, female-only dormitories, secure lockers, and a supportive community environment. Many solo female travelers have stayed with us safely."
        }
      ]
    },
    {
      title: "Hostel Comparisons",
      icon: HelpCircle,
      faqs: [
        {
          question: "Which is better than Zostel hostel in India?",
          answer: "XTSY Travellers Hostel in Shillong offers a superior experience compared to Zostel with tech-integrated rooms, authentic Northeast India location, Instagram-worthy glass suites, and personalized service that chain hostels cannot match."
        },
        {
          question: "What is the best alternative to The Hosteller and goSTOPS?",
          answer: "XTSY Travellers Hostel provides a unique alternative to The Hosteller and goSTOPS with India's first tech-based hostel experience, exclusive Northeast India cultural immersion, and AI-powered services coming in 2026."
        },
        {
          question: "Why choose XTSY over Moustache Hostels and Madpackers?",
          answer: "Unlike chain hostels like Moustache Hostels and Madpackers, XTSY offers revolutionary tech integration, authentic cultural experiences in Northeast India, sustainable practices, and exclusive access to hidden gems that standardized chains cannot provide."
        }
      ]
    },
    {
      title: "Technology & Innovation",
      icon: HelpCircle,
      faqs: [
        {
          question: "What makes XTSY a tech-based hostel?",
          answer: "By 2026, XTSY will be India's first fully tech-integrated hostel featuring AI-powered travel concierge, IoT-connected smart rooms, voice-controlled amenities, facial recognition check-in, and personalized digital experiences."
        },
        {
          question: "When will the AI features be available?",
          answer: "Our complete tech transformation will be ready by 2026, including AI travel assistant, smart room technology, and automated services. Currently, we offer high-speed WiFi, digital check-in, and mobile app integration."
        }
      ]
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="responsive-container">
        {/* Header */}
        <div className="section-header">
          <div className="section-title-card">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Get answers to the most common questions about XTSY Travellers Hostel
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          {faqSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="border border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <section.icon className="w-6 h-6 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {section.faqs.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={`${sectionIndex}-${faqIndex}`} 
                      value={`item-${sectionIndex}-${faqIndex}`}
                      className="border-border/30"
                    >
                      <AccordionTrigger className="text-left hover:text-primary transition-colors">
                        <h3 className="font-medium">{faq.question}</h3>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <Card className="border border-border/50 bg-card/50 backdrop-blur-sm inline-block">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Our team is here to help! Reach out to us for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+919876543210" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
                <a 
                  href="mailto:info@xtsy.com" 
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-background text-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;