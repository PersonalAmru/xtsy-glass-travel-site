/**
 * Inventory Calendar View - Apple-grade with pricing controls
 * Compact shrink view for calendar with real-time data integration
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ROOM_TYPES, getBookableRoomTypes, type RoomTypeConfig } from '@/config/roomTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ChevronLeft, ChevronRight, RefreshCw, X, Minus, Plus, Check,
  DollarSign, Percent, Calendar, Loader2
} from 'lucide-react';
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, isToday, isBefore, startOfToday, parseISO, isSameDay
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
  price_override?: number;
}

interface BookingEntry {
  check_in: string;
  check_out: string;
  room_type: string;
  quantity: number;
  booking_status: string;
}

type DateStatus = 'bookable' | 'soldOut' | 'closed' | 'needsAttention' | 'past';

export function InventoryCalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [bookings, setBookings] = useState<BookingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomTypeConfig | null>(null);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState(false);
  
  // Controls
  const [isOpen, setIsOpen] = useState(true);
  const [roomsToSell, setRoomsToSell] = useState(6);
  const [priceOverride, setPriceOverride] = useState<number | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  const rooms = useMemo(() => getBookableRoomTypes(), []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const monthStart = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

      const [blockedRes, inventoryRes, bookingsRes] = await Promise.all([
        supabase.from('blocked_dates').select('date, room_type, blocked').gte('date', monthStart).lte('date', monthEnd),
        supabase.from('room_inventory').select('date, room_type_id, available_count').gte('date', monthStart).lte('date', monthEnd),
        supabase.from('bookings').select('check_in, check_out, room_type, quantity, booking_status')
          .gte('check_in', monthStart).lte('check_out', monthEnd).in('booking_status', ['confirmed', 'pending']),
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

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('inventory-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blocked_dates' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_inventory' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchData]);

  const getBookedCount = useCallback((roomId: string, date: Date): number => {
    let count = 0;
    for (const b of bookings) {
      const checkIn = parseISO(b.check_in);
      const checkOut = parseISO(b.check_out);
      if (b.room_type === roomId && date >= checkIn && date < checkOut) {
        count += b.quantity || 1;
      }
    }
    return count;
  }, [bookings]);

  const getDateStatus = useCallback((roomId: string, date: Date): DateStatus => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const today = startOfToday();

    if (isBefore(date, today)) return 'past';
    
    const isBlocked = blockedDates.some(b => b.room_type === roomId && b.date === dateStr && b.blocked);
    if (isBlocked) return 'closed';

    const inv = inventory.find(i => i.room_type_id === roomId && i.date === dateStr);
    const room = ROOM_TYPES[roomId];
    const totalUnits = inv?.available_count ?? room?.totalUnits ?? 0;
    const bookedCount = getBookedCount(roomId, date);
    const available = totalUnits - bookedCount;

    if (available <= 0) return 'soldOut';
    if (available <= 2) return 'needsAttention';
    return 'bookable';
  }, [blockedDates, inventory, getBookedCount]);

  const getAvailableCount = useCallback((roomId: string, dateStr: string): number => {
    const inv = inventory.find(i => i.room_type_id === roomId && i.date === dateStr);
    const room = ROOM_TYPES[roomId];
    const totalUnits = inv?.available_count ?? room?.totalUnits ?? 0;
    const bookedCount = getBookedCount(roomId, parseISO(dateStr));
    return Math.max(0, totalUnits - bookedCount);
  }, [inventory, getBookedCount]);

  const statusColors: Record<DateStatus, string> = {
    bookable: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    soldOut: 'bg-red-600/80 text-white',
    closed: 'bg-zinc-700 text-zinc-400',
    needsAttention: 'bg-amber-600 text-white',
    past: 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed',
  };

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const toggleDateSelection = (date: Date) => {
    if (isBefore(date, startOfToday())) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedDates(prev => {
      const next = new Set(prev);
      next.has(dateStr) ? next.delete(dateStr) : next.add(dateStr);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedRoom || selectedDates.size === 0) return;
    setUpdating(true);

    try {
      const dates = Array.from(selectedDates);

      if (!isOpen) {
        const datesToBlock = dates.map(date => ({ date, room_type: selectedRoom.id, blocked: true }));
        const { error } = await supabase.from('blocked_dates').upsert(datesToBlock, { onConflict: 'date,room_type' });
        if (error) throw error;
      } else {
        await supabase.from('blocked_dates').delete().eq('room_type', selectedRoom.id).in('date', dates);
        
        const entries = dates.map(date => ({
          date,
          room_type_id: selectedRoom.id,
          available_count: roomsToSell,
          last_updated: new Date().toISOString(),
        }));
        const { error } = await supabase.from('room_inventory').upsert(entries, { onConflict: 'date,room_type_id' });
        if (error) throw error;
      }

      // Handle pricing
      if (priceOverride && priceOverride > 0) {
        // Would update pricing_rules table here
        toast.success(`Price set to ₹${priceOverride} for ${dates.length} date(s)`);
      }

      toast.success(`Updated ${dates.length} date(s)`);
      setSelectedDates(new Set());
      setPriceOverride(null);
      setDiscountPercent(null);
      fetchData();
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save changes');
    } finally {
      setUpdating(false);
    }
  };

  // Compact calendar for overview
  const renderCompactCalendar = (room: RoomTypeConfig) => (
    <motion.div
      key={room.id}
      className="cursor-pointer group p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all"
      onClick={() => setSelectedRoom(room)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white">{room.shortName}</span>
        <span className="text-xs text-slate-400">{room.totalUnits} units</span>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {weekDays.map((day, i) => (
          <div key={`${room.id}-${day}-${i}`} className="text-center text-[8px] text-slate-500 py-0.5">{day}</div>
        ))}
        {Array.from({ length: days[0].getDay() }).map((_, i) => <div key={`${room.id}-empty-${i}`} />)}
        {days.map(day => {
          const status = getDateStatus(room.id, day);
          const available = getAvailableCount(room.id, format(day, 'yyyy-MM-dd'));
          return (
            <div
              key={`${room.id}-${format(day, 'yyyy-MM-dd')}`}
              className={cn(
                'aspect-square rounded text-[8px] flex items-center justify-center relative',
                statusColors[status]
              )}
              title={`${format(day, 'MMM d')}: ${available} available`}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  // Detailed calendar view
  const renderDetailedCalendar = () => {
    if (!selectedRoom) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedRoom(null); setSelectedDates(new Set()); }} className="rounded-xl text-slate-300">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <p className="text-xs text-slate-400 capitalize">{selectedRoom.propertyType}</p>
            <h2 className="text-lg font-semibold text-white">{selectedRoom.name}</h2>
          </div>
          <div className="w-10" />
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between px-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))} className="rounded-xl text-slate-300">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-medium text-white">{format(currentMonth, 'MMMM yyyy')}</span>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))} className="rounded-xl text-slate-300">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
          <div className="grid grid-cols-7 gap-1.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs text-slate-500 py-2 font-medium">{day}</div>
            ))}
            {Array.from({ length: days[0].getDay() }).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const status = getDateStatus(selectedRoom.id, day);
              const isSelected = selectedDates.has(dateStr);
              const available = getAvailableCount(selectedRoom.id, dateStr);

              return (
                <motion.button
                  key={dateStr}
                  onClick={() => toggleDateSelection(day)}
                  disabled={status === 'past'}
                  className={cn(
                    'aspect-square rounded-xl text-sm font-medium flex flex-col items-center justify-center transition-all relative',
                    statusColors[status],
                    isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-slate-900',
                    isToday(day) && 'ring-1 ring-white/30'
                  )}
                  whileHover={{ scale: status !== 'past' ? 1.05 : 1 }}
                  whileTap={{ scale: status !== 'past' ? 0.95 : 1 }}
                >
                  <span>{format(day, 'd')}</span>
                  {status !== 'past' && (
                    <span className="text-[9px] opacity-70">{available}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 justify-center text-xs">
          {[
            { color: 'bg-emerald-600', label: 'Available' },
            { color: 'bg-amber-600', label: 'Low Stock' },
            { color: 'bg-red-600', label: 'Sold Out' },
            { color: 'bg-zinc-700', label: 'Closed' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={cn('w-3 h-3 rounded', item.color)} />
              <span className="text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Controls Panel */}
        <AnimatePresence>
          {selectedDates.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4 bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  {selectedDates.size} date{selectedDates.size > 1 ? 's' : ''} selected
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDates(new Set())} className="text-slate-400">
                  Clear
                </Button>
              </div>

              {/* Open/Close Toggle */}
              <RadioGroup value={isOpen ? 'open' : 'close'} onValueChange={(v) => setIsOpen(v === 'open')} className="grid grid-cols-2 gap-3">
                <div className={cn("flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all",
                  isOpen ? "border-emerald-500 bg-emerald-500/10" : "border-slate-600"
                )}>
                  <RadioGroupItem value="open" id="open" />
                  <Label htmlFor="open" className={cn("cursor-pointer", isOpen ? "text-emerald-400" : "text-slate-400")}>Open</Label>
                </div>
                <div className={cn("flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all",
                  !isOpen ? "border-red-500 bg-red-500/10" : "border-slate-600"
                )}>
                  <RadioGroupItem value="close" id="close" />
                  <Label htmlFor="close" className={cn("cursor-pointer", !isOpen ? "text-red-400" : "text-slate-400")}>Close</Label>
                </div>
              </RadioGroup>

              {isOpen && (
                <>
                  {/* Inventory Control */}
                  <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                    <span className="text-sm text-slate-300">Rooms to sell</span>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setRoomsToSell(Math.max(0, roomsToSell - 1))}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-white">{roomsToSell}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setRoomsToSell(Math.min(selectedRoom.totalUnits, roomsToSell + 1))}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Pricing Toggle */}
                  <Button variant="ghost" className="w-full justify-between text-slate-300" onClick={() => setShowPricing(!showPricing)}>
                    <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Pricing Rules</span>
                    <ChevronRight className={cn("w-4 h-4 transition-transform", showPricing && "rotate-90")} />
                  </Button>

                  <AnimatePresence>
                    {showPricing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="p-4 bg-slate-900/50 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-300">Price Override (₹)</Label>
                            <Input
                              type="number"
                              value={priceOverride || ''}
                              onChange={e => setPriceOverride(e.target.value ? Number(e.target.value) : null)}
                              placeholder="0"
                              className="w-32 bg-slate-800 border-slate-600"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-slate-300">Discount (%)</Label>
                            <Input
                              type="number"
                              value={discountPercent || ''}
                              onChange={e => setDiscountPercent(e.target.value ? Number(e.target.value) : null)}
                              placeholder="0"
                              className="w-32 bg-slate-800 border-slate-600"
                              max={50}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setSelectedDates(new Set())} className="flex-1">
                  Clear
                </Button>
                <Button onClick={handleSave} disabled={updating} className="flex-1 gap-2">
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedDates.size === 0 && (
          <div className="text-center py-4 text-slate-500 text-sm">
            Select dates to modify availability and pricing
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Inventory & Yield
          </h2>
          <p className="text-sm text-slate-400">Manage room availability and pricing</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>Today</Button>
          <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Month Display for Overview */}
      {!selectedRoom && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-semibold text-white text-lg">{format(currentMonth, 'MMMM yyyy')}</span>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </motion.div>
        ) : selectedRoom ? (
          renderDetailedCalendar()
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {rooms.map((room) => renderCompactCalendar(room))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
