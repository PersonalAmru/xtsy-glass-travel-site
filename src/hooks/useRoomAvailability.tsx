import { useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Use refs to prevent subscription re-creation loops
  const roomNameRef = useRef(roomName);
  const enabledRef = useRef(enabled);
  
  // Update refs when values change
  useEffect(() => {
    roomNameRef.current = roomName;
    enabledRef.current = enabled;
  }, [roomName, enabled]);

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

  // Stable callback for subscription handlers
  const handleRealTimeUpdate = useCallback((payload: any) => {
    const currentRoomName = roomNameRef.current;
    const currentEnabled = enabledRef.current;
    
    if (!currentEnabled || !currentRoomName) return;
    
    const newRecord = payload.new as any;
    const oldRecord = payload.old as any;
    const changedRoomType = newRecord?.room_type || oldRecord?.room_type;
    
    const roomAliases = [currentRoomName];
    if (currentRoomName.includes('8') && currentRoomName.toLowerCase().includes('bed')) {
      roomAliases.push('8-bed-mixed-economy-dorm');
      roomAliases.push('Bed in 8 bed mixed economy dorm');
    }
    
    if (changedRoomType && roomAliases.includes(changedRoomType)) {
      loadAvailability();
    }
  }, [loadAvailability]);

  // Single effect for real-time subscriptions - only create once
  useEffect(() => {
    if (!enabled || !roomName) {
      return;
    }

    // Create unique channel names that don't change on every render
    const channelId = `${roomName.replace(/\s+/g, '_')}_${Date.now()}`;
    
    const blockedDatesChannel = supabase
      .channel(`blocked_dates_${channelId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'blocked_dates'
      }, handleRealTimeUpdate)
      .subscribe();

    const bookingsChannel = supabase
      .channel(`bookings_${channelId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, handleRealTimeUpdate)
      .subscribe();

    return () => {
      supabase.removeChannel(blockedDatesChannel);
      supabase.removeChannel(bookingsChannel);
    };
  }, []); // Empty dependency array - only create subscriptions once

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