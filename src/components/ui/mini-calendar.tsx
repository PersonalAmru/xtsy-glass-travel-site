"use client";

import * as React from "react";
import {
  format,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isBefore,
  startOfToday,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DAYS_OF_WEEK = [
  { key: "sun", label: "Sun" },
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
];

export type AvailabilityStatus = 'available' | 'limited' | 'soldOut' | 'blocked' | 'unknown';

interface DayAvailability {
  date: Date;
  status: AvailabilityStatus;
  available?: number;
  total?: number;
}

interface MiniCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  availability?: Record<string, { available: number; total: number; isBlocked?: boolean; isSoldOut?: boolean }>;
  className?: string;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  selectedDate,
  onDateSelect,
  availability = {},
  className,
}) => {
  const [currentWeek, setCurrentWeek] = React.useState(() => selectedDate || new Date());
  const today = startOfToday();

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 0 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 0 }),
  });

  const getAvailabilityStatus = (date: Date): AvailabilityStatus => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = availability[dateStr];
    
    if (!dayData) return 'unknown';
    if (dayData.isBlocked) return 'blocked';
    if (dayData.isSoldOut || dayData.available === 0) return 'soldOut';
    if (dayData.available <= 2) return 'limited';
    return 'available';
  };

  const getStatusColor = (status: AvailabilityStatus): string => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500';
      case 'limited':
        return 'bg-amber-500';
      case 'soldOut':
        return 'bg-red-500';
      case 'blocked':
        return 'bg-slate-500';
      default:
        return 'bg-slate-400';
    }
  };

  const isPast = (date: Date) => isBefore(date, today);

  return (
    <div className={cn("rounded-xl bg-white/5 border border-white/10 p-4", className)}>
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm font-medium text-white">
          {format(currentWeek, "MMMM yyyy")}
        </span>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of week headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day.key}
            className="text-center text-xs font-medium text-white/50 py-1"
          >
            {day.label}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const past = isPast(day);
          const status = getAvailabilityStatus(day);
          const statusColor = getStatusColor(status);
          const isDisabled = past || status === 'soldOut' || status === 'blocked';

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isDisabled && onDateSelect?.(day)}
              disabled={isDisabled}
              className={cn(
                "relative aspect-square rounded-lg flex flex-col items-center justify-center",
                "transition-all duration-200 text-sm font-medium",
                past && "opacity-40 cursor-not-allowed",
                !past && !isDisabled && "hover:bg-white/10 cursor-pointer",
                isDisabled && !past && "cursor-not-allowed opacity-60",
                isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-slate-900",
                isToday && !isSelected && "ring-1 ring-white/30"
              )}
            >
              <span className={cn(
                "text-white",
                past && "text-white/40",
                isSelected && "font-bold"
              )}>
                {format(day, "d")}
              </span>
              
              {/* Availability indicator dot */}
              {!past && (
                <span className={cn(
                  "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                  statusColor
                )} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-4 text-xs text-white/50">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Limited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
