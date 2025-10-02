import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useHappyGuests = () => {
  const [happyGuestsCount, setHappyGuestsCount] = useState<number>(610);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the current counter from Supabase
  const fetchHappyGuestsCount = useCallback(async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('metrics')
        .select('value')
        .eq('key', 'happy_guests')
        .maybeSingle(); // Use maybeSingle() to handle missing records gracefully

      if (fetchError) {
        console.warn('Failed to fetch happy guests count:', fetchError.message);
        return; // keep fallback 610
      }

      // Accept 0 as valid; ignore only null/undefined
      if (data && data.value !== undefined && data.value !== null) {
        setHappyGuestsCount(Number(data.value));
      } else {
        console.warn('metrics.happy_guests returned null/undefined; using fallback 610');
      }
    } catch (err) {
      console.warn('Error fetching happy guests count:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch count');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Increment via DB function and reflect latest value
  const incrementHappyGuests = useCallback(async (): Promise<void> => {
    try {
      setError(null);

      const { data, error: incrementError } = await supabase
        .rpc('increment_happy_guests');

      if (incrementError) {
        console.error('Failed to increment happy guests:', incrementError.message);
        setError(incrementError.message);
        // Try to refresh the current value anyway
        await fetchHappyGuestsCount();
        return;
      }

      // Expecting [{ new_count: number }]
      if (data && data.length > 0 && data[0].new_count !== undefined && data[0].new_count !== null) {
        const newCount = Number(data[0].new_count);
        setHappyGuestsCount(newCount);
      } else {
        // If RPC didn’t return a number, refetch from table
        await fetchHappyGuestsCount();
      }
    } catch (err) {
      console.error('Error incrementing happy guests:', err);
      setError(err instanceof Error ? err.message : 'Failed to increment count');
      await fetchHappyGuestsCount();
    }
  }, [fetchHappyGuestsCount]);

  // Load once on mount
  useEffect(() => {
    fetchHappyGuestsCount();
  }, [fetchHappyGuestsCount]);

  return {
    happyGuestsCount,
    incrementHappyGuests,
    isLoading,
    error,
    refetch: fetchHappyGuestsCount,
  };
};
