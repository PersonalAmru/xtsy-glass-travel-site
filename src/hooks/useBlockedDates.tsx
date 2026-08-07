import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BlockedDatesData {
  [roomType: string]: string[];
}

interface UseBlockedDatesReturn {
  blockedDates: BlockedDatesData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBlockedDates = (): UseBlockedDatesReturn => {
  const [blockedDates, setBlockedDates] = useState<BlockedDatesData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBlockedDates = async () => {
    try {
      setError(null);
      // Use room_inventory table to determine blocked dates (where available_count = 0)
      const { data: inventoryData, error: fetchError } = await supabase
        .from('room_inventory')
        .select('room_type_id, date, available_count')
        .eq('available_count', 0);

      if (fetchError) {
        throw fetchError;
      }

      // Group blocked dates by room type
      const blockedByRoom: BlockedDatesData = {};
      inventoryData?.forEach(item => {
        if (!blockedByRoom[item.room_type_id]) {
          blockedByRoom[item.room_type_id] = [];
        }
        blockedByRoom[item.room_type_id].push(item.date);
      });

      setBlockedDates(blockedByRoom);
    } catch (err) {
      console.error('Error loading blocked dates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load blocked dates');
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    setLoading(true);
    await loadBlockedDates();
  };

  useEffect(() => {
    loadBlockedDates();

    // Set up real-time subscription for room inventory changes
    const channel = supabase
      .channel('room_inventory_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_inventory'
        },
        () => {
          console.log('Room inventory updated, reloading blocked dates...');
          loadBlockedDates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    blockedDates,
    loading,
    error,
    refetch
  };
};

// Helper function to check if a room is available for given dates
export const checkRoomAvailability = (
  roomId: string, 
  checkIn: string, 
  checkOut: string, 
  blockedDates: BlockedDatesData
): boolean => {
  const roomBlockedDates = blockedDates[roomId] || [];
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Check each night of the stay
  let currentDate = new Date(checkInDate);
  while (currentDate < checkOutDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (roomBlockedDates.includes(dateStr)) {
      return false; // Room is blocked for this date
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return true; // Room is available
};