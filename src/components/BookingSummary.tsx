import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, Clock, Edit } from 'lucide-react';
import { useScreenSize } from '@/hooks/use-mobile';

interface BookingSummaryProps {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  onEdit?: () => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  checkIn,
  checkOut,
  guests,
  nights,
  onEdit
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const screenSize = useScreenSize();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isScrolled || screenSize === 'mobile') {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isMobileView = screenSize === 'mobile';
  const isCompactView = isScrolled || isMobileView;

  return (
    <Card className={`transition-all duration-300 backdrop-blur-sm bg-card/95 ${
      isMobileView 
        ? 'sticky top-2 mx-2 shadow-md border-border/60' 
        : isScrolled 
          ? 'sticky top-4 shadow-sm border-border/50' 
          : 'sticky top-4 shadow-lg border-border'
    }`}>
      <CardHeader className={`transition-all duration-300 ${
        isCompactView ? 'pb-2 pt-3 px-3' : 'pb-4 pt-6 px-6'
      }`}>
        <div className="flex items-center justify-between">
          <CardTitle className={`transition-all duration-300 ${
            isCompactView ? 'text-base' : 'text-xl'
          }`}>
            {isMobileView ? 'Stay Details' : 'Your Stay'}
          </CardTitle>
          {onEdit && (
            <Button
              variant="ghost"
              size={isMobileView ? "sm" : "default"}
              onClick={onEdit}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <Edit className={`${isMobileView ? 'h-3 w-3' : 'h-4 w-4'} ${isMobileView ? '' : 'mr-1'}`} />
              {!isMobileView && 'Edit'}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={`transition-all duration-300 ${
        isCompactView ? 'pt-0 pb-3 px-3' : 'pt-0 pb-6 px-6'
      }`}>
        <div className={`grid transition-all duration-300 ${
          isMobileView 
            ? 'grid-cols-3 gap-1' 
            : isScrolled 
              ? 'grid-cols-3 gap-2' 
              : 'grid-cols-1 gap-4'
        }`}>
          {/* Check-in */}
          <div className={`flex items-center transition-all duration-300 ${
            isCompactView ? 'flex-col text-center' : 'space-x-3'
          }`}>
            <div className={`flex items-center justify-center transition-all duration-300 ${
              isMobileView
                ? 'w-6 h-6 mb-1 bg-primary/10 rounded-full' 
                : isScrolled 
                  ? 'w-8 h-8 mb-1 bg-primary/10 rounded-full' 
                  : 'w-10 h-10 bg-primary/10 rounded-full'
            }`}>
              <Calendar className={`transition-all duration-300 ${
                isMobileView ? 'h-3 w-3' : isScrolled ? 'h-3 w-3' : 'h-4 w-4'
              } text-primary`} />
            </div>
            <div>
              <p className={`font-medium transition-all duration-300 ${
                isMobileView ? 'text-xs' : isScrolled ? 'text-xs' : 'text-sm'
              }`}>
                Check-in
              </p>
              <p className={`text-foreground transition-all duration-300 ${
                isMobileView ? 'text-xs font-medium' : isScrolled ? 'text-xs font-medium' : 'text-base font-semibold'
              }`}>
                {formatDate(checkIn)}
              </p>
            </div>
          </div>

          {/* Check-out */}
          <div className={`flex items-center transition-all duration-300 ${
            isCompactView ? 'flex-col text-center' : 'space-x-3'
          }`}>
            <div className={`flex items-center justify-center transition-all duration-300 ${
              isMobileView
                ? 'w-6 h-6 mb-1 bg-primary/10 rounded-full' 
                : isScrolled 
                  ? 'w-8 h-8 mb-1 bg-primary/10 rounded-full' 
                  : 'w-10 h-10 bg-primary/10 rounded-full'
            }`}>
              <Calendar className={`transition-all duration-300 ${
                isMobileView ? 'h-3 w-3' : isScrolled ? 'h-3 w-3' : 'h-4 w-4'
              } text-primary`} />
            </div>
            <div>
              <p className={`font-medium transition-all duration-300 ${
                isMobileView ? 'text-xs' : isScrolled ? 'text-xs' : 'text-sm'
              }`}>
                Check-out
              </p>
              <p className={`text-foreground transition-all duration-300 ${
                isMobileView ? 'text-xs font-medium' : isScrolled ? 'text-xs font-medium' : 'text-base font-semibold'
              }`}>
                {formatDate(checkOut)}
              </p>
            </div>
          </div>

          {/* Guests */}
          <div className={`flex items-center transition-all duration-300 ${
            isCompactView ? 'flex-col text-center' : 'space-x-3'
          }`}>
            <div className={`flex items-center justify-center transition-all duration-300 ${
              isMobileView
                ? 'w-6 h-6 mb-1 bg-primary/10 rounded-full' 
                : isScrolled 
                  ? 'w-8 h-8 mb-1 bg-primary/10 rounded-full' 
                  : 'w-10 h-10 bg-primary/10 rounded-full'
            }`}>
              <Users className={`transition-all duration-300 ${
                isMobileView ? 'h-3 w-3' : isScrolled ? 'h-3 w-3' : 'h-4 w-4'
              } text-primary`} />
            </div>
            <div>
              <p className={`font-medium transition-all duration-300 ${
                isMobileView ? 'text-xs' : isScrolled ? 'text-xs' : 'text-sm'
              }`}>
                Guests
              </p>
              <p className={`text-foreground transition-all duration-300 ${
                isMobileView ? 'text-xs font-medium' : isScrolled ? 'text-xs font-medium' : 'text-base font-semibold'
              }`}>
                {guests}
              </p>
            </div>
          </div>
        </div>

        {/* Duration and Location - Only show when not compact view */}
        {!isCompactView && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {nights} night{nights !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                XTSY270, Meghalaya
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingSummary;