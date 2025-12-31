/**
 * PremiumBookingCalendar - World-class iOS-style calendar
 * Matches the premium dark green design with colored availability dots
 */

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isBefore,
  isAfter,
  isWithinInterval,
  startOfToday,
  getDay
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumBookingCalendarProps {
  checkIn?: Date;
  checkOut?: Date;
  onDateSelect: (date: Date) => void;
  selectingCheckOut: boolean;
  minDate?: Date;
  className?: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Simulated availability data - in production, this would come from API
const getAvailabilityDots = (date: Date): string[] => {
  const day = date.getDate();
  // Simulate different availability states with colored dots
  if (day % 7 === 0) return ["#4ade80", "#60a5fa", "#f472b6"]; // High availability
  if (day % 5 === 0) return ["#4ade80", "#f472b6"]; // Medium availability
  if (day % 3 === 0) return ["#60a5fa"]; // Low availability
  if (day % 4 === 0) return ["#4ade80", "#60a5fa"]; // Some availability
  return []; // No special indicators
};

export function PremiumBookingCalendar({
  checkIn,
  checkOut,
  onDateSelect,
  selectingCheckOut,
  minDate = startOfToday(),
  className,
}: PremiumBookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => 
    checkIn || new Date()
  );
  const [direction, setDirection] = React.useState(0);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate padding days for the start of the month
  const startPadding = getDay(monthStart);
  const prevMonth = subMonths(currentMonth, 1);
  const prevMonthEnd = endOfMonth(prevMonth);
  const paddingDays = Array.from({ length: startPadding }, (_, i) => {
    const day = prevMonthEnd.getDate() - startPadding + i + 1;
    return new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
  });

  // Calculate padding days for the end of the month
  const endPadding = (7 - ((days.length + startPadding) % 7)) % 7;
  const nextMonth = addMonths(currentMonth, 1);
  const trailingDays = Array.from({ length: endPadding }, (_, i) => {
    return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i + 1);
  });

  const allDays = [...paddingDays, ...days, ...trailingDays];

  const goToPrevMonth = () => {
    setDirection(-1);
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const isInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false;
    return isWithinInterval(date, { start: checkIn, end: checkOut });
  };

  const isRangeStart = (date: Date) => checkIn && isSameDay(date, checkIn);
  const isRangeEnd = (date: Date) => checkOut && isSameDay(date, checkOut);
  const isSelected = (date: Date) => isRangeStart(date) || isRangeEnd(date);
  const isDisabled = (date: Date) => isBefore(date, minDate);
  const isOutsideMonth = (date: Date) => !isSameMonth(date, currentMonth);

  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return;
    onDateSelect(date);
  };

  return (
    <div className={cn(
      "rounded-2xl overflow-hidden",
      "bg-gradient-to-br from-[hsl(160,35%,25%)] to-[hsl(160,40%,20%)]",
      "p-4 md:p-6",
      className
    )}>
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevMonth}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <AnimatePresence mode="wait">
          <motion.h2
            key={format(currentMonth, "MMMM yyyy")}
            initial={{ opacity: 0, y: direction > 0 ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -10 : 10 }}
            transition={{ duration: 0.2 }}
            className="text-lg font-semibold text-white"
          >
            {format(currentMonth, "MMMM yyyy")}
          </motion.h2>
        </AnimatePresence>

        <button
          onClick={goToNextMonth}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-white/60 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={format(currentMonth, "yyyy-MM")}
          initial={{ opacity: 0, x: direction * 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-1"
        >
          {allDays.map((date, index) => {
            const outside = isOutsideMonth(date);
            const disabled = isDisabled(date);
            const selected = isSelected(date);
            const inRange = isInRange(date);
            const rangeStart = isRangeStart(date);
            const rangeEnd = isRangeEnd(date);
            const dots = !outside && !disabled ? getAvailabilityDots(date) : [];

            return (
              <motion.button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={disabled}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                className={cn(
                  "relative aspect-square flex flex-col items-center justify-center",
                  "rounded-xl transition-all duration-200",
                  "text-sm font-medium",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                  // Base states
                  outside && "text-white/25",
                  disabled && !outside && "text-white/30 cursor-not-allowed",
                  !outside && !disabled && !selected && !inRange && "text-white/90 hover:bg-white/10 active:bg-white/15",
                  // Range selection
                  inRange && !selected && "bg-white/10 text-white",
                  rangeStart && !rangeEnd && "rounded-r-none",
                  rangeEnd && !rangeStart && "rounded-l-none",
                  // Selected state - matching the screenshot's teal/green selection
                  selected && "bg-[hsl(160,45%,35%)] text-white shadow-lg shadow-black/20"
                )}
              >
                <span className="relative z-10">{format(date, "d")}</span>
                
                {/* Availability Dots */}
                {dots.length > 0 && (
                  <div className="absolute bottom-1.5 flex gap-0.5">
                    {dots.map((color, i) => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-xs text-white/50">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />
          <span>Limited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f472b6]" />
          <span>Popular</span>
        </div>
      </div>
    </div>
  );
}

export default PremiumBookingCalendar;
