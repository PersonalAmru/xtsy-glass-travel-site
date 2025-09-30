import React from 'react';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRoomAvailability, getAvailabilityStatus, type AvailabilityData } from '@/hooks/useRoomAvailability';
import { Loader2 } from 'lucide-react';

interface AvailabilityCalendarProps {
  roomName: string;
  roomId?: string;
  daysToShow?: number;
  compact?: boolean;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  roomName,
  roomId,
  daysToShow = 30,
  compact = false
}) => {
  const { availability, loading, error } = useRoomAvailability(roomName, true, roomId);
  
  const today = startOfDay(new Date());
  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(today, i));

  const getStatusColor = (date: Date): string => {
    const status = getAvailabilityStatus(date, availability);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = availability[dateStr];

    // Check if admin has blocked this room entirely
    if (dayData?.isBlocked) {
      return 'bg-gray-500/80 border-gray-600';
    }

    switch (status) {
      case 'soldOut':
        return 'bg-red-500/80 border-red-600';
      case 'limited':
        return 'bg-yellow-500/80 border-yellow-600';
      case 'available':
        return 'bg-green-500/80 border-green-600';
      default:
        return 'bg-gray-300/50 border-gray-400';
    }
  };

  const getStatusLabel = (date: Date): string => {
    const status = getAvailabilityStatus(date, availability);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = availability[dateStr];

    if (dayData?.isBlocked) {
      return 'Admin Blocked';
    }

    switch (status) {
      case 'soldOut':
        return 'Sold Out';
      case 'limited':
        return `Limited (${dayData?.available || 0} left)`;
      case 'available':
        return `Available (${dayData?.available || 0})`;
      default:
        return 'Unknown';
    }
  };

  const getTooltipContent = (date: Date): React.ReactNode => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = availability[dateStr];

    return (
      <div className="text-xs space-y-1">
        <div className="font-semibold">{format(date, 'EEE, MMM d')}</div>
        <div>{getStatusLabel(date)}</div>
        {dayData && (
          <>
            <div className="text-muted-foreground">
              {dayData.bookedCount} / {dayData.total} booked
            </div>
            {dayData.isBlocked && (
              <div className="text-amber-300">Blocked by admin</div>
            )}
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading availability...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 border-red-500/50 bg-red-500/10">
        <p className="text-sm text-red-600">Error loading availability: {error}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Availability Calendar</h4>
          <div className="flex gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600" />
              <span>Limited</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600" />
              <span>Sold Out</span>
            </div>
          </div>
        </div>

        <TooltipProvider>
          <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
            {dates.map((date) => {
              const isToday = isSameDay(date, today);
              return (
                <Tooltip key={date.toISOString()}>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        ${compact ? 'h-8' : 'h-12'} 
                        rounded-lg border-2 
                        ${getStatusColor(date)}
                        ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                        transition-all hover:scale-105 cursor-pointer
                        flex flex-col items-center justify-center
                        text-white font-medium
                      `}
                    >
                      <div className={compact ? 'text-xs' : 'text-sm'}>
                        {format(date, 'd')}
                      </div>
                      {!compact && (
                        <div className="text-[10px] opacity-80">
                          {format(date, 'EEE')}
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {getTooltipContent(date)}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
    </Card>
  );
};
