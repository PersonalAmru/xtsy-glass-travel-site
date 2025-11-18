import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PawPrint, Heart, Shield, Plane, Home, Users, Phone, Globe } from "lucide-react";

const PetFriendly = () => {
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
        <section className="responsive-container py-16 md:py-24">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-6 py-2">
              <PawPrint className="w-5 h-5 mr-2 inline" />
              India's 1st Pet Friendly Travellers Hostel
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Where Pet Comfort <span className="text-primary">Matters</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Welcome to XTSY Prime - India's pioneering pet-friendly travellers hostel in Shillong, Meghalaya. 
              Travel with your furry companions and experience hospitality that cares for both you and your pets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-lg px-8">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                View Pet Rooms
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
              <Button size="lg" className="text-lg px-8">
                <Phone className="w-5 h-5 mr-2" />
                Call +91 88373 17070
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                WhatsApp Us
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
    </div>
  );
};

export default PetFriendly;
