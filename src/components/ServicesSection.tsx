
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
      details: "Our well-stocked convenience store offers snacks, drinks, toiletries, travel essentials, local souvenirs, and emergency supplies. Open 24/7 for your convenience, so you never have to worry about running out of essentials during your stay.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: "laundry",
      icon: Shirt,
      title: "Laundry Services",
      description: "Professional laundry and dry cleaning services",
      details: "Keep your clothes fresh during your extended stay with our professional laundry services. We offer same-day washing and drying, dry cleaning for delicate items, and express service for urgent needs. Eco-friendly detergents used for all cleaning processes.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const activeService = services.find(service => service.id === activeTab);

  return (
    <section id="services" className="py-20 px-4 bg-gradient-to-br from-slate-900/30 via-slate-800/30 to-slate-900/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent font-['Poppins']">
            Our Services
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-['Inter']">
            Experience comfort and convenience with our premium hostel services designed for modern travelers
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {services.map((service) => (
            <Button
              key={service.id}
              variant={activeTab === service.id ? "default" : "outline"}
              onClick={() => setActiveTab(service.id)}
              className={`px-8 py-4 font-bold transition-all duration-300 text-base ${
                activeTab === service.id
                  ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-xl border-0 scale-105"
                  : "border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/40 hover:scale-105"
              }`}
            >
              <service.icon className="h-5 w-5 mr-3" />
              {service.title}
            </Button>
          ))}
        </div>

        {/* Active Service Content */}
        {activeService && (
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 max-w-4xl mx-auto transform hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto w-28 h-28 bg-gradient-to-r ${activeService.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative transform hover:rotate-3 transition-transform duration-300`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeService.gradient} rounded-3xl blur-xl opacity-60 scale-110`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl`}></div>
                <div className={`absolute inset-1 bg-gradient-to-tl from-black/20 to-transparent rounded-3xl`}></div>
                <activeService.icon className="h-14 w-14 text-white relative z-10 drop-shadow-lg" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2 font-['Poppins']">
                {activeService.title}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg font-['Inter']">
                {activeService.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 text-base leading-relaxed font-['Inter']">
                {activeService.details}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
