import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, XCircle, CheckCircle } from 'lucide-react';
import { useRoomAvailability, getAvailabilityStatus } from '@/hooks/useRoomAvailability';
import { cn } from '@/lib/utils';

interface RoomAvailabilityCalendarProps {
  roomTypeId: string;
  roomName: string;
  onDateSelect?: (date: Date | undefined) => void;
  selectedDate?: Date;
}

interface AvailabilityData {
  available: number;
  total: number;
  isBlocked: boolean;
  isSoldOut: boolean;
  bookedCount: number;
}

const RoomAvailabilityCalendar: React.FC<RoomAvailabilityCalendarProps> = ({
  roomTypeId,
  roomName,
  onDateSelect,
  selectedDate
}) => {
  // Use the new real-time availability hook
  const { availability, loading, error } = useRoomAvailability(roomName, !!roomName, roomTypeId);

  const getDayAvailability = (date: Date): AvailabilityData | null => {
    const dateStr = date.toISOString().split('T')[0];
    return availability[dateStr] || null;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Room Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Room Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-destructive text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="w-4 h-4" />
              Error Loading Availability
            </div>
            <div className="text-xs text-muted-foreground">
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-xs text-primary hover:underline"
            >
              Refresh Page
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          {roomName} Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Modern Scrolling Calendar Container */}
        <div className="relative">
          {/* Horizontal Scrollable Date Picker */}
          <div className="bg-white border-t">
            {/* Compact Legend */}
            <div className="px-3 py-2 border-b bg-gray-50">
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600">Limited</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Sold Out</span>
                </div>
              </div>
            </div>

            {/* Horizontal Scrolling Date List */}
            <div className="relative">
              <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 gap-1 p-3 pb-4">
                {(() => {
                  const dates = [];
                  const startDate = new Date();
                  const endDate = new Date();
                  endDate.setMonth(endDate.getMonth() + 3);
                  let currentMonth = '';
                  
                  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    const currentDate = new Date(d);
                    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    const dayAvailability = getDayAvailability(currentDate);
                    const availabilityStatus = getAvailabilityStatus(currentDate, availability);
                    const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();
                    const isToday = currentDate.toDateString() === new Date().toDateString();
                    
                    const isSoldOut = availabilityStatus === 'soldOut';
                    const isLimited = availabilityStatus === 'limited';
                    const isAvailable = availabilityStatus === 'available';
                    const isBookable = !isSoldOut;

                    // Show month divider when month changes
                    if (monthYear !== currentMonth) {
                      currentMonth = monthYear;
                      dates.push(
                        <div key={`month-${monthYear}`} className="flex-shrink-0 w-12 h-14 flex items-center justify-center border-r border-gray-200 mr-2">
                          <span className="text-xs font-semibold text-gray-500 transform -rotate-90 whitespace-nowrap">
                            {monthYear}
                          </span>
                        </div>
                      );
                    }

                    dates.push(
                      <div
                        key={currentDate.toISOString()}
                        onClick={() => {
                          if (isBookable && onDateSelect) {
                            onDateSelect(currentDate);
                          }
                        }}
                        className={cn(
                          "flex-shrink-0 w-12 h-14 flex flex-col items-center justify-center rounded-md border transition-all duration-200",
                          {
                            // Base styles
                            "bg-white border-gray-200": !isSelected && !isAvailable && !isLimited && !isSoldOut,
                             // Available dates (green) - ✅
                             "bg-green-50 border-green-300 hover:bg-green-100 cursor-pointer": isAvailable && !isSelected,
                             // Limited availability (orange) - 🟠
                             "bg-orange-50 border-orange-300 hover:bg-orange-100 cursor-pointer": isLimited && !isSelected,
                             // Sold out dates (red) - 🔴
                             "bg-red-50 border-red-300 cursor-not-allowed opacity-75": isSoldOut,
                            // Selected states
                            "bg-blue-500 border-blue-600 text-white shadow-md": isSelected && isBookable,
                            "bg-red-500 border-red-600 text-white": isSelected && isSoldOut,
                            // Today highlight
                            "ring-1 ring-blue-400": isToday && !isSelected,
                          }
                        )}
                      >
                        {/* Day of week */}
                        <span className={cn(
                          "text-xs font-medium uppercase leading-none",
                          {
                            "text-gray-500": !isSelected && !isSoldOut && !isAvailable && !isLimited,
                            "text-green-600": isAvailable && !isSelected,
                            "text-orange-600": isLimited && !isSelected,
                            "text-red-500": isSoldOut && !isSelected,
                            "text-white": isSelected,
                          }
                        )}>
                          {currentDate.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                        </span>
                        
                        {/* Date number */}
                        <span className={cn(
                          "text-sm font-bold leading-none mt-1",
                          {
                            "text-gray-900": !isSelected && !isSoldOut && !isAvailable && !isLimited,
                            "text-green-700": isAvailable && !isSelected,
                            "text-orange-700": isLimited && !isSelected,
                            "text-red-600": isSoldOut && !isSelected,
                            "text-white": isSelected,
                          }
                        )}>
                          {currentDate.getDate()}
                        </span>
                        
                        {/* Status indicator */}
                        <div className="mt-1">
                          {isSoldOut ? (
                            <XCircle className={cn(
                              "w-2.5 h-2.5",
                              isSelected ? "text-white" : "text-red-500"
                            )} />
                          ) : isLimited && dayAvailability ? (
                            <span className={cn(
                              "text-xs font-bold leading-none",
                              isSelected ? "text-white" : "text-orange-600"
                            )}>
                              {dayAvailability.available}
                            </span>
                          ) : isAvailable ? (
                            <CheckCircle className={cn(
                              "w-2.5 h-2.5",
                              isSelected ? "text-white" : "text-green-500"
                            )} />
                          ) : (
                            <div className="w-2.5 h-2.5" />
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  return dates;
                })()}
              </div>
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
              <div className="bg-gray-50 border-t p-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-gray-900">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </div>
                    {(() => {
                      const dayAvailability = getDayAvailability(selectedDate);
                      if (!dayAvailability) return null;
                      
                      return (
                        <div className="text-gray-600 mt-0.5">
                          {dayAvailability.available}/{dayAvailability.total} available
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    {(() => {
                      const dayAvailability = getDayAvailability(selectedDate);
                      const status = getAvailabilityStatus(selectedDate, availability);
                      
                      if (!dayAvailability || !status) return null;
                      
                      if (status === 'soldOut') {
                        return (
                          <div className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                            🔴 Sold Out
                          </div>
                        );
                      } else if (status === 'limited') {
                        return (
                          <div className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                            🟠 {dayAvailability.available} left
                          </div>
                        );
                      } else {
                        return (
                          <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            ✅ Available
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomAvailabilityCalendar;