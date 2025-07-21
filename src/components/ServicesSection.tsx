
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wifi, 
  Car, 
  Coffee, 
  Utensils, 
  Shield, 
  Clock, 
  Headphones, 
  Zap, 
  Bath, 
  Wind, 
  Tv, 
  Gamepad2,
  MapPin,
  Users
} from "lucide-react";

const ServicesSection = () => {
  const amenities = [
    { name: "Free WiFi", icon: Wifi, description: "High-speed internet throughout the property" },
    { name: "Parking", icon: Car, description: "Secure parking space for vehicles" },
    { name: "Common Kitchen", icon: Utensils, description: "Fully equipped kitchen for guest use" },
    { name: "Cafe/Restaurant", icon: Coffee, description: "On-site dining options available" },
    { name: "24/7 Security", icon: Shield, description: "Round-the-clock security services" },
    { name: "24/7 Reception", icon: Clock, description: "Always available front desk support" },
    { name: "Tour Assistance", icon: Headphones, description: "Local tour booking and guidance" },
    { name: "Power Backup", icon: Zap, description: "Uninterrupted power supply" },
    { name: "Hot Water", icon: Bath, description: "24/7 hot water facility" },
    { name: "Air Conditioning", icon: Wind, description: "Climate control in rooms" },
    { name: "TV/Entertainment", icon: Tv, description: "Entertainment options in common areas" },
    { name: "Games Room", icon: Gamepad2, description: "Indoor games and recreational activities" },
    { name: "Lockers", icon: Shield, description: "Secure storage for valuables" },
    { name: "Laundry", icon: Bath, description: "Laundry and clothes washing facilities" },
    { name: "Travel Desk", icon: MapPin, description: "Travel planning and booking assistance" },
    { name: "Common Areas", icon: Users, description: "Comfortable spaces for socializing" }
  ];

  return (
    <section id="services" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-purple-100/30" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl mb-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 font-playfair">
              Amenities & Services
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            Everything you need for a comfortable and memorable stay at XTSY Travellers Hostel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity, index) => {
            const IconComponent = amenity.icon;
            return (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md h-full flex flex-col">
                <CardHeader className="text-center pb-3">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {amenity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <CardDescription className="text-gray-600 text-center flex-grow">
                    {amenity.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
