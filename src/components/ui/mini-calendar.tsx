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
  { key: "sun", label: "S" },
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
];

export type AvailabilityStatus = 'available' | 'limited' | 'soldOut' | 'blocked' | 'unknown';

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
    <div className={cn("rounded-lg bg-white/5 border border-white/10 p-2", className)}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
          onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        
        <span className="text-xs font-medium text-white/70">
          {format(currentWeek, "MMM yyyy")}
        </span>
        
        <button
          className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
          onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Days of week headers - compact */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day.key}
            className="text-center text-[10px] font-medium text-white/40 py-0.5"
          >
            {day.label}
          </div>
        ))}
      </div>

      {/* Calendar days - compact */}
      <div className="grid grid-cols-7 gap-0.5">
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
                "relative w-8 h-8 rounded flex flex-col items-center justify-center",
                "transition-all duration-150 text-xs font-medium",
                past && "opacity-30 cursor-not-allowed",
                !past && !isDisabled && "hover:bg-white/10 cursor-pointer",
                isDisabled && !past && "cursor-not-allowed opacity-50",
                isSelected && "bg-primary/20 ring-1 ring-primary",
                isToday && !isSelected && "ring-1 ring-white/20"
              )}
            >
              <span className={cn(
                "text-white/80",
                past && "text-white/30",
                isSelected && "text-primary font-semibold"
              )}>
                {format(day, "d")}
              </span>
              
              {/* Availability indicator dot */}
              {!past && (
                <span className={cn(
                  "absolute bottom-0.5 w-1 h-1 rounded-full",
                  statusColor
                )} />
              )}
            </button>
          );
        })}
      </div>

      {/* Compact Legend */}
      <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-center gap-3 text-[10px] text-white/40">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Limited</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
