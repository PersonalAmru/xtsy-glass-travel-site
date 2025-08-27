import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useHappyGuests = () => {
  const [happyGuestsCount, setHappyGuestsCount] = useState<number>(610);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial count from Supabase
  const fetchHappyGuestsCount = useCallback(async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('metrics')
        .select('value')
        .eq('key', 'happy_guests')
        .single();

      if (fetchError) {
        console.warn('Failed to fetch happy guests count:', fetchError.message);
        // Keep fallback value of 610
        return;
      }

      if (data?.value) {
        setHappyGuestsCount(Number(data.value));
      }
    } catch (err) {
      console.warn('Error fetching happy guests count:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch count');
      // Keep fallback value
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Increment count and update in Supabase
  const incrementHappyGuests = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      
      // Call the database function to increment safely
      const { data, error: incrementError } = await supabase
        .rpc('increment_happy_guests');

      if (incrementError) {
        console.error('Failed to increment happy guests:', incrementError.message);
        setError(incrementError.message);
        return;
      }

      if (data && data.length > 0) {
        const newCount = Number(data[0].new_count);
        setHappyGuestsCount(newCount);
        console.log('Happy guests count updated to:', newCount);
      }
    } catch (err) {
      console.error('Error incrementing happy guests:', err);
      setError(err instanceof Error ? err.message : 'Failed to increment count');
    }
  }, []);

  // Load initial count on mount
  useEffect(() => {
    fetchHappyGuestsCount();
  }, [fetchHappyGuestsCount]);

  return {
    happyGuestsCount,
    incrementHappyGuests,
    isLoading,
    error,
    refetch: fetchHappyGuestsCount
  };
};
