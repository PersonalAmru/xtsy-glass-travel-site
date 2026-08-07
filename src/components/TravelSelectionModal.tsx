import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
      <DialogContent 
        data-testid="travel-selection-modal"
        className="p-4 sm:p-6 overflow-hidden"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(calc(100vw - 32px), 28rem)',
          maxWidth: '28rem',
          boxSizing: 'border-box',
          margin: 0,
        }}
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-center text-lg sm:text-xl font-bold text-foreground">
            Choose Your Travel Destination
          </DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              Select between domestic travel within India or international travel to Asia and Europe
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 sm:gap-4 py-2 sm:py-4 w-full">
          <Button
            onClick={() => handleSelection('domestic')}
            className="h-auto min-h-[72px] sm:min-h-[80px] flex flex-col gap-1.5 sm:gap-2 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-full touch-manipulation"
            size="lg"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl emoji-text">🇮🇳</span>
              <MapPin className="h-5 w-5 sm:h-5 sm:w-5 flex-shrink-0" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm sm:text-base">Domestic Travel</div>
              <div className="text-xs sm:text-sm opacity-90">Explore India</div>
            </div>
          </Button>

          <Button
            onClick={() => handleSelection('international')}
            className="h-auto min-h-[72px] sm:min-h-[80px] flex flex-col gap-1.5 sm:gap-2 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white w-full touch-manipulation"
            size="lg"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl emoji-text">🌏</span>
              <Globe className="h-5 w-5 sm:h-5 sm:w-5 flex-shrink-0" />
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm sm:text-base">XTSY Asia & Europe</div>
              <div className="text-[10px] sm:text-xs bg-red-500 text-white px-2 py-0.5 sm:py-1 rounded-full mt-1 inline-block">
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