import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Edit } from 'lucide-react';
import { useScreenSize } from '@/hooks/use-mobile';
import { useApp } from '@/contexts/AppContext';

export interface BookingSummaryItem {
  label: string;
  amount: number; // amount in base currency (INR) before format
}

interface BookingSummaryProps {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  onEdit?: () => void;

  /**
   * Optional enriched summary data. If provided, these will be shown:
   * - roomType: e.g. "270° Panorama Glass Ensuite"
   * - items: line items (room subtotal, add-ons, taxes)
   * - totalPrice: grand total in base INR (will be formatted via useApp)
   */
  roomType?: string;
  items?: BookingSummaryItem[];
  totalPrice?: number;

  // Optional contact fields (shown only if provided)
  guestName?: string;
  email?: string;
  phone?: string;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  checkIn,
  checkOut,
  guests,
  nights,
  onEdit,
  roomType = 'XTSY Accommodation',
  items = [],
  totalPrice = 0,
  guestName,
  email,
  phone,
}) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  const { formatPrice } = useApp();

  const formatShort = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  return (
    <Card
      className={`transition-all duration-300 backdrop-blur-sm bg-card/95 ${
        isMobile ? 'sticky top-2 mx-2 shadow-md border-border/60' : 'sticky top-4 shadow-sm border-border/50'
      }`}
    >
      <CardHeader className="transition-all duration-300 pb-2 pt-3 px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="transition-all duration-300 text-base text-center flex-1">
            Booking Summary
          </CardTitle>
          {onEdit && (
            <Button
              variant="ghost"
              size={isMobile ? 'sm' : 'default'}
              onClick={onEdit}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Edit className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${isMobile ? '' : 'mr-1'}`} />
              {!isMobile && 'Edit'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="transition-all duration-300 pt-0 pb-3 px-3">
        {/* Dates & Guests */}
        <div className={`grid transition-all duration-300 ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-3 gap-2'}`}>
          <div className="flex items-center flex-col text-center">
            <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} mb-1 bg-primary/10 rounded-full flex items-center justify-center`}>
              <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <p className="text-xs font-medium">Check-in</p>
            <p className="text-xs font-medium text-foreground">{formatShort(checkIn)}</p>
          </div>

          <div className="flex items-center flex-col text-center">
            <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} mb-1 bg-primary/10 rounded-full flex items-center justify-center`}>
              <Calendar className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <p className="text-xs font-medium">Check-out</p>
            <p className="text-xs font-medium text-foreground">{formatShort(checkOut)}</p>
          </div>

          <div className="flex items-center flex-col text-center">
            <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} mb-1 bg-primary/10 rounded-full flex items-center justify-center`}>
              <Users className={`${isMobile ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <p className="text-xs font-medium">Guests</p>
            <p className="text-xs font-medium text-foreground">{guests}</p>
          </div>
        </div>

        {/* Nights + Room Type */}
        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            {nights} night{nights > 1 ? 's' : ''} • {roomType}
          </p>
        </div>

        {/* Optional guest/contact */}
        {(guestName || email || phone) && (
          <div className="mt-3 text-xs text-muted-foreground space-y-1">
            {guestName && <div><span className="font-medium">Guest:</span> {guestName}</div>}
            {email && <div><span className="font-medium">Email:</span> {email}</div>}
            {phone && <div><span className="font-medium">Phone:</span> {phone}</div>}
          </div>
        )}

        {/* Line Items */}
        {items.length > 0 && (
          <div className="mt-3 border-t pt-3 space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{it.label}</span>
                <span className="font-medium">{formatPrice(it.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="mt-3 border-t pt-3 flex justify-between items-center">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-sm font-bold">{formatPrice(totalPrice)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
