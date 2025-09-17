import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useRoomAvailability } from '@/hooks/useRoomAvailability';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar as CalendarIcon, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

interface CalendarWithAvailabilityProps {
  roomTypeId: string;
  selectedDates: DateRange | undefined;
  onDateSelect: (dates: DateRange | undefined) => void;
  quantity?: number;
  className?: string;
}

export const CalendarWithAvailability = ({
  roomTypeId,
  selectedDates,
  onDateSelect,
  quantity = 1,
  className
}: CalendarWithAvailabilityProps) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  
  // Calculate date range for availability fetch (next 3 months)
  const today = new Date();
  const fromDate = today.toISOString().split('T')[0];
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3);
  const toDate = futureDate.toISOString().split('T')[0];

  const {
    availability,
    roomTypes,
    loading,
    error,
    isSoldOut,
    getAvailableCount,
    isRoomAvailable
  } = useRoomAvailability(roomTypeId, fromDate, toDate);

  const selectedRoomType = roomTypes.find(rt => rt.id === roomTypeId);

  // Custom day renderer with availability information
  const renderDay = (day: Date) => {
    const dateStr = day.toISOString().split('T')[0];
    const availableCount = getAvailableCount(dateStr);
    const soldOut = isSoldOut(dateStr);
    const isPast = day < new Date(today.toDateString());
    
    return (
      <div
        className={cn(
          "relative w-full h-full flex items-center justify-center",
          soldOut && !isPast && "bg-red-100 text-red-600",
          availableCount > 0 && availableCount <= 3 && !soldOut && "bg-yellow-100 text-yellow-800",
          availableCount > 3 && "bg-green-100 text-green-800"
        )}
        onMouseEnter={() => setHoveredDate(day)}
        onMouseLeave={() => setHoveredDate(null)}
      >
        <span>{day.getDate()}</span>
        {soldOut && !isPast && (
          <div className="absolute -top-1 -right-1">
            <AlertCircle className="h-3 w-3 text-red-500" />
          </div>
        )}
        {availableCount > 0 && availableCount <= 3 && !soldOut && (
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <Badge variant="secondary" className="text-xs px-1 py-0">
              {availableCount}
            </Badge>
          </div>
        )}
      </div>
    );
  };

  // Validate selected dates
  useEffect(() => {
    if (selectedDates?.from && selectedDates?.to) {
      const checkInStr = selectedDates.from.toISOString().split('T')[0];
      const checkOutStr = selectedDates.to.toISOString().split('T')[0];
      
      if (!isRoomAvailable(checkInStr, checkOutStr, quantity)) {
        // Clear selection if not available
        onDateSelect(undefined);
      }
    }
  }, [selectedDates, isRoomAvailable, quantity, onDateSelect]);

  // Custom disabled dates function
  const isDateDisabled = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    const isPast = date < new Date(today.toDateString());
    const soldOut = isSoldOut(dateStr);
    
    return isPast || soldOut;
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Loading Calendar...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Select Dates
          {selectedRoomType && (
            <Badge variant="outline" className="ml-2">
              {selectedRoomType.name}
            </Badge>
          )}
        </CardTitle>
        {quantity > 1 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Looking for {quantity} {quantity === 1 ? 'room' : 'rooms'}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Calendar
          mode="range"
          selected={selectedDates}
          onSelect={onDateSelect}
          disabled={isDateDisabled}
          numberOfMonths={2}
          className="w-full"
        />
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border rounded"></div>
            <span>Limited (≤3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border rounded relative">
              <AlertCircle className="h-3 w-3 text-red-500 absolute -top-1 -right-1" />
            </div>
            <span>Sold Out</span>
          </div>
        </div>

        {/* Hover tooltip */}
        {hoveredDate && (
          <div className="mt-2 p-2 bg-muted rounded text-sm">
            <strong>{hoveredDate.toLocaleDateString()}</strong>
            <br />
            {isSoldOut(hoveredDate.toISOString().split('T')[0]) ? (
              <span className="text-red-600 font-medium">You just missed it! 😔</span>
            ) : (
              <span>
                {getAvailableCount(hoveredDate.toISOString().split('T')[0])} rooms available
              </span>
            )}
          </div>
        )}

        {/* Selection validation message */}
        {selectedDates?.from && selectedDates?.to && (
          <div className="mt-4">
            {isRoomAvailable(
              selectedDates.from.toISOString().split('T')[0],
              selectedDates.to.toISOString().split('T')[0],
              quantity
            ) ? (
              <Alert>
                <CalendarIcon className="h-4 w-4" />
                <AlertDescription className="text-green-600">
                  ✅ Available for your selected dates!
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  ❌ Not available for selected dates. Please choose different dates.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};