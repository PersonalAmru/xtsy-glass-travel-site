
import { useState } from "react";
import { Calendar, Users, MapPin, Shield, Mountain, Compass, Camera, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AdventureSection = () => {
  const [activeTab, setActiveTab] = useState("weekend-getaway");

  const itineraries = [
    {
      id: "weekend-getaway",
      icon: Calendar,
      title: "Weekend Getaway",
      duration: "2 Days 1 Night",
      description: "Perfect escape to Shillong's iconic attractions",
      details: "Day 1: Arrival at XTSY → Shillong Peak (highest point in Shillong) → Elephant Falls (three-tiered waterfall) → Police Bazaar shopping → Don Bosco Museum → Evening at Café Shillong Heritage. Day 2: Ward's Lake boating → Golf Links → Cathedral of Mary Help of Christians → Departure. Includes: Accommodation, breakfast, local transport, entry fees.",
      safety: "Carry warm clothes (temperature drops to 5°C in winter). Valid photo ID mandatory. Weather changes rapidly - keep rain gear handy. Comfortable walking shoes essential for uneven terrain.",
      price: "₹2,999",
      gradient: "from-green-500 to-emerald-500",
      highlights: ["Shillong Peak Views", "Elephant Falls Trek", "Local Culture", "Heritage Sites"]
    },
    {
      id: "long-weekend",
      icon: Users,
      title: "Cherrapunji Explorer", 
      duration: "4 Days 3 Nights",
      description: "Living Root Bridges & wettest place on Earth",
      details: "Day 1: Shillong city tour → Umiam Lake. Day 2: Cherrapunji → Nohkalikai Falls (tallest plunge waterfall in India) → Seven Sisters Falls → Mawsmai Cave exploration. Day 3: Double Decker Living Root Bridge trek (3km each way) → Nongriat Village → Rainbow Falls. Day 4: Mawlynnong (Cleanest Village of Asia) → Dawki River crystal clear waters → Living Root Bridge → Departure.",
      safety: "Monsoon season (June-September) extremely wet - waterproof gear essential. Living Root Bridge trek requires good fitness level. River activities only with life jackets. Local guides mandatory for cave exploration.",
      price: "₹8,999", 
      gradient: "from-blue-500 to-cyan-500",
      highlights: ["Living Root Bridges", "Nohkalikai Falls", "Cleanest Village", "Crystal Clear Dawki"]
    },
    {
      id: "group-special",
      icon: Mountain,
      title: "Meghalaya Grand Circuit",
      duration: "6 Days 5 Nights", 
      description: "Complete Northeast adventure for groups",
      details: "Day 1-2: Shillong → Umiam Lake → Elephant Falls → Shillong Peak. Day 3-4: Cherrapunji → Living Root Bridges → Nohkalikai Falls → Seven Sisters Falls → Mawsmai Caves. Day 5: Mawlynnong Village → Dawki River → Jaintia Hills. Day 6: Balphakram National Park → Balpakram Plateau → Traditional Garo villages → Departure. Includes: All meals, accommodation, transport, guides, permits.",
      safety: "Group leader with first aid training mandatory. Medical kit and emergency contacts provided. Travel insurance recommended. National Park requires special permits - advance booking essential.",
      price: "₹15,999",
      gradient: "from-purple-500 to-indigo-500", 
      highlights: ["Complete Meghalaya", "Balphakram National Park", "Tribal Villages", "Group Activities"]
    },
    {
      id: "offbeat-explorer",
      icon: Compass,
      title: "Offbeat Meghalaya",
      duration: "5 Days 4 Nights",
      description: "Hidden gems & secret spots for adventure seekers", 
      details: "Day 1: Krang Suri Falls (turquoise blue waters) → Jowai. Day 2: Mawryngkhang Bamboo Trek → Bamboo Bridge → Kynrem Falls (7th highest waterfall in India). Day 3: Laitlum Canyons (Grand Canyon of East) → Smit Village (traditional Khasi village). Day 4: Phe Phe Falls → Riwai Village → Traditional Khasi archery. Day 5: Mawphanlur → Sacred Groves → Traditional weaving centers → Departure.",
      safety: "High fitness level required - involves 15km+ trekking daily. Local Khasi guide mandatory. Restricted to October-March only due to monsoon safety. Emergency evacuation difficult - comprehensive insurance essential.",
      price: "₹12,999",
      gradient: "from-orange-500 to-red-500",
      highlights: ["Krang Suri Falls", "Grand Canyon Views", "Tribal Culture", "Adventure Trekking"]
    }
  ];

  const activeItinerary = itineraries.find(itinerary => itinerary.id === activeTab);

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-green-400/10 via-blue-400/15 to-emerald-400/10 relative overflow-hidden">
      {/* Enhanced background animations */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 bg-gradient-to-r from-green-400/15 to-blue-400/15 rounded-full blur-xl animate-pulse"
            style={{
              left: `${5 + i * 15}%`,
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.4}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-serif-sans">
            Curated Meghalaya Itineraries
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-seasons leading-relaxed">
            Discover the hidden treasures of Northeast India with our expertly crafted travel experiences
          </p>
        </div>

        {/* Enhanced Tab Toggle Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {itineraries.map((itinerary) => (
            <Button
              key={itinerary.id}
              variant={activeTab === itinerary.id ? "default" : "outline"}
              onClick={() => setActiveTab(itinerary.id)}
              className={`p-6 h-auto font-bold transition-all duration-300 border-2 font-seasons flex flex-col gap-2 ${
                activeTab === itinerary.id
                  ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-xl border-green-400 scale-105 transform"
                  : "border-green-300/60 text-white bg-slate-800/60 hover:bg-slate-700/80 hover:border-green-400/80 hover:scale-105 hover:text-green-200 backdrop-blur-sm"
              }`}
            >
              <itinerary.icon className="h-6 w-6 mx-auto" />
              <span className="text-sm font-bold">{itinerary.title}</span>
              <span className="text-xs opacity-80">{itinerary.duration}</span>
            </Button>
          ))}
        </div>

        {/* Active Itinerary Content */}
        {activeItinerary && (
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 max-w-6xl mx-auto transform hover:scale-105 transition-all duration-300 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className={`mx-auto w-32 h-32 bg-gradient-to-r ${activeItinerary.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative transform hover:rotate-3 transition-transform duration-300`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeItinerary.gradient} rounded-3xl blur-xl opacity-60 scale-110`}></div>
                <activeItinerary.icon className="h-16 w-16 text-white relative z-10 drop-shadow-lg" />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <CardTitle className="text-3xl md:text-4xl font-bold text-white font-serif-sans">
                  {activeItinerary.title}
                </CardTitle>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 py-2 text-lg">
                  {activeItinerary.price}
                </Badge>
              </div>
              <CardDescription className="text-gray-300 text-lg mb-4 font-seasons">
                {activeItinerary.duration} • {activeItinerary.description}
              </CardDescription>
              
              {/* Highlights */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {activeItinerary.highlights.map((highlight, index) => (
                  <Badge key={index} variant="outline" className="border-green-400/50 text-green-300 bg-green-900/20">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div>
                <h4 className="text-2xl font-bold text-white mb-4 font-serif-sans flex items-center gap-2">
                  <Camera className="h-6 w-6 text-green-400" />
                  Detailed Itinerary
                </h4>
                <p className="text-gray-300 text-base leading-relaxed font-seasons">
                  {activeItinerary.details}
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-serif-sans">
                  <Shield className="h-5 w-5 text-red-400" />
                  Safety & Travel Guidelines
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed font-seasons">
                  {activeItinerary.safety}
                </p>
              </div>
              
              <div className="text-center">
                <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 font-seasons rounded-xl shadow-xl">
                  <Leaf className="h-5 w-5 mr-2" />
                  Book This Adventure
                </Button>
                <p className="text-gray-400 text-sm mt-3 font-seasons">
                  Experience the untouched beauty of Meghalaya with expert guides
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default AdventureSection;
