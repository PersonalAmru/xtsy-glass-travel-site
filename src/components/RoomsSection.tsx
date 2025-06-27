
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";

const RoomsSection = () => {
  const [selectedProperty, setSelectedProperty] = useState("travellers");
  const [hoveredRoom, setHoveredRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const roomImages = {
    "8_bed": [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/8%20Bed%20Mixed%20Only%20Dormitory/DJI_20250324_131232_671.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/8%20Bed%20Mixed%20Only%20Dormitory/DJI_20250324_131142_044.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/8%20Bed%20Mixed%20Only%20Dormitory/DJI_20250324_130847_967.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/8%20Bed%20Mixed%20Only%20Dormitory/DJI_20250324_125319_178.jpg"
    ],
    "6_bed": [
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/6%20Bed%20Female%20Mixed%20Dormitory/DJI_20250324_131312_363.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/6%20Bed%20Female%20Mixed%20Dormitory/DJI_20250324_130158_955.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/6%20Bed%20Female%20Mixed%20Dormitory/DJI_20250324_130439_199.jpg",
      "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/6%20Bed%20Female%20Mixed%20Dormitory/IMG_3962.JPG"
    ]
  };

  const roomTypes = {
    travellers: [
      {
        id: "8_bed",
        name: "8 Bed Mixed Only Dormitory",
        price: 555,
        capacity: 8,
        type: "Mixed",
        amenities: ["Free WiFi", "AC", "Lockers", "Common Area"],
        availability: 3,
        images: roomImages["8_bed"]
      },
      {
        id: "6_bed",
        name: "6 Bed Female/Mixed Dormitory",
        price: 666,
        capacity: 6,
        type: "Female/Mixed",
        amenities: ["Free WiFi", "AC", "Lockers", "Private Bathroom"],
        availability: 2,
        images: roomImages["6_bed"]
      },
      {
        id: "4_bed",
        name: "4 Bed Female/Mixed Dormitory",
        price: 777,
        capacity: 4,
        type: "Female/Mixed",
        amenities: ["Free WiFi", "AC", "Lockers", "Premium Bedding"],
        availability: 1,
        images: []
      }
    ],
    luxury: [
      {
        id: "king_double",
        name: "King Double Room",
        price: 3333,
        capacity: 2,
        type: "Private",
        amenities: ["King Bed", "Private Bathroom", "AC", "Mini Fridge", "Balcony"],
        availability: 2,
        images: []
      },
      {
        id: "king_triple",
        name: "King Triple Room",
        price: 4444,
        capacity: 3,
        type: "Private",
        amenities: ["King Bed", "Single Bed", "Private Bathroom", "AC", "Sea View"],
        availability: 1,
        images: []
      }
    ]
  };

  const nextImage = (roomId) => {
    const room = roomTypes[selectedProperty].find(r => r.id === roomId);
    if (room && room.images.length > 0) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [roomId]: ((prev[roomId] || 0) + 1) % room.images.length
      }));
    }
  };

  const prevImage = (roomId) => {
    const room = roomTypes[selectedProperty].find(r => r.id === roomId);
    if (room && room.images.length > 0) {
      setCurrentImageIndex(prev => ({
        ...prev,
        [roomId]: ((prev[roomId] || 0) - 1 + room.images.length) % room.images.length
      }));
    }
  };

  return (
    <section id="rooms" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            Our Rooms
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Choose from our comfortable accommodations designed for every type of traveler
          </p>

          {/* Property Selector - Center Aligned */}
          <div className="flex justify-center gap-4 mb-12">
            <Button
              variant={selectedProperty === "travellers" ? "default" : "outline"}
              onClick={() => setSelectedProperty("travellers")}
              className={selectedProperty === "travellers" 
                ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white" 
                : "border-white/20 text-gray-300 hover:bg-white/10"
              }
            >
              XTSY Travellers Hostel
            </Button>
            <Button
              variant={selectedProperty === "luxury" ? "default" : "outline"}
              onClick={() => setSelectedProperty("luxury")}
              className={selectedProperty === "luxury" 
                ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white" 
                : "border-white/20 text-gray-300 hover:bg-white/10"
              }
            >
              XTSY Luxury
            </Button>
          </div>
        </div>

        {/* Room Cards - Center Aligned Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
            {roomTypes[selectedProperty].map((room, index) => (
              <Card 
                key={index} 
                className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 overflow-hidden group hover:scale-105"
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
              >
                {/* Room Image with Collage */}
                <div className="h-48 relative overflow-hidden">
                  {room.images.length > 0 ? (
                    <div className="relative w-full h-full">
                      <img 
                        src={room.images[currentImageIndex[room.id] || 0]}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      
                      {/* Image Navigation Overlay */}
                      {hoveredRoom === room.id && room.images.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-between px-2 bg-black/20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage(room.id);
                            }}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4 text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage(room.id);
                            }}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          >
                            <ChevronRight className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      )}
                      
                      {/* Image Dots Indicator */}
                      {room.images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
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
                        <p className="text-sm">Room images will appear here</p>
                        <p className="text-xs">from Supabase bucket</p>
                      </div>
                    </div>
                  )}
                </div>

                <CardHeader className="text-center">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-bold text-white flex-1 text-left">
                      {room.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-teal-500/20 text-teal-300">
                      {room.availability} available
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300 text-center">
                    {room.type} • {room.capacity} guests
                  </CardDescription>
                </CardHeader>

                <CardContent className="text-center">
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {room.amenities.map((amenity, i) => (
                        <Badge key={i} variant="outline" className="border-white/20 text-gray-300 text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">₹{room.price}</span>
                      <span className="text-gray-400 text-sm">/night</span>
                    </div>
                    <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white">
                      Book Now
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
