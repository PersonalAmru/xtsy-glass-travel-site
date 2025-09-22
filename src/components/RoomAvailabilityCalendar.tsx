import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, XCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
  const [availability, setAvailability] = useState<Record<string, AvailabilityData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (roomTypeId) {
      loadAvailability();
    }
  }, [roomTypeId]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get availability for next 3 months
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const { data, error } = await supabase.functions.invoke('get-room-availability', {
        body: {
          room_type_name: roomName, // Use room name instead of ID
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setAvailability(data.availability);
      } else {
        throw new Error(data?.error || 'Failed to load availability');
      }
    } catch (err) {
      console.error('Error loading room availability:', err);
      setError(err instanceof Error ? err.message : 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const getDayAvailability = (date: Date): AvailabilityData | null => {
    const dateStr = date.toISOString().split('T')[0];
    return availability[dateStr] || null;
  };

  const modifiers = {
    soldOut: (date: Date) => {
      const dayAvailability = getDayAvailability(date);
      return dayAvailability?.isSoldOut || false;
    },
    available: (date: Date) => {
      const dayAvailability = getDayAvailability(date);
      return dayAvailability && !dayAvailability.isSoldOut && dayAvailability.available > 0;
    },
    limited: (date: Date) => {
      const dayAvailability = getDayAvailability(date);
      return dayAvailability && !dayAvailability.isSoldOut && dayAvailability.available > 0 && dayAvailability.available <= 2;
    }
  };

  const modifiersStyles = {
    soldOut: {
      backgroundColor: 'hsl(var(--destructive))',
      color: 'hsl(var(--destructive-foreground))',
      opacity: 0.7
    },
    available: {
      backgroundColor: 'hsl(var(--success))',
      color: 'hsl(var(--success-foreground))'
    },
    limited: {
      backgroundColor: 'hsl(var(--warning))',
      color: 'hsl(var(--warning-foreground))'
    }
  };

  const renderDay = (day: any) => {
    const dayDate = day instanceof Date ? day : new Date(day.date || day);
    const dayAvailability = getDayAvailability(dayDate);
    const dayNumber = dayDate.getDate();

    if (!dayAvailability) {
      return <span>{dayNumber}</span>;
    }

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span className="text-sm font-medium">{dayNumber}</span>
        {dayAvailability.isSoldOut ? (
          <XCircle className="w-3 h-3 mt-0.5" />
        ) : dayAvailability.available <= 2 ? (
          <span className="text-xs font-bold">{dayAvailability.available}</span>
        ) : (
          <CheckCircle className="w-3 h-3 mt-0.5" />
        )}
      </div>
    );
  };

  const renderModernDay = (day: any) => {
    const dayDate = day instanceof Date ? day : new Date(day.date || day);
    const dayAvailability = getDayAvailability(dayDate);
    const dayNumber = dayDate.getDate();
    const isToday = dayDate.toDateString() === new Date().toDateString();
    const isSelected = selectedDate && dayDate.toDateString() === selectedDate.toDateString();

    if (!dayAvailability) {
      return (
        <div className="w-full h-10 flex items-center justify-center text-muted-foreground">
          <span className="text-sm">{dayNumber}</span>
        </div>
      );
    }

    const getStatusColor = () => {
      if (dayAvailability.isSoldOut) return 'bg-destructive/20 border-destructive/40 text-destructive-foreground';
      if (dayAvailability.available <= 2) return 'bg-warning/20 border-warning/40 text-warning-foreground';
      return 'bg-success/20 border-success/40 text-success-foreground';
    };

    const getStatusIcon = () => {
      if (dayAvailability.isSoldOut) return <XCircle className="w-3 h-3" />;
      if (dayAvailability.available <= 2) return <span className="text-xs font-bold">{dayAvailability.available}</span>;
      return <CheckCircle className="w-3 h-3" />;
    };

    return (
      <div className={cn(
        "w-full h-10 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200 cursor-pointer hover:scale-105",
        getStatusColor(),
        isToday && "ring-2 ring-primary ring-offset-1",
        isSelected && "ring-2 ring-foreground ring-offset-2 scale-105"
      )}>
        <span className={cn("text-sm font-medium", isToday && "font-bold")}>
          {dayNumber}
        </span>
        <div className="mt-0.5">
          {getStatusIcon()}
        </div>
      </div>
    );
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
          <div className="text-sm text-muted-foreground text-center py-4">
            {error}
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
          {/* Month Navigation Header */}
          <div className="sticky top-0 z-10 bg-card border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-muted-foreground">Available</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-muted-foreground">Limited</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-destructive"></div>
                  <span className="text-muted-foreground">Sold Out</span>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Scrollable Date Picker */}
          <div className="bg-white border-t">
            {/* Date Navigation Header */}
            <div className="px-4 py-2 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Select Date
                </h3>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Sold Out</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Scrolling Date List */}
            <div className="relative">
              <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 gap-2 p-4 pb-6">
                {(() => {
                  const dates = [];
                  const startDate = new Date();
                  const endDate = new Date();
                  endDate.setMonth(endDate.getMonth() + 3);
                  
                  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                    const currentDate = new Date(d);
                    const dayAvailability = getDayAvailability(currentDate);
                    const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();
                    const isToday = currentDate.toDateString() === new Date().toDateString();
                    const isSoldOut = dayAvailability?.isSoldOut || false;
                    const isBookable = dayAvailability && !dayAvailability.isSoldOut;

                    dates.push(
                      <div
                        key={currentDate.toISOString()}
                        onClick={() => {
                          if (isBookable && onDateSelect) {
                            onDateSelect(currentDate);
                          }
                        }}
                        className={cn(
                          "flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200",
                          {
                            // Base styles
                            "bg-white border-gray-200": !isSelected && !isSoldOut && !isBookable,
                            // Bookable dates (green)
                            "bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer": isBookable && !isSelected,
                            // Sold out dates (red, not clickable)
                            "bg-red-50 border-red-200 cursor-not-allowed opacity-75": isSoldOut,
                            // Selected date
                            "bg-blue-500 border-blue-600 text-white": isSelected && isBookable,
                            "bg-red-500 border-red-600 text-white": isSelected && isSoldOut,
                            // Today highlight
                            "ring-2 ring-blue-300 ring-offset-1": isToday && !isSelected,
                            // Hover effects
                            "hover:scale-105": isBookable,
                          }
                        )}
                      >
                        {/* Day of week */}
                        <span className={cn(
                          "text-xs font-medium uppercase",
                          {
                            "text-gray-600": !isSelected && !isSoldOut,
                            "text-green-700": isBookable && !isSelected,
                            "text-red-600": isSoldOut && !isSelected,
                            "text-white": isSelected,
                          }
                        )}>
                          {currentDate.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        
                        {/* Date number */}
                        <span className={cn(
                          "text-lg font-bold",
                          {
                            "text-gray-900": !isSelected && !isSoldOut,
                            "text-green-800": isBookable && !isSelected,
                            "text-red-700": isSoldOut && !isSelected,
                            "text-white": isSelected,
                          }
                        )}>
                          {currentDate.getDate()}
                        </span>
                        
                        {/* Status indicator */}
                        <div className="mt-1">
                          {isSoldOut ? (
                            <XCircle className={cn(
                              "w-3 h-3",
                              isSelected ? "text-white" : "text-red-600"
                            )} />
                          ) : isBookable ? (
                            dayAvailability.available <= 2 ? (
                              <span className={cn(
                                "text-xs font-bold px-1 py-0.5 rounded",
                                isSelected ? "text-white" : "text-green-700 bg-green-100"
                              )}>
                                {dayAvailability.available}
                              </span>
                            ) : (
                              <CheckCircle className={cn(
                                "w-3 h-3",
                                isSelected ? "text-white" : "text-green-600"
                              )} />
                            )
                          ) : (
                            <div className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  return dates;
                })()}
              </div>
              
              {/* Scroll indicators */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
              <div className="bg-gray-50 border-t p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    {(() => {
                      const dayAvailability = getDayAvailability(selectedDate);
                      if (!dayAvailability) return null;
                      
                      return (
                        <div className="text-xs text-gray-600 mt-1">
                          {dayAvailability.available} of {dayAvailability.total} rooms available
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    {(() => {
                      const dayAvailability = getDayAvailability(selectedDate);
                      if (!dayAvailability) return null;
                      
                      if (dayAvailability.isSoldOut) {
                        return (
                          <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Sold Out
                          </div>
                        );
                      } else if (dayAvailability.available <= 2) {
                        return (
                          <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                            Limited ({dayAvailability.available} left)
                          </div>
                        );
                      } else {
                        return (
                          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Available
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