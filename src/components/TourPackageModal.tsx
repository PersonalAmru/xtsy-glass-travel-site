import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Users, Star, MapPin, Minus, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TourPackage {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  price: string;
  rating: number;
  category: string;
  highlights: string[];
  bestSeason: string;
}

interface TourPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourPackage: TourPackage | null;
}

const TourPackageModal: React.FC<TourPackageModalProps> = ({ isOpen, onClose, tourPackage }) => {
  const [guests, setGuests] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: ""
  });
  const { toast } = useToast();

  if (!tourPackage) return null;

  // Calculate pricing based on category
  const baseRate = 2800; // per person per day
  const days = parseInt(tourPackage.duration.split(" ")[0]);
  let finalRate = baseRate;

  if (tourPackage.category === "adventure") {
    finalRate = baseRate * 1.15; // 15% increase for adventure
  } else if (tourPackage.category === "cultural") {
    finalRate = baseRate * 1.10; // 10% increase for cultural
  }

  const totalAmount = Math.round(finalRate * days * guests);
  const gstAmount = Math.round(totalAmount * 0.18);
  const finalTotal = totalAmount + gstAmount;

  const handleAddToCart = () => {
    if (!selectedDate || !guestDetails.name || !guestDetails.email || !guestDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Generate unique session ID for this guest
    const sessionId = `tour_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const cartItem = {
      sessionId,
      type: "tour_package",
      packageId: tourPackage.id,
      packageTitle: tourPackage.title,
      guests,
      selectedDate,
      duration: days,
      baseRate: finalRate,
      totalAmount,
      gstAmount,
      finalTotal,
      guestDetails,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage with unique session
    const existingCart = JSON.parse(localStorage.getItem(`tour_cart_${sessionId}`) || "[]");
    existingCart.push(cartItem);
    localStorage.setItem(`tour_cart_${sessionId}`, JSON.stringify(existingCart));

    // Also save session ID for header cart access
    const allSessions = JSON.parse(localStorage.getItem("active_tour_sessions") || "[]");
    if (!allSessions.includes(sessionId)) {
      allSessions.push(sessionId);
      localStorage.setItem("active_tour_sessions", JSON.stringify(allSessions));
    }

    toast({
      title: "Added to Cart",
      description: `${tourPackage.title} has been added to your cart`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {tourPackage.title}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Package Details */}
          <div className="space-y-6">
            <div className="relative">
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Package Image</p>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90">
                  {tourPackage.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{tourPackage.rating}</span>
              </div>
            </div>

            <div>
              <p className="text-gray-600 mb-4">{tourPackage.description}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-sm text-gray-600">{tourPackage.duration}</p>
                </div>
                <div className="text-center">
                  <Users className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-sm text-gray-600">{tourPackage.difficulty}</p>
                </div>
                <div className="text-center">
                  <Calendar className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                  <p className="text-sm text-gray-600">{tourPackage.bestSeason}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Package Highlights:</h4>
                <div className="space-y-1">
                  {tourPackage.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      <span className="text-sm text-gray-600">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Book This Journey</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center font-medium">{guests}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGuests(guests + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="date">Preferred Start Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-2"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Lead Guest Details</h4>
                  
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={guestDetails.name}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={guestDetails.phone}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    <Input
                      id="emergency"
                      value={guestDetails.emergencyContact}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      placeholder="Emergency contact number"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Pricing Summary */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <h3 className="text-lg font-semibold mb-4">Pricing Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Rate (per person/day):</span>
                  <span>₹{baseRate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category Rate (per person/day):</span>
                  <span>₹{Math.round(finalRate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{days} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{guests}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span>₹{gstAmount.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Add to Cart
              </Button>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TourPackageModal;