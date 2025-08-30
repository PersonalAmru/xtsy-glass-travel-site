import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Edit } from 'lucide-react';
import { useScreenSize } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
interface BookingSummaryProps {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  onEdit?: () => void;
  // Additional props for full booking integration
  roomType?: string;
  totalPrice?: number;
  guestName?: string;
  email?: string;
  phone?: string;
  address?: string;
}
export const BookingSummary: React.FC<BookingSummaryProps> = ({
  checkIn,
  checkOut,
  guests,
  nights,
  onEdit,
  roomType = "XTSY Accommodation",
  totalPrice = 0,
  guestName = "",
  email = "",
  phone = "",
  address = ""
}) => {
  const screenSize = useScreenSize();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (screenSize === 'mobile') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleWhatsAppBooking = async () => {
    // Validate required fields
    if (!checkIn || !checkOut || !guests || nights <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required booking details including dates and guest count",
        variant: "destructive"
      });
      return;
    }

    // Build comprehensive WhatsApp message
    const message = `Hello XTSY Team, I'd like to book:

🏨 *BOOKING DETAILS:*
Room Type: ${roomType}
Guests: ${guests}
Dates: ${checkIn} – ${checkOut} (${nights} nights)
Total: ₹${totalPrice?.toLocaleString() || 'TBD'}

👤 *MY DETAILS:*
Name: ${guestName || 'To be provided'}
Email: ${email || 'To be provided'}
Phone: ${phone || 'To be provided'}
Address: ${address || 'To be provided'}

Please confirm availability and provide final booking confirmation.
Thank you!`.trim();

    // Silent logging to Supabase with minimal egress
    try {
      await supabase.from("whatsapp_logs").insert([
        {
          type: "booking",
          phone: phone || null,
          email: email || null,
          message: message,
          created_at: new Date().toISOString(),
        }
      ]); // Note: returning: 'minimal' not supported in current client version
    } catch (error) {
      // Silent fail - don't block user experience
      console.log("Logging failed:", error);
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/918837317070?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank", "noopener noreferrer");
  };
  const isMobileView = screenSize === 'mobile';
  return <Card className={`transition-all duration-300 backdrop-blur-sm bg-card/95 ${isMobileView ? 'sticky top-2 mx-2 shadow-md border-border/60' : 'sticky top-4 shadow-sm border-border/50'}`}>
      <CardHeader className="transition-all duration-300 pb-2 pt-3 px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="transition-all duration-300 text-base text-center flex-1">Live the Shillong Vibe</CardTitle>
          {onEdit && <Button variant="ghost" size={isMobileView ? "sm" : "default"} onClick={onEdit} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <Edit className={`${isMobileView ? 'h-3 w-3' : 'h-4 w-4'} ${isMobileView ? '' : 'mr-1'}`} />
              {!isMobileView && 'Edit'}
            </Button>}
        </div>
      </CardHeader>
      
      <CardContent className="transition-all duration-300 pt-0 pb-3 px-3">
        <div className={`grid transition-all duration-300 ${isMobileView ? 'grid-cols-3 gap-1' : 'grid-cols-3 gap-2'}`}>
          {/* Check-in */}
          <div className="flex items-center transition-all duration-300 flex-col text-center">
            <div className={`flex items-center justify-center transition-all duration-300 ${isMobileView ? 'w-6 h-6 mb-1 bg-primary/10 rounded-full' : 'w-8 h-8 mb-1 bg-primary/10 rounded-full'}`}>
              <Calendar className={`transition-all duration-300 ${isMobileView ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <div>
              <p className={`font-medium transition-all duration-300 ${isMobileView ? 'text-xs' : 'text-xs'}`}>
                Check-in
              </p>
              <p className={`text-foreground transition-all duration-300 ${isMobileView ? 'text-xs font-medium' : 'text-xs font-medium'}`}>
                {formatDate(checkIn)}
              </p>
            </div>
          </div>

          {/* Check-out */}
          <div className="flex items-center transition-all duration-300 flex-col text-center">
            <div className={`flex items-center justify-center transition-all duration-300 ${isMobileView ? 'w-6 h-6 mb-1 bg-primary/10 rounded-full' : 'w-8 h-8 mb-1 bg-primary/10 rounded-full'}`}>
              <Calendar className={`transition-all duration-300 ${isMobileView ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <div>
              <p className={`font-medium transition-all duration-300 ${isMobileView ? 'text-xs' : 'text-xs'}`}>
                Check-out
              </p>
              <p className={`text-foreground transition-all duration-300 ${isMobileView ? 'text-xs font-medium' : 'text-xs font-medium'}`}>
                {formatDate(checkOut)}
              </p>
            </div>
          </div>

          {/* Guests */}
          <div className="flex items-center transition-all duration-300 flex-col text-center">
            <div className={`flex items-center justify-center transition-all duration-300 ${isMobileView ? 'w-6 h-6 mb-1 bg-primary/10 rounded-full' : 'w-8 h-8 mb-1 bg-primary/10 rounded-full'}`}>
              <Users className={`transition-all duration-300 ${isMobileView ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <div>
              <p className={`font-medium transition-all duration-300 ${isMobileView ? 'text-xs' : 'text-xs'}`}>
                Guests
              </p>
              <p className={`text-foreground transition-all duration-300 ${isMobileView ? 'text-xs font-medium' : 'text-xs font-medium'}`}>
                {guests}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default BookingSummary;
