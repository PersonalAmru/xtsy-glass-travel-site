
import { useState } from "react";
import { Mountain, MapPin, Camera, Compass } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdventureSection = () => {
  const [activeTab, setActiveTab] = useState("living-root-bridge");

  const adventures = [
    {
      id: "living-root-bridge",
      icon: Mountain,
      title: "Living Root Bridge",
      description: "Marvel at nature's engineering in Cherrapunji",
      details: "Experience the wonder of living root bridges in Cherrapunji, one of the wettest places on Earth. These incredible structures are formed by training the roots of rubber trees over decades. Trek through lush forests, witness breathtaking waterfalls, and discover the ingenuity of the Khasi people.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: "elephant-falls",
      icon: Camera,
      title: "Elephant Falls",
      description: "Three-tiered waterfall near Shillong",
      details: "Visit the spectacular three-tiered Elephant Falls, one of Shillong's most popular attractions. Each tier offers unique views and photo opportunities. The falls are easily accessible and perfect for nature lovers and photography enthusiasts.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "umiam-lake",
      icon: MapPin,
      title: "Umiam Lake",
      description: "Scenic artificial lake perfect for water sports",
      details: "Enjoy water sports and scenic beauty at Umiam Lake, also known as Barapani. This artificial lake offers boating, kayaking, and water skiing. The surrounding hills provide a perfect backdrop for photography and relaxation.",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      id: "shillong-peak",
      icon: Compass,
      title: "Shillong Peak",
      description: "Highest point in Shillong with panoramic views",
      details: "Reach the highest point in Shillong for breathtaking panoramic views of the city and surrounding countryside. On clear days, you can see the plains of Bangladesh from this vantage point. Perfect for sunrise and sunset photography.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const activeAdventure = adventures.find(adventure => adventure.id === activeTab);

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-900/20 via-slate-800/20 to-slate-900/20 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-28 h-28 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-xl animate-pulse"
            style={{
              left: `${10 + i * 20}%`,
              top: `${15 + i * 15}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent" style={{ fontFamily: "'Cormorant Garmond', serif" }}>
            Adventure & Travel Info
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Discover the natural wonders and thrilling adventures around Shillong
          </p>
        </div>

        {/* Enhanced Tab Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {adventures.map((adventure) => (
            <Button
              key={adventure.id}
              variant={activeTab === adventure.id ? "default" : "outline"}
              onClick={() => setActiveTab(adventure.id)}
              className={`px-8 py-4 font-bold transition-all duration-300 text-base border-2 ${
                activeTab === adventure.id
                  ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-xl border-green-400 scale-105 transform"
                  : "border-green-300/60 text-white bg-slate-800/60 hover:bg-slate-700/80 hover:border-green-400/80 hover:scale-105 hover:text-green-200 backdrop-blur-sm"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <adventure.icon className="h-5 w-5 mr-3" />
              {adventure.title}
            </Button>
          ))}
        </div>

        {/* Active Adventure Content */}
        {activeAdventure && (
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 max-w-4xl mx-auto transform hover:scale-105 transition-all duration-300 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto w-28 h-28 bg-gradient-to-r ${activeAdventure.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative transform hover:rotate-3 transition-transform duration-300`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeAdventure.gradient} rounded-3xl blur-xl opacity-60 scale-110`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-3xl`}></div>
                <div className={`absolute inset-1 bg-gradient-to-tl from-black/20 to-transparent rounded-3xl`}></div>
                <activeAdventure.icon className="h-14 w-14 text-white relative z-10 drop-shadow-lg" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garmond', serif" }}>
                {activeAdventure.title}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                {activeAdventure.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 text-base leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                {activeAdventure.details}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default AdventureSection;
