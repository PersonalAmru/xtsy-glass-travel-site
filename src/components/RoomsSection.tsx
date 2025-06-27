
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

const RoomsSection = () => {
  const [selectedProperty, setSelectedProperty] = useState("travellers");

  const roomTypes = {
    travellers: [
      {
        name: "8 Bed Mixed Dormitory",
        price: 555,
        capacity: 8,
        type: "Mixed",
        amenities: ["Free WiFi", "AC", "Lockers", "Common Area"],
        availability: 3,
        images: []
      },
      {
        name: "6 Bed Female/Mixed Dormitory",
        price: 666,
        capacity: 6,
        type: "Female/Mixed",
        amenities: ["Free WiFi", "AC", "Lockers", "Private Bathroom"],
        availability: 2,
        images: []
      },
      {
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
        name: "King Double Room",
        price: 3333,
        capacity: 2,
        type: "Private",
        amenities: ["King Bed", "Private Bathroom", "AC", "Mini Fridge", "Balcony"],
        availability: 2,
        images: []
      },
      {
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
              <Card key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 overflow-hidden group hover:scale-105">
                {/* Room Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-white/10 rounded-lg flex items-center justify-center">
                      <Users className="h-8 w-8" />
                    </div>
                    <p className="text-sm">Room images will appear here</p>
                    <p className="text-xs">from Supabase bucket</p>
                  </div>
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
