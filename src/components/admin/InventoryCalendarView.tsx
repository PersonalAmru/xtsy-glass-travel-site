/**
 * Inventory Calendar View - Apple-grade with pricing controls
 * Calendar + bulk date selection for price/block management per property
 * With property-level filtering and full inventory controls
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ROOM_TYPES, getBookableRoomTypes, getBookableRoomTypesByProperty, type RoomTypeConfig, TAG_LABELS, TAG_COLORS } from '@/config/roomTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ChevronLeft, ChevronRight, RefreshCw, X, Minus, Plus, Check,
  DollarSign, Percent, Calendar, Loader2, Building, Tag
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

interface PricingRule {
  room_type_id: string;
  start_date: string;
  end_date: string;
  adjustment_type: string;
  adjustment_value: number;
  is_active: boolean;
}

type DateStatus = 'bookable' | 'soldOut' | 'closed' | 'needsAttention' | 'past';

// Available property types
const PROPERTY_TYPES = [
  { value: 'all', label: 'All Properties' },
  { value: 'Experience by XTSY', label: 'Experience by XTSY' },
  { value: 'XTSY Travellers Hostel', label: 'XTSY Travellers Hostel' },
  { value: 'XTSY Economy', label: 'XTSY Economy' },
];

export function InventoryCalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [bookings, setBookings] = useState<BookingEntry[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomTypeConfig | null>(null);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string>('XTSY Travellers Hostel');
  
  // Controls
  const [isOpen, setIsOpen] = useState(true);
  const [roomsToSell, setRoomsToSell] = useState(6);
  const [priceOverride, setPriceOverride] = useState<number | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  // Get rooms filtered by selected property
  const rooms = useMemo(() => {
    if (selectedProperty === 'all') {
      return getBookableRoomTypes();
    }
    return getBookableRoomTypesByProperty(selectedProperty);
  }, [selectedProperty]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const monthStart = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

      const [blockedRes, inventoryRes, bookingsRes, pricingRes] = await Promise.all([
        supabase.from('blocked_dates').select('date, room_type, blocked').gte('date', monthStart).lte('date', monthEnd),
        supabase.from('room_inventory').select('date, room_type_id, available_count').gte('date', monthStart).lte('date', monthEnd),
        supabase.from('bookings').select('check_in, check_out, room_type, quantity, booking_status')
          .gte('check_in', monthStart).lte('check_out', monthEnd).in('booking_status', ['confirmed', 'pending']),
        supabase.from('pricing_rules').select('room_type_id, start_date, end_date, adjustment_type, adjustment_value, is_active')
          .lte('start_date', monthEnd).gte('end_date', monthStart).eq('is_active', true),
      ]);

      if (blockedRes.error) throw blockedRes.error;
      if (inventoryRes.error) throw inventoryRes.error;
      if (bookingsRes.error) throw bookingsRes.error;
      // Pricing rules might not exist yet - don't throw
      
      setBlockedDates(blockedRes.data || []);
      setInventory((inventoryRes.data || []) as InventoryEntry[]);
      setBookings((bookingsRes.data || []) as BookingEntry[]);
      setPricingRules(pricingRes.data || []);
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
    bookable: 'bg-success hover:bg-success/90 text-success-foreground',
    soldOut: 'bg-destructive/80 text-destructive-foreground',
    closed: 'bg-muted text-muted-foreground',
    needsAttention: 'bg-warning text-warning-foreground',
    past: 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed',
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
      const dates = Array.from(selectedDates).sort();
      const minDate = dates[0];
      const maxDate = dates[dates.length - 1];

      // Get current user for audit
      const { data: { user } } = await supabase.auth.getUser();

      if (!isOpen) {
        // Block dates
        const datesToBlock = dates.map(date => ({ date, room_type: selectedRoom.id, blocked: true }));
        const { error } = await supabase.from('blocked_dates').upsert(datesToBlock, { onConflict: 'date,room_type' });
        if (error) throw error;

        // Log bulk operation
        await supabase.from('inventory_bulk_operations').insert({
          operation_type: 'block',
          room_type_id: selectedRoom.id,
          property_type: selectedRoom.propertyType,
          dates_affected: dates,
          new_values: { blocked: true },
          applied_by: user?.id,
          notes: `Blocked ${dates.length} date(s) for ${selectedRoom.name}`,
        });
      } else {
        // Unblock dates
        await supabase.from('blocked_dates').delete().eq('room_type', selectedRoom.id).in('date', dates);
        
        // Update inventory counts
        const entries = dates.map(date => ({
          date,
          room_type_id: selectedRoom.id,
          available_count: roomsToSell,
          last_updated: new Date().toISOString(),
        }));
        const { error } = await supabase.from('room_inventory').upsert(entries, { onConflict: 'date,room_type_id' });
        if (error) throw error;

        // Log bulk operation
        await supabase.from('inventory_bulk_operations').insert({
          operation_type: 'unblock',
          room_type_id: selectedRoom.id,
          property_type: selectedRoom.propertyType,
          dates_affected: dates,
          new_values: { available_count: roomsToSell, blocked: false },
          applied_by: user?.id,
          notes: `Updated ${dates.length} date(s) to ${roomsToSell} units for ${selectedRoom.name}`,
        });
      }

      // Handle pricing rule creation
      if ((priceOverride && priceOverride > 0) || (discountPercent && discountPercent > 0)) {
        const ruleName = priceOverride 
          ? `Price Override ₹${priceOverride}` 
          : `${discountPercent}% Discount`;
        
        const pricingRule = {
          room_type_id: selectedRoom.id,
          rule_name: ruleName,
          rule_type: priceOverride ? 'fixed' : 'percentage',
          adjustment_type: priceOverride ? 'fixed' : 'percentage',
          adjustment_value: priceOverride || discountPercent || 0,
          start_date: minDate,
          end_date: maxDate,
          is_active: true,
          created_by: user?.id,
        };

        const { error: pricingError } = await supabase
          .from('pricing_rules')
          .insert(pricingRule);

        if (pricingError) {
          console.error('Failed to create pricing rule:', pricingError);
          toast.error('Failed to save pricing rule, but inventory was updated');
        } else {
          // Log pricing change
          await supabase.from('inventory_bulk_operations').insert({
            operation_type: 'price_change',
            room_type_id: selectedRoom.id,
            property_type: selectedRoom.propertyType,
            dates_affected: dates,
            new_values: { 
              price_override: priceOverride, 
              discount_percent: discountPercent,
              rule_name: ruleName,
            },
            applied_by: user?.id,
            notes: `Applied ${ruleName} for ${selectedRoom.name} from ${minDate} to ${maxDate}`,
          });
          toast.success(`Pricing rule created: ${ruleName}`);
        }
      }

      toast.success(`Updated ${dates.length} date(s) for ${selectedRoom.name}`);
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
      className="cursor-pointer group p-3 rounded-xl bg-card hover:bg-accent border border-border hover:border-primary/30 transition-all"
      onClick={() => setSelectedRoom(room)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{room.shortName}</span>
        <span className="text-xs text-muted-foreground">{room.totalUnits} units</span>
      </div>
      
      {/* Room Tags */}
      {room.tags && room.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {room.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className={cn(
                "inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                TAG_COLORS[tag]?.bg || 'bg-muted',
                TAG_COLORS[tag]?.text || 'text-muted-foreground'
              )}
            >
              {TAG_LABELS[tag]}
            </span>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-7 gap-0.5">
        {weekDays.map((day, i) => (
          <div key={`${room.id}-${day}-${i}`} className="text-center text-[8px] text-muted-foreground py-0.5">{day}</div>
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
          <Button variant="ghost" size="icon" onClick={() => { setSelectedRoom(null); setSelectedDates(new Set()); }} className="rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground capitalize">{selectedRoom.propertyType}</p>
            <h2 className="text-lg font-semibold text-foreground">{selectedRoom.name}</h2>
            {/* Room Tags */}
            {selectedRoom.tags && selectedRoom.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {selectedRoom.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium",
                      TAG_COLORS[tag]?.bg || 'bg-muted',
                      TAG_COLORS[tag]?.text || 'text-muted-foreground'
                    )}
                  >
                    {TAG_LABELS[tag]}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="w-10" />
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between px-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))} className="rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-medium text-foreground">{format(currentMonth, 'MMMM yyyy')}</span>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))} className="rounded-xl">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="grid grid-cols-7 gap-1.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs text-muted-foreground py-2 font-medium">{day}</div>
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
                    isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                    isToday(day) && 'ring-1 ring-foreground/30'
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
            { color: 'bg-success', label: 'Available' },
            { color: 'bg-warning', label: 'Low Stock' },
            { color: 'bg-destructive', label: 'Sold Out' },
            { color: 'bg-muted', label: 'Closed' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={cn('w-3 h-3 rounded', item.color)} />
              <span className="text-muted-foreground">{item.label}</span>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Inventory & Yield
          </h2>
          <p className="text-sm text-muted-foreground">Manage room availability and pricing by property</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Property Selector */}
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-[200px]">
              <Building className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map(pt => (
                <SelectItem key={pt.value} value={pt.value}>
                  {pt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>Today</Button>
          <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Property Info Banner */}
      {selectedProperty !== 'all' && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">{selectedProperty}</p>
              <p className="text-xs text-muted-foreground">{rooms.length} room types available</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-success/20 text-success rounded-full">Pricing Controls</span>
            <span className="px-2 py-1 bg-warning/20 text-warning rounded-full">Date Blocking</span>
            <span className="px-2 py-1 bg-primary/20 text-primary rounded-full">Bulk Operations</span>
          </div>
        </div>
      )}

      {/* Month Display for Overview */}
      {!selectedRoom && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-semibold text-foreground text-lg">{format(currentMonth, 'MMMM yyyy')}</span>
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
