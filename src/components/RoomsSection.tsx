import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

const RoomsSection = () => {
  const [selectedProperty, setSelectedProperty] = useState("travellers");
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [imageLoading, setImageLoading] = useState({});

  const roomImages = {
    "8_bed": [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/8%20Bed%20Mixed%20Only%20Dormitory/P1010829",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/8%20Bed%20Mixed%20Only%20Dormitory/DJI_20250324_131142_044.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/8%20Bed%20Mixed%20Only%20Dormitory/DJI_20250324_130847_967.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/8%20Bed%20Mixed%20Only%20Dormitory/DJI_20250324_130837_977.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/8%20Bed%20Mixed%20Only%20Dormitory/DJI_20250324_125319_178.jpg"
    ],
    "6_bed": [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/6%20Bed%20Female%20Mixed%20Dormitory/DJI_20250324_131232_671.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/6%20Bed%20Female%20Mixed%20Dormitory/DJI_20250324_130158_955.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/6%20Bed%20Female%20Mixed%20Dormitory/DJI_20250324_130439_199.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/6%20Bed%20Female%20Mixed%20Dormitory/IMG_3962.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/6%20Bed%20Female%20Mixed%20Dormitory/IMG_4075.jpg"
    ],
    "4_bed_mixed": [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/4%20Bed%20Female%20Mixed%20Dormitory/DJI_20250324_131312_363.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/4%20Bed%20Female%20Mixed%20Dormitory/P1010848.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/4%20Bed%20Female%20Mixed%20Dormitory/P1010834.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/4%20Bed%20Female%20Mixed%20Dormitory/P1010879.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/4%20Bed%20Female%20Mixed%20Dormitory/IMG_4079.jpg"
    ],
    "4_bed_female": [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/4%20Bed%20Female%20Only%20Dormitory/DJI_20250324_130728_735.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/4%20Bed%20Female%20Only%20Dormitory/DJI_20250324_131640_522.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/4%20Bed%20Female%20Only%20Dormitory/IMG_3956.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/4%20Bed%20Female%20Only%20Dormitory/P1010930.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Travellers%20Hostel/4%20Bed%20Female%20Only%20Dormitory/IMG_4076.jpg"
    ],
    "king_double": [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Luxury/King%20Double%20Room/DJI_20250324_124855_713.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Luxury/King%20Double%20Room/DJI_20250324_124356_487.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Luxury/King%20Double%20Room/DJI_20250614_125720_138.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Luxury/King%20Double%20Room/IMG_4077.jpg"
    ],
    "king_triple": [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Luxury/King%20Triple%20Room/image%20triple%20room.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Luxury/King%20Triple%20Room/IMG_4074.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Luxury/King%20Triple%20Room/DJI_20250614_130117_662.JPG",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/XTSY%20Luxury/King%20Triple%20Room/IMG_4076.jpg"
    ],
    "glass_sky": []
  };

  const roomTypes = {
    travellers: [
      {
        id: "8_bed",
        name: "Bed In 8 Bed Mixed Dormitory",
        price: 555,
        capacity: 8,
        type: "Mixed",
        amenities: ["XL Comfy Beds", "Reading lights", "Charging point", "Attached Bathroom", "High speed Wi-Fi", "Hot Water", "Locker", "Balcony", "Toiletries"],
        images: roomImages["8_bed"]
      },
      {
        id: "6_bed",  
        name: "Bed In 6 Bed Female/Mixed Dormitory",
        price: 666,
        capacity: 6,
        type: "Female/Mixed",
        amenities: ["XL Comfy Beds", "Reading lights", "Charging point", "Attached Bathroom", "High speed Wi-Fi", "Hot Water", "Locker", "Balcony", "Toiletries"],
        images: roomImages["6_bed"]
      },
      {
        id: "4_bed_mixed",
        name: "Bed In 4 Bed Female/Mixed Dormitory",
        price: 777,
        capacity: 4,
        type: "Female/Mixed",
        amenities: ["XL Comfy Beds", "Reading lights", "Charging point", "Attached Bathroom", "High speed Wi-Fi", "Hot Water", "Locker", "Balcony", "Toiletries"],
        images: roomImages["4_bed_mixed"]
      },
      {
        id: "4_bed_female",
        name: "Bed In 4 Bed Female Dormitory",
        price: 888,
        capacity: 4,
        type: "Female Only",
        amenities: ["XL Comfy Beds", "Reading lights", "Charging point", "Attached Bathroom", "High speed Wi-Fi", "Hot Water", "Locker", "Balcony", "Toiletries"],
        images: roomImages["4_bed_female"]
      }
    ],
    luxury: [
      {
        id: "king_double",
        name: "King Double Room",
        price: 3333,
        capacity: 2,
        type: "Private",
        amenities: ["Charging point", "Attached Bathroom", "High speed Wi-Fi", "Privacy", "Hot Water", "Mountain View", "River View (Seasonal)", "Kettle", "Toiletries", "Seating Area"],
        images: roomImages["king_double"]
      },
      {
        id: "king_triple",
        name: "King Triple Room",
        price: 4444,
        capacity: 3,
        type: "Private",
        amenities: ["Charging point", "Attached Bathroom", "High speed Wi-Fi", "Privacy", "Hot Water", "Mountain View", "River View (Seasonal)", "Kettle", "Toiletries", "Seating Area"],
        images: roomImages["king_triple"]
      },
      {
        id: "glass_sky",
        name: "Glass Sky Suite",
        price: 18999,
        capacity: 2,
        type: "Premium Suite",
        amenities: ["Charging point", "Attached Bathroom", "High speed Wi-Fi", "Privacy", "Hot Water", "Mountain View", "River View (Seasonal)", "Kettle", "Toiletries", "Seating Area"],
        images: roomImages["glass_sky"],
        comingSoon: true
      }
    ]
  };

  // Auto-cycling images effect with smooth fade
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const newIndex = {};
        Object.keys(roomImages).forEach(roomId => {
          const room = [...roomTypes.travellers, ...roomTypes.luxury].find(r => r.id === roomId);
          if (room && room.images.length > 0) {
            setImageLoading(prevLoading => ({ ...prevLoading, [roomId]: true }));
            newIndex[roomId] = ((prev[roomId] || 0) + 1) % room.images.length;
          }
        });
        return { ...prev, ...newIndex };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextImage = (roomId) => {
    const room = [...roomTypes.travellers, ...roomTypes.luxury].find(r => r.id === roomId);
    if (room && room.images.length > 0) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [roomId]: ((prev[roomId] || 0) + 1) % room.images.length
      }));
    }
  };

  const prevImage = (roomId) => {
    const room = [...roomTypes.travellers, ...roomTypes.luxury].find(r => r.id === roomId);
    if (room && room.images.length > 0) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [roomId]: ((prev[roomId] || 0) - 1 + room.images.length) % room.images.length
      }));
    }
  };

  const scrollToBooking = () => {
    const element = document.getElementById('home');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="rooms" className="py-20 px-4 bg-gradient-to-br from-yellow-400/10 via-orange-400/15 to-red-400/10 relative overflow-hidden">
      {/* Enhanced tropical background animations */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 bg-gradient-to-r from-yellow-400/15 to-orange-400/15 rounded-full blur-xl animate-pulse"
            style={{
              left: `${5 + i * 12}%`,
              bottom: `${10 + i * 12}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${3.5 + i * 0.4}s`
            }}
          />
        ))}
        {/* Palm leaf shadows */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-2xl animate-bounce"
              style={{
                right: `${5 + i * 30}%`,
                top: `${10 + i * 25}%`,
                animationDelay: `${i * 1.2}s`,
                animationDuration: `${5 + i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent font-serif-sans">
            Our Properties
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-seasons">
            Choose from our comfortable accommodations designed for every type of traveler
          </p>

          {/* Enhanced Property Selector */}
          <div className="flex justify-center gap-4 mb-12">
            <Button
              variant={selectedProperty === "travellers" ? "default" : "outline"}
              onClick={() => setSelectedProperty("travellers")}
              className={`px-8 py-4 font-bold transition-all duration-300 text-base border-2 font-seasons ${
                selectedProperty === "travellers"
                  ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-xl border-teal-400 scale-105 transform"
                  : "border-teal-300/60 text-white bg-slate-800/60 hover:bg-slate-700/80 hover:border-teal-400/80 hover:scale-105 hover:text-teal-200 backdrop-blur-sm"
              }`}
            >
              XTSY Travellers Hostel
            </Button>
            <Button
              variant={selectedProperty === "luxury" ? "default" : "outline"}
              onClick={() => setSelectedProperty("luxury")}
              className={`px-8 py-4 font-bold transition-all duration-300 text-base border-2 font-seasons ${
                selectedProperty === "luxury"
                  ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-xl border-teal-400 scale-105 transform"
                  : "border-teal-300/60 text-white bg-slate-800/60 hover:bg-slate-700/80 hover:border-teal-400/80 hover:scale-105 hover:text-teal-200 backdrop-blur-sm"
              }`}
            >
              XTSY Luxury
            </Button>
          </div>
        </div>

        {/* Room Cards */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
            {roomTypes[selectedProperty].map((room, index) => (
              <Card 
                key={index} 
                className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 overflow-hidden group hover:scale-105 transform-gpu shadow-2xl"
              >
                {/* Room Image with Enhanced Fade Effect */}
                <div className="h-48 relative overflow-hidden">
                  {room.comingSoon && room.id === "glass_sky" ? (
                    <div className="bg-gradient-to-br from-purple-700 to-indigo-600 flex items-center justify-center h-full relative">
                      <div className="text-white text-center">
                        <div className="text-3xl font-bold mb-2 font-serif-sans">Glass Sky Suite</div>
                        <Badge className="bg-yellow-500 text-black font-bold px-4 py-2 text-lg">
                          Coming Soon
                        </Badge>
                      </div>
                    </div>
                  ) : room.images.length > 0 ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={room.images[currentImageIndex[room.id] || 0]}
                        alt={room.name}
                        className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${
                          imageLoading[room.id] ? 'opacity-0' : 'opacity-100'
                        }`}
                        style={{ 
                          transition: 'opacity 1s ease-in-out, transform 0.3s ease'
                        }}
                        onLoad={() => {
                          setImageLoading(prev => ({ ...prev, [room.id]: false }));
                        }}
                        onLoadStart={() => {
                          setImageLoading(prev => ({ ...prev, [room.id]: true }));
                        }}
                      />
                      
                      {/* Manual Navigation Buttons */}
                      {room.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage(room.id);
                            }}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all duration-200 z-10"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage(room.id);
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full transition-all duration-200 z-10"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {/* Image Dots Indicator */}
                      {room.images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
                          {room.images.map((_, imgIndex) => (
                            <div
                              key={imgIndex}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                (currentImageIndex[room.id] || 0) === imgIndex 
                                  ? 'bg-white' 
                                  : 'bg-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center h-full">
                      <div className="text-gray-400 text-center">
                        <div className="w-16 h-16 mx-auto mb-2 bg-white/10 rounded-lg flex items-center justify-center">
                          <Users className="h-8 w-8" />
                        </div>
                        <p className="text-sm font-seasons">Room images will appear here</p>
                      </div>
                    </div>
                  )}
                </div>

                <CardHeader className="text-center">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold text-white flex-1 text-left font-serif-sans">
                      {room.name}
                    </CardTitle>
                    {room.comingSoon && room.id === "glass_sky" && (
                      <Badge className="bg-yellow-500 text-black font-bold">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-300 text-center font-seasons">
                    {room.type} • {room.capacity} guests
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {room.amenities.map((amenity, i) => (
                        <Badge key={i} variant="outline" className="border-white/20 text-gray-300 text-xs font-seasons">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white font-serif-sans">₹{room.price}</span>
                      <span className="text-gray-400 text-sm font-seasons">/night</span>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold transition-all duration-300 transform hover:scale-105 font-seasons"
                      onClick={scrollToBooking}
                      disabled={room.comingSoon && room.id === "glass_sky"}
                    >
                      {room.comingSoon && room.id === "glass_sky" ? "Coming Soon" : "Book Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;
