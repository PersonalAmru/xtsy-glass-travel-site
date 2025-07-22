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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Choose Your Travel Destination
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button
            onClick={() => handleSelection('domestic')}
            className="h-20 flex flex-col gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            size="lg"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🇮🇳</div>
              <div>
                <MapPin className="h-5 w-5" />
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Domestic Travel</div>
              <div className="text-sm opacity-90">Explore India</div>
            </div>
          </Button>

          <Button
            onClick={() => handleSelection('international')}
            className="h-20 flex flex-col gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            size="lg"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🌏</div>
              <div>
                <Globe className="h-5 w-5" />
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold">XTSY Asia & Europe</div>
              <div className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
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