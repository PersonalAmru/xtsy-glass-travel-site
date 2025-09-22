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

          {/* Scrollable Calendar Grid */}
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-background">
            <div className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateSelect}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                components={{
                  Day: ({ day }) => renderModernDay(day)
                }}
                className={cn("w-full pointer-events-auto")}
                disabled={(date) => date < new Date()}
                showOutsideDays={false}
                numberOfMonths={3}
              />
            </div>
          </div>

          {/* Selected Date Info Panel */}
          {selectedDate && (
            <div className="sticky bottom-0 bg-gradient-to-t from-card via-card to-transparent p-4 border-t">
              <div className="bg-muted/50 backdrop-blur-sm rounded-lg p-3 border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">
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
                        <div className="text-xs text-muted-foreground mt-1">
                          {dayAvailability.available} of {dayAvailability.total} available
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const dayAvailability = getDayAvailability(selectedDate);
                      if (!dayAvailability) return null;
                      
                      if (dayAvailability.isSoldOut) {
                        return (
                          <Badge variant="destructive" className="text-xs">
                            Sold Out
                          </Badge>
                        );
                      } else if (dayAvailability.available <= 2) {
                        return (
                          <Badge variant="secondary" className="text-xs bg-warning/20 text-warning-foreground border-warning">
                            Limited
                          </Badge>
                        );
                      } else {
                        return (
                          <Badge variant="secondary" className="text-xs bg-success/20 text-success-foreground border-success">
                            Available
                          </Badge>
                        );
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomAvailabilityCalendar;