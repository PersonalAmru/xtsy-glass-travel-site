
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
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
    <section className="py-8 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-0">
            <CardContent className="glass-card p-6 sm:p-8 text-center bg-white/15 border border-white/20">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-serif-sans">
                🌟 Ready for Adventure?
              </h3>
              <p className="text-white/90 text-base sm:text-lg mb-6 font-seasons">Contact us to customize your perfect tour package across IN, Asia or EU</p>
              <Button onClick={handlePlanAdventure} className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-seasons">
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
            <VisuallyHidden>
              <DialogDescription>Select domestic or international travel</DialogDescription>
            </VisuallyHidden>
          </DialogHeader>
          <div className="flex flex-col gap-4 p-4">
            <Button onClick={() => handleTravelChoice('domestic')} className="h-16 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
              🇮🇳 Domestic Travel
              <span className="block text-sm font-normal">Explore India</span>
            </Button>
            <Button onClick={() => handleTravelChoice('international')} className="h-16 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
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
