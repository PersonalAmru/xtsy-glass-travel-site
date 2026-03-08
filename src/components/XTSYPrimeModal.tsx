import React from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, ArrowRight, CheckCircle2, Building2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface XTSYPrimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  offering: {
    title: string;
    description: string;
    image: string;
    icon: React.ElementType;
    price: string;
    originalPrice?: string;
    priceNote: string;
    features: string[];
    category: string;
    rating: number;
    path: string;
  };
}

const XTSYPrimeModal: React.FC<XTSYPrimeModalProps> = ({ isOpen, onClose, offering }) => {
  const navigate = useNavigate();

  const handlePropertyNavigate = (propertySlug: string) => {
    onClose();
    requestAnimationFrame(() => {
      navigate(`/properties/${propertySlug}`);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden bg-background border-0 shadow-2xl rounded-2xl">
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              src={offering.image}
              alt={offering.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2.5 bg-black/40 backdrop-blur-md hover:bg-black/60 rounded-full text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-primary/90 backdrop-blur-md text-primary-foreground border-0 font-semibold">
                {offering.category}
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-white/15 backdrop-blur-md rounded-xl">
                  <offering.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                    {offering.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-white/80 text-sm font-medium">{offering.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            <DialogHeader className="space-y-0">
              <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                {offering.description}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-baseline gap-2 bg-primary/5 border border-primary/20 rounded-xl p-4">
              {offering.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{offering.originalPrice}</span>
              )}
              <span className="text-3xl font-bold text-primary">{offering.price}</span>
              <span className="text-muted-foreground text-sm">{offering.priceNote}</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                What's Included
              </h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {offering.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2.5 bg-muted/40 rounded-xl px-3 py-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Book at</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground justify-start gap-3 rounded-xl h-auto py-4"
                  onClick={() => {
                    onClose();
                    requestAnimationFrame(() => navigate(offering.path));
                  }}
                >
                  <Building2 className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">{offering.title}</div>
                    <div className="text-xs opacity-80">{offering.category}</div>
                  </div>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 justify-center gap-2 rounded-xl h-auto py-4 font-semibold"
                  onClick={() => {
                    onClose();
                    requestAnimationFrame(() => navigate(offering.path));
                  }}
                >
                  Know More about {offering.title}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default XTSYPrimeModal;
