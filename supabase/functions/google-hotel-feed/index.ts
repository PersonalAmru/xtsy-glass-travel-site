import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ── Inline Supabase client ──
function createOptimizedClient(useServiceRole = false) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = useServiceRole
    ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    : Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  return createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    db: { schema: 'public' },
    global: { headers: { 'x-client-info': 'supabase-edge-function' } },
  });
}

// ── Inline Cache ──
class PersistentCache {
  // deno-lint-ignore no-explicit-any
  private supabase: any;
  constructor(supabase: any) { this.supabase = supabase; }

  async get<T>(key: string): Promise<T | null> {
    try {
      const { data, error } = await this.supabase
        .from('edge_function_cache').select('value, expires_at').eq('key', key).single();
      if (error || !data) return null;
      if (new Date(data.expires_at) < new Date()) { await this.delete(key); return null; }
      return data.value as T;
    } catch { return null; }
  }

  // deno-lint-ignore no-explicit-any
  async set(key: string, value: any, ttlSeconds: number): Promise<boolean> {
    try {
      const expires_at = new Date(Date.now() + ttlSeconds * 1000).toISOString();
      const { error } = await this.supabase
        .from('edge_function_cache').upsert({ key, value, expires_at }, { onConflict: 'key' });
      return !error;
    } catch { return false; }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from('edge_function_cache').delete().eq('key', key);
      return !error;
    } catch { return false; }
  }
}

// ── Inline Rate Limiter ──
function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || req.headers.get('x-real-ip')
    || 'unknown';
}

// deno-lint-ignore no-explicit-any
async function checkRateLimit(supabase: any, ip: string, endpoint: string, config: { maxRequests: number; windowMs: number }) {
  const windowStart = new Date(Date.now() - config.windowMs);
  const expiresAt = new Date(Date.now() + config.windowMs);
  try {
    const { data, error } = await supabase
      .from('rate_limits').select('request_count, window_start')
      .eq('ip_address', ip).eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString()).single();

    if (error && error.code !== 'PGRST116') return { allowed: true, remaining: config.maxRequests, resetAt: expiresAt };

    if (!data) {
      await supabase.from('rate_limits').insert({ ip_address: ip, endpoint, request_count: 1, window_start: new Date().toISOString(), expires_at: expiresAt.toISOString() });
      return { allowed: true, remaining: config.maxRequests - 1, resetAt: expiresAt };
    }

    if (data.request_count >= config.maxRequests) return { allowed: false, remaining: 0, resetAt: new Date(new Date(data.window_start).getTime() + config.windowMs) };

    await supabase.from('rate_limits').update({ request_count: data.request_count + 1 }).eq('ip_address', ip).eq('endpoint', endpoint).eq('window_start', data.window_start);
    return { allowed: true, remaining: config.maxRequests - data.request_count - 1, resetAt: new Date(new Date(data.window_start).getTime() + config.windowMs) };
  } catch { return { allowed: true, remaining: config.maxRequests, resetAt: expiresAt }; }
}

// deno-lint-ignore no-explicit-any
function getRateLimitHeaders(result: any): Record<string, string> {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetAt.toISOString(),
    'Retry-After': Math.ceil((result.resetAt.getTime() - Date.now()) / 1000).toString(),
  };
}

// ── Constants ──
const CACHE_TTL = 900;
const CACHE_KEY_HOTEL_LIST = 'google_hotel_list_xml';
const CACHE_KEY_PRICE_FEED = 'google_price_feed_xml';

const PROPERTIES = [
  {
    id: 'xtsy-travellers-hostel',
    name: 'XTSY Travellers Hostel',
    dbId: '11978251-839f-4274-ab1b-ec9c2d8bbaae',
    addr1: 'Diengiong, Mawdiangdiang, New Shillong Township',
    city: 'Shillong',
    province: 'Meghalaya',
    postal_code: '793018',
    country: 'IN',
    phone: '+918837317070',
    latitude: '25.6025257',
    longitude: '91.9448919',
    category: 'hostel',
    roomTypes: ['king-double-room', '4-bed-mixed-female-dorm', '4-bed-female-only-dorm', '6-bed-mixed-dorm', '6-bed-mixed-female-dorm', '8-bed-mixed-dorm'],
  },
  {
    id: 'xtsy-luxury',
    name: 'XTSY Luxury',
    dbId: '5d67fd82-c64c-4cd0-b051-a29deb9c9b3b',
    addr1: 'Diengiong, Mawdiangdiang, New Shillong Township',
    city: 'Shillong',
    province: 'Meghalaya',
    postal_code: '793018',
    country: 'IN',
    phone: '+918837317070',
    latitude: '25.6025257',
    longitude: '91.9448919',
    category: 'hotel',
    roomTypes: ['xtsy-270'],
  },
];

const ALL_ROOM_TYPE_IDS = PROPERTIES.flatMap((p) => p.roomTypes);

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function generateHotelListXml(): string {
  const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>', '<listings>'];
  for (const prop of PROPERTIES) {
    lines.push(`  <listing>`);
    lines.push(`    <id>${escapeXml(prop.id)}</id>`);
    lines.push(`    <name>${escapeXml(prop.name)}</name>`);
    lines.push(`    <address format="simple">`);
    lines.push(`      <component name="addr1">${escapeXml(prop.addr1)}</component>`);
    lines.push(`      <component name="city">${escapeXml(prop.city)}</component>`);
    lines.push(`      <component name="province">${escapeXml(prop.province)}</component>`);
    lines.push(`      <component name="postal_code">${escapeXml(prop.postal_code)}</component>`);
    lines.push(`      <component name="country">${prop.country}</component>`);
    lines.push(`    </address>`);
    lines.push(`    <phone type="main">${escapeXml(prop.phone)}</phone>`);
    lines.push(`    <latitude>${prop.latitude}</latitude>`);
    lines.push(`    <longitude>${prop.longitude}</longitude>`);
    lines.push(`    <category>${escapeXml(prop.category)}</category>`);
    lines.push(`  </listing>`);
  }
  lines.push('</listings>');
  return lines.join('\n');
}

