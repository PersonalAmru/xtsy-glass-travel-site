
import { Wifi, Car, Coffee, Shield, Users, Gamepad2, Utensils, TreePine, Flame, Info, Eye, Droplets, CreditCard, Tv, Dumbbell, Zap, Mountain, UserCheck, Waves } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ServicesSection = () => {
  const amenities = [
    { icon: Mountain, name: "Mountain View" },
    { icon: CreditCard, name: "Card Payment Accepted" },
    { icon: Coffee, name: "Cafe" },
    { icon: Shield, name: "Storage Facility" },
    { icon: Waves, name: "Laundry Services (Extra)" },
    { icon: Wifi, name: "Free Wi-Fi" },
    { icon: Tv, name: "Common Television" },
    { icon: UserCheck, name: "Common hangout area" },
    { icon: Car, name: "Parking (private)" }
  ];

  return (
    <section id="services" className="py-16 sm:py-20 px-3 sm:px-4 bg-gray-50 relative overflow-hidden">
      {/* Enhanced background animations */}
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
        {/* Amenities Section - Clean Text-based Design */}
        <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-orange-200 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-serif-sans">
              Amenities
            </h2>
            <p className="text-gray-600 text-base sm:text-lg font-seasons max-w-2xl mx-auto">
              Enjoy a comprehensive range of modern amenities designed to make your stay comfortable and memorable
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 flex-shrink-0">
                  <amenity.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-gray-700 text-sm sm:text-base font-seasons font-medium">
                  {amenity.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
