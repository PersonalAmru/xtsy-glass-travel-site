import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useApp } from "@/contexts/AppContext";
import { Car, Bike, Shield, Clock, Phone, MapPin, Fuel, Users, Settings, Star, ChevronRight, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SEOHead from "@/components/SEOHead";

// Vehicle data with Supabase images
const cars = [
  {
    name: "Tata Punch",
    price: 2000,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/Tata%20punch.jpg",
    fuel: "Petrol",
    transmission: "Manual",
    seats: 5,
    category: "Compact SUV"
  },
  {
    name: "Tata Indica",
    price: 2000,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/Tata%20Indica.jpg",
    fuel: "Diesel",
    transmission: "Manual",
    seats: 5,
    category: "Hatchback"
  },
  {
    name: "Mahindra Thar",
    price: 3800,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/Thar.jpg",
    fuel: "Diesel",
    transmission: "Manual/Auto",
    seats: 4,
    category: "Off-Road SUV"
  },
  {
    name: "Mahindra Scorpio",
    price: 4000,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/Scorpio.jpg",
    fuel: "Diesel",
    transmission: "Manual",
    seats: 7,
    category: "Full-Size SUV"
  },
  {
    name: "Mahindra XUV 700",
    price: 4500,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/XUV%20700%20EBONY.jpg",
    fuel: "Diesel/Petrol",
    transmission: "Auto",
    seats: 7,
    category: "Premium SUV",
    badge: "Top End 2025"
  },
  {
    name: "Hyundai i10 Nios",
    price: 1800,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/i10%20nios.jpg",
    fuel: "Petrol",
    transmission: "Manual",
    seats: 5,
    category: "City Hatchback"
  },
  {
    name: "Hyundai i20",
    price: 2000,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/I20.jpg",
    fuel: "Petrol",
    transmission: "Manual/Auto",
    seats: 5,
    category: "Premium Hatchback"
  },
  {
    name: "Kia Seltos",
    price: 2800,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/KIA%20SELTOS.jpg",
    fuel: "Petrol/Diesel",
    transmission: "Auto",
    seats: 5,
    category: "Crossover SUV"
  },
  {
    name: "Kia Sonet",
    price: 2500,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/Sonet.jpg",
    fuel: "Petrol/Diesel",
    transmission: "Manual/Auto",
    seats: 5,
    category: "Compact Crossover"
  }
];

const bikes = [
  {
    name: "RE Meteor 350",
    price: 1300,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/ROYAL%20ENFIELD%20METEOR.jpg",
    engine: "350cc",
    type: "Cruiser",
    mileage: "42 km/l"
  },
  {
    name: "RE Himalayan 411",
    price: 1300,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/411.jpg",
    engine: "411cc",
    type: "Adventure",
    mileage: "35 km/l"
  },
  {
    name: "RE Himalayan 450",
    price: 1800,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/Royal%20Enfield%20Himalayan%20450.jpg",
    engine: "450cc",
    type: "Adventure",
    mileage: "30 km/l",
    badge: "New 2024"
  },
  {
    name: "RE Hunter 350",
    price: 1600,
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/XTSY%20Rentals/Hunter.jpg",
    engine: "350cc",
    type: "Roadster",
    mileage: "40 km/l"
  }
];

const heroImages = [
  ...cars.map(c => c.image),
  ...bikes.map(b => b.image)
];

const features = [
  { icon: Shield, title: "Fully Insured", description: "Comprehensive insurance on all vehicles" },
  { icon: Clock, title: "24/7 Support", description: "Round-the-clock roadside assistance" },
  { icon: MapPin, title: "Free Delivery", description: "Vehicle delivery at your doorstep" },
  { icon: Users, title: "Driver Available", description: "Experienced local drivers on request" }
];

const faqs = [
  { question: "What documents are required for renting?", answer: "Valid driving license, government ID proof (Aadhaar/Passport), and a security deposit. For bikes, a motorcycle endorsement on your license is required." },
  { question: "What is the fuel policy?", answer: "Vehicles are provided with a full tank. Please return with a full tank or we'll charge ₹150/litre above market price." },
  { question: "Is a driver available?", answer: "Yes! We provide experienced local drivers at ₹800-1200/day extra depending on the vehicle. They know all the scenic routes and hidden spots." },
  { question: "What about inter-state travel?", answer: "Inter-state travel is allowed with prior approval. Additional permits may be required for certain states like Arunachal Pradesh (ILP)." },
  { question: "What is the cancellation policy?", answer: "Free cancellation up to 24 hours before pickup. 50% charge for cancellations within 24 hours. No refund for no-shows." },
  { question: "Is there a minimum rental period?", answer: "Minimum rental is 1 day (24 hours). Weekly and monthly discounts available - contact us for special rates." }
];

const XTSYRentals = () => {
  const { formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState("cars");
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    document.title = "XTSY Rentals - Car & Bike Rentals in Shillong | Explore Northeast India";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppBooking = (vehicleName: string, price: number) => {
    const message = encodeURIComponent(
      `Hi! I'd like to rent:\n\n🚗 Vehicle: ${vehicleName}\n💰 Rate: ₹${price}/day\n📅 Dates: [Please specify]\n📍 Pickup: Shillong\n\nPlease confirm availability.`
    );
    window.open(`https://wa.me/918837317070?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="XTSY Rentals — Premium Car & Bike Rentals in Shillong"
        description="Explore Northeast India at your own pace. 9 premium cars and 4 Royal Enfield bikes. Fully insured, 24/7 support, GPS included. Starting ₹1,300/day."
        keywords="car rental shillong, bike rental shillong, thar rental northeast india, royal enfield rental meghalaya"
        canonicalUrl="https://xtsy.one/xtsy-rentals"
      />
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`XTSY Rentals vehicle ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                idx === heroIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          {/* Brand warm glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,hsl(25_95%_53%/0.08),transparent_60%)]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <Badge variant="outline" className="mb-6 border-primary/40 text-primary bg-primary/10 backdrop-blur-sm px-4 py-1.5">
            <Car className="w-3.5 h-3.5 mr-1.5" />
            XTSY Prime
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 font-playfair tracking-tight">
            XTSY <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">Rentals</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-4 font-josefin">
            Explore Northeast India on Your Terms
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Premium cars & Royal Enfield bikes for the roads less traveled. Fully insured, GPS-equipped, driver available.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.8 Rating</span>
            <span className="flex items-center gap-1.5"><Car className="w-4 h-4 text-primary" /> 9 Cars</span>
            <span className="flex items-center gap-1.5"><Bike className="w-4 h-4 text-primary" /> 4 Bikes</span>
          </div>
        </motion.div>
      </section>

      {/* Features Strip */}
      <section className="py-6 border-y border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold text-sm">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Listings */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-card border border-border p-1 rounded-xl">
                <TabsTrigger 
                  value="cars" 
                  className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <Car className="w-4 h-4" />
                  Cars ({cars.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="bikes"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                >
                  <Bike className="w-4 h-4" />
                  Bikes ({bikes.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Cars Grid */}
            <TabsContent value="cars">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-muted via-card to-muted">
                      {/* Ambient glow behind vehicle */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,hsl(25_95%_53%/0.06),transparent_70%)]" />
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl p-2"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                      
                      {/* Shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className="bg-background/60 backdrop-blur-sm border-border/50 text-foreground/90 text-xs">
                          {car.category}
                        </Badge>
                      </div>
                      {car.badge && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                            {car.badge}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-foreground drop-shadow-lg">{car.name}</h3>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm bg-muted/50 rounded-lg px-2 py-1.5">
                          <Fuel className="w-3.5 h-3.5 text-primary" />
                          <span>{car.fuel}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm bg-muted/50 rounded-lg px-2 py-1.5">
                          <Settings className="w-3.5 h-3.5 text-primary" />
                          <span>{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm bg-muted/50 rounded-lg px-2 py-1.5">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span>{car.seats} Seats</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(car.price)}
                          </span>
                          <span className="text-muted-foreground text-sm">/day</span>
                        </div>
                        <button
                          onClick={() => handleWhatsAppBooking(car.name, car.price)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_50%)] text-primary-foreground rounded-xl transition-all duration-300 shadow-lg hover:scale-105 font-medium"
                        >
                          <Phone className="w-4 h-4" />
                          Book
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Bikes Grid */}
            <TabsContent value="bikes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {bikes.map((bike, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted via-card to-muted">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,hsl(25_95%_53%/0.06),transparent_70%)]" />
                      <img
                        src={bike.image}
                        alt={bike.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl p-2"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                      
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className="bg-background/60 backdrop-blur-sm border-border/50 text-foreground/90 text-xs">
                          {bike.type}
                        </Badge>
                      </div>
                      {bike.badge && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-primary text-primary-foreground text-xs font-bold shadow-lg">
                            {bike.badge}
                          </Badge>
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-foreground drop-shadow-lg">{bike.name}</h3>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm bg-muted/50 rounded-lg px-2 py-1.5">
                          <Settings className="w-3.5 h-3.5 text-primary" />
                          <span>{bike.engine}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm bg-muted/50 rounded-lg px-2 py-1.5">
                          <Bike className="w-3.5 h-3.5 text-primary" />
                          <span>{bike.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm bg-muted/50 rounded-lg px-2 py-1.5">
                          <Fuel className="w-3.5 h-3.5 text-primary" />
                          <span>{bike.mileage}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(bike.price)}
                          </span>
                          <span className="text-muted-foreground text-sm">/day</span>
                        </div>
                        <button
                          onClick={() => handleWhatsAppBooking(bike.name, bike.price)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_50%)] text-primary-foreground rounded-xl transition-all duration-300 shadow-lg hover:scale-105 font-medium"
                        >
                          <Phone className="w-4 h-4" />
                          Book
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Common Questions</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-playfair">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 overflow-hidden hover:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-foreground hover:text-primary py-5 text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* Brand glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,hsl(25_95%_53%/0.06),transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-playfair">
            Ready to <span className="text-primary">Explore?</span>
          </h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-xl mx-auto">
            Book your ride today and discover the beauty of Northeast India at your own pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/918837317070?text=Hi!%20I'm%20interested%20in%20renting%20a%20vehicle%20from%20XTSY%20Rentals."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[hsl(142_70%_45%)] hover:bg-[hsl(142_70%_50%)] text-primary-foreground rounded-xl font-semibold transition-all shadow-lg hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              WhatsApp: +91 88373 17070
            </a>
            <a
              href="tel:+918837317070"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card hover:bg-muted text-foreground border border-border rounded-xl font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default XTSYRentals;
