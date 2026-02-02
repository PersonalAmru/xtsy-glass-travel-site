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

const DAYS_OF_WEEK = [
  { key: "sun", label: "S" },
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
];

export type AvailabilityStatus = 'available' | 'limited' | 'soldOut' | 'blocked' | 'unknown';

interface AvailabilityDataItem {
  available: number;
  total: number;
  isBlocked?: boolean;
  isSoldOut?: boolean;
  adminBlocked?: boolean;
}

interface MiniCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  availability?: Record<string, AvailabilityDataItem>;
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
    // Admin-blocked dates should be clearly marked
    if (dayData.adminBlocked || dayData.isBlocked) return 'blocked';
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
    <div className={cn("rounded-lg bg-white/5 border border-white/10 p-3", className)}>
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
          onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          aria-label="Previous week"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <span className="text-sm font-medium text-white/80">
          {format(currentWeek, "MMM yyyy")}
        </span>
        
        <button
          className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
          onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
          aria-label="Next week"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar Grid - Days headers and dates aligned */}
      <div className="grid grid-cols-7">
        {/* Day headers row */}
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day.key}
            className="flex items-center justify-center h-8 text-[11px] font-medium text-white/50"
          >
            {day.label}
          </div>
        ))}
        
        {/* Date cells - perfectly aligned below headers */}
        {weekDays.map((day) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const past = isPast(day);
          const status = getAvailabilityStatus(day);
          const statusColor = getStatusColor(status);
          const isDisabled = past || status === 'soldOut' || status === 'blocked';

          return (
            <div key={day.toISOString()} className="flex justify-center">
              <button
                onClick={() => !isDisabled && onDateSelect?.(day)}
                disabled={isDisabled}
                className={cn(
                  "relative w-9 h-9 rounded-md flex flex-col items-center justify-center",
                  "transition-all duration-150 text-sm font-medium",
                  past && "opacity-30 cursor-not-allowed",
                  !past && !isDisabled && "hover:bg-white/10 cursor-pointer",
                  isDisabled && !past && "cursor-not-allowed opacity-50",
                  isSelected && "bg-primary/20 ring-1 ring-primary",
                  isToday && !isSelected && "ring-1 ring-white/30"
                )}
              >
                <span className={cn(
                  "text-white/80",
                  past && "text-white/30",
                  isSelected && "text-primary font-semibold"
                )}>
                  {format(day, "d")}
                </span>
                
                {/* Availability indicator dot - centered below number */}
                {!past && (
                  <span className={cn(
                    "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                    statusColor
                  )} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-center gap-4 text-[10px] text-white/40">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Limited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
