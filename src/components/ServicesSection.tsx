
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
    <section id="services" className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 via-transparent to-teal-100/30" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-200/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-200/30 rounded-full blur-3xl" />
      
      {/* Enhanced background animations */}
      <div className="absolute inset-0">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="absolute w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-r from-green-300/20 to-teal-300/20 rounded-full blur-xl animate-pulse"
            style={{
              left: `${8 + i * 13}%`,
              top: `${12 + i * 11}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${3.5 + i * 0.4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Amenities Section - Enhanced Design */}
        <div className="bg-gradient-to-br from-white/95 to-green-50/80 border-3 border-green-300 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl mb-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent mb-4">
                🏨 Amenities 🌟
              </h2>
              <div className="w-28 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full" />
            </div>
            <p className="text-gray-700 text-lg sm:text-xl max-w-3xl mx-auto bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              ✨ Enjoy a comprehensive range of modern amenities designed to make your stay comfortable and memorable! 🏠
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
