
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

  return (
    <section id="services" className="py-20 px-4 bg-gradient-to-br from-slate-900/30 via-slate-800/30 to-slate-900/30 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 bg-gradient-to-r from-teal-400/10 to-blue-400/10 rounded-full blur-xl animate-pulse"
            style={{
              right: `${5 + i * 20}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: "'Cormorant Garmond', serif" }}>
            Our Services
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Experience comfort and convenience with our premium hostel services designed for modern travelers
          </p>
        </div>

        {/* Enhanced Tab Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {services.map((service) => (
            <Button
              key={service.id}
              variant={activeTab === service.id ? "default" : "outline"}
              onClick={() => setActiveTab(service.id)}
              className={`px-8 py-4 font-bold transition-all duration-300 text-base border-2 ${
                activeTab === service.id
                  ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-xl border-teal-400 scale-105 transform"
                  : "border-teal-300/60 text-white bg-slate-800/60 hover:bg-slate-700/80 hover:border-teal-400/80 hover:scale-105 hover:text-teal-200 backdrop-blur-sm"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <service.icon className="h-5 w-5 mr-3" />
              {service.title}
            </Button>
          ))}
        </div>

        {/* Active Service Content */}
        {activeService && (
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 max-w-4xl mx-auto transform hover:scale-105 transition-all duration-300 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto w-28 h-28 bg-gradient-to-r ${activeService.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative transform hover:rotate-3 transition-transform duration-300`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeService.gradient} rounded-3xl blur-xl opacity-60 scale-110`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl`}></div>
                <div className={`absolute inset-1 bg-gradient-to-tl from-black/20 to-transparent rounded-3xl`}></div>
                <activeService.icon className="h-14 w-14 text-white relative z-10 drop-shadow-lg" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garmond', serif" }}>
                {activeService.title}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                {activeService.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
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
