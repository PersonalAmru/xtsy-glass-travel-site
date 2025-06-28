
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
      details: "Enjoy hassle-free transportation from major pickup points in Shillong directly to XTSY. This exclusive offer is available for groups of 4 or more guests and includes pickup from Railway Station, Bus Stand, Airport, and major city locations. Service operates from 8 AM to 8 PM daily.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "free-breakfast",
      icon: Coffee,
      title: "Free Breakfast for Female Travellers",
      description: "Complimentary breakfast for all female guests",
      details: "Start your day right with our complimentary breakfast exclusively for female travelers. Enjoy a hearty meal with local and continental options including fresh fruits, cereals, toast, eggs, and traditional dishes. Available daily from 7:30 AM to 10:30 AM in our dining area.",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const activeDeal = deals.find(deal => deal.id === activeTab);

  return (
    <section id="deals" className="py-20 px-4 bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-['Poppins']">
            Deals & Offers
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Exclusive deals and special offers for our valued guests
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {deals.map((deal) => (
            <Button
              key={deal.id}
              variant={activeTab === deal.id ? "default" : "outline"}
              onClick={() => setActiveTab(deal.id)}
              className={`px-8 py-4 font-semibold transition-all duration-300 text-base ${
                activeTab === deal.id
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg border-0 scale-105"
                  : "border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/40 hover:scale-105"
              }`}
            >
              <deal.icon className="h-5 w-5 mr-3" />
              {deal.title}
            </Button>
          ))}
        </div>

        {/* Active Deal Content */}
        {activeDeal && (
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 max-w-4xl mx-auto transform hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto w-28 h-28 bg-gradient-to-r ${activeDeal.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative transform hover:rotate-3 transition-transform duration-300`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeDeal.gradient} rounded-3xl blur-xl opacity-60 scale-110`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl`}></div>
                <div className={`absolute inset-1 bg-gradient-to-tl from-black/20 to-transparent rounded-3xl`}></div>
                <activeDeal.icon className="h-14 w-14 text-white relative z-10 drop-shadow-lg" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2 font-['Poppins']">
                {activeDeal.title}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                {activeDeal.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 text-base leading-relaxed">
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
