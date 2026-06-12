import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { deferUntilIdle } from '@/utils/deferUntilIdle';

interface HappyGuestsContextValue {
  happyGuestsCount: number;
  incrementHappyGuests: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const HappyGuestsContext = createContext<HappyGuestsContextValue | null>(null);

// Singleton to prevent duplicate fetches across React StrictMode
let globalFetchPromise: Promise<number> | null = null;
let globalCachedCount: number | null = null;

export const HappyGuestsProvider = ({ children }: { children: ReactNode }) => {
  const [happyGuestsCount, setHappyGuestsCount] = useState<number>(globalCachedCount ?? 0);
  const [isLoading, setIsLoading] = useState(globalCachedCount === null);
  const [error, setError] = useState<string | null>(null);

  const fetchHappyGuestsCount = useCallback(async () => {
    // Return cached value if available
    if (globalCachedCount !== null) {
      setHappyGuestsCount(globalCachedCount);
      setIsLoading(false);
      return;
    }

    // Deduplicate concurrent fetches
    if (globalFetchPromise) {
      const count = await globalFetchPromise;
      setHappyGuestsCount(count);
      setIsLoading(false);
      return;
    }

    globalFetchPromise = (async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('metrics')
          .select('value')
          .eq('key', 'happy_guests')
          .maybeSingle();

        if (fetchError) {
          console.warn('Failed to fetch happy guests count:', fetchError.message);
          return 0;
        }

        const count = data?.value !== undefined && data?.value !== null 
          ? Number(data.value) 
          : 0;
        
        globalCachedCount = count;
        return count;
      } catch (err) {
        console.warn('Error fetching happy guests count:', err);
        return 0;
      }
    })();

    const count = await globalFetchPromise;
    setHappyGuestsCount(count);
    setIsLoading(false);
    globalFetchPromise = null;
  }, []);

  const incrementHappyGuests = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const { data, error: incrementError } = await supabase.rpc('increment_happy_guests');

      if (incrementError) {
        console.error('Failed to increment happy guests:', incrementError.message);
        setError(incrementError.message);
        return;
      }

      if (data && data.length > 0 && data[0].new_count !== undefined) {
        const newCount = Number(data[0].new_count);
        setHappyGuestsCount(newCount);
        globalCachedCount = newCount;
      }
    } catch (err) {
      console.error('Error incrementing happy guests:', err);
      setError(err instanceof Error ? err.message : 'Failed to increment count');
    }
  }, []);

  useEffect(() => {
    // Defer until after LCP — this is a non-critical vanity metric and must
    // never compete with hydration. Fails silently to 0 if unreachable.
    deferUntilIdle(() => { void fetchHappyGuestsCount(); });
  }, [fetchHappyGuestsCount]);

  return (
    <HappyGuestsContext.Provider value={{ happyGuestsCount, incrementHappyGuests, isLoading, error }}>
      {children}
    </HappyGuestsContext.Provider>
  );
};

export const useHappyGuestsContext = () => {
  const context = useContext(HappyGuestsContext);
  if (!context) {
    throw new Error('useHappyGuestsContext must be used within HappyGuestsProvider');
  }
  return context;
};
