
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Gift, Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface XTSYDealsExitPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onReturnHome: () => void;
}

const XTSYDealsExitPopup = ({ isOpen, onClose, onReturnHome }: XTSYDealsExitPopupProps) => {
  const navigate = useNavigate();

  const handleViewDeals = () => {
    navigate('/deals');
    onClose();
  };

  const handleCloseAndReturnHome = () => {
    onClose();
    onReturnHome();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-orange-500" />
            Wait! Don't Miss Out!
          </DialogTitle>
        </DialogHeader>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <Gift className="h-12 w-12 text-orange-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Exclusive XTSY Deals Await!
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Discover amazing offers on premium accommodations, adventure tours, 
                and travel packages. Limited-time deals you won't find anywhere else!
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4 border border-orange-200">
              <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold">
                <Sparkles className="h-4 w-4" />
                <span>Special Discounts Available</span>
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleViewDeals}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Exclusive Deals
              </Button>
              
              <Button
                onClick={handleCloseAndReturnHome}
                variant="outline"
                className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                Close & Return Home
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-gray-500">
          Don't let these exclusive offers slip away!
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default XTSYDealsExitPopup;
