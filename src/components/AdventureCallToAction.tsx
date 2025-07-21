
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdventureCallToAction = () => {
  const navigate = useNavigate();
  const [showTravelModal, setShowTravelModal] = useState(false);

  const handlePlanAdventure = () => {
    setShowTravelModal(true);
  };

  const handleTravelChoice = (type: 'domestic' | 'international') => {
    setShowTravelModal(false);
    navigate(`/travel?tab=${type}`);
  };

  return (
    <section className="py-16 sm:py-20 px-3 sm:px-4 bg-gradient-to-br from-slate-100 via-white to-slate-100 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-xl animate-pulse"
            style={{
              left: `${15 + i * 18}%`,
              top: `${10 + i * 18}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${3.5 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-0">
            <CardContent className="p-6 sm:p-8 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-serif-sans">
                🌟 Ready for Adventure?
              </h3>
              <p className="text-white/90 text-base sm:text-lg mb-6 font-seasons">
                Contact us to customize your perfect Meghalaya adventure package
              </p>
              <Button 
                onClick={handlePlanAdventure}
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-seasons"
              >
                Plan My Adventure 🗺️
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Travel Choice Modal */}
      <Dialog open={showTravelModal} onOpenChange={setShowTravelModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Choose Your Adventure</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 p-4">
            <Button 
              onClick={() => handleTravelChoice('domestic')}
              className="h-16 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              🇮🇳 Domestic Travel
              <span className="block text-sm font-normal">Explore India</span>
            </Button>
            <Button 
              onClick={() => handleTravelChoice('international')}
              className="h-16 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              ✈️ International Travel
              <span className="block text-sm font-normal">Explore the World</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AdventureCallToAction;
