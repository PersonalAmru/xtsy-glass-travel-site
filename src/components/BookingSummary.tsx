import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Users, Edit, Check, X } from 'lucide-react';
import { useScreenSize } from '@/hooks/use-mobile';
interface BookingSummaryProps {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  onEdit?: () => void;
  onUpdateBooking?: (checkIn: string, checkOut: string, guests: number) => void;
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
  onUpdateBooking,
  roomType = "XTSY Accommodation",
  totalPrice = 0,
  guestName = "",
  email = "",
  phone = "",
  address = ""
}) => {
  const screenSize = useScreenSize();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCheckIn, setEditedCheckIn] = useState(checkIn);
  const [editedCheckOut, setEditedCheckOut] = useState(checkOut);
  const [editedGuests, setEditedGuests] = useState(guests);
  
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

  const handleSave = () => {
    if (onUpdateBooking) {
      onUpdateBooking(editedCheckIn, editedCheckOut, editedGuests);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCheckIn(checkIn);
    setEditedCheckOut(checkOut);
    setEditedGuests(guests);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      setIsEditing(true);
    }
  };

  const isMobileView = screenSize === 'mobile';
  return <Card className={`transition-all duration-300 backdrop-blur-sm bg-card/95 ${isMobileView ? 'sticky top-2 mx-2 shadow-md border-border/60' : 'sticky top-4 shadow-sm border-border/50'}`}>
      <CardHeader className="transition-all duration-300 pb-2 pt-3 px-3">
        <div className="flex items-center justify-between">
          <CardTitle className="transition-all duration-300 text-base text-center flex-1">Live the Shillong Vibe</CardTitle>
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button variant="ghost" size={isMobileView ? "sm" : "default"} onClick={handleSave} className="text-green-600 hover:text-green-700 transition-colors shrink-0">
                  <Check className={`${isMobileView ? 'h-3 w-3' : 'h-4 w-4'}`} />
                </Button>
                <Button variant="ghost" size={isMobileView ? "sm" : "default"} onClick={handleCancel} className="text-red-600 hover:text-red-700 transition-colors shrink-0">
                  <X className={`${isMobileView ? 'h-3 w-3' : 'h-4 w-4'}`} />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size={isMobileView ? "sm" : "default"} onClick={handleEditClick} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                <Edit className={`${isMobileView ? 'h-3 w-3' : 'h-4 w-4'} ${isMobileView ? '' : 'mr-1'}`} />
                {!isMobileView && 'Edit'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="transition-all duration-300 pt-0 pb-3 px-3">
        <div className={`grid transition-all duration-300 ${isMobileView ? 'grid-cols-3 gap-1' : 'grid-cols-3 gap-2'}`}>
          {/* Check-in */}
          <div className="flex items-center transition-all duration-300 flex-col text-center">
            <div className={`flex items-center justify-center transition-all duration-300 ${isMobileView ? 'w-6 h-6 mb-1 bg-primary/10 rounded-full' : 'w-8 h-8 mb-1 bg-primary/10 rounded-full'}`}>
              <Calendar className={`transition-all duration-300 ${isMobileView ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <div className="w-full">
              <p className={`font-medium transition-all duration-300 ${isMobileView ? 'text-xs' : 'text-xs'}`}>
                Check-in
              </p>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedCheckIn}
                  onChange={(e) => setEditedCheckIn(e.target.value)}
                  className={`mt-1 text-center ${isMobileView ? 'text-xs h-6' : 'text-xs h-7'} border-primary/20 focus:border-primary`}
                />
              ) : (
                <p className={`text-foreground transition-all duration-300 ${isMobileView ? 'text-xs font-medium' : 'text-xs font-medium'}`}>
                  {formatDate(checkIn)}
                </p>
              )}
            </div>
          </div>

          {/* Check-out */}
          <div className="flex items-center transition-all duration-300 flex-col text-center">
            <div className={`flex items-center justify-center transition-all duration-300 ${isMobileView ? 'w-6 h-6 mb-1 bg-primary/10 rounded-full' : 'w-8 h-8 mb-1 bg-primary/10 rounded-full'}`}>
              <Calendar className={`transition-all duration-300 ${isMobileView ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <div className="w-full">
              <p className={`font-medium transition-all duration-300 ${isMobileView ? 'text-xs' : 'text-xs'}`}>
                Check-out
              </p>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedCheckOut}
                  onChange={(e) => setEditedCheckOut(e.target.value)}
                  className={`mt-1 text-center ${isMobileView ? 'text-xs h-6' : 'text-xs h-7'} border-primary/20 focus:border-primary`}
                />
              ) : (
                <p className={`text-foreground transition-all duration-300 ${isMobileView ? 'text-xs font-medium' : 'text-xs font-medium'}`}>
                  {formatDate(checkOut)}
                </p>
              )}
            </div>
          </div>

          {/* Guests */}
          <div className="flex items-center transition-all duration-300 flex-col text-center">
            <div className={`flex items-center justify-center transition-all duration-300 ${isMobileView ? 'w-6 h-6 mb-1 bg-primary/10 rounded-full' : 'w-8 h-8 mb-1 bg-primary/10 rounded-full'}`}>
              <Users className={`transition-all duration-300 ${isMobileView ? 'h-3 w-3' : 'h-3 w-3'} text-primary`} />
            </div>
            <div className="w-full">
              <p className={`font-medium transition-all duration-300 ${isMobileView ? 'text-xs' : 'text-xs'}`}>
                Guests
              </p>
              {isEditing ? (
                <Input
                  type="number"
                  min="1"
                  max="8"
                  value={editedGuests}
                  onChange={(e) => setEditedGuests(parseInt(e.target.value) || 1)}
                  className={`mt-1 text-center ${isMobileView ? 'text-xs h-6' : 'text-xs h-7'} border-primary/20 focus:border-primary`}
                />
              ) : (
                <p className={`text-foreground transition-all duration-300 ${isMobileView ? 'text-xs font-medium' : 'text-xs font-medium'}`}>
                  {guests}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default BookingSummary;
