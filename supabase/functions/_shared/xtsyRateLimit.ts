import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function checkXtsyRateLimit(
  req: Request,
  scope: string,
  limit: number,
): Promise<boolean> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const rateLimitSalt = Deno.env.get('XTSY_AI_RATE_LIMIT_SALT');
  if (!supabaseUrl || !serviceRoleKey || !rateLimitSalt) {
    throw new Error('Rate-limit service or dedicated salt is not configured');
  }

  const forwarded = req.headers.get('x-forwarded-for')
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const ip = req.headers.get('cf-connecting-ip')
    || req.headers.get('x-real-ip')
    || forwarded?.at(-1)
    || 'unknown';

  const keyMaterial = new TextEncoder().encode(`${rateLimitSalt}:${scope}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', keyMaterial);
  const keyHash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data, error } = await supabase.rpc('consume_xtsy_ai_rate_limit', {
    p_key_hash: keyHash,
    p_limit: limit,
    p_window_seconds: 3600,
  });
  if (error) {
    console.error('[XTSY rate limit] Could not consume rate-limit slot', error.message);
    throw new Error('Rate-limit check failed');
  }
  return data === true;
}
