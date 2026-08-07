import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Users, IndianRupee } from "lucide-react";

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  roomRate?: number;
  subtotal?: number;
  gstAmount?: number;
  otherTaxes?: number;
  totalAmount?: number;
  roomType?: string;
}

interface GuestDetailsHeaderProps {
  isCompact: boolean;
  onBack: () => void;
  bookingData: BookingData;
  displayGuests: number;
}

export const GuestDetailsHeader = ({ isCompact, onBack, bookingData, displayGuests }: GuestDetailsHeaderProps) => {
  return (
    <div className={`flex-shrink-0 border-b bg-gradient-to-r from-orange-50 to-red-50 transition-all duration-300 ${isCompact ? "p-2 md:p-3" : "p-4 md:p-6"}`}>
      <div className="flex items-center gap-3 mb-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2 text-gray-900 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5 text-gray-900" />
        </Button>
        <DialogTitle className={`font-bold text-gray-900 transition-all duration-300 ${isCompact ? "text-lg md:text-xl" : "text-xl md:text-2xl"}`}>
          Booking Summary and Guest Details
        </DialogTitle>
      </div>

      <div className={`bg-white rounded-lg shadow-sm transition-all duration-300 overflow-hidden ${isCompact ? "p-1.5 mt-1.5" : "p-2 mt-2"}`}>
        {/* Booking Details Row */}
        <div className={`grid gap-2 mb-3 ${isCompact ? "grid-cols-4 text-xs" : "grid-cols-2 md:grid-cols-4 text-xs"}`}>
          <div className="flex items-center gap-1.5">
            <Calendar className={`text-orange-500 ${isCompact ? "h-2.5 w-2.5" : "h-3 w-3"}`} />
            <div>
              <div className="text-gray-700 font-medium">Check-in</div>
              <div className="font-semibold text-gray-900">{new Date(bookingData.checkIn).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className={`text-orange-500 ${isCompact ? "h-2.5 w-2.5" : "h-3 w-3"}`} />
            <div>
              <div className="text-gray-700 font-medium">Check-out</div>
              <div className="font-semibold text-gray-900">{new Date(bookingData.checkOut).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className={`text-orange-500 ${isCompact ? "h-2.5 w-2.5" : "h-3 w-3"}`} />
            <div>
              <div className="text-gray-700 font-medium">Guests</div>
              <div className="font-semibold text-gray-900">{displayGuests}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className={`text-orange-500 ${isCompact ? "h-2.5 w-2.5" : "h-3 w-3"}`} />
            <div>
              <div className="text-gray-700 font-medium">Nights</div>
              <div className="font-semibold text-gray-900">{bookingData.nights}</div>
            </div>
          </div>
        </div>

        {/* Pricing Summary Section */}
        <div className="border-t pt-2">
          <div className="flex items-center gap-1.5 mb-2">
            <IndianRupee className={`text-green-600 ${isCompact ? "h-2.5 w-2.5" : "h-3 w-3"}`} />
            <h3 className={`font-semibold text-gray-900 ${isCompact ? "text-xs" : "text-xs"}`}>Pricing Summary</h3>
          </div>
          
          <div className={`space-y-1.5 ${isCompact ? "text-xs" : "text-xs"}`}>
            {bookingData.roomType && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Room Type:</span>
                <span className="font-medium text-gray-900">{bookingData.roomType}</span>
              </div>
            )}
            
            {bookingData.roomRate && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Room Rate ({bookingData.nights} nights):</span>
                <span className="font-medium text-gray-900">₹{bookingData.roomRate.toLocaleString()}</span>
              </div>
            )}
            
            {bookingData.subtotal && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Subtotal:</span>
                <span className="font-medium text-gray-900">₹{bookingData.subtotal.toLocaleString()}</span>
              </div>
            )}
            
            {bookingData.gstAmount && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">GST (18%):</span>
                <span className="font-medium text-gray-900">₹{bookingData.gstAmount.toLocaleString()}</span>
              </div>
            )}
            
            {bookingData.otherTaxes && bookingData.otherTaxes > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Other Taxes:</span>
                <span className="font-medium text-gray-900">₹{bookingData.otherTaxes.toLocaleString()}</span>
              </div>
            )}
            
            <div className="border-t pt-1.5 mt-2">
              <div className="flex justify-between items-center">
                <span className={`font-bold text-gray-900 ${isCompact ? "text-xs" : "text-sm"}`}>Total Payable:</span>
                <span className={`font-bold text-green-600 ${isCompact ? "text-sm" : "text-base"}`}>
                  ₹{(bookingData.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};