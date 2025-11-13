export interface CacheConfig {
  type: 'public' | 'private' | 'no-cache' | 'no-store';
  maxAge?: number;
  sMaxAge?: number;
  staleWhileRevalidate?: number;
  mustRevalidate?: boolean;
  tags?: string[];
}

// In-memory cache for edge functions (per-instance, short-lived)
const memoryCache = new Map<string, {
  data: any;
  expires: number;
  etag: string;
}>();

export function generateETag(data: any): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `"${Math.abs(hash).toString(36)}"`;
}

export function checkETag(request: Request, etag: string): boolean {
  const ifNoneMatch = request.headers.get('If-None-Match');
  return ifNoneMatch === etag;
}

export function getCached<T>(key: string): T | null {
  const cached = memoryCache.get(key);
  if (!cached) return null;
  
  if (Date.now() > cached.expires) {
    memoryCache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

export function setCached(key: string, data: any, ttlSeconds: number): string {
  const etag = generateETag(data);
  memoryCache.set(key, {
    data,
    expires: Date.now() + (ttlSeconds * 1000),
    etag,
  });
  return etag;
}

export function invalidateCache(pattern?: string) {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  
  const regex = new RegExp(pattern);
  for (const key of memoryCache.keys()) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }
}

const CACHE_CONFIGS: Record<string, CacheConfig> = {
  'get-room-availability': {
    type: 'public',
    maxAge: 300, // 5 minutes
    sMaxAge: 300,
    staleWhileRevalidate: 600, // 10 minutes SWR
    tags: ['availability'],
  },
  'get-room-types': {
    type: 'public',
    maxAge: 3600, // 1 hour
    sMaxAge: 3600,
    staleWhileRevalidate: 7200, // 2 hours SWR
    tags: ['room-types'],
  },
  'fetch-exchange-rates': {
    type: 'public',
    maxAge: 43200, // 12 hours
    sMaxAge: 43200,
    staleWhileRevalidate: 86400, // 24 hours SWR
    tags: ['exchange-rates'],
  },
  'validate-booking': {
    type: 'no-cache',
    mustRevalidate: true,
  },
  'newsletter-signup': {
    type: 'no-store',
  },
  'secure-blocking': {
    type: 'no-store',
  },
};

export function getCacheHeaders(
  endpoint: string, 
  customConfig?: CacheConfig,
  options?: { etag?: string; cacheHit?: boolean }
): Record<string, string> {
  const config = customConfig || CACHE_CONFIGS[endpoint];
  
  if (!config) {
    return {
      'Cache-Control': 'no-cache',
      'X-Cache': 'BYPASS',
    };
  }

  const parts: string[] = [];
  const headers: Record<string, string> = {};

  if (config.type === 'no-store') {
    parts.push('no-store', 'no-cache', 'must-revalidate', 'private');
    headers['Pragma'] = 'no-cache';
    headers['Expires'] = '0';
  } else if (config.type === 'no-cache') {
    parts.push('no-cache');
    if (config.mustRevalidate) parts.push('must-revalidate');
  } else {
    parts.push(config.type);
    if (config.maxAge !== undefined) parts.push(`max-age=${config.maxAge}`);
    if (config.sMaxAge !== undefined) parts.push(`s-maxage=${config.sMaxAge}`);
    if (config.staleWhileRevalidate !== undefined) {
      parts.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
    }
    
    // Set explicit expiry for better CDN caching
    if (config.maxAge) {
      const expiryDate = new Date(Date.now() + config.maxAge * 1000);
      headers['Expires'] = expiryDate.toUTCString();
    }
  }

  headers['Cache-Control'] = parts.join(', ');
  headers['Vary'] = 'Origin, Accept-Encoding';
  headers['X-Content-Type-Options'] = 'nosniff';
  
  // Add cache tags for invalidation
  if (config.tags && config.tags.length > 0) {
    headers['Cache-Tag'] = config.tags.join(',');
  }
  
  // Add ETag if provided
  if (options?.etag) {
    headers['ETag'] = options.etag;
  }
  
  // Add cache status for monitoring
  headers['X-Cache'] = options?.cacheHit ? 'HIT' : 'MISS';

  return headers;
}

export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}
