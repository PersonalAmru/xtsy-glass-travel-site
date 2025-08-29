import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Users } from "lucide-react";

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
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

      <div className={`bg-white rounded-lg shadow-sm transition-all duration-300 overflow-hidden ${isCompact ? "p-2 mt-2" : "p-3 mt-4"}`}>
        <div className={`grid gap-3 ${isCompact ? "grid-cols-4 text-xs" : "grid-cols-2 md:grid-cols-4 text-sm"}`}>
          <div className="flex items-center gap-2">
            <Calendar className={`text-orange-500 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
            <div>
              <div className="text-gray-700 font-medium">Check-in</div>
              <div className="font-semibold text-gray-900">{new Date(bookingData.checkIn).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className={`text-orange-500 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
            <div>
              <div className="text-gray-700 font-medium">Check-out</div>
              <div className="font-semibold text-gray-900">{new Date(bookingData.checkOut).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className={`text-orange-500 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
            <div>
              <div className="text-gray-700 font-medium">Guests</div>
              <div className="font-semibold text-gray-900">{displayGuests}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className={`text-orange-500 ${isCompact ? "h-3 w-3" : "h-4 w-4"}`} />
            <div>
              <div className="text-gray-700 font-medium">Nights</div>
              <div className="font-semibold text-gray-900">{bookingData.nights}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};