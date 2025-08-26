import React from 'react';
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
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEE, MMM dd');
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="sticky top-4 z-10 shadow-lg border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-orange-500" />
            Your Booking Details
          </h3>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit} className="border-orange-300 text-orange-600 hover:bg-orange-50">
              <Edit3 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-orange-100">
            <div className="bg-orange-100 p-2 rounded-full">
              <CalendarDays className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-in</p>
              <p className="font-semibold text-gray-800">{formatDate(checkIn)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-orange-100">
            <div className="bg-red-100 p-2 rounded-full">
              <CalendarDays className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-out</p>
              <p className="font-semibold text-gray-800">{formatDate(checkOut)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-orange-100">
            <div className="bg-purple-100 p-2 rounded-full">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Guests</p>
              <p className="font-semibold text-gray-800">{guests} {guests === 1 ? 'Guest' : 'Guests'}</p>
            </div>
          </div>
        </div>
        
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
      </CardContent>
    </Card>
  );
};

export default BookingSummary;