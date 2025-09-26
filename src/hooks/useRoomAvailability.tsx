import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AvailabilityData {
  available: number;
  total: number;
  isBlocked: boolean;
  isSoldOut: boolean;
  bookedCount: number;
}

interface UseRoomAvailabilityReturn {
  availability: Record<string, AvailabilityData>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRoomAvailability = (
  roomName: string,
  enabled: boolean = true
): UseRoomAvailabilityReturn => {
  const [availability, setAvailability] = useState<Record<string, AvailabilityData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAvailability = useCallback(async () => {
    if (!roomName || !enabled) return;

    try {
      setError(null);
      console.log(`Loading availability for room: ${roomName}`);

      // Get availability for next 3 months
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const { data, error: functionError } = await supabase.functions.invoke('get-room-availability', {
        body: {
          room_type_name: roomName,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }
      });

      if (functionError) {
        throw functionError;
      }

      if (data?.success) {
        console.log(`Availability loaded for ${roomName}:`, Object.keys(data.availability).length, 'dates');
        setAvailability(data.availability);
      } else {
        throw new Error(data?.error || 'Failed to load availability');
      }
    } catch (err) {
      console.error(`Error loading availability for ${roomName}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  }, [roomName, enabled]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await loadAvailability();
  }, [loadAvailability]);

  useEffect(() => {
    if (!enabled || !roomName) {
      setLoading(false);
      return;
    }

    loadAvailability();

    // Create room aliases for subscription matching
    const createRoomAliases = (roomName: string): string[] => {
      const aliases = [roomName];
      const baseName = roomName.replace(/^(Bed in |Room )/i, '');
      
      // Add base name without prefixes
      aliases.push(baseName);
      
      // Add specific room type patterns
      if (roomName.includes('8') && roomName.toLowerCase().includes('bed')) {
        aliases.push('8-bed-mixed-economy-dorm');
        aliases.push('Bed in 8 bed mixed economy dorm');
      }
      
      return [...new Set(aliases)];
    };

    const roomAliases = createRoomAliases(roomName);
    console.log(`Setting up real-time subscriptions for room aliases:`, roomAliases);

    // Real-time subscription for blocked dates changes
    const blockedDatesChannel = supabase
      .channel(`blocked_dates_${roomName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blocked_dates'
        },
        (payload) => {
          console.log(`Blocked dates changed for ${roomName}:`, payload);
          // Check if this change affects our room
          const newRecord = payload.new as any;
          const oldRecord = payload.old as any;
          const changedRoomType = newRecord?.room_type || oldRecord?.room_type;
          if (changedRoomType && roomAliases.includes(changedRoomType)) {
            console.log(`Reloading availability due to blocked dates change for ${changedRoomType}`);
            loadAvailability();
          }
        }
      )
      .subscribe();

    // Real-time subscription for booking changes
    const bookingsChannel = supabase
      .channel(`bookings_${roomName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log(`Booking changed for ${roomName}:`, payload);
          // Check if this booking affects our room type
          const newRecord = payload.new as any;
          const oldRecord = payload.old as any;
          const changedRoomType = newRecord?.room_type || oldRecord?.room_type;
          if (changedRoomType && roomAliases.includes(changedRoomType)) {
            console.log(`Reloading availability due to booking change for ${changedRoomType}`);
            loadAvailability();
          }
        }
      )
      .subscribe();

    // Real-time subscription for room inventory changes
    const inventoryChannel = supabase
      .channel(`inventory_${roomName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_inventory'
        },
        (payload) => {
          console.log(`Room inventory changed for ${roomName}:`, payload);
          // Check if this inventory change affects our room type
          const newRecord = payload.new as any;
          const oldRecord = payload.old as any;
          const changedRoomTypeId = newRecord?.room_type_id || oldRecord?.room_type_id;
          if (changedRoomTypeId && roomAliases.includes(changedRoomTypeId)) {
            console.log(`Reloading availability due to inventory change for ${changedRoomTypeId}`);
            loadAvailability();
          }
        }
      )
      .subscribe();

    return () => {
      console.log(`Cleaning up subscriptions for ${roomName}`);
      supabase.removeChannel(blockedDatesChannel);
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(inventoryChannel);
    };
  }, [roomName, enabled, loadAvailability]);

  return {
    availability,
    loading,
    error,
    refetch
  };
};

// Helper function to get availability status for a specific date
export const getAvailabilityStatus = (
  date: Date,
  availability: Record<string, AvailabilityData>
): 'available' | 'limited' | 'soldOut' | null => {
  const dateStr = date.toISOString().split('T')[0];
  const dayAvailability = availability[dateStr];

  if (!dayAvailability) return null;

  if (dayAvailability.isSoldOut) return 'soldOut';
  if (dayAvailability.available <= 2) return 'limited';
  return 'available';
};

// Helper function to check if a date range is available
export const checkDateRangeAvailability = (
  checkIn: Date,
  checkOut: Date,
  availability: Record<string, AvailabilityData>
): boolean => {
  let currentDate = new Date(checkIn);
  
  while (currentDate < checkOut) {
    const status = getAvailabilityStatus(currentDate, availability);
    if (status === 'soldOut') {
      return false;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return true;
};