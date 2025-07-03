import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Wifi, Car, Coffee, Utensils, Shield, TreePine } from "lucide-react";

const RoomsSection = () => {
  const [activeProperty, setActiveProperty] = useState("hostel");

  const scrollToCalendar = () => {
    const element = document.querySelector('#home');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Focus on the booking form after scrolling
      setTimeout(() => {
        const checkInInput = document.querySelector('input[type="date"]') as HTMLInputElement;
        if (checkInInput) {
          checkInInput.focus();
        }
      }, 1000);
    }
  };

  const properties = {
    hostel: {
      name: "XTSY Travellers Hostel",
      description: "Budget-friendly accommodation in the heart of Shillong",
      image: "", // Ready for Supabase Object URL
      rooms: [
        {
          id: "4-bed-female-only-dorm",
          name: "4 Bed Female Only Dorms",
          price: 850,
          description: "Female-only dormitory with modern amenities",
          features: ["Female only", "Shared bathroom", "Wi-Fi", "Locker", "Common area"],
          maxGuests: 1,
          image: "" // Ready for Supabase Object URL
        },
        {
          id: "4-bed-mixed-female-dorm",
          name: "4 Bed Mixed/Female Dorms",
          price: 800,
          description: "Mixed or female dormitory with shared facilities",
          features: ["Mixed/Female", "Shared bathroom", "Wi-Fi", "Locker", "Common area"],
          maxGuests: 1,
          image: "" // Ready for Supabase Object URL
        },
        {
          id: "6-bed-mixed-female-dorm",
          name: "6 Bed Mixed/Female Dorms",
          price: 700,
          description: "Spacious mixed or female dormitory",
          features: ["Mixed/Female", "Shared bathroom", "Wi-Fi", "Locker", "Common area"],
          maxGuests: 1,
          image: "" // Ready for Supabase Object URL
        },
        {
          id: "8-bed-mixed-dorm",
          name: "8 Bed Mixed Dorms",
          price: 600,
          description: "Large mixed dormitory for budget travelers",
          features: ["Mixed dorm", "Shared bathroom", "Wi-Fi", "Locker", "Common area"],
          maxGuests: 1,
          image: "" // Ready for Supabase Object URL
        }
      ]
    },
    luxury: {
      name: "XTSY Luxury",
      description: "Premium accommodation with modern amenities and scenic views",
      image: "", // Ready for Supabase Object URL
      rooms: [
        {
          id: "king-double-room",
          name: "King Double Room",
          price: 3200,
          description: "Spacious room with king bed for two guests",
          features: ["King bed", "Valley view", "Mini bar", "Attached bath", "Wi-Fi", "TV"],
          maxGuests: 2,
          image: "" // Ready for Supabase Object URL
        },
        {
          id: "king-triple-room",
          name: "King Triple Room",
          price: 4200,
          description: "Luxurious room accommodating up to three guests",
          features: ["King bed + extra bed", "Panoramic view", "Mini bar", "Attached bath", "Wi-Fi", "Premium amenities"],
          maxGuests: 3,
          image: "" // Ready for Supabase Object URL
        }
      ]
    }
  };

  const activePropertyData = properties[activeProperty as keyof typeof properties];

  return (
    <section id="rooms" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-gray-50 relative overflow-hidden">
      {/* Background animations - subtle gray tones */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-gray-200/20 to-orange-200/20 rounded-full blur-xl animate-pulse"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 12}%`,
              animationDelay: `${i * 1}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-serif-sans px-4">
            Our Properties
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-seasons px-4">
            Choose from our range of accommodations designed for every traveler's needs and budget
          </p>
        </div>

        {/* Property Toggle Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
          {Object.entries(properties).map(([key, property]) => (
            <Button
              key={key}
              variant={activeProperty === key ? "default" : "outline"}
              onClick={() => setActiveProperty(key)}
              className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 font-bold transition-all duration-300 text-sm sm:text-base border-2 w-full sm:w-auto ${
                activeProperty === key
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl border-orange-400 scale-105 transform"
                  : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-orange-400 hover:scale-105 hover:text-orange-600"
              } font-seasons`}
            >
              {property.name}
            </Button>
          ))}
        </div>

        {/* Property Header */}
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
                {activePropertyData.name}
              </CardTitle>
              <CardDescription className="text-gray-600 text-base sm:text-lg font-seasons">
                {activePropertyData.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-3 sm:px-0">
          {activePropertyData.rooms.map((room) => (
            <Card key={room.id} className="bg-white border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md">
              <CardHeader className="pb-3">
                <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center border border-gray-300">
                  <div className="text-center">
                    <TreePine className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                    <p className="text-gray-500 text-xs">Room Image</p>
                    <p className="text-gray-400 text-xs">Supabase Ready</p>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 font-serif-sans">
                    {room.name}
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">
                    ₹{room.price}/night
                  </Badge>
                </div>
                <CardDescription className="text-gray-600 text-sm font-seasons">
                  {room.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-orange-300 text-orange-600 bg-orange-50">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Max {room.maxGuests} guests
                  </span>
                </div>
                
                <Button 
                  onClick={scrollToCalendar}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-seasons"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Common Amenities */}
        <div className="mt-12 sm:mt-16">
          <Card className="bg-white border border-gray-200 shadow-lg max-w-4xl mx-auto mx-3 sm:mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 font-serif-sans">
                Common Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Wifi className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mb-2" />
                  <span className="text-gray-700 text-xs sm:text-sm font-seasons">Free Wi-Fi</span>
                </div>
                <div className="flex flex-col items-center">
                  <Car className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mb-2" />
                  <span className="text-gray-700 text-xs sm:text-sm font-seasons">Parking</span>
                </div>
                <div className="flex flex-col items-center">
                  <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mb-2" />
                  <span className="text-gray-700 text-xs sm:text-sm font-seasons">Cafe</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 mb-2" />
                  <span className="text-gray-700 text-xs sm:text-sm font-seasons">24/7 Security</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;
