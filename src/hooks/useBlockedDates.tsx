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
      const { data: blockedData, error: fetchError } = await supabase
        .from('blocked_dates')
        .select('room_type, date')
        .eq('blocked', true);

      if (fetchError) {
        throw fetchError;
      }

      // Group blocked dates by room type
      const blockedByRoom: BlockedDatesData = {};
      blockedData?.forEach(block => {
        if (!blockedByRoom[block.room_type]) {
          blockedByRoom[block.room_type] = [];
        }
        blockedByRoom[block.room_type].push(block.date);
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

    // Set up real-time subscription for blocked dates changes
    const channel = supabase
      .channel('blocked_dates_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blocked_dates'
        },
        () => {
          console.log('Blocked dates updated, reloading...');
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