
import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Camera, Compass } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const AdventureSection = () => {
  const [openCards, setOpenCards] = useState({});

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

  const itineraries = [
    {
      title: "3-Day Beach Explorer",
      days: [
        "Day 1: Check-in, Beach walk, Sunset viewing",
        "Day 2: Water sports, Local food tour",
        "Day 3: Shopping, Cultural sites, Departure"
      ]
    },
    {
      title: "7-Day Complete Experience",
      days: [
        "Day 1-2: Arrival, Local orientation, Beach activities",
        "Day 3-4: Adventure sports, Trekking",
        "Day 5-6: Cultural immersion, Food tours",
        "Day 7: Relaxation, Shopping, Departure"
      ]
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

        {/* Adventure Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {adventureData.map((item) => (
            <Card key={item.id} className="backdrop-blur-lg bg-white/10 border border-white/20">
              <Collapsible
                open={openCards[item.id]}
                onOpenChange={() => toggleCard(item.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
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

        {/* Sample Itineraries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <h3 className="col-span-full text-2xl font-bold text-white text-center mb-6">
            Sample Itineraries
          </h3>
          {itineraries.map((itinerary, index) => (
            <Card key={index} className="backdrop-blur-lg bg-white/10 border border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">
                  {itinerary.title}
                </CardTitle>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdventureSection;
