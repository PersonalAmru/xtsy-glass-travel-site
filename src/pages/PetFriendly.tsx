import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppBookingForm from "@/components/WhatsAppBookingForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PawPrint, Heart, Shield, Plane, Home, Users, Phone, Globe, MessageCircle } from "lucide-react";
import petFriendlyHero from "@/assets/pet-friendly-hero.jpg";

const PetFriendly = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    document.title = "India's 1st Pet Friendly Travellers Hostel | XTSY Prime Pet Travel Accommodation";
    
    // SEO Meta Tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'XTSY Prime - India\'s first pet-friendly travellers hostel in Shillong, Meghalaya. Pet-friendly accommodation, domestic & international pet travel arrangements, complete pet care support by Team XTSY.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'XTSY Prime - India\'s first pet-friendly travellers hostel in Shillong, Meghalaya. Pet-friendly accommodation, domestic & international pet travel arrangements, complete pet care support by Team XTSY.';
      document.head.appendChild(meta);
    }

    // Keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords = 'pet friendly hostel India, pet friendly accommodation Shillong, pet travel India, dog friendly hostel Meghalaya, cat friendly hostel, pet friendly travellers hostel, pet travel arrangements, international pet travel India, domestic pet travel, pet care hostel, pet friendly stay Northeast India, pet friendly accommodation Meghalaya';
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords;
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-background/95">
      <Header />
      
      <main className="flex-1 pt-20 pb-12">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${petFriendlyHero})` }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
          
          {/* Content */}
          <div className="relative z-10 responsive-container text-center space-y-6 max-w-4xl mx-auto px-4">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-lg px-6 py-2 shadow-lg">
              <PawPrint className="w-5 h-5 mr-2 inline" />
              India's 1st Pet Friendly Travellers Hostel
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl">
              Where Pet Comfort <span className="text-primary drop-shadow-lg">Matters</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
              Welcome to XTSY Prime - India's pioneering pet-friendly travellers hostel in Shillong, Meghalaya. 
              Travel with your furry companions and experience hospitality that cares for both you and your pets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8 shadow-xl"
                onClick={() => setIsBookingModalOpen(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Book via WhatsApp
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 shadow-xl"
                onClick={() => window.open('tel:+918837317070', '_self')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose XTSY Section */}
        <section className="bg-muted/30 py-16">
          <div className="responsive-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose XTSY Prime for Pet Travel?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We understand that pets are family. Our comprehensive pet care services ensure a stress-free travel experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border/50 hover:border-primary/50 transition-all">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Home className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Pet-Friendly Rooms</h3>
                  <p className="text-muted-foreground">
                    Specially designed rooms with pet amenities, comfortable bedding, and safe spaces for your companions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-all">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Plane className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Travel Arrangements</h3>
                  <p className="text-muted-foreground">
                    Complete domestic and international pet travel arrangements including documentation and transport.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-all">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Team XTSY Support</h3>
                  <p className="text-muted-foreground">
                    24/7 dedicated team support for all your pet care needs during your stay with us.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/50 transition-all">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Pet Comfort First</h3>
                  <p className="text-muted-foreground">
                    From food bowls to play areas, we ensure your pets feel at home throughout their journey.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pet Travel Services */}
        <section className="responsive-container py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Comprehensive Pet Travel Services
              </h2>
              <p className="text-lg text-muted-foreground">
                XTSY Travel supports your furry friends every step of the way
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-primary/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <Globe className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Domestic Pet Travel
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>✓ Pet-friendly transportation across India</li>
                        <li>✓ Health certificate assistance</li>
                        <li>✓ Interstate travel documentation</li>
                        <li>✓ Veterinary coordination</li>
                        <li>✓ Pet carrier arrangements</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <Plane className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        International Pet Travel
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>✓ International pet passport assistance</li>
                        <li>✓ Vaccination and microchipping guidance</li>
                        <li>✓ Import/export documentation</li>
                        <li>✓ Airline pet travel booking</li>
                        <li>✓ Quarantine procedure support</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Pet Care & Safety
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>✓ Secure pet-friendly premises</li>
                        <li>✓ Emergency veterinary contacts</li>
                        <li>✓ Pet sitting services available</li>
                        <li>✓ Pet food and supplies guidance</li>
                        <li>✓ Walking and exercise areas</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <PawPrint className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Pet Amenities
                      </h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>✓ Pet beds and comfortable bedding</li>
                        <li>✓ Food and water bowls provided</li>
                        <li>✓ Pet-friendly outdoor spaces</li>
                        <li>✓ Waste disposal facilities</li>
                        <li>✓ Pet grooming recommendations</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pet FAQ Section */}
        <section className="responsive-container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Pet Travel FAQs
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about traveling with your pets to XTSY Prime
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  What types of pets are welcome at XTSY Prime?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We welcome dogs, cats, and birds of all sizes and breeds. As India's 1st Pet Friendly Travellers Hostel, we understand that pets are family. However, we recommend contacting Team XTSY in advance to ensure we can accommodate your specific pet's needs and to prepare the room accordingly.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  Are there any additional charges for bringing pets?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, there is a nominal pet fee to cover additional cleaning and pet amenities. The exact fee depends on the size and type of pet, as well as the duration of your stay. Contact us via WhatsApp or call +91 88373 17070 for detailed pricing information.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  What documents are required for my pet to stay?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We require up-to-date vaccination records, including rabies vaccination certificate. For domestic travel within India, a fitness certificate from a registered veterinarian is recommended. For international pet travel, additional documentation including pet passports, import permits, and health certificates may be required. Team XTSY can assist you with all documentation requirements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  Do you help with domestic and international pet travel arrangements?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Absolutely! XTSY Travel provides comprehensive pet travel support for both domestic and international journeys. We assist with airline bookings, pet carrier arrangements, health certificates, quarantine procedures, and all necessary documentation. Our team coordinates with veterinarians and authorities to ensure smooth travel for your furry companions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  What pet amenities are provided in the rooms?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Our pet-friendly rooms include comfortable pet beds, food and water bowls, waste disposal facilities, and designated areas for your pets to relax. We also have outdoor spaces for exercise and walking. Additional amenities like pet toys and grooming supplies can be arranged upon request.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  Can I leave my pet alone in the room?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We understand that you may need to leave your pet briefly, but we recommend not leaving pets unattended for extended periods. If you need to go out, pet sitting services can be arranged through Team XTSY. We also have 24/7 support available in case your pet needs any assistance during your absence.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  Are there veterinary services nearby?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, we have partnerships with local veterinary clinics in Shillong and around Northeast India and can arrange emergency veterinary services if needed. Team XTSY maintains a list of trusted veterinarians and pet care professionals in the area. We also provide contact details and directions to the nearest animal hospitals.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  What is your pet behavior policy?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We ask that all pets be well-behaved, non-aggressive, and comfortable around people and other animals. Pets should be house-trained or crate-trained. Owners are responsible for their pet's behavior and any damages caused. We reserve the right to request removal of pets that display aggressive behavior or cause disturbances to other guests.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  Do I need to bring my own pet food and supplies?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes, we recommend bringing your pet's regular food to maintain their dietary routine and avoid stomach issues. However, Team XTSY can provide guidance on local pet stores and can arrange for basic supplies if needed. We provide bowls and basic amenities, but bringing familiar items like toys and blankets will help your pet feel more comfortable.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                  How do I book a pet-friendly room at XTSY Prime?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Booking is easy! Simply click the "Book via WhatsApp" button on this page to connect with Team XTSY directly. Provide details about your pet (type, breed, size, age) along with your travel dates. You can also call us at +91 88373 17070. We recommend booking in advance to ensure availability and allow us to prepare the perfect pet-friendly accommodation for you.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 py-16">
          <div className="responsive-container text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Travel with Your Pet?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Contact Team XTSY for full-fledged support in planning your pet-friendly travel experience. 
              We're here to make your journey comfortable, safe, and memorable for both you and your furry friends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => setIsBookingModalOpen(true)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Book via WhatsApp
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 bg-white text-gray-900 hover:bg-gray-50"
                onClick={() => window.open('tel:+918837317070', '_self')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call +91 88373 17070
              </Button>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="sr-only">
          <h2>Pet Friendly Hostel in Shillong Meghalaya</h2>
          <p>
            XTSY Prime is India's first pet-friendly travellers hostel located in Shillong, Meghalaya. 
            We specialize in pet-friendly accommodation, domestic pet travel, international pet travel arrangements, 
            dog-friendly rooms, cat-friendly stays, and complete pet care services. Book pet-friendly hostel rooms 
            in Northeast India with Team XTSY support for all your pet travel needs.
          </p>
        </section>
      </main>
      
      <Footer />
      
      <WhatsAppBookingForm 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default PetFriendly;
