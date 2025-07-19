import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Users, Clock, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  sessionId: string;
  type: string;
  packageId: number;
  packageTitle: string;
  guests: number;
  selectedDate: string;
  duration: number;
  baseRate: number;
  totalAmount: number;
  gstAmount: number;
  finalTotal: number;
  guestDetails: {
    name: string;
    email: string;
    phone: string;
    emergencyContact: string;
  };
  createdAt: string;
}

interface TourCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
}

const TourCartModal: React.FC<TourCartModalProps> = ({ isOpen, onClose, sessionId }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && sessionId) {
      loadCartItems();
    }
  }, [isOpen, sessionId]);

  const loadCartItems = () => {
    if (!sessionId) return;
    
    const savedCart = localStorage.getItem(`tour_cart_${sessionId}`);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const removeItem = (index: number) => {
    if (!sessionId) return;
    
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem(`tour_cart_${sessionId}`, JSON.stringify(updatedCart));
    
    // Trigger storage event for real-time cart updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: `tour_cart_${sessionId}`,
      newValue: JSON.stringify(updatedCart)
    }));
    
    toast({
      title: "Item Removed",
      description: "Package has been removed from your cart",
    });
  };

  const clearCart = () => {
    if (!sessionId) return;
    
    setCartItems([]);
    localStorage.removeItem(`tour_cart_${sessionId}`);
    
    // Remove session from active sessions
    const allSessions = JSON.parse(localStorage.getItem("active_tour_sessions") || "[]");
    const updatedSessions = allSessions.filter((id: string) => id !== sessionId);
    localStorage.setItem("active_tour_sessions", JSON.stringify(updatedSessions));
    
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  const proceedToBooking = () => {
    toast({
      title: "Booking Initiated",
      description: "Redirecting to payment gateway...",
    });
    // Here you would integrate with your payment system
  };

  const totalCartValue = cartItems.reduce((sum, item) => sum + item.finalTotal, 0);

  if (!sessionId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Tour Cart
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No active session found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Tour Cart ({cartItems.length} items)
          </DialogTitle>
        </DialogHeader>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some tour packages to get started</p>
            <Button onClick={onClose}>Continue Browsing</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{item.packageTitle}</h3>
                        <Badge variant="outline">Tour Package</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{item.guests} guests</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{item.duration} days</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(item.selectedDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="text-sm space-y-1">
                        <p><strong>Lead Guest:</strong> {item.guestDetails.name}</p>
                        <p><strong>Email:</strong> {item.guestDetails.email}</p>
                        <p><strong>Phone:</strong> {item.guestDetails.phone}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-600 mb-2">
                        ₹{item.finalTotal.toLocaleString()}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Cart Summary */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Guests:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.guests, 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount:</span>
                  <span className="text-orange-600">₹{totalCartValue.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="flex-1"
                >
                  Clear Cart
                </Button>
                <Button 
                  onClick={proceedToBooking}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                >
                  Proceed to Booking
                </Button>
              </div>
            </Card>

            {/* Session Info */}
            <div className="text-xs text-gray-500 text-center">
              Session ID: {sessionId}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TourCartModal;