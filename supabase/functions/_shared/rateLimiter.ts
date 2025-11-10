import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface RateLimitConfig {
  endpoint: string;
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  'get-room-availability': { endpoint: 'get-room-availability', maxRequests: 60, windowMs: 60000 },
  'validate-booking': { endpoint: 'validate-booking', maxRequests: 30, windowMs: 60000 },
  'get-room-types': { endpoint: 'get-room-types', maxRequests: 100, windowMs: 60000 },
  'newsletter-signup': { endpoint: 'newsletter-signup', maxRequests: 10, windowMs: 3600000 },
  'fetch-exchange-rates': { endpoint: 'fetch-exchange-rates', maxRequests: 20, windowMs: 60000 },
};

export async function checkRateLimit(
  supabase: SupabaseClient,
  ipAddress: string,
  endpoint: string,
  customConfig?: RateLimitConfig
): Promise<RateLimitResult> {
  const config = customConfig || DEFAULT_CONFIGS[endpoint];
  
  if (!config) {
    return { allowed: true, remaining: 999, resetAt: new Date(Date.now() + 60000) };
  }

  const windowStart = new Date(Date.now() - config.windowMs);
  const expiresAt = new Date(Date.now() + config.windowMs);

  try {
    // Get current request count in window
    const { data: rateLimitData, error: selectError } = await supabase
      .from('rate_limits')
      .select('request_count, window_start')
      .eq('ip_address', ipAddress)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString())
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Rate limit check error:', selectError);
      return { allowed: true, remaining: config.maxRequests, resetAt: expiresAt };
    }

    if (!rateLimitData) {
      // First request in window - create new record
      const { error: insertError } = await supabase
        .from('rate_limits')
        .insert({
          ip_address: ipAddress,
          endpoint: endpoint,
          request_count: 1,
          window_start: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        console.error('Rate limit insert error:', insertError);
        return { allowed: true, remaining: config.maxRequests - 1, resetAt: expiresAt };
      }

      return { allowed: true, remaining: config.maxRequests - 1, resetAt: expiresAt };
    }

    // Check if limit exceeded
    if (rateLimitData.request_count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(new Date(rateLimitData.window_start).getTime() + config.windowMs),
      };
    }

    // Increment request count
    const { error: updateError } = await supabase
      .from('rate_limits')
      .update({ request_count: rateLimitData.request_count + 1 })
      .eq('ip_address', ipAddress)
      .eq('endpoint', endpoint)
      .eq('window_start', rateLimitData.window_start);

    if (updateError) {
      console.error('Rate limit update error:', updateError);
    }

    return {
      allowed: true,
      remaining: config.maxRequests - rateLimitData.request_count - 1,
      resetAt: new Date(new Date(rateLimitData.window_start).getTime() + config.windowMs),
    };
  } catch (error) {
    console.error('Rate limit exception:', error);
    // Fail open to prevent blocking legitimate traffic
    return { allowed: true, remaining: config.maxRequests, resetAt: expiresAt };
  }
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetAt.toISOString(),
    'Retry-After': Math.ceil((result.resetAt.getTime() - Date.now()) / 1000).toString(),
  };
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}
