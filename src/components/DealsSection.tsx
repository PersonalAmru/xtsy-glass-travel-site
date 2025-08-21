
import { useState } from "react";
import { Car, Tag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DealsSection = () => {
  const [activeTab, setActiveTab] = useState("xtsy10");

  const deals = [
    {
      id: "xtsy10",
      icon: Tag,
      title: "XTSY10 - 10% Discount",
      description: "Min 4 guests, 4 beds, 2+ nights",
      details: "Get 10% discount on your booking! Minimum requirements: 4 guests, room selection of minimum 4 beds for 2 nights or more. Use coupon code 'XTSY10' during booking.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: "welcome15",
      icon: Tag,
      title: "WELCOME15 - 15% Discount",
      description: "Exclusive for 270° Panorama Glass Ensuite",
      details: "Get 15% discount exclusively for XTSY Luxury '270° Panorama Glass Ensuite' bookings. Minimum 1 night booking required. Use coupon code 'WELCOME15' during booking.",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  const activeDeal = deals.find(deal => deal.id === activeTab);

  return (
    <section id="deals" className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-100 via-white to-slate-100 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-xl animate-pulse"
            style={{
              left: `${10 + i * 25}%`,
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 1}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl mb-6 max-w-lg">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-1 font-serif-sans">
              Deals & Offers
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-seasons">
              Special accommodations for every traveler's needs
            </p>
            <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mt-2 rounded-full" />
          </div>
        </div>

        {/* Enhanced Tab Toggle Buttons - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-0 mb-12 sm:mb-16 px-4">
          {deals.map((deal, index) => (
            <Button
              key={deal.id}
              variant={activeTab === deal.id ? "default" : "outline"}
              onClick={() => setActiveTab(deal.id)}
              className={`px-2 sm:px-4 lg:px-6 py-2 sm:py-3 font-bold transition-all duration-300 text-xs sm:text-sm flex-1 sm:flex-none ${
                index === 0 ? 'sm:rounded-r-none' : index === deals.length - 1 ? 'sm:rounded-l-none' : 'sm:rounded-none'
              } ${
                activeTab === deal.id
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl border-orange-400"
                  : "border-orange-300/60 text-gray-800 bg-white hover:bg-orange-50 hover:border-orange-400/80 hover:text-orange-600"
              } font-seasons border-2`}
            >
              <deal.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
              <span className="text-xs sm:text-sm whitespace-nowrap leading-tight">{deal.title}</span>
            </Button>
          ))}
        </div>

        {/* Active Deal Content - Mobile Optimized */}
        {activeDeal && (
          <Card className="bg-white border-2 border-gray-200 max-w-4xl mx-auto transform hover:scale-105 transition-all duration-300 shadow-xl mx-3 sm:mx-auto">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <div className={`mx-auto w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-r ${activeDeal.gradient} rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-2xl relative transform hover:rotate-3 transition-transform duration-300`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeDeal.gradient} rounded-2xl sm:rounded-3xl blur-xl opacity-60 scale-110`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl sm:rounded-3xl`}></div>
                <div className={`absolute inset-1 bg-gradient-to-tl from-black/20 to-transparent rounded-2xl sm:rounded-3xl`}></div>
                <activeDeal.icon className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-white relative z-10 drop-shadow-lg" />
              </div>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 font-serif-sans px-4">
                {activeDeal.title}
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm sm:text-base lg:text-lg font-seasons px-4">
                {activeDeal.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center px-4 sm:px-6">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-seasons">
                {activeDeal.details}
              </p>
              {(activeDeal.id === "xtsy10" || activeDeal.id === "welcome15" || activeDeal.id === "meghalaya20") && (
                <div className="mt-6 p-4 bg-green-100 rounded-xl border-2 border-green-300">
                  <p className="text-green-800 font-bold text-lg font-seasons">
                    Use Coupon Code: <span className="bg-green-200 px-3 py-1 rounded-lg text-xl">{activeDeal.id.toUpperCase()}</span>
                  </p>
                  <p className="text-green-700 text-sm mt-2 font-seasons">
                    {activeDeal.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default DealsSection;