// deno-lint-ignore no-explicit-any
async function generatePriceAvailabilityXml(supabase: any): Promise<string> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 90);
  const todayStr = formatDate(today);
  const endStr = formatDate(endDate);

  const [roomTypesRes, inventoryRes, blockedRes] = await Promise.all([
    supabase.from('room_types').select('id, name, base_price, total_units').in('id', ALL_ROOM_TYPE_IDS).eq('is_active', true),
    supabase.from('room_inventory').select('room_type_id, date, available_count').in('room_type_id', ALL_ROOM_TYPE_IDS).gte('date', todayStr).lte('date', endStr),
    supabase.from('blocked_dates').select('room_type, date').in('room_type', ALL_ROOM_TYPE_IDS).eq('blocked', true).gte('date', todayStr).lte('date', endStr),
  ]);

  const roomTypes = roomTypesRes.data || [];
  const inventory = inventoryRes.data || [];
  const blocked = blockedRes.data || [];

  const roomMap = new Map(); for (const rt of roomTypes) roomMap.set(rt.id, rt);
  const inventoryMap = new Map(); for (const inv of inventory) inventoryMap.set(`${inv.room_type_id}|${inv.date}`, inv.available_count);
  const blockedSet = new Set(); for (const b of blocked) blockedSet.add(`${b.room_type}|${b.date}`);

  const timestamp = now.toISOString();
  const txnId = `txn_${now.getTime()}`;
  const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>', `<Transaction timestamp="${timestamp}" id="${txnId}">`];

  for (const prop of PROPERTIES) {
    for (const roomId of prop.roomTypes) {
      const room = roomMap.get(roomId);
      if (!room) continue;
      const checkDate = new Date(today);
      for (let d = 0; d < 90; d++) {
        const dateStr = formatDate(checkDate);
        const key = `${roomId}|${dateStr}`;
        let available: number;
        if (blockedSet.has(key)) { available = 0; }
        else if (inventoryMap.has(key)) { available = Math.max(0, inventoryMap.get(key)!); }
        else { available = room.total_units; }

        const baserate = room.base_price;
        const tax = Math.round((baserate * 12) / 112 * 100) / 100;
        const netRate = Math.round((baserate - tax) * 100) / 100;

        lines.push(`  <Result>`);
        lines.push(`    <Property>${escapeXml(prop.id)}</Property>`);
        lines.push(`    <Checkin>${dateStr}</Checkin>`);
        lines.push(`    <Nights>1</Nights>`);
        lines.push(`    <RoomID>${escapeXml(roomId)}</RoomID>`);
        lines.push(`    <Baserate currency="INR">${netRate.toFixed(2)}</Baserate>`);
        lines.push(`    <Tax currency="INR">${tax.toFixed(2)}</Tax>`);
        lines.push(`    <OtherFees currency="INR">0.00</OtherFees>`);
        if (available <= 0) { lines.push(`    <Custom1>unavailable</Custom1>`); }
        else { lines.push(`    <Custom1>available</Custom1>`); lines.push(`    <Custom2>${available}</Custom2>`); }
        lines.push(`    <AllowablePointsOfSale>`);
        lines.push(`      <PointOfSale id="xtsy_direct"/>`);
        lines.push(`    </AllowablePointsOfSale>`);
        lines.push(`  </Result>`);
        checkDate.setDate(checkDate.getDate() + 1);
      }
    }
  }
  lines.push('</Transaction>');
  return lines.join('\n');
}

console.log("Google Hotel Feed function starting...");

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  }

  const supabase = createOptimizedClient(true);
  const url = new URL(req.url);
  const feedType = url.searchParams.get('type') || 'hotel-list';
  const forceRefresh = url.searchParams.get('refresh') === 'true';

  const ip = getClientIp(req);
  const rateResult = await checkRateLimit(supabase, ip, 'google-hotel-feed', { maxRequests: 60, windowMs: 60000 });

  if (!rateResult.allowed) {
    return new Response('<error>Rate limit exceeded</error>', { status: 429, headers: { 'Content-Type': 'application/xml', ...getRateLimitHeaders(rateResult) } });
  }

  try {
    const cache = new PersistentCache(supabase);
    const cacheKey = feedType === 'price-availability' ? CACHE_KEY_PRICE_FEED : CACHE_KEY_HOTEL_LIST;

    if (!forceRefresh) {
      const cached = await cache.get<string>(cacheKey);
      if (cached) {
        return new Response(cached, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=900, s-maxage=900', 'X-Cache': 'HIT' } });
      }
    }

    const xml = feedType === 'price-availability' ? await generatePriceAvailabilityXml(supabase) : generateHotelListXml();
    await cache.set(cacheKey, xml, CACHE_TTL);

    return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=900, s-maxage=900', 'X-Cache': 'MISS' } });
  } catch (error) {
    console.error('Google Hotel Feed error:', error);
    return new Response('<error>Internal server error</error>', { status: 500, headers: { 'Content-Type': 'application/xml' } });
  }
});
