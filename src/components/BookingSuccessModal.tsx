import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle } from "lucide-react";

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  guestName: string;
}

const BookingSuccessModal = ({ isOpen, onClose, bookingId, guestName }: BookingSuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        data-testid="booking-success-modal" 
        className="w-full max-w-md mx-auto"
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
        <div className="text-center space-y-6 py-4">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Enquiry Sent!
            </h2>
            <p className="text-gray-600">
              Thank you, {guestName}!
            </p>
          </div>

          {/* Booking ID */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Your Enquiry ID:</p>
            <p className="font-mono font-bold text-lg text-gray-900">{bookingId}</p>
          </div>

          {/* Main Message */}
          <div className="space-y-4">
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
              <div className="flex items-start">
                <MessageCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-amber-800 font-semibold">
                    This is an enquiry, not a confirmed booking
                  </p>
                  <p className="text-amber-700 text-sm mt-1">
                    The host will review your request and confirm availability via WhatsApp shortly. No payment has been taken.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>• The host will reach out on WhatsApp</p>
              <p>• Please keep your Enquiry ID for reference</p>
              <p>• Final confirmation is at the host's discretion</p>
            </div>
          </div>

          {/* Close Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3"
          >
            Got It!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingSuccessModal;