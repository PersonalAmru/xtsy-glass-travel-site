
import { MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PropertySection from "./PropertySection";

const RoomsSection = () => {
  const scrollToCalendar = () => {
    const element = document.querySelector('#home');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const checkInInput = document.querySelector('input[type="date"]') as HTMLInputElement;
        if (checkInInput) {
          checkInInput.focus();
        }
      }, 1000);
    }
  };

  const hostelRooms = [
    {
      id: "4-bed-female-only-dorm",
      name: "Bed in 4 Bed Female Only Dorm",
      price: 850,
      description: "Female-only dormitory with modern amenities",
      features: ["Female only", "Shared bathroom", "Wi-Fi", "Locker", "Common area"],
      maxGuests: 4,
      maxRooms: 1,
      image: ""
    },
    {
      id: "4-bed-mixed-female-dorm",
      name: "Bed in 4 Bed Mixed/Female Dorm", 
      price: 800,
      description: "Mixed or female dormitory with shared facilities",
      features: ["Mixed/Female", "Shared bathroom", "Wi-Fi", "Locker", "Common area"],
      maxGuests: 4,
      maxRooms: 1,
      image: ""
    },
    {
      id: "6-bed-mixed-female-dorm",
      name: "Bed in 6 Bed Mixed/Female Dorm",
      price: 700,
      description: "Spacious mixed or female dormitory",
      features: ["Mixed/Female", "Shared bathroom", "Wi-Fi", "Locker", "Common area"],
      maxGuests: 30,
      maxRooms: 5,
      image: ""
    },
    {
      id: "8-bed-mixed-dorm",
      name: "Bed in 8 Bed Mixed Dorm",
      price: 600,
      description: "Large mixed dormitory for budget travelers",
      features: ["Mixed dorm", "Shared bathroom", "Wi-Fi", "Locker", "Common area"],
      maxGuests: 8,
      maxRooms: 1,
      image: ""
    }
  ];

  const luxuryRooms = [
    {
      id: "king-double-room",
      name: "King Double Room",
      price: 3200,
      description: "Spacious room with king bed for two guests",
      features: ["King bed", "Valley view", "Attached bath", "Wi-Fi", "Premium amenities"],
      maxGuests: 4,
      maxRooms: 2,
      image: ""
    },
    {
      id: "king-triple-room",
      name: "King Triple Room",
      price: 4200,
      description: "Luxurious room accommodating up to three guests",
      features: ["King bed + extra bed", "Panoramic view", "Attached bath", "Wi-Fi", "Premium amenities"],
      maxGuests: 3,
      maxRooms: 1,
      image: ""
    },
    {
      id: "signature-270-glass-suite",
      name: "Signature 270° Glass Suite",
      price: 18000,
      description: "Premium suite with 270-degree panoramic views and luxury amenities",
      features: ["270° Panoramic view", "Luxury amenities", "Attached bath", "Wi-Fi", "Premium service"],
      maxGuests: 2,
      maxRooms: 1,
      image: ""
    }
  ];

  return (
    <section id="rooms" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-purple-100/30" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
      
      {/* Floating background animations */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-xl animate-pulse"
            style={{
              left: `${5 + i * 12}%`,
              top: `${15 + i * 10}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-block p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 font-playfair">
              Our Properties
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            Choose from our range of premium accommodations designed for every traveler's needs and budget!
          </p>
        </div>

        {/* Main Property Display */}
        <div className="text-center mb-8 sm:mb-12">
          <Card className="bg-white border border-gray-200 shadow-lg max-w-4xl mx-auto mx-3 sm:mx-auto">
            <CardHeader className="text-center">
              <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-6 flex items-center justify-center border border-gray-300">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Main Property Image</p>
                  <p className="text-gray-400 text-xs">Ready for Supabase URL</p>
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 font-serif-sans">
                Live the Shillong Vibe
              </CardTitle>
              <CardDescription className="text-gray-600 text-base sm:text-lg font-seasons">
                Experience both budget-friendly hostel stays and premium luxury accommodations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* XTSY Travellers Hostel Section */}
        <PropertySection
          title="XTSY Travellers Hostel"
          description="Budget-friendly accommodation in the heart of Shillong with modern amenities and vibrant community spaces"
          rooms={hostelRooms}
          propertyType="hostel"
          onSelectRoom={scrollToCalendar}
        />

        {/* XTSY Luxury Section */}
        <PropertySection
          title="XTSY Luxury"
          description="Premium accommodation with breathtaking views, luxury amenities, and exceptional service for discerning travelers"
          rooms={luxuryRooms}
          propertyType="luxury"
          onSelectRoom={scrollToCalendar}
        />
      </div>

      <style>
        {`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        `}
      </style>
    </section>
  );
};

export default RoomsSection;
