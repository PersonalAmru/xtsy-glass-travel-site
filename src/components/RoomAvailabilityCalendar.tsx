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
          room_type_id: roomTypeId,
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
      <CardContent className="p-3">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          components={{
            Day: ({ day }) => renderDay(day)
          }}
          className={cn("w-full pointer-events-auto")}
          disabled={(date) => date < new Date()}
        />
        
        {/* Legend */}
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span>Limited (≤2)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-destructive opacity-70"></div>
              <span>Sold Out</span>
            </div>
          </div>
        </div>

        {/* Selected date info */}
        {selectedDate && (
          <div className="mt-3 p-2 bg-muted rounded-md">
            <div className="text-sm font-medium">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            {(() => {
              const dayAvailability = getDayAvailability(selectedDate);
              if (!dayAvailability) return null;
              
              return (
                <div className="text-xs text-muted-foreground mt-1">
                  {dayAvailability.isSoldOut ? (
                    <Badge variant="destructive" className="text-xs">
                      Sold Out
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {dayAvailability.available} / {dayAvailability.total} available
                      </Badge>
                      {dayAvailability.isBlocked && (
                        <Badge variant="outline" className="text-xs">
                          Admin Blocked
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoomAvailabilityCalendar;