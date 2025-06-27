import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Camera, Compass } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const AdventureSection = () => {
  const [openCards, setOpenCards] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  const toggleCard = (cardId) => {
    setOpenCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const adventureData = [
    {
      id: "local-guides",
      icon: MapPin,
      title: "Local Guides",
      description: "Expert local guides for authentic experiences",
      content: [
        "🏖️ Beach hopping tours to hidden gems",
        "🍛 Food tours showcasing local cuisine",
        "🏛️ Historical site visits with cultural insights",
        "🌅 Sunrise and sunset viewing spots",
        "🎣 Fishing trips with local fishermen"
      ]
    },
    {
      id: "travel-tips",
      icon: Compass,
      title: "Travel Tips",
      description: "Essential tips for your perfect getaway",
      content: [
        "💡 Best time to visit different attractions",
        "🚗 Transportation options and local routes",
        "💰 Budget-friendly dining recommendations",
        "📱 Must-have apps for travelers",
        "🎒 Packing essentials for your stay"
      ]
    },
    {
      id: "adventure-activities",
      icon: Camera,
      title: "Adventure Activities",
      description: "Thrilling activities and experiences",
      content: [
        "🏄‍♂️ Water sports and beach activities",
        "🥾 Trekking and hiking trails nearby",
        "🏊‍♀️ Swimming and snorkeling spots",
        "🎭 Cultural events and festivals",
        "🛍️ Shopping districts and local markets"
      ]
    }
  ];

  const curatedDestinations = [
    {
      title: "Meghalaya's Living Root Bridges",
      days: [
        "Day 1: Arrival in Shillong, explore Police Bazaar and Ward's Lake",
        "Day 2: Trek to Double Decker Living Root Bridge in Cherrapunji",
        "Day 3: Visit Mawlynnong (Asia's cleanest village) and Dawki River",
        "Day 4: Explore caves in Jaintia Hills and local tribal culture"
      ],
      highlight: "UNESCO Heritage Sites & Natural Wonders"
    },
    {
      title: "Sacred Groves & Waterfalls Experience",
      days: [
        "Day 1-2: Shillong sightseeing - Elephant Falls, Shillong Peak",
        "Day 3-4: Cherrapunji - Nohkalikai Falls, Seven Sisters Falls",
        "Day 5-6: Mawsynram wettest place exploration",
        "Day 7: Sacred groves conservation experience with Khasi tribes"
      ],
      highlight: "Biodiversity Hotspot & Cultural Immersion"
    },
    {
      title: "Adventure Sports in Meghalaya",
      days: [
        "Day 1: River rafting in Umngot River, Dawki",
        "Day 2: Rock climbing and rappelling in East Khasi Hills",
        "Day 3: Caving expedition in Krem Liat Prah cave system",
        "Day 4: Zip-lining and canopy walks in Mawphlang Sacred Forest"
      ],
      highlight: "Adrenaline Rush in Northeast India"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            Adventure & Travel Info
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover amazing experiences and get insider tips for your perfect adventure
          </p>
        </div>

        {/* Adventure Cards with Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {adventureData.map((item) => (
            <Card 
              key={item.id} 
              className={`backdrop-blur-xl bg-white/10 border border-white/20 transition-all duration-300 ${
                hoveredCard === item.id ? 'bg-white/20 scale-105 shadow-2xl' : 'hover:bg-white/15'
              }`}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Collapsible
                open={openCards[item.id]}
                onOpenChange={() => toggleCard(item.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center transition-transform duration-300 ${
                          hoveredCard === item.id ? 'scale-110' : ''
                        }`}>
                          <item.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white text-left">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400 text-left">
                            {item.description}
                          </CardDescription>
                        </div>
                      </div>
                      {openCards[item.id] ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {item.content.map((point, index) => (
                        <li key={index} className="text-gray-300 text-sm">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Curated Itineraries */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Curated Itineraries and Destinations
            </h3>
            <p className="text-lg text-gray-400 mb-8">
              Explore the mystical beauty of Northeast India with our specially crafted experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {curatedDestinations.map((itinerary, index) => (
              <Card 
                key={index} 
                className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 group"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">
                    {itinerary.title}
                  </CardTitle>
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-teal-500/20 to-blue-600/20 rounded-full border border-teal-400/30">
                    <span className="text-teal-300 text-sm font-medium">{itinerary.highlight}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {itinerary.days.map((day, dayIndex) => (
                      <li key={dayIndex} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></span>
                        {day}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold">
                      Explore This Journey
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdventureSection;
