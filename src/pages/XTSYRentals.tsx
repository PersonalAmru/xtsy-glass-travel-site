import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useApp } from "@/contexts/AppContext";
import { Car, Bike, Shield, Clock, Phone, MapPin, Fuel, Users, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

// All rental images for hero shuffle
const heroImages = [
  ...cars.map(c => c.image),
  ...bikes.map(b => b.image)
];

const features = [
  {
    icon: Shield,
    title: "Fully Insured",
    description: "Comprehensive insurance coverage on all vehicles"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock roadside assistance"
  },
  {
    icon: MapPin,
    title: "Free Delivery",
    description: "Vehicle delivery at your doorstep in Shillong"
  },
  {
    icon: Users,
    title: "Driver Available",
    description: "Experienced local drivers on request"
  }
];

const faqs = [
  {
    question: "What documents are required for renting?",
    answer: "Valid driving license, government ID proof (Aadhaar/Passport), and a security deposit. For bikes, a motorcycle endorsement on your license is required."
  },
  {
    question: "What is the fuel policy?",
    answer: "Vehicles are provided with a full tank. Please return with a full tank or we'll charge ₹150/litre above market price."
  },
  {
    question: "Is a driver available?",
    answer: "Yes! We provide experienced local drivers at ₹800-1200/day extra depending on the vehicle. They know all the scenic routes and hidden spots."
  },
  {
    question: "What about inter-state travel?",
    answer: "Inter-state travel is allowed with prior approval. Additional permits may be required for certain states like Arunachal Pradesh (ILP)."
  },
  {
    question: "What is the cancellation policy?",
    answer: "Free cancellation up to 24 hours before pickup. 50% charge for cancellations within 24 hours. No refund for no-shows."
  },
  {
    question: "Is there a minimum rental period?",
    answer: "Minimum rental is 1 day (24 hours). Weekly and monthly discounts available - contact us for special rates."
  }
];

const XTSYRentals = () => {
  const { formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState("cars");
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    document.title = "XTSY Rentals - Car & Bike Rentals in Shillong | Explore Northeast India";
  }, []);

  // Auto-shuffle hero images every 4 seconds
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      {/* Hero Section with Auto-Shuffling Images */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary mb-6">
            <Car className="w-4 h-4" />
            <span className="text-sm font-medium">XTSY Prime</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            XTSY <span className="text-primary">Rentals</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8">
            Explore Northeast India on Your Terms
          </p>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Premium cars & bikes for the roads less traveled. From city drives to mountain adventures.
          </p>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-8 bg-slate-900/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
                  <p className="text-white/60 text-xs">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Listings */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-slate-800/50 border border-white/10 p-1">
                <TabsTrigger 
                  value="cars" 
                  className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <Car className="w-4 h-4" />
                  Cars ({cars.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="bikes"
                  className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white"
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
                  <div 
                    key={index}
                    className="group bg-gradient-to-b from-slate-800/50 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 ring-1 ring-white/5"
                  >
                    {/* Instagram-grade image container - 16:9 aspect ratio for full car body */}
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        style={{ objectPosition: '50% 60%' }}
                      />
                      {/* Instagram-style gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 via-transparent to-slate-900/30" />
                      
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white/90 text-xs font-medium border border-white/10">
                          {car.category}
                        </span>
                      </div>
                      {car.badge && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-primary/30">
                            {car.badge}
                          </span>
                        </div>
                      )}
                      
                      {/* Vehicle name overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">{car.name}</h3>
                      </div>
                    </div>
                    
                    {/* Card content with glass effect */}
                    <div className="p-5 bg-gradient-to-b from-slate-800/50 to-slate-900/80">
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="flex items-center gap-1.5 text-white/70 text-sm bg-white/5 rounded-lg px-2 py-1.5">
                          <Fuel className="w-3.5 h-3.5 text-primary" />
                          <span>{car.fuel}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/70 text-sm bg-white/5 rounded-lg px-2 py-1.5">
                          <Settings className="w-3.5 h-3.5 text-primary" />
                          <span>{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/70 text-sm bg-white/5 rounded-lg px-2 py-1.5">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span>{car.seats} Seats</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(car.price)}
                          </span>
                          <span className="text-white/50 text-sm">/day</span>
                        </div>
                        <button
                          onClick={() => handleWhatsAppBooking(car.name, car.price)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-300 shadow-lg shadow-green-600/30 hover:shadow-green-500/40 hover:scale-105"
                        >
                          <Phone className="w-4 h-4" />
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Bikes Grid */}
            <TabsContent value="bikes">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {bikes.map((bike, index) => (
                  <div 
                    key={index}
                    className="group bg-gradient-to-b from-slate-800/50 to-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 ring-1 ring-white/5"
                  >
                    {/* Instagram-grade image container - 4:3 aspect ratio for bike profile */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 overflow-hidden">
                      <img
                        src={bike.image}
                        alt={bike.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        style={{ objectPosition: '50% 55%' }}
                      />
                      {/* Instagram-style gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 via-transparent to-slate-900/30" />
                      
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      
                      {/* Type badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white/90 text-xs font-medium border border-white/10">
                          {bike.type}
                        </span>
                      </div>
                      {bike.badge && (
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-primary/30">
                            {bike.badge}
                          </span>
                        </div>
                      )}
                      
                      {/* Bike name overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold text-white drop-shadow-lg">{bike.name}</h3>
                      </div>
                    </div>
                    
                    {/* Card content with glass effect */}
                    <div className="p-5 bg-gradient-to-b from-slate-800/50 to-slate-900/80">
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="flex items-center gap-1.5 text-white/70 text-sm bg-white/5 rounded-lg px-2 py-1.5">
                          <Settings className="w-3.5 h-3.5 text-primary" />
                          <span>{bike.engine}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/70 text-sm bg-white/5 rounded-lg px-2 py-1.5">
                          <Bike className="w-3.5 h-3.5 text-primary" />
                          <span>{bike.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/70 text-sm bg-white/5 rounded-lg px-2 py-1.5">
                          <Fuel className="w-3.5 h-3.5 text-primary" />
                          <span>{bike.mileage}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(bike.price)}
                          </span>
                          <span className="text-white/50 text-sm">/day</span>
                        </div>
                        <button
                          onClick={() => handleWhatsAppBooking(bike.name, bike.price)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl transition-all duration-300 shadow-lg shadow-green-600/30 hover:shadow-green-500/40 hover:scale-105"
                        >
                          <Phone className="w-4 h-4" />
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-slate-800/30 border border-white/10 rounded-xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-white hover:text-primary py-5 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Explore?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Book your ride today and discover the beauty of Northeast India at your own pace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/918837317070?text=Hi!%20I'm%20interested%20in%20renting%20a%20vehicle%20from%20XTSY%20Rentals."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              WhatsApp: +91 88373 17070
            </a>
            <a
              href="tel:+918837317070"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-white/20 rounded-xl font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default XTSYRentals;
