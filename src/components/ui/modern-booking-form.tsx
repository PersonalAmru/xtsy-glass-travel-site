/**
 * ModernBookingForm - Premium booking form UI component
 * Clean, minimal design with glassmorphism effects
 */

import React, { useState, useCallback } from 'react';
import { MapPin, Calendar, Users, Search, Minus, Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShinyButton } from '@/components/ui/shiny-button';
import { trackButtonClick } from '@/hooks/usePageTracking';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";

interface LocationOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface ModernBookingFormProps {
  locationOptions: LocationOption[];
  location: string;
  onLocationChange: (value: string) => void;
  checkIn: Date | undefined;
  onCheckInChange: (date: Date | undefined) => void;
  checkOut: Date | undefined;
  onCheckOutChange: (date: Date | undefined) => void;
  guests: number;
  onGuestsChange: (count: number) => void;
  onSubmit: () => void;
  className?: string;
  maxGuests?: number;
}

export const ModernBookingForm: React.FC<ModernBookingFormProps> = ({
  locationOptions,
  location,
  onLocationChange,
  checkIn,
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  guests,
  onGuestsChange,
  onSubmit,
  className,
  maxGuests = 20,
}) => {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const handleGuestIncrement = useCallback(() => {
    if (guests < maxGuests) {
      onGuestsChange(guests + 1);
      trackButtonClick('guest_increment', 'booking_form');
    }
  }, [guests, maxGuests, onGuestsChange]);

  const handleGuestDecrement = useCallback(() => {
    if (guests > 1) {
      onGuestsChange(guests - 1);
      trackButtonClick('guest_decrement', 'booking_form');
    }
  }, [guests, onGuestsChange]);

  const handleSubmit = () => {
    trackButtonClick('check_availability', 'booking_form');
    onSubmit();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={cn(
      "w-full max-w-lg mx-auto",
      "bg-card/80 backdrop-blur-xl",
      "border border-border/50 rounded-2xl",
      "shadow-2xl shadow-black/20",
      "p-6 sm:p-8",
      className
    )}>
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-primary via-orange-400 to-rose-400 bg-clip-text text-transparent">
            Best Hostel
          </span>
          <span className="text-foreground"> in Shillong</span>
        </h2>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Location */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Destination
          </label>
          <Select value={location} onValueChange={onLocationChange}>
            <SelectTrigger className={cn(
              "w-full h-14 rounded-xl",
              "bg-background/50 border-border/60",
              "text-foreground text-left",
              "hover:bg-background/70 hover:border-border",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
              "transition-all duration-200"
            )}>
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <SelectValue placeholder="Where to?" />
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {locationOptions.map((opt) => (
                <SelectItem 
                  key={opt.value} 
                  value={opt.value}
                  className="text-foreground hover:bg-accent focus:bg-accent"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{opt.label}</span>
                    {opt.sublabel && (
                      <span className="text-xs text-muted-foreground">{opt.sublabel}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Check-in */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Check-in
            </label>
            <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "w-full h-14 rounded-xl px-3",
                    "bg-background/50 border border-border/60",
                    "text-foreground text-left",
                    "hover:bg-background/70 hover:border-border",
                    "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                    "transition-all duration-200",
                    "flex items-center gap-2"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <span className={cn(
                    "flex-1 text-sm",
                    !checkIn && "text-muted-foreground"
                  )}>
                    {checkIn ? format(checkIn, "MMM d") : "Add date"}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkIn}
                  onSelect={(date) => {
                    onCheckInChange(date);
                    setCheckInOpen(false);
                    // Auto-open checkout if no date set
                    if (date && !checkOut) {
                      setTimeout(() => setCheckOutOpen(true), 100);
                    }
                  }}
                  disabled={(date) => date < today}
                  autoFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Check-out
            </label>
            <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "w-full h-14 rounded-xl px-3",
                    "bg-background/50 border border-border/60",
                    "text-foreground text-left",
                    "hover:bg-background/70 hover:border-border",
                    "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                    "transition-all duration-200",
                    "flex items-center gap-2"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <span className={cn(
                    "flex-1 text-sm",
                    !checkOut && "text-muted-foreground"
                  )}>
                    {checkOut ? format(checkOut, "MMM d") : "Add date"}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkOut}
                  onSelect={(date) => {
                    onCheckOutChange(date);
                    setCheckOutOpen(false);
                  }}
                  disabled={(date) => date <= (checkIn || today)}
                  autoFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Guests
          </label>
          <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full h-14 rounded-xl px-3",
                  "bg-background/50 border border-border/60",
                  "text-foreground text-left",
                  "hover:bg-background/70 hover:border-border",
                  "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                  "transition-all duration-200",
                  "flex items-center justify-between"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm">
                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-popover border-border" align="start">
              <div className="flex items-center justify-between p-2">
                <span className="text-sm font-medium text-foreground">Guests</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGuestDecrement}
                    disabled={guests <= 1}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                      guests > 1
                        ? "bg-accent hover:bg-accent/80 text-foreground active:scale-95"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                    aria-label="Decrease guests"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-bold text-foreground tabular-nums min-w-[2rem] text-center">
                    {guests}
                  </span>
                  <button
                    onClick={handleGuestIncrement}
                    disabled={guests >= maxGuests}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                      guests < maxGuests
                        ? "bg-accent hover:bg-accent/80 text-foreground active:scale-95"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                    aria-label="Increase guests"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {guests >= 20 && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  For 20+ guests, contact us for group rates
                </p>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button - Premium ShinyButton */}
        <ShinyButton
          onClick={handleSubmit}
          className="w-full"
          size="lg"
        >
          <Search className="w-5 h-5" />
          Check Availability
        </ShinyButton>
      </div>

      {/* Footer Tags */}
      <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
          🏨 2 Properties
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
          🌟 Premium
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
          🎯 Best Rates
        </span>
      </div>
    </div>
  );
};

export default ModernBookingForm;
