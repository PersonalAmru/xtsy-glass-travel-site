
import { Sofa, Clock, ShoppingBag, Shirt, Wifi, Car, Coffee, Shield, Users, Gamepad2, Utensils, TreePine, Flame, Info, Eye, Droplets, CreditCard, Tv, Dumbbell, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ServicesSection = () => {
  const mainServices = [
    {
      icon: Sofa,
      title: "Common Lounge Access",
      description: "Relax, play games, enjoy music in our cozy common area",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Clock,
      title: "24/7 Travel Assistance",
      description: "Round-the-clock support for all your travel needs",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      icon: ShoppingBag,
      title: "In-House Convenience Store",
      description: "Everything you need right at your fingertips",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Shirt,
      title: "Laundry Services",
      description: "Professional laundry meets Guest satisfaction!",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const amenities = [
    { icon: Wifi, name: "Free Wi-Fi", emoji: "📶" },
    { icon: Coffee, name: "Cafe", emoji: "☕" },
    { icon: ShoppingBag, name: "Storage Facility", emoji: "🧳" },
    { icon: Shirt, name: "Laundry Service", emoji: "👕" },
    { icon: Sofa, name: "Common Lounge", emoji: "🛋️" },
    { icon: Gamepad2, name: "Games Room", emoji: "🎮" },
    { icon: Utensils, name: "CP Breakfast", emoji: "🍳" },
    { icon: Car, name: "Free Parking", emoji: "🚗" },
    { icon: Flame, name: "BBQ Area", emoji: "🔥" },
    { icon: Flame, name: "Bonfire", emoji: "🔥" },
    { icon: Info, name: "Tourist Info Centre", emoji: "ℹ️" },
    { icon: Shield, name: "Security", emoji: "🛡️" },
    { icon: Eye, name: "CCTV", emoji: "👁️" },
    { icon: Droplets, name: "Hot Water", emoji: "🚿" },
    { icon: CreditCard, name: "Card Payment", emoji: "💳" },
    { icon: Dumbbell, name: "In-house Activities", emoji: "🏋️" },
    { icon: Zap, name: "UPI Payment", emoji: "⚡" },
    { icon: Droplets, name: "Water Dispenser", emoji: "💧" },
    { icon: Car, name: "Public Parking", emoji: "🅿️" }
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
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-serif-sans px-4">
            ✨ Our Services
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-seasons px-4">
            Experience premium amenities and services designed for every traveler's comfort and convenience
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {mainServices.map((service, index) => (
            <Card key={index} className="bg-white border-2 border-gray-200 hover:border-orange-300 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-xl relative transform hover:rotate-3 transition-transform duration-300`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} rounded-2xl blur-lg opacity-50 scale-110`}></div>
                  <service.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white relative z-10 drop-shadow-lg" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 font-serif-sans">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base font-seasons">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Amenities Section - More Attractive Design */}
        <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-orange-200 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 font-serif-sans">
              🏠 Amenities & Facilities
            </h3>
            <p className="text-gray-600 text-base sm:text-lg font-seasons max-w-2xl mx-auto">
              Enjoy a comprehensive range of modern amenities designed to make your stay comfortable and memorable
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                  <amenity.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="text-center">
                  <span className="text-lg sm:text-xl mb-1 block">{amenity.emoji}</span>
                  <span className="text-gray-700 text-xs sm:text-sm font-seasons font-medium text-center leading-tight">
                    {amenity.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
