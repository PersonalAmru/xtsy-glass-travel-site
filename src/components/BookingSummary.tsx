
import React, { useState, useEffect } from 'react';
import { CalendarDays, Users, Clock, Edit3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays, parseISO } from 'date-fns';

interface BookingSummaryProps {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  onEdit?: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  checkIn,
  checkOut,
  guests,
  nights,
  onEdit
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100); // Trigger after 100px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, isScrolled ? 'MMM dd' : 'EEE, MMM dd');
    } catch {
      return dateString;
    }
  };

  return (
    <Card className={`sticky top-4 z-10 shadow-lg border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 transition-all duration-300 ${
      isScrolled ? 'scale-90 shadow-md' : 'scale-100'
    }`}>
      <CardContent className={`transition-all duration-300 ${isScrolled ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-gray-800 flex items-center transition-all duration-300 ${
            isScrolled ? 'text-lg' : 'text-xl'
          }`}>
            <CalendarDays className={`mr-2 text-orange-500 transition-all duration-300 ${
              isScrolled ? 'h-4 w-4' : 'h-5 w-5'
            }`} />
            {isScrolled ? 'Booking' : 'Your Booking Details'}
          </h3>
          {onEdit && (
            <Button 
              variant="outline" 
              size={isScrolled ? "sm" : "sm"} 
              onClick={onEdit} 
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
        
        <div className={`grid gap-4 transition-all duration-300 ${
          isScrolled ? 'md:grid-cols-4' : 'md:grid-cols-3'
        }`}>
          <div className={`flex items-center space-x-3 bg-white rounded-lg border border-orange-100 transition-all duration-300 ${
            isScrolled ? 'p-2' : 'p-3'
          }`}>
            <div className={`bg-orange-100 rounded-full transition-all duration-300 ${
              isScrolled ? 'p-1.5' : 'p-2'
            }`}>
              <CalendarDays className={`text-orange-600 transition-all duration-300 ${
                isScrolled ? 'h-3 w-3' : 'h-4 w-4'
              }`} />
            </div>
            <div>
              <p className={`text-gray-500 transition-all duration-300 ${
                isScrolled ? 'text-xs' : 'text-sm'
              }`}>Check-in</p>
              <p className={`font-semibold text-gray-800 transition-all duration-300 ${
                isScrolled ? 'text-sm' : 'text-base'
              }`}>{formatDate(checkIn)}</p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-3 bg-white rounded-lg border border-orange-100 transition-all duration-300 ${
            isScrolled ? 'p-2' : 'p-3'
          }`}>
            <div className={`bg-red-100 rounded-full transition-all duration-300 ${
              isScrolled ? 'p-1.5' : 'p-2'
            }`}>
              <CalendarDays className={`text-red-600 transition-all duration-300 ${
                isScrolled ? 'h-3 w-3' : 'h-4 w-4'
              }`} />
            </div>
            <div>
              <p className={`text-gray-500 transition-all duration-300 ${
                isScrolled ? 'text-xs' : 'text-sm'
              }`}>Check-out</p>
              <p className={`font-semibold text-gray-800 transition-all duration-300 ${
                isScrolled ? 'text-sm' : 'text-base'
              }`}>{formatDate(checkOut)}</p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-3 bg-white rounded-lg border border-orange-100 transition-all duration-300 ${
            isScrolled ? 'p-2' : 'p-3'
          }`}>
            <div className={`bg-purple-100 rounded-full transition-all duration-300 ${
              isScrolled ? 'p-1.5' : 'p-2'
            }`}>
              <Users className={`text-purple-600 transition-all duration-300 ${
                isScrolled ? 'h-3 w-3' : 'h-4 w-4'
              }`} />
            </div>
            <div>
              <p className={`text-gray-500 transition-all duration-300 ${
                isScrolled ? 'text-xs' : 'text-sm'
              }`}>Guests</p>
              <p className={`font-semibold text-gray-800 transition-all duration-300 ${
                isScrolled ? 'text-sm' : 'text-base'
              }`}>{guests} {guests === 1 ? 'Guest' : 'Guests'}</p>
            </div>
          </div>

          {isScrolled && (
            <div className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-orange-100">
              <div className="bg-blue-100 p-1.5 rounded-full">
                <Clock className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Nights</p>
                <p className="text-sm font-semibold text-gray-800">{nights}</p>
              </div>
            </div>
          )}
        </div>
        
        {!isScrolled && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Duration:</span>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {nights} {nights === 1 ? 'Night' : 'Nights'}
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              📍 Shillong, Meghalaya
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
