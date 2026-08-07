/**
 * Availability Calendar Component
 * Date-wise room availability management with color coding and bulk selection
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ROOM_INVENTORY, getAllRooms, CATEGORY_LABELS } from '@/data/roomInventory';
import { AppleCard, AppleSectionHeader } from './AppleCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, startOfToday } from 'date-fns';

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

export function AvailabilityCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const rooms = useMemo(() => getAllRooms(), []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const monthStart = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

      // Fetch blocked dates
      const { data: blockedData, error: blockedError } = await supabase
        .from('blocked_dates')
        .select('date, room_type')
        .gte('date', monthStart)
        .lte('date', monthEnd);

      if (blockedError) throw blockedError;
      setBlockedDates(blockedData || []);

      // Fetch inventory data
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('room_inventory')
        .select('date, room_type_id, available_count')
        .gte('date', monthStart)
        .lte('date', monthEnd);

      if (inventoryError) throw inventoryError;
      setInventory((inventoryData || []) as InventoryEntry[]);

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

  const getDateStatus = useCallback((date: Date, roomId?: string): DateStatus => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const today = startOfToday();

    if (isBefore(date, today)) return 'past';

    // Check if date is blocked
    const isBlocked = blockedDates.some(
      b => b.date === dateStr && (!roomId || roomId === 'all' || b.room_type === roomId)
    );
    if (isBlocked) return 'blocked';

    // Check inventory levels
    const relevantInventory = inventory.filter(
      i => i.date === dateStr && (!roomId || roomId === 'all' || i.room_type_id === roomId)
    );

    if (relevantInventory.length > 0) {
      const totalAvailable = relevantInventory.reduce((sum, i) => sum + i.available_count, 0);
      if (totalAvailable === 0) return 'booked';
      if (totalAvailable <= 2) return 'limited';
    }

    return 'available';
  }, [blockedDates, inventory]);

  const statusColors: Record<DateStatus, string> = {
    available: 'bg-success/20 text-success hover:bg-success/30',
    limited: 'bg-warning/20 text-warning hover:bg-warning/30',
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
    if (selectedDates.size === 0) {
      toast.error('Select dates to block');
      return;
    }

    if (selectedRoom === 'all') {
      toast.error('Select a specific room type to block dates');
      return;
    }

    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const datesToBlock = Array.from(selectedDates).map(date => ({
        date,
        room_type: selectedRoom,
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
    if (selectedDates.size === 0) {
      toast.error('Select dates to unblock');
      return;
    }

    if (selectedRoom === 'all') {
      toast.error('Select a specific room type to unblock dates');
      return;
    }

    setUpdating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const dates = Array.from(selectedDates);

      const { error } = await supabase
        .from('blocked_dates')
        .delete()
        .eq('room_type', selectedRoom)
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

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <AppleSectionHeader
        title="Availability Calendar"
        subtitle="Block or unblock dates for specific room types"
        action={
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
        }
      />

      <AppleCard variant="elevated" padding="md">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Room Selector */}
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {rooms.map(room => (
                <SelectItem key={room.id} value={room.id}>
                  {room.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium w-32 text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Actions */}
          {selectedDates.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">
                {selectedDates.size} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBlockDates}
                disabled={updating || selectedRoom === 'all'}
              >
                <Lock className="w-4 h-4 mr-2" />
                Block
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnblockDates}
                disabled={updating || selectedRoom === 'all'}
              >
                <Unlock className="w-4 h-4 mr-2" />
                Unblock
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDates(new Set())}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success/30" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning/30" />
            <span>Limited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive/30" />
            <span>Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted" />
            <span>Booked</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday Headers */}
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-2"
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
            const status = getDateStatus(day, selectedRoom === 'all' ? undefined : selectedRoom);
            const isSelected = selectedDates.has(dateStr);

            return (
              <button
                key={dateStr}
                onClick={() => toggleDateSelection(day)}
                disabled={status === 'past'}
                className={cn(
                  'relative aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all',
                  statusColors[status],
                  isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                  isToday(day) && 'font-bold'
                )}
              >
                {format(day, 'd')}
                {isToday(day) && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current" />
                )}
              </button>
            );
          })}
        </div>
      </AppleCard>
    </div>
  );
}
