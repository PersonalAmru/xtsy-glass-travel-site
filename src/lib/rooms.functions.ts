import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader, setResponseHeader } from '@tanstack/react-start/server';

import { checkServerRateLimit } from './rate-limit.server';

/**
 * Active room types for the booking UI.
 * Migrated from the `get-room-types` edge function to a TanStack server fn.
 */
export const getRoomTypes = createServerFn({ method: 'GET' }).handler(async () => {
  const ip =
    getRequestHeader('cf-connecting-ip') ??
    getRequestHeader('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

  const limit = await checkServerRateLimit(supabaseAdmin, ip, 'get-room-types', 100, 60_000);
  if (!limit.allowed) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  const { data, error } = await supabaseAdmin
    .from('room_types')
    .select('*')
    .eq('is_active', true)
    .order('created_at');

  if (error) {
    console.error('[getRoomTypes]', error.message);
    throw new Error('Unable to fetch room information. Please try again or contact support.');
  }

  setResponseHeader('cache-control', 'public, max-age=60, stale-while-revalidate=300');
  return data ?? [];
});
