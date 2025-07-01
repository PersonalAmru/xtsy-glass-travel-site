
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
          id: "dormitory-bed",
          name: "Dormitory Bed",
          price: 599,
          description: "Shared accommodation with modern amenities",
          features: ["Shared bathroom", "Wi-Fi", "Locker", "Common area"],
          maxGuests: 1,
          image: "" // Ready for Supabase Object URL
        },
        {
          id: "private-room-shared-bath",
          name: "Private Room (Shared Bath)",
          price: 1299,
          description: "Private room with shared bathroom facilities",
          features: ["Private room", "Shared bathroom", "Wi-Fi", "TV"],
          maxGuests: 2,
          image: "" // Ready for Supabase Object URL
        },
        {
          id: "private-room-attached-bath",
          name: "Private Room (Attached Bath)",
          price: 1799,
          description: "Private room with attached bathroom",
          features: ["Private room", "Attached bathroom", "Wi-Fi", "TV", "Hot water"],
          maxGuests: 2,
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
          id: "deluxe-room",
          name: "Deluxe Room",
          price: 2999,
          description: "Spacious room with premium amenities and valley views",
          features: ["King bed", "Valley view", "Mini bar", "Attached bath", "Wi-Fi", "TV"],
          maxGuests: 2,
          image: "" // Ready for Supabase Object URL
        },
        {
          id: "executive-suite",
          name: "Executive Suite",
          price: 4999,
          description: "Luxurious suite with separate living area and panoramic views",
          features: ["Separate living area", "Panoramic view", "Jacuzzi", "Mini bar", "Wi-Fi", "Premium amenities"],
          maxGuests: 4,
          image: "" // Ready for Supabase Object URL
        },
        {
          id: "presidential-suite",
          name: "Presidential Suite",
          price: 7999,
          description: "Ultimate luxury with private balcony and exclusive services",
          features: ["Private balcony", "Exclusive services", "Butler service", "Premium dining", "Spa access"],
          maxGuests: 4,
          image: "" // Ready for Supabase Object URL
        }
      ]
    }
  };

  const activePropertyData = properties[activeProperty as keyof typeof properties];

  return (
    <section id="rooms" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl animate-pulse"
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-serif-sans px-4">
            Our Properties
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto font-seasons px-4">
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
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl border-blue-400 scale-105 transform"
                  : "border-blue-300/60 text-white bg-slate-800/60 hover:bg-slate-700/80 hover:border-blue-400/80 hover:scale-105 hover:text-blue-200 backdrop-blur-sm"
              } font-seasons`}
            >
              {property.name}
            </Button>
          ))}
        </div>

        {/* Property Header */}
        <div className="text-center mb-8 sm:mb-12">
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 max-w-4xl mx-auto mx-3 sm:mx-auto">
            <CardHeader className="text-center">
              <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-6 flex items-center justify-center border border-gray-600">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">Main Property Image</p>
                  <p className="text-gray-500 text-xs">Ready for Supabase URL</p>
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 font-serif-sans">
                {activePropertyData.name}
              </CardTitle>
              <CardDescription className="text-gray-300 text-base sm:text-lg font-seasons">
                {activePropertyData.description}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-3 sm:px-0">
          {activePropertyData.rooms.map((room) => (
            <Card key={room.id} className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 flex items-center justify-center border border-gray-600">
                  <div className="text-center">
                    <TreePine className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                    <p className="text-gray-400 text-xs">Room Image</p>
                    <p className="text-gray-500 text-xs">Supabase Ready</p>
                  </div>
                </div>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg sm:text-xl font-bold text-white font-serif-sans">
                    {room.name}
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">
                    ₹{room.price}/night
                  </Badge>
                </div>
                <CardDescription className="text-gray-300 text-sm font-seasons">
                  {room.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-blue-300/60 text-blue-200 bg-blue-500/10">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Max {room.maxGuests} guests
                  </span>
                </div>
                
                <Button 
                  onClick={scrollToCalendar}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-seasons"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Common Amenities */}
        <div className="mt-12 sm:mt-16">
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 max-w-4xl mx-auto mx-3 sm:mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-4 font-serif-sans">
                Common Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
                <div className="flex flex-col items-center">
                  <Wifi className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mb-2" />
                  <span className="text-white text-xs sm:text-sm font-seasons">Free Wi-Fi</span>
                </div>
                <div className="flex flex-col items-center">
                  <Car className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mb-2" />
                  <span className="text-white text-xs sm:text-sm font-seasons">Parking</span>
                </div>
                <div className="flex flex-col items-center">
                  <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mb-2" />
                  <span className="text-white text-xs sm:text-sm font-seasons">Cafe</span>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mb-2" />
                  <span className="text-white text-xs sm:text-sm font-seasons">24/7 Security</span>
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
