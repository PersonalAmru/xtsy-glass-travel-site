
import { useState } from "react";
import { Car, Coffee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DealsSection = () => {
  const [activeTab, setActiveTab] = useState("free-taxi");

  const deals = [
    {
      id: "free-taxi",
      icon: Car,
      title: "Free Taxi to XTSY",
      description: "Complimentary pickup service for groups of 4 or more",
      details: "Enjoy Free transportation from major pickup points in Shillong directly to XTSY Travellers Hostel. This exclusive offer is available for groups of 4 or more guests and includes pickup from Police Bazaar, Golf links, Polo Market, Civil Hospital/Barik Point and other major points in Shillong. Service operates from 8 AM to 8 PM daily.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "free-breakfast",
      icon: Coffee,
      title: "Free Breakfast for Female Travellers",
      description: "Complimentary breakfast for all female guests",
      details: "Start your day right with our complimentary breakfast exclusively for female travellers. Enjoy a hearty complimentary meal available daily from 8:30 AM.",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const activeDeal = deals.find(deal => deal.id === activeTab);

  return (
    <section id="deals" className="py-20 px-4 bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-xl animate-pulse"
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
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent" style={{ fontFamily: "'Cormorant Garmond', serif" }}>
            Deals & Offers
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Exclusive deals and special offers for our valued guests
          </p>
        </div>

        {/* Enhanced Tab Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {deals.map((deal) => (
            <Button
              key={deal.id}
              variant={activeTab === deal.id ? "default" : "outline"}
              onClick={() => setActiveTab(deal.id)}
              className={`px-8 py-4 font-bold transition-all duration-300 text-base border-2 ${
                activeTab === deal.id
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl border-orange-400 scale-105 transform"
                  : "border-orange-300/60 text-white bg-slate-800/60 hover:bg-slate-700/80 hover:border-orange-400/80 hover:scale-105 hover:text-orange-200 backdrop-blur-sm"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <deal.icon className="h-5 w-5 mr-3" />
              {deal.title}
            </Button>
          ))}
        </div>

        {/* Active Deal Content */}
        {activeDeal && (
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 max-w-4xl mx-auto transform hover:scale-105 transition-all duration-300 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto w-28 h-28 bg-gradient-to-r ${activeDeal.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative transform hover:rotate-3 transition-transform duration-300`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeDeal.gradient} rounded-3xl blur-xl opacity-60 scale-110`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl`}></div>
                <div className={`absolute inset-1 bg-gradient-to-tl from-black/20 to-transparent rounded-3xl`}></div>
                <activeDeal.icon className="h-14 w-14 text-white relative z-10 drop-shadow-lg" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garmond', serif" }}>
                {activeDeal.title}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                {activeDeal.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {activeDeal.details}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default DealsSection;
