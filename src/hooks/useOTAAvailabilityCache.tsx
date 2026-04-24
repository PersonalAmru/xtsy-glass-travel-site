import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { AvailabilityData } from './useRoomAvailability';

/**
 * OTA Availability Fallback — reads ota_availability_cache so the booking UI
 * can render last-known availability instantly, before the live OTA sync
 * completes. Non-blocking; safe for first paint.
 */

interface CachedResult {
  cache: Record<string, AvailabilityData>;
  cachedAt: Date | null;
  isStale: boolean;
  loading: boolean;
}

export const useOTAAvailabilityCache = (
  roomName: string,
  enabled: boolean = true
): CachedResult => {
  const [cache, setCache] = useState<Record<string, AvailabilityData>>({});
  const [cachedAt, setCachedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled || !roomName) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase
          .from('ota_availability_cache')
          .select('*')
          .eq('room_type_name', roomName)
          .gte('cache_date', today)
          .order('cache_date', { ascending: true })
          .limit(120);

        if (cancelled) return;
        const map: Record<string, AvailabilityData> = {};
        let newest: Date | null = null;
        (data || []).forEach((row: any) => {
          map[row.cache_date] = {
            available: row.available,
            total: row.total,
            isBlocked: row.is_blocked,
            isSoldOut: row.is_sold_out,
            bookedCount: Math.max(0, row.total - row.available),
          };
          const t = new Date(row.cached_at);
          if (!newest || t > newest) newest = t;
        });
        setCache(map);
        setCachedAt(newest);
      } catch {
        // Silent — fallback only
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [roomName, enabled]);

  const isStale = cachedAt ? Date.now() - cachedAt.getTime() > 15 * 60 * 1000 : false;

  return { cache, cachedAt, isStale, loading };
};

export default useOTAAvailabilityCache;
