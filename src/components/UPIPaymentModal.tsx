
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    bookingId: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    whatsappNumber: string;
    addOns?: {
      breakfast?: number;
      dinnerVeg?: number;
      dinnerNonVeg?: number;
      transportation?: boolean;
      itineraryPlanning?: boolean;
    };
    addOnTotal?: number;
  };
}

const UPIPaymentModal = ({ isOpen, onClose, bookingData }: UPIPaymentModalProps) => {
  const [copied, setCopied] = useState<string>("");
  const { toast } = useToast();

  const upiId = "xtsy@paytm"; // Replace with actual UPI ID
  const upiAmount = bookingData.totalAmount;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
    setTimeout(() => setCopied(""), 2000);
  };

  const generateAddOnsMessage = () => {
    if (!bookingData.addOns) return '';
    
    const addOns = [];
    
    if (bookingData.addOns.breakfast && bookingData.addOns.breakfast > 0) {
      addOns.push(`• Breakfast: ${bookingData.addOns.breakfast} meals × ₹150 = ₹${bookingData.addOns.breakfast * 150}`);
    }
    
    if (bookingData.addOns.dinnerVeg && bookingData.addOns.dinnerVeg > 0) {
      addOns.push(`• Dinner (Veg): ${bookingData.addOns.dinnerVeg} meals × ₹300 = ₹${bookingData.addOns.dinnerVeg * 300}`);
    }
    
    if (bookingData.addOns.dinnerNonVeg && bookingData.addOns.dinnerNonVeg > 0) {
      addOns.push(`• Dinner (Non-Veg): ${bookingData.addOns.dinnerNonVeg} meals × ₹300 = ₹${bookingData.addOns.dinnerNonVeg * 300}`);
    }
    
    if (bookingData.addOns.transportation) {
      addOns.push(`• Transportation Services: Best rates available`);
    }
    
    if (bookingData.addOns.itineraryPlanning) {
      const cost = bookingData.addOns.transportation ? 'Free (with Transportation)' : '5% convenience charges';
      addOns.push(`• Itinerary Planning & Support: ${cost}`);
    }
    
    return addOns.length > 0 ? `\n\n🎯 Add-ons Selected:\n${addOns.join('\n')}` : '';
  };

  const openWhatsApp = () => {
    const addOnsMessage = generateAddOnsMessage();
    const addOnTotalMessage = bookingData.addOnTotal ? `\nAdd-ons Total: ₹${bookingData.addOnTotal}` : '';
    
    const message = `💳 *XTSY - UPI Payment Confirmation*

Hi XTSY Team! Payment completed successfully! ✅

📋 *Booking Details:*
   Booking ID: ${bookingData.bookingId}
   Guest Name: ${bookingData.guestName}
   Check-in: ${new Date(bookingData.checkIn).toLocaleDateString()}
   Check-out: ${new Date(bookingData.checkOut).toLocaleDateString()}

💰 *Payment Information:*
   Amount Paid: ₹${upiAmount}${addOnTotalMessage}${addOnsMessage}

📸 *Payment Screenshot:* [Attaching payment proof]

Excited for my XTSY experience! Please confirm my booking. 🏔️✨

Thank you!`;

    const whatsappUrl = `https://api.whatsapp.com/send/?phone=918837317070&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  const suggestedDescription = `XTSY-${bookingData.bookingId} ${bookingData.guestName} ${new Date(bookingData.checkIn).toLocaleDateString()}-${new Date(bookingData.checkOut).toLocaleDateString()}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">
            Complete Your Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Section */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                {/* Replace this div with actual QR code image */}
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-sm text-gray-600">QR Code<br />Coming Soon</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Scan QR code with any UPI app</p>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">UPI ID:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{upiId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(upiId, "UPI ID")}
                    className="p-1 h-auto"
                  >
                    {copied === "UPI ID" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Amount:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">₹{upiAmount}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(upiAmount.toString(), "Amount")}
                    className="p-1 h-auto"
                  >
                    {copied === "Amount" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="border-t pt-3">
                <span className="font-medium text-sm">Suggested Description:</span>
                <div className="mt-1 p-2 bg-gray-50 rounded text-xs flex justify-between items-center">
                  <span className="font-mono break-all">{suggestedDescription}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(suggestedDescription, "Description")}
                    className="p-1 h-auto ml-2 flex-shrink-0"
                  >
                    {copied === "Description" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-orange-800 mb-2">Payment Instructions:</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>1. Pay ₹{upiAmount} to UPI ID: {upiId}</li>
                <li>2. Add suggested description for easy identification</li>
                <li>3. Take screenshot of successful payment</li>
                <li>4. Click WhatsApp button below to confirm</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={openWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-5 w-5" />
              Confirm Payment via WhatsApp
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              I'll Pay Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UPIPaymentModal;
