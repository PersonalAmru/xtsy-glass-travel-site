/**
 * SearchEditBar - Inline editable search criteria bar
 * Allows users to modify location, dates, and guests without going back
 * Session-persistent for consistent booking flow
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Calendar, Users, Minus, Plus, ChevronDown, Check } from 'lucide-react';
import { format, addDays } from 'date-fns';

/**
 * Parse a date string (YYYY-MM-DD) as local time, not UTC
 * This prevents timezone offset issues where dates shift by 1 day
 */
const parseLocalDate = (dateString: string | null): Date | undefined => {
  if (!dateString) return undefined;
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};
import { cn } from '@/lib/utils';
import { getLocationOptions, Location } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { ShinyButton } from '@/components/ui/shiny-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useComponentTracking } from '@/hooks/useComponentTracking';

interface SearchEditBarProps {
  location: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  onSearchUpdate: (params: {
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => void;
  className?: string;
}

export const SearchEditBar: React.FC<SearchEditBarProps> = ({
  location: initialLocation,
  checkIn: initialCheckIn,
  checkOut: initialCheckOut,
  guests: initialGuests,
  onSearchUpdate,
  className,
}) => {
  const navigate = useNavigate();
  const { trackButton, trackFormSubmit } = useComponentTracking({ section: 'search_edit_bar' });
  
  // Local state for editing - use parseLocalDate to avoid timezone offset issues
  const [location, setLocation] = useState(initialLocation);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    parseLocalDate(initialCheckIn)
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    parseLocalDate(initialCheckOut)
  );
  const [guests, setGuests] = useState(initialGuests);
  
  // Popover states
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Sync state when props change (e.g., new search from hero)
  // Use parseLocalDate to avoid timezone offset issues
  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  useEffect(() => {
    setCheckInDate(parseLocalDate(initialCheckIn));
  }, [initialCheckIn]);

  useEffect(() => {
    setCheckOutDate(parseLocalDate(initialCheckOut));
  }, [initialCheckOut]);

  useEffect(() => {
    setGuests(initialGuests);
  }, [initialGuests]);
  
  const locationOptions = getLocationOptions();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if any value has changed
  const hasChanges = 
    location !== initialLocation ||
    (checkInDate?.toISOString().split('T')[0] !== initialCheckIn) ||
    (checkOutDate?.toISOString().split('T')[0] !== initialCheckOut) ||
    guests !== initialGuests;

  const handleGuestIncrement = useCallback(() => {
    if (guests < 20) {
      setGuests(prev => prev + 1);
      trackButton('guest_increment_search');
    }
  }, [guests, trackButton]);

  const handleGuestDecrement = useCallback(() => {
    if (guests > 1) {
      setGuests(prev => prev - 1);
      trackButton('guest_decrement_search');
    }
  }, [guests, trackButton]);

  const handleApplyChanges = () => {
    if (!checkInDate || !checkOutDate) {
      return;
    }

    const checkInStr = checkInDate.toISOString().split('T')[0];
    const checkOutStr = checkOutDate.toISOString().split('T')[0];

    // Update session storage
    const searchParams = {
      location,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      guests,
    };
    sessionStorage.setItem('xtsy_search_params', JSON.stringify(searchParams));

    // Track the update
    trackFormSubmit('search_modify', {
      location,
      nights: Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)),
      guests,
    });

    // Notify parent and update URL
    onSearchUpdate(searchParams);
    
    // Update URL params
    const urlParams = new URLSearchParams({
      location,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      guests: guests.toString(),
    });
    navigate(`/search?${urlParams.toString()}`, { replace: true });
    
    setIsEditing(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Select';
    return format(date, 'MMM dd');
  };

  const formatFullDate = (date: Date | undefined) => {
    if (!date) return 'Select date';
    return format(date, 'MMM dd, yyyy');
  };

  const getLocationLabel = () => {
    const loc = locationOptions.find(l => l.value === location);
    return loc ? loc.label : 'Select';
  };

