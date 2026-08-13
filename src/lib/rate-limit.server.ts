import type { SupabaseClient } from '@supabase/supabase-js';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Shared fixed-window rate limiter backed by the `rate_limits` table.
 * Used by migrated server functions (previously `_shared/rateLimiter.ts`
 * in the edge-function runtime). Fails open on infrastructure errors so a
 * limiter outage never blocks legitimate guests.
 */
export async function checkServerRateLimit(
  supabase: SupabaseClient<any, any, any>,
  identifier: string,
  endpoint: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - windowMs);
  const resetAt = new Date(Date.now() + windowMs);

  try {
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('request_count, window_start')
      .eq('ip_address', identifier)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString())
      .maybeSingle();

    if (!existing) {
      await supabase.from('rate_limits').insert({
        ip_address: identifier,
        endpoint,
        request_count: 1,
        window_start: new Date().toISOString(),
        expires_at: resetAt.toISOString(),
      });
      return { allowed: true, remaining: maxRequests - 1, resetAt };
    }

    const count = Number(existing.request_count ?? 0);
    const windowResetAt = new Date(new Date(existing.window_start as string).getTime() + windowMs);

    if (count >= maxRequests) {
      return { allowed: false, remaining: 0, resetAt: windowResetAt };
    }

    await supabase
      .from('rate_limits')
      .update({ request_count: count + 1 })
      .eq('ip_address', identifier)
      .eq('endpoint', endpoint)
      .eq('window_start', existing.window_start as string);

    return { allowed: true, remaining: maxRequests - count - 1, resetAt: windowResetAt };
  } catch (err) {
    console.error(`[rate-limit] ${endpoint} check failed`, err);
    return { allowed: true, remaining: maxRequests, resetAt };
  }
}
