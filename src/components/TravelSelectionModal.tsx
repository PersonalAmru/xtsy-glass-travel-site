import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TravelSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TravelSelectionModal = ({ isOpen, onClose }: TravelSelectionModalProps) => {
  const navigate = useNavigate();

  const handleSelection = (type: 'domestic' | 'international') => {
    navigate(`/travel?tab=${type}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl font-bold">
            Choose Your Travel Destination
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
          <Button
            onClick={() => handleSelection('domestic')}
            className="h-auto min-h-[70px] sm:min-h-[80px] flex flex-col gap-1 sm:gap-2 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-full"
            size="lg"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">🇮🇳</span>
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm sm:text-base">Domestic Travel</div>
              <div className="text-xs sm:text-sm opacity-90">Explore India</div>
            </div>
          </Button>

          <Button
            onClick={() => handleSelection('international')}
            className="h-auto min-h-[70px] sm:min-h-[80px] flex flex-col gap-1 sm:gap-2 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white w-full"
            size="lg"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">🌏</span>
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm sm:text-base">XTSY Asia & Europe</div>
              <div className="text-[10px] sm:text-xs bg-red-500 text-white px-2 py-0.5 sm:py-1 rounded-full mt-1">
                Launching Soon
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TravelSelectionModal;