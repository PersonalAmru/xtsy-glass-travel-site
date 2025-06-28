
import { useState } from "react";
import { Calendar, Users, MapPin, Shield } from "lucide-react";
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
      duration: "1 Night 2 Days",
      description: "Perfect for a quick escape from city life",
      details: "Day 1: Arrival & Shillong City Tour - Visit Police Bazaar, Cathedral, Golf Links. Evening at Café Shillong. Day 2: Elephant Falls, Shillong Peak, departure. Includes: Accommodation, breakfast, local sightseeing.",
      safety: "Carry warm clothes, valid ID, emergency contacts. Weather can change quickly.",
      price: "₹2,999",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: "long-weekend",
      icon: Users,
      title: "Long Weekend Trip",
      duration: "3 Nights 4 Days",
      description: "Extended exploration of Meghalaya's wonders",
      details: "Day 1: Arrival, Shillong city tour. Day 2: Cherrapunji - Living Root Bridge, Nohkalikai Falls. Day 3: Mawlynnong (Cleanest Village), Dawki River. Day 4: Umiam Lake, departure. Includes: All meals, transport, guide.",
      safety: "Trekking shoes essential. Monsoon season requires rain gear. Book permits in advance.",
      price: "₹8,999",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "group-special",
      icon: Users,
      title: "Ideal for Groups",
      duration: "5 Nights 6 Days",
      description: "Comprehensive Meghalaya adventure for groups",
      details: "Day 1-2: Shillong exploration, local culture immersion. Day 3-4: Cherrapunji expedition, cave exploration. Day 5: Mawsynram, Balphakram National Park. Day 6: Shopping, departure. Group activities, bonfire nights included.",
      safety: "Group leader mandatory. Medical kit provided. Insurance recommended for adventure activities.",
      price: "₹15,999",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      id: "offbeat-explorer",
      icon: MapPin,  
      title: "Offbeat Explorer",
      duration: "4 Nights 5 Days",
      description: "Hidden gems and secret spots of Meghalaya",
      details: "Discover Krang Suri Falls, Mawryngkhang Bamboo Trek, Laitlum Canyons, Kynrem Falls. Experience local Khasi culture, traditional villages, authentic cuisine. Limited to 8 people per batch for intimate experience.",
      safety: "High fitness level required. Local guide mandatory. Restricted season travel (Oct-Mar only).",
      price: "₹12,999",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const activeItinerary = itineraries.find(itinerary => itinerary.id === activeTab);

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-yellow-400/10 via-orange-400/15 to-red-400/10 relative overflow-hidden">
      {/* Enhanced tropical background animations */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-28 h-28 bg-gradient-to-r from-green-400/15 to-blue-400/15 rounded-full blur-xl animate-pulse"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + i * 12}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.3}s`
            }}
          />
        ))}
        {/* Palm leaf effects */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-20 h-20 bg-gradient-to-br from-emerald-400/40 to-green-500/40 rounded-full blur-2xl animate-bounce"
              style={{
                right: `${8 + i * 22}%`,
                bottom: `${12 + i * 18}%`,
                animationDelay: `${i * 1.1}s`,
                animationDuration: `${5 + i * 0.4}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-serif-sans">
            Curated Itineraries
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-seasons">
            Discover Meghalaya with our expertly crafted travel packages
          </p>
        </div>

        {/* Enhanced Tab Toggle Buttons - Services Section Style */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {itineraries.map((itinerary) => (
            <Button
              key={itinerary.id}
              variant={activeTab === itinerary.id ? "default" : "outline"}
              onClick={() => setActiveTab(itinerary.id)}
              className={`px-6 py-3 font-bold transition-all duration-300 text-sm border-2 font-seasons ${
                activeTab === itinerary.id
                  ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-xl border-green-400 scale-105 transform"
                  : "border-green-300/60 text-white bg-slate-800/60 hover:bg-slate-700/80 hover:border-green-400/80 hover:scale-105 hover:text-green-200 backdrop-blur-sm"
              }`}
            >
              <itinerary.icon className="h-4 w-4 mr-2" />
              {itinerary.title}
            </Button>
          ))}
        </div>

        {/* Active Itinerary Content */}
        {activeItinerary && (
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 max-w-5xl mx-auto transform hover:scale-105 transition-all duration-300 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className={`mx-auto w-28 h-28 bg-gradient-to-r ${activeItinerary.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative transform hover:rotate-3 transition-transform duration-300`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeItinerary.gradient} rounded-3xl blur-xl opacity-60 scale-110`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl`}></div>
                <div className={`absolute inset-1 bg-gradient-to-tl from-black/20 to-transparent rounded-3xl`}></div>
                <activeItinerary.icon className="h-14 w-14 text-white relative z-10 drop-shadow-lg" />
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <CardTitle className="text-3xl font-bold text-white font-serif-sans">
                  {activeItinerary.title}
                </CardTitle>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-3 py-1">
                  {activeItinerary.price}
                </Badge>
              </div>
              <CardDescription className="text-gray-300 text-lg mb-2 font-seasons">
                {activeItinerary.duration} • {activeItinerary.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-3 font-serif-sans">Itinerary Details</h4>
                <p className="text-gray-300 text-base leading-relaxed font-seasons">
                  {activeItinerary.details}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2 font-serif-sans">
                  <Shield className="h-5 w-5 text-green-400" />
                  Safety & Travel Tips
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed font-seasons">
                  {activeItinerary.safety}
                </p>
              </div>
              <div className="text-center">
                <Button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold px-8 py-3 text-lg transition-all duration-300 transform hover:scale-105 font-seasons">
                  Book This Package
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default AdventureSection;
