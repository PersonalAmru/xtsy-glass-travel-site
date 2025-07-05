
import { useState } from "react";
import { Sofa, Clock, ShoppingBag, Shirt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ServicesSection = () => {
  const [activeTab, setActiveTab] = useState("common-lounge");

  const services = [
    {
      id: "common-lounge",
      icon: Sofa,
      title: "Common Lounge Access",
      description: "Relax, play games, enjoy music in our cozy common area",
      details: "Unwind in our spacious common lounge area designed for relaxation and socializing. Enjoy comfortable seating, board games, music system, books, and a friendly atmosphere where you can meet fellow travelers. Perfect for chilling out after a day of exploration, working on your laptop, or simply enjoying some downtime.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      id: "travel-assistance",
      icon: Clock,
      title: "24/7 Travel Assistance",
      description: "Round-the-clock support for all your travel needs",
      details: "Our dedicated team is always available to help you with travel planning, emergency assistance, local recommendations, and booking services. Whether it's finding the best restaurants, arranging tours, or handling unexpected situations, we're here for you 24/7.",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      id: "convenience-store",
      icon: ShoppingBag,
      title: "In-House Convenience Store",
      description: "Everything you need right at your fingertips",
      details: "Our well-stocked convenience store offers snacks, drinks, travel essentials and emergency supplies. Open 24/7 for your convenience, so you never have to worry about running out of essentials during your stay.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: "laundry",
      icon: Shirt,
      title: "Laundry Services",
      description: "Professional laundry meets Guest satisfaction!",
      details: "Keep your clothes fresh during your extended stay express laundry service for urgent needs. We use Eco-friendly detergents and Our staffs are trained to handle your items with love and care.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const activeService = services.find(service => service.id === activeTab);

  const amenities = [
    "Mountain View", "Card Payment Accepted", "Cafe", "Storage Facility", 
    "Laundry Services (Extra)", "Free Wi-Fi", "Common Television", 
    "Common hangout area", "In-house Activities", "Breakfast (Extra)", 
    "UPI Payment Accepted", "Parking (private)", "24/7 Reception",
    "Tourist Information", "Luggage Storage", "Security"
  ];

  return (
    <section id="services" className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-100 via-white to-slate-100 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 font-serif-sans">
            Our Services
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-seasons px-4">
            Choose from our range of accommodations designed for every traveler's needs and budget
          </p>
        </div>

        {/* Horizontal Tab Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-0 mb-12 sm:mb-16 px-4">
          {services.map((service, index) => (
            <Button
              key={service.id}
              variant={activeTab === service.id ? "default" : "outline"}
              onClick={() => setActiveTab(service.id)}
              className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 font-bold transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none ${
                index === 0 ? 'sm:rounded-r-none' : 
                index === services.length - 1 ? 'sm:rounded-l-none' : 
                'sm:rounded-none'
              } ${
                activeTab === service.id
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl border-orange-400"
                  : "border-orange-300/60 text-gray-800 bg-white hover:bg-orange-50 hover:border-orange-400/80 hover:text-orange-600"
              } font-seasons border-2`}
            >
              <service.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
              <span className="text-xs sm:text-sm lg:text-base whitespace-nowrap">{service.title}</span>
            </Button>
          ))}
        </div>

        {/* Active Service Content */}
        {activeService && (
          <Card className="bg-white border-2 border-gray-200 max-w-4xl mx-auto transform hover:scale-105 transition-all duration-300 shadow-xl mx-3 sm:mx-auto">
            <CardHeader className="text-center pb-3 sm:pb-4">
              <div className={`mx-auto w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-r ${activeService.gradient} rounded-2xl sm:rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-2xl relative transform hover:rotate-3 transition-transform duration-300`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeService.gradient} rounded-2xl sm:rounded-3xl blur-xl opacity-60 scale-110`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl sm:rounded-3xl`}></div>
                <div className={`absolute inset-1 bg-gradient-to-tl from-black/20 to-transparent rounded-2xl sm:rounded-3xl`}></div>
                <activeService.icon className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-white relative z-10 drop-shadow-lg" />
              </div>
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 font-serif-sans px-4">
                {activeService.title}
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm sm:text-base lg:text-lg font-seasons px-4">
                {activeService.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center px-4 sm:px-6">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-seasons">
                {activeService.details}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Common Amenities Section */}
        <div className="mt-16 bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center font-serif-sans">
            Common Amenities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 text-sm font-seasons font-medium">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
