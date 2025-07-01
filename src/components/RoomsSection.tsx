
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RoomsSection = () => {
  const [activeTab, setActiveTab] = useState("travellers-hostel");

  const roomTypes = [
    {
      id: "travellers-hostel",
      name: "XTSY Travellers Hostel",
      description: "Budget-friendly accommodation perfect for backpackers and solo travelers",
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/Hostel/IMG_4087.JPG",
      features: ["Dormitories", "Common Lounges", "Free Wi-Fi", "Shared Kitchen", "Community Atmosphere"],
      rooms: [
        {
          name: "Bed In 8 Bed Mixed Dormitory",
          price: "₹800",
          capacity: "1 Room - 8 Guests",
          image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
          features: ["8 Bunk Beds", "Mixed Gender", "Shared Bathroom", "Lockers", "Common Area Access"]
        },
        {
          name: "Bed In 6 Bed Female/Mixed Dormitory",
          price: "₹900",
          capacity: "5 Rooms - 30 Guests",
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
          features: ["6 Bunk Beds", "Female/Mixed Gender", "Shared Bathroom", "Personal Lockers", "Reading Lights"]
        },
        {
          name: "Bed In 4 Bed Female/Mixed Dormitory",
          price: "₹1,100",
          capacity: "1 Room - 4 Guests",
          image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
          features: ["4 Bunk Beds", "Female/Mixed Gender", "Shared Bathroom", "Storage Space", "AC Available"]
        },
        {
          name: "Bed In 4 Bed Female Dormitory",
          price: "₹1,200",
          capacity: "1 Room - 4 Guests",
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80",
          features: ["4 Bunk Beds", "Female Only", "Private Bathroom", "Individual Lockers", "Enhanced Privacy"]
        }
      ]
    },
    {
      id: "luxury",
      name: "XTSY Luxury",
      description: "Premium hospitality experience with stunning mountain views",
      image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Rooms/Luxury/luxury-suite-1.jpg",
      features: ["Private Rooms", "Mountain Views", "Premium Amenities", "Concierge Service"],
      rooms: [
        {
          name: "Sky Glass Suite",
          price: "₹4,999",
          capacity: "2 Guests",
          image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
          features: ["King Size Bed", "Glass Ceiling", "Mountain View", "Private Balcony", "Luxury Bathroom"]
        },
        {
          name: "Valley View Suite",
          price: "₹3,999", 
          capacity: "2 Guests",
          image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
          features: ["Queen Size Bed", "Valley View", "Private Balcony", "Work Desk", "Premium Amenities"]
        },
        {
          name: "Garden Villa",
          price: "₹5,999",
          capacity: "4 Guests", 
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
          features: ["Two Bedrooms", "Private Garden", "Living Area", "Kitchenette", "Luxury Furnishing"]
        }
      ]
    }
  ];

  const activeRoomType = roomTypes.find(roomType => roomType.id === activeTab);

  return (
    <section id="rooms" className="py-20 px-4 bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 relative overflow-hidden">
      {/* Enhanced tropical background animations */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-28 h-28 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-xl animate-pulse"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + i * 12}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.3}s`
            }}
          />
        ))}
        {/* Palm leaf effects */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-20 h-20 bg-gradient-to-br from-fuchsia-400/40 to-purple-500/40 rounded-full blur-2xl animate-bounce"
              style={{
                right: `${8 + i * 22}%`,
                bottom: `${12 + i * 18}%`,
                animationDelay: `${i * 1.1}s`,
                animationDuration: `${5 + i * 0.4}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-serif-sans">
            Our Properties
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-seasons">
            Experience comfort and luxury in the heart of Shillong
          </p>
        </div>

        {/* Enhanced Tab Toggle Buttons - Services Section Style */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {roomTypes.map((roomType) => (
            <Button
              key={roomType.id}
              variant={activeTab === roomType.id ? "default" : "outline"}
              onClick={() => setActiveTab(roomType.id)}
              className={`px-6 py-3 font-bold transition-all duration-300 text-sm border-2 font-seasons ${
                activeTab === roomType.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-xl border-purple-400 scale-105 transform"
                  : "border-purple-300/60 text-white bg-slate-800/60 hover:bg-slate-700/80 hover:border-purple-400/80 hover:scale-105 hover:text-purple-200 backdrop-blur-sm"
              }`}
            >
              {roomType.name}
            </Button>
          ))}
        </div>

        {/* Active Room Type Content */}
        {activeRoomType && (
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 max-w-5xl mx-auto transform hover:scale-105 transition-all duration-300 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="relative">
                <img
                  src={activeRoomType.image}
                  alt={activeRoomType.name}
                  className="w-full h-64 object-cover rounded-2xl shadow-xl"
                />
              </div>
              <CardTitle className="text-3xl font-bold text-white mt-4 font-serif-sans">
                {activeRoomType.name}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg font-seasons">
                {activeRoomType.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-3 font-serif-sans">Features</h4>
                <ul className="list-disc list-inside text-gray-300 text-sm font-seasons">
                  {activeRoomType.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              {/* Room Details */}
              {activeRoomType.rooms && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeRoomType.rooms.map((room, index) => (
                    <Card key={index} className="bg-black/20 backdrop-blur-md border border-white/10">
                      <CardHeader className="text-center">
                        <div className="relative">
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-48 object-cover rounded-2xl shadow-md"
                          />
                        </div>
                        <CardTitle className="text-xl font-bold text-white mt-3 font-serif-sans">
                          {room.name}
                        </CardTitle>
                        <CardDescription className="text-gray-300 text-sm font-seasons">
                          {room.capacity} • {room.price}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside text-gray-300 text-sm font-seasons">
                          {room.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="text-center">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105 font-seasons">
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default RoomsSection;
