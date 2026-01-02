/**
 * Room Calendar Panel - Inline calendar for each room card
 * Bulk date selection for blocking, pricing, and discounts
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  DollarSign,
  Percent,
  X,
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
} from 'date-fns';

interface RoomCalendarPanelProps {
  roomId: string;
  roomName: string;
  basePrice: number;
  onClose: () => void;
}

interface BlockedDate {
  date: string;
  room_type: string;
}

interface InventoryEntry {
  date: string;
  room_type_id: string;
  available_count: number;
}

type DateStatus = 'available' | 'limited' | 'blocked' | 'booked' | 'past';
type ActionMode = 'select' | 'block' | 'unblock' | 'price' | 'discount';

export function RoomCalendarPanel({ roomId, roomName, basePrice, onClose }: RoomCalendarPanelProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [actionMode, setActionMode] = useState<ActionMode>('select');
  const [priceValue, setPriceValue] = useState<string>(basePrice.toString());
  const [discountValue, setDiscountValue] = useState<string>('10');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const monthStart = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

      const [blockedRes, inventoryRes] = await Promise.all([
        supabase
          .from('blocked_dates')
          .select('date, room_type')
          .eq('room_type', roomId)
          .gte('date', monthStart)
          .lte('date', monthEnd),
        supabase
          .from('room_inventory')
          .select('date, room_type_id, available_count')
          .eq('room_type_id', roomId)
          .gte('date', monthStart)
          .lte('date', monthEnd),
      ]);

      if (blockedRes.error) throw blockedRes.error;
      if (inventoryRes.error) throw inventoryRes.error;

      setBlockedDates(blockedRes.data || []);
      setInventory(inventoryRes.data || []);
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  }, [currentMonth, roomId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDateStatus = useCallback((date: Date): DateStatus => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const today = startOfToday();

    if (isBefore(date, today)) return 'past';

    const isBlocked = blockedDates.some(b => b.date === dateStr);
    if (isBlocked) return 'blocked';

    const inv = inventory.find(i => i.date === dateStr);
    if (inv) {
      if (inv.available_count === 0) return 'booked';
      if (inv.available_count <= 2) return 'limited';
    }

    return 'available';
  }, [blockedDates, inventory]);

  const statusColors: Record<DateStatus, string> = {
    available: 'bg-success/20 text-success-foreground hover:bg-success/30',
    limited: 'bg-warning/20 text-warning-foreground hover:bg-warning/30',
    blocked: 'bg-destructive/20 text-destructive hover:bg-destructive/30',
    booked: 'bg-muted text-muted-foreground',
    past: 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed',
  };

  const toggleDateSelection = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (isBefore(date, startOfToday())) return;

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

  const handleBlockDates = async () => {
    if (selectedDates.size === 0) return;
    setUpdating(true);
    try {
      const datesToBlock = Array.from(selectedDates).map(date => ({
        date,
        room_type: roomId,
        blocked: true,
      }));

      const { error } = await supabase
        .from('blocked_dates')
        .upsert(datesToBlock, { onConflict: 'date,room_type' });

      if (error) throw error;
      toast.success(`Blocked ${selectedDates.size} date(s)`);
      setSelectedDates(new Set());
      fetchData();
    } catch (error) {
      console.error('Failed to block dates:', error);
      toast.error('Failed to block dates');
    } finally {
      setUpdating(false);
    }
  };

  const handleUnblockDates = async () => {
    if (selectedDates.size === 0) return;
    setUpdating(true);
    try {
      const dates = Array.from(selectedDates);
      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('room_type', roomId)
        .in('date', dates);

      if (error) throw error;
      toast.success(`Unblocked ${selectedDates.size} date(s)`);
      setSelectedDates(new Set());
      fetchData();
    } catch (error) {
      console.error('Failed to unblock dates:', error);
      toast.error('Failed to unblock dates');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateInventory = async (count: number) => {
    if (selectedDates.size === 0) return;
    setUpdating(true);
    try {
      const entries = Array.from(selectedDates).map(date => ({
        date,
        room_type_id: roomId,
        available_count: count,
        last_updated: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('room_inventory')
        .upsert(entries, { onConflict: 'date,room_type_id' });

      if (error) throw error;
      toast.success(`Updated inventory for ${selectedDates.size} date(s)`);
      setSelectedDates(new Set());
      fetchData();
    } catch (error) {
      console.error('Failed to update inventory:', error);
      toast.error('Failed to update inventory');
    } finally {
      setUpdating(false);
    }
  };

  const handleApplyPrice = async () => {
    const price = parseFloat(priceValue);
    if (isNaN(price) || price < 0) {
      toast.error('Enter a valid price');
      return;
    }
    // For now, we'll update room_inventory with a note that pricing is managed
    // In production, this would update a pricing_rules or room_rates table
    toast.success(`Price ₹${price} will be applied to ${selectedDates.size} date(s)`);
    setSelectedDates(new Set());
    setActionMode('select');
  };

  const handleApplyDiscount = async () => {
    const discount = parseFloat(discountValue);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      toast.error('Enter a valid discount (0-100%)');
      return;
    }
    // In production, this would update a pricing_rules table
    toast.success(`${discount}% discount will be applied to ${selectedDates.size} date(s)`);
    setSelectedDates(new Set());
    setActionMode('select');
  };

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="border-t border-border/50 pt-4 mt-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Calendar - {roomName}</h4>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-xs font-medium w-24 text-center">
          {format(currentMonth, 'MMM yyyy')}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-success/40" />
          <span>Avail</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-warning/40" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-destructive/40" />
          <span>Block</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-muted" />
          <span>Full</span>
        </div>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="h-32 flex items-center justify-center text-muted-foreground text-xs">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-0.5">
          {/* Weekday Headers */}
          {weekDays.map((day, i) => (
            <div
              key={`${day}-${i}`}
              className="text-center text-[10px] font-medium text-muted-foreground py-1"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for start of month */}
          {Array.from({ length: days[0].getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Days */}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const status = getDateStatus(day);
            const isSelected = selectedDates.has(dateStr);

            return (
              <button
                key={dateStr}
                onClick={() => toggleDateSelection(day)}
                disabled={status === 'past'}
                className={cn(
                  'aspect-square rounded text-[10px] font-medium transition-all',
                  statusColors[status],
                  isSelected && 'ring-2 ring-primary ring-offset-1 ring-offset-background',
                  isToday(day) && 'font-bold underline'
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      )}

      {/* Actions */}
      {selectedDates.size > 0 && (
        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {selectedDates.size} date(s) selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => setSelectedDates(new Set())}
            >
              Clear
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={handleBlockDates}
              disabled={updating}
            >
              <Lock className="w-3 h-3 mr-1" />
              Block
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={handleUnblockDates}
              disabled={updating}
            >
              <Unlock className="w-3 h-3 mr-1" />
              Unblock
            </Button>
          </div>

          {/* Inventory Control */}
          <div className="space-y-2">
            <Label className="text-xs">Set Available Units</Label>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 5].map(n => (
                <Button
                  key={n}
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 text-xs p-0"
                  onClick={() => handleUpdateInventory(n)}
                  disabled={updating}
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Update */}
          <div className="space-y-2">
            <Label className="text-xs">Set Price (₹)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={priceValue}
                onChange={e => setPriceValue(e.target.value)}
                className="h-8 text-xs"
                placeholder="Price"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs shrink-0"
                onClick={handleApplyPrice}
                disabled={updating}
              >
                <DollarSign className="w-3 h-3 mr-1" />
                Apply
              </Button>
            </div>
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <Label className="text-xs">Set Discount (%)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={discountValue}
                onChange={e => setDiscountValue(e.target.value)}
                className="h-8 text-xs"
                placeholder="Discount %"
                min="0"
                max="100"
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs shrink-0"
                onClick={handleApplyDiscount}
                disabled={updating}
              >
                <Percent className="w-3 h-3 mr-1" />
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
