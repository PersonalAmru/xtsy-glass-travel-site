import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, XCircle, CheckCircle } from 'lucide-react';
import { useRoomAvailability, getAvailabilityStatus } from '@/hooks/useRoomAvailability';
import { cn } from '@/lib/utils';

interface SharedAvailabilityCalendarProps {
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

const SharedAvailabilityCalendar: React.FC<SharedAvailabilityCalendarProps> = ({
  roomTypeId,
  roomName,
  onDateSelect,
  selectedDate
}) => {
  // Use the optimized availability hook with roomId parameter
  const { availability, loading, error } = useRoomAvailability(roomName, !!roomName, roomTypeId);

  const getDayAvailability = (date: Date): AvailabilityData | null => {
    const dateStr = date.toISOString().split('T')[0];
    return availability[dateStr] || null;
  };

  if (loading) {
    return (
      <Card className="w-full bg-gray-900 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
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
      <Card className="w-full bg-gray-900 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
            <CalendarIcon className="w-4 h-4" />
            Room Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-400 text-center py-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="w-4 h-4" />
              Error Loading Availability
            </div>
            <div className="text-xs text-gray-400">
              {error}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-gray-900 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-white">
          <CalendarIcon className="w-4 h-4" />
          {roomName} Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Modern Scrolling Calendar Container */}
        <div className="relative">
          {/* Horizontal Scrollable Date Picker */}
          <div className="bg-gray-800 border-t border-gray-700">
            {/* Compact Legend */}
            <div className="px-3 py-2 border-b border-gray-600 bg-gray-800">
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-300">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-300">Limited</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-300">Sold Out</span>
                </div>
              </div>
            </div>

            {/* Horizontal Scrolling Date List */}
            <div className="relative">
              <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 gap-1 p-3 pb-4">
                {(() => {
                  const dates: React.ReactNode[] = [];
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
                        <div key={`month-${monthYear}`} className="flex-shrink-0 w-12 h-14 flex items-center justify-center border-r border-gray-600 mr-2">
                          <span className="text-xs font-semibold text-gray-400 transform -rotate-90 whitespace-nowrap">
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
                            "bg-gray-800 border-gray-600": !isSelected && !isAvailable && !isLimited && !isSoldOut,
                            // Available dates (green)
                            "bg-green-900 border-green-600 hover:bg-green-800 cursor-pointer": isAvailable && !isSelected,
                            // Limited availability (orange)
                            "bg-orange-900 border-orange-600 hover:bg-orange-800 cursor-pointer": isLimited && !isSelected,
                            // Sold out dates (red)
                            "bg-red-900 border-red-600 cursor-not-allowed opacity-75": isSoldOut,
                            // Selected states
                            "bg-blue-600 border-blue-500 text-white shadow-md": isSelected && isBookable,
                            "bg-red-600 border-red-500 text-white": isSelected && isSoldOut,
                            // Today highlight
                            "ring-1 ring-blue-400": isToday && !isSelected,
                          }
                        )}
                      >
                        {/* Day of week */}
                        <span className={cn(
                          "text-xs font-medium uppercase leading-none",
                          {
                            "text-gray-400": !isSelected && !isSoldOut && !isAvailable && !isLimited,
                            "text-green-300": isAvailable && !isSelected,
                            "text-orange-300": isLimited && !isSelected,
                            "text-red-300": isSoldOut && !isSelected,
                            "text-white": isSelected,
                          }
                        )}>
                          {currentDate.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                        </span>
                        
                        {/* Date number */}
                        <span className={cn(
                          "text-sm font-bold leading-none mt-1",
                          {
                            "text-gray-200": !isSelected && !isSoldOut && !isAvailable && !isLimited,
                            "text-green-200": isAvailable && !isSelected,
                            "text-orange-200": isLimited && !isSelected,
                            "text-red-300": isSoldOut && !isSelected,
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
                              isSelected ? "text-white" : "text-red-400"
                            )} />
                          ) : isLimited && dayAvailability ? (
                            <span className={cn(
                              "text-xs font-bold leading-none",
                              isSelected ? "text-white" : "text-orange-300"
                            )}>
                              {dayAvailability.available}
                            </span>
                          ) : isAvailable ? (
                            <CheckCircle className={cn(
                              "w-2.5 h-2.5",
                              isSelected ? "text-white" : "text-green-400"
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
              <div className="bg-gray-800 border-t border-gray-600 p-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-gray-200">
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
                        <div className="text-gray-400 mt-0.5">
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
                          <div className="px-2 py-1 bg-red-900 text-red-300 rounded text-xs font-medium">
                            🔴 Sold Out
                          </div>
                        );
                      } else if (status === 'limited') {
                        return (
                          <div className="px-2 py-1 bg-orange-900 text-orange-300 rounded text-xs font-medium">
                            🟠 {dayAvailability.available} left
                          </div>
                        );
                      } else {
                        return (
                          <div className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs font-medium">
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

export default SharedAvailabilityCalendar;