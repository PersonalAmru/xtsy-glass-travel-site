/**
 * Inventory Calendar View - Redesigned per reference screenshots
 * Shows all room types with color-coded calendars, availability controls
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ROOM_TYPES, getBookableRoomTypes, type RoomTypeConfig, PROPERTY_LABELS } from '@/config/roomTypes';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Minus,
  Plus,
  Check,
} from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isBefore,
  startOfToday,
  parseISO,
} from 'date-fns';

interface BlockedDate {
  date: string;
  room_type: string;
  blocked: boolean;
}

interface InventoryEntry {
  date: string;
  room_type_id: string;
  available_count: number;
}

interface BookingEntry {
  check_in: string;
  check_out: string;
  room_type: string;
  quantity: number;
  booking_status: string;
}

type DateStatus = 'bookable' | 'soldOut' | 'closed' | 'needsAttention' | 'past';

interface RoomCalendarData {
  roomId: string;
  dates: Record<string, DateStatus>;
}

export function InventoryCalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [bookings, setBookings] = useState<BookingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomTypeConfig | null>(null);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState(false);
  
  // Availability control state
  const [isOpen, setIsOpen] = useState(true);
  const [roomsToSell, setRoomsToSell] = useState(6);
  const [showDateDetails, setShowDateDetails] = useState(false);

  // Use the single source of truth for room types
  const rooms = useMemo(() => getBookableRoomTypes(), []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const monthStart = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

      const [blockedRes, inventoryRes, bookingsRes] = await Promise.all([
        supabase
          .from('blocked_dates')
          .select('date, room_type, blocked')
          .gte('date', monthStart)
          .lte('date', monthEnd),
        supabase
          .from('room_inventory')
          .select('date, room_type_id, available_count')
          .gte('date', monthStart)
          .lte('date', monthEnd),
        supabase
          .from('bookings')
          .select('check_in, check_out, room_type, quantity, booking_status')
          .gte('check_in', monthStart)
          .lte('check_out', monthEnd)
          .in('booking_status', ['confirmed', 'pending']),
      ]);

      if (blockedRes.error) throw blockedRes.error;
      if (inventoryRes.error) throw inventoryRes.error;
      if (bookingsRes.error) throw bookingsRes.error;

      setBlockedDates(blockedRes.data || []);
      setInventory(inventoryRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('inventory-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blocked_dates' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_inventory' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  const getDateStatus = useCallback((roomId: string, date: Date): DateStatus => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const today = startOfToday();

    if (isBefore(date, today)) return 'past';

    // Check if blocked/closed
    const isBlocked = blockedDates.some(b => b.room_type === roomId && b.date === dateStr && b.blocked);
    if (isBlocked) return 'closed';

    // Check inventory
    const inv = inventory.find(i => i.room_type_id === roomId && i.date === dateStr);
    if (inv && inv.available_count === 0) return 'soldOut';

    // Check bookings
    const hasBooking = bookings.some(b => {
      const checkIn = parseISO(b.check_in);
      const checkOut = parseISO(b.check_out);
      return b.room_type === roomId && date >= checkIn && date < checkOut;
    });
    if (hasBooking) return 'soldOut';

    return 'bookable';
  }, [blockedDates, inventory, bookings]);

  const getInventoryForDate = useCallback((roomId: string, dateStr: string) => {
    const inv = inventory.find(i => i.room_type_id === roomId && i.date === dateStr);
    const room = ROOM_TYPES[roomId];
    return {
      available: inv?.available_count ?? room?.totalUnits ?? 0,
      total: room?.totalUnits ?? 0,
    };
  }, [inventory]);

  const statusColors: Record<DateStatus, string> = {
    bookable: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    soldOut: 'bg-amber-600/80 text-white',
    closed: 'bg-zinc-600 text-zinc-300',
    needsAttention: 'bg-rose-600 text-white',
    past: 'bg-zinc-800 text-zinc-500 cursor-not-allowed',
  };

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDateSelection = (date: Date) => {
    if (isBefore(date, startOfToday())) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedDates(prev => {
      const next = new Set(prev);
      if (next.has(dateStr)) {
        next.delete(dateStr);
      } else {
        next.add(dateStr);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedRoom || selectedDates.size === 0) return;
    setUpdating(true);

    try {
      const dates = Array.from(selectedDates);

      if (!isOpen) {
        // Block the dates
        const datesToBlock = dates.map(date => ({
          date,
          room_type: selectedRoom.id,
          blocked: true,
        }));
        const { error } = await supabase
          .from('blocked_dates')
          .upsert(datesToBlock, { onConflict: 'date,room_type' });
        if (error) throw error;
      } else {
        // Unblock if needed
        await supabase
          .from('blocked_dates')
          .delete()
          .eq('room_type', selectedRoom.id)
          .in('date', dates);

        // Update inventory
        const entries = dates.map(date => ({
          date,
          room_type_id: selectedRoom.id,
          available_count: roomsToSell,
          last_updated: new Date().toISOString(),
        }));
        const { error } = await supabase
          .from('room_inventory')
          .upsert(entries, { onConflict: 'date,room_type_id' });
        if (error) throw error;
      }

      toast.success(`Updated ${dates.length} date(s)`);
      setSelectedDates(new Set());
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save changes');
    } finally {
      setUpdating(false);
    }
  };

  const handleClear = () => {
    setSelectedDates(new Set());
  };

  // Get date details for selected dates
  const selectedDateDetails = useMemo(() => {
    if (!selectedRoom) return [];
    return Array.from(selectedDates).sort().map(dateStr => ({
      date: dateStr,
      ...getInventoryForDate(selectedRoom.id, dateStr),
    }));
  }, [selectedDates, selectedRoom, getInventoryForDate]);

  const renderOverviewCalendar = (room: RoomTypeConfig) => {
    return (
      <div 
        key={room.id}
        className="cursor-pointer group"
        onClick={() => setSelectedRoom(room)}
      >
        <div className="grid grid-cols-7 gap-0.5">
          {weekDays.map((day, i) => (
            <div key={`${room.id}-${day}-${i}`} className="text-center text-[8px] text-muted-foreground py-0.5">
              {day.charAt(0)}
            </div>
          ))}
          {Array.from({ length: days[0].getDay() }).map((_, i) => (
            <div key={`${room.id}-empty-${i}`} />
          ))}
          {days.map(day => {
            const status = getDateStatus(room.id, day);
            return (
              <div
                key={`${room.id}-${format(day, 'yyyy-MM-dd')}`}
                className={cn(
                  'aspect-square rounded-sm text-[8px] flex items-center justify-center',
                  statusColors[status]
                )}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
        <p className="text-xs font-medium mt-2 text-center group-hover:text-primary transition-colors">
          {room.shortName}
        </p>
      </div>
    );
  };

  const renderDetailedCalendar = () => {
    if (!selectedRoom) return null;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setSelectedRoom(null)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">{selectedRoom.propertyType}</p>
            <h2 className="text-lg font-semibold">{selectedRoom.name}</h2>
          </div>
          <div className="w-10" />
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between px-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm text-muted-foreground py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: days[0].getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const status = getDateStatus(selectedRoom.id, day);
            const isSelected = selectedDates.has(dateStr);

            return (
              <button
                key={dateStr}
                onClick={() => toggleDateSelection(day)}
                disabled={status === 'past'}
                className={cn(
                  'aspect-square rounded-lg text-sm font-medium flex items-center justify-center transition-all',
                  statusColors[status],
                  isSelected && 'ring-2 ring-sky-400 ring-offset-2 ring-offset-background',
                  isToday(day) && 'font-bold'
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-600" />
            <span>Bookable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-600/80" />
            <span>Sold out</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-zinc-600" />
            <span>Closed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-rose-600" />
            <span>Needs attention</span>
          </div>
        </div>

        {/* Availability Controls (show when dates selected) */}
        {selectedDates.size > 0 && (
          <div className="space-y-4 border-t border-border pt-4">
            <h3 className="font-semibold">Availability</h3>
            
            {/* Open/Close Toggle */}
            <RadioGroup value={isOpen ? 'open' : 'close'} onValueChange={(v) => setIsOpen(v === 'open')}>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <Label htmlFor="open" className="cursor-pointer flex-1">Open</Label>
                <RadioGroupItem value="open" id="open" />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <Label htmlFor="close" className="cursor-pointer flex-1">Close</Label>
                <RadioGroupItem value="close" id="close" />
              </div>
            </RadioGroup>

            {/* Rooms to Sell */}
            {isOpen && (
              <div className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rooms to sell</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setRoomsToSell(Math.max(0, roomsToSell - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{roomsToSell}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setRoomsToSell(Math.min(selectedRoom.totalUnits, roomsToSell + 1))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Current availability info */}
                <div className="text-xs text-amber-500 flex items-start gap-2 bg-amber-500/10 p-3 rounded-lg">
                  <span className="mt-0.5">⚠️</span>
                  <span>
                    {selectedRoom.shortName} currently has between {Math.min(...selectedDateDetails.map(d => d.available))} and {Math.max(...selectedDateDetails.map(d => d.available))} rooms available for these {selectedDates.size} selected dates.
                  </span>
                </div>

                {/* Toggle date details */}
                <button 
                  className="text-sky-400 text-sm hover:underline"
                  onClick={() => setShowDateDetails(!showDateDetails)}
                >
                  {showDateDetails ? 'Hide' : 'Show'} date details
                </button>

                {/* Date Details Table */}
                {showDateDetails && (
                  <div className="border border-amber-600/50 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 text-xs font-medium p-2 bg-amber-900/30">
                      <span>Date</span>
                      <span className="text-right">Availability (current/new)</span>
                    </div>
                    {selectedDateDetails.map(({ date, available }) => (
                      <div key={date} className="grid grid-cols-2 text-xs p-2 border-t border-amber-600/30">
                        <span>{format(parseISO(date), 'dd MMM yyyy')}</span>
                        <span className="text-right">
                          {available} <span className="text-sky-400 ml-2">{roomsToSell}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <div className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">{selectedDates.size} nights</span>
                <br />
                <span className="text-xs">Selected</span>
              </div>
              <div className="flex-1" />
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
              <Button onClick={handleSave} disabled={updating}>
                {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Select dates prompt */}
        {selectedDates.size === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-20 h-20 mx-auto mb-4 opacity-50">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="10" y="10" width="16" height="16" rx="2" fill="currentColor" opacity="0.3" />
                <rect x="30" y="10" width="16" height="16" rx="2" fill="currentColor" opacity="0.4" />
                <rect x="50" y="10" width="16" height="16" rx="2" fill="currentColor" opacity="0.5" />
                <rect x="70" y="10" width="16" height="16" rx="2" fill="currentColor" opacity="0.6" />
                <rect x="10" y="30" width="16" height="16" rx="2" fill="currentColor" opacity="0.7" />
                <rect x="30" y="30" width="16" height="16" rx="2" fill="currentColor" opacity="0.8" />
                <rect x="50" y="30" width="16" height="16" rx="2" fill="currentColor" opacity="0.9" />
                <rect x="70" y="30" width="16" height="16" rx="2" fill="currentColor" />
                <rect x="10" y="50" width="16" height="16" rx="2" fill="hsl(var(--primary))" />
                <rect x="30" y="50" width="16" height="16" rx="2" fill="hsl(var(--primary))" />
                <rect x="50" y="50" width="16" height="16" rx="2" fill="hsl(var(--primary))" />
              </svg>
            </div>
            <p className="font-medium">Select dates to make changes</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Availability</h1>
          {!selectedRoom && <p className="text-muted-foreground">Select a room type</p>}
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : selectedRoom ? (
        renderDetailedCalendar()
      ) : (
        <>
          {/* Month Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="font-medium w-32 text-center">{format(currentMonth, 'MMMM yyyy')}</span>
            <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Room Calendars Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {rooms.map(room => renderOverviewCalendar(room))}
          </div>
        </>
      )}
    </div>
  );
}
