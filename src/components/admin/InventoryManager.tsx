/**
 * Inventory Manager Component
 * Apple-style room grid with status toggles and real-time sync
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RoomType, RoomStatus, CATEGORY_LABELS, getRoomsByCategory } from '@/data/roomInventory';
import { AppleCard, AppleSectionHeader, AppleStatusBadge } from './AppleCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { 
  BedDouble, 
  Users, 
  RefreshCw, 
  CalendarDays,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RoomCalendarPanel } from './RoomCalendarPanel';

interface RoomStatusData {
  room_type_id: string;
  status: RoomStatus;
  admin_note?: string;
}

export function InventoryManager() {
  const [statusData, setStatusData] = useState<Record<string, RoomStatusData>>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [calendarRoom, setCalendarRoom] = useState<string | null>(null);

  const fetchRoomStatuses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('room_availability_status')
        .select('*');

      if (error) throw error;

      const statusMap: Record<string, RoomStatusData> = {};
      data?.forEach(item => {
        statusMap[item.room_type_id] = {
          room_type_id: item.room_type_id,
          status: item.status as RoomStatus,
          admin_note: item.admin_note || undefined,
        };
      });

      setStatusData(statusMap);
    } catch (error) {
      console.error('Failed to fetch room statuses:', error);
      toast.error('Failed to load room statuses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoomStatuses();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('room-status-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'room_availability_status' },
        () => fetchRoomStatuses()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRoomStatuses]);

  const updateRoomStatus = async (roomId: string, newStatus: RoomStatus) => {
    setUpdating(roomId);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Use upsert to handle both insert and update
      const { error } = await supabase
        .from('room_availability_status')
        .upsert({
          room_type_id: roomId,
          status: newStatus,
          created_by: user.id,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'room_type_id'
        });

      if (error) throw error;

      // Update local state immediately
      setStatusData(prev => ({
        ...prev,
        [roomId]: {
          room_type_id: roomId,
          status: newStatus,
          admin_note: prev[roomId]?.admin_note,
        }
      }));

      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update room status');
    } finally {
      setUpdating(null);
    }
  };

  const getRoomStatus = (roomId: string): RoomStatus => {
    return statusData[roomId]?.status || 'available';
  };

  const renderRoomCard = (room: RoomType) => {
    const status = getRoomStatus(room.id);
    const isExpanded = expandedRoom === room.id;
    const isUpdating = updating === room.id;
    const showCalendar = calendarRoom === room.id;

    return (
      <AppleCard
        key={room.id}
        variant="elevated"
        padding="none"
        className={cn(
          'overflow-hidden transition-all duration-300',
          (isExpanded || showCalendar) && 'ring-2 ring-primary/30'
        )}
      >
        {/* Room Image */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <AppleStatusBadge status={status} size="sm" />
          </div>

          {/* Room Name */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-semibold text-sm truncate">{room.shortName}</h3>
            <p className="text-white/70 text-xs truncate">{CATEGORY_LABELS[room.category]}</p>
          </div>
        </div>

        {/* Room Info */}
        <div className="p-4 space-y-3">
          {/* Quick Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{room.capacity}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BedDouble className="w-4 h-4" />
              <span>{room.totalUnits} units</span>
            </div>
            {room.isBookable && (
              <span className="text-primary font-medium">
                ₹{room.discountedPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Status Selector */}
          <Select
            value={status}
            onValueChange={(value) => updateRoomStatus(room.id, value as RoomStatus)}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-full h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Available
                </span>
              </SelectItem>
              <SelectItem value="limited">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  Limited
                </span>
              </SelectItem>
              <SelectItem value="sold_out">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  Sold Out
                </span>
              </SelectItem>
              <SelectItem value="maintenance">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                  Maintenance
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant={showCalendar ? "default" : "outline"}
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => setCalendarRoom(showCalendar ? null : room.id)}
            >
              <CalendarDays className="w-3 h-3 mr-1" />
              Calendar
            </Button>
            <button
              onClick={() => setExpandedRoom(isExpanded ? null : room.id)}
              className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
            >
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Expanded Details */}
          {isExpanded && !showCalendar && (
            <div className="pt-3 border-t border-border/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room ID</span>
                <span className="font-mono">{room.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{room.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kind</span>
                <span>{room.kind}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bookable</span>
                <span>{room.isBookable ? 'Yes' : 'OTA Only'}</span>
              </div>
              {statusData[room.id]?.admin_note && (
                <div className="pt-2">
                  <span className="text-muted-foreground">Note:</span>
                  <p className="mt-1 text-foreground">{statusData[room.id].admin_note}</p>
                </div>
              )}
            </div>
          )}

          {/* Calendar Panel */}
          {showCalendar && (
            <RoomCalendarPanel
              roomId={room.id}
              roomName={room.shortName}
              basePrice={room.discountedPrice}
              onClose={() => setCalendarRoom(null)}
            />
          )}
        </div>

        {isUpdating && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
          </div>
        )}
      </AppleCard>
    );
  };

  const categories: Array<'luxury' | 'hostel' | 'economy'> = ['luxury', 'hostel', 'economy'];

  return (
    <div className="space-y-8">
      <AppleSectionHeader
        title="Room Inventory"
        subtitle="Manage room availability and status"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRoomStatuses}
            disabled={loading}
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
        }
      />

      {categories.map(category => {
        const rooms = getRoomsByCategory(category);
        if (rooms.length === 0) return null;

        return (
          <div key={category} className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {rooms.map(renderRoomCard)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
