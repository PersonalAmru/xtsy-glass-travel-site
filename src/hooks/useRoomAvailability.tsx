import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AvailabilityData {
  available: number;
  total: number;
  isBlocked: boolean;
  isSoldOut: boolean;
  bookedCount: number;
  adminBlocked?: boolean;
}

interface UseRoomAvailabilityReturn {
  availability: Record<string, AvailabilityData>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: number | null;
}

export const useRoomAvailability = (
  roomName: string,
  enabled: boolean = true,
  roomId?: string
): UseRoomAvailabilityReturn => {
  const [availability, setAvailability] = useState<Record<string, AvailabilityData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  
  // Use refs to prevent subscription re-creation loops
  const roomNameRef = useRef(roomName);
  const enabledRef = useRef(enabled);
  const roomIdRef = useRef(roomId);
  const lastRealtimeRefreshRef = useRef<number>(0);
  const subscriptionIdRef = useRef<string>(`${Date.now()}`);
  
  // Update refs when values change
  useEffect(() => {
    roomNameRef.current = roomName;
    enabledRef.current = enabled;
    roomIdRef.current = roomId;
  }, [roomName, enabled, roomId]);

  const loadAvailability = useCallback(async () => {
    if (!roomName || !enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get availability for next 3 months
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);

      const { data, error: functionError } = await supabase.functions.invoke('get-room-availability', {
        body: {
          room_type_name: roomName,
          room_type_id: roomIdRef.current,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        }
      });

      if (functionError) {
        throw new Error(`Availability service error: ${functionError.message || 'Unknown error'}`);
      }

      if (data?.success) {
        setAvailability(data.availability || {});
        setError(null);
        setLastUpdated(Date.now());
      } else {
        throw new Error(data?.error || 'Failed to load availability data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load availability';
      setError(errorMessage);
      setAvailability({});
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
  }, [roomName, enabled]);

  // Stable callback for subscription handlers - refresh availability on any change
  const handleRealTimeUpdate = useCallback(() => {
    const currentRoomName = roomNameRef.current;
    const currentEnabled = enabledRef.current;
    
    if (!currentEnabled || !currentRoomName) return;

    // Throttle refreshes to max 500ms to provide fast updates while avoiding UI glittering
    const now = Date.now();
    if (now - (lastRealtimeRefreshRef.current || 0) < 500) {
      return;
    }
    lastRealtimeRefreshRef.current = now;
    
    console.log('[RoomAvailability] Real-time update triggered, refreshing...');
    loadAvailability();
  }, [loadAvailability]);

  // Single effect for real-time subscriptions
  useEffect(() => {
    if (!enabled || !roomName) {
      return;
    }

    // Create unique channel names
    const channelId = subscriptionIdRef.current;
    
    // Subscribe to blocked_dates changes (admin blocking)
    const blockedDatesChannel = supabase
      .channel(`blocked_dates_${channelId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'blocked_dates'
      }, handleRealTimeUpdate)
      .subscribe();

    // Subscribe to room_inventory changes (capacity/availability)
    const inventoryChannel = supabase
      .channel(`inventory_${channelId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_inventory'
      }, handleRealTimeUpdate)
      .subscribe();

    // Subscribe to bookings changes
    const bookingsChannel = supabase
      .channel(`bookings_${channelId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, handleRealTimeUpdate)
      .subscribe();

    // Subscribe to admin room availability status changes
    const statusChannel = supabase
      .channel(`room_status_${channelId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'room_availability_status'
      }, handleRealTimeUpdate)
      .subscribe();

    console.log('[RoomAvailability] Subscribed to real-time updates for:', roomName);

    return () => {
      supabase.removeChannel(blockedDatesChannel);
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(bookingsChannel);
      supabase.removeChannel(statusChannel);
    };
  }, [roomName, enabled, handleRealTimeUpdate]);

  return {
    availability,
    loading,
    error,
    refetch,
    lastUpdated
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