  return (
    <div className={cn(
      "bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-4",
      className
    )}>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        {/* Location Selector */}
        <div className="flex-1 min-w-0">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
            Destination
          </label>
          <Select value={location} onValueChange={(val) => { setLocation(val); setIsEditing(true); }}>
            <SelectTrigger className={cn(
              "w-full h-12 rounded-xl",
              "bg-background/50 border-border/60",
              "text-foreground",
              "hover:bg-background/70 hover:border-border",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            )}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <SelectValue placeholder="Where to?" />
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

        {/* Date Range */}
        <div className="flex-1 min-w-0">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
            Dates
          </label>
          <div className="flex items-center gap-2">
            {/* Check-in */}
            <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex-1 h-12 rounded-xl px-3",
                    "bg-background/50 border border-border/60",
                    "text-foreground text-left",
                    "hover:bg-background/70 hover:border-border",
                    "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                    "transition-all duration-200",
                    "flex items-center gap-2"
                  )}
                >
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className={cn(
                    "text-sm truncate",
                    !checkInDate && "text-muted-foreground"
                  )}>
                    {formatDate(checkInDate)}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkInDate}
                  onSelect={(date) => {
                    setCheckInDate(date);
                    setIsEditing(true);
                    setCheckInOpen(false);
                    if (date && (!checkOutDate || date >= checkOutDate)) {
                      setCheckOutDate(addDays(date, 1));
                    }
                    setTimeout(() => setCheckOutOpen(true), 100);
                  }}
                  disabled={(date) => date < today}
                  autoFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <span className="text-muted-foreground">→</span>

            {/* Check-out */}
            <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex-1 h-12 rounded-xl px-3",
                    "bg-background/50 border border-border/60",
                    "text-foreground text-left",
                    "hover:bg-background/70 hover:border-border",
                    "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                    "transition-all duration-200",
                    "flex items-center gap-2"
                  )}
                >
                  <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className={cn(
                    "text-sm truncate",
                    !checkOutDate && "text-muted-foreground"
                  )}>
                    {formatDate(checkOutDate)}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                <CalendarComponent
                  mode="single"
                  selected={checkOutDate}
                  onSelect={(date) => {
                    setCheckOutDate(date);
                    setIsEditing(true);
                    setCheckOutOpen(false);
                  }}
                  disabled={(date) => date <= (checkInDate || today)}
                  autoFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Guests */}
        <div className="flex-shrink-0 w-full lg:w-auto">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 block">
            Guests
          </label>
          <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full lg:w-32 h-12 rounded-xl px-3",
                  "bg-background/50 border border-border/60",
                  "text-foreground text-left",
                  "hover:bg-background/70 hover:border-border",
                  "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                  "transition-all duration-200",
                  "flex items-center justify-between"
                )}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{guests}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 bg-popover border-border" align="end">
              <div className="flex items-center justify-between p-2">
                <span className="text-sm font-medium text-foreground">Guests</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGuestDecrement}
                    disabled={guests <= 1}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all",
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
                    disabled={guests >= 20}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      guests < 20
                        ? "bg-accent hover:bg-accent/80 text-foreground active:scale-95"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                    aria-label="Increase guests"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Apply Button - Only show when there are changes */}
        {hasChanges && checkInDate && checkOutDate && (
          <div className="flex-shrink-0">
            <label className="text-xs font-medium text-transparent uppercase tracking-wider mb-1 block lg:visible invisible">
              Apply
            </label>
            <ShinyButton
              onClick={handleApplyChanges}
              size="sm"
              className="w-full lg:w-auto h-12"
            >
              <Check className="w-4 h-4" />
              Update
            </ShinyButton>
          </div>
        )}
      </div>

      {/* Summary line */}
      {checkInDate && checkOutDate && (
        <div className="mt-3 pt-3 border-t border-border/30 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))} night{Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) !== 1 ? 's' : ''} • {guests} guest{guests !== 1 ? 's' : ''}
          </span>
          <span className="text-foreground font-medium">
            {formatFullDate(checkInDate)} → {formatFullDate(checkOutDate)}
          </span>
        </div>
      )}
    </div>
  );
};

export default SearchEditBar;
