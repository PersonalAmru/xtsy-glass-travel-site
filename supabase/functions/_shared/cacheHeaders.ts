export interface CacheConfig {
  type: 'public' | 'private' | 'no-cache' | 'no-store';
  maxAge?: number;
  sMaxAge?: number;
  staleWhileRevalidate?: number;
  mustRevalidate?: boolean;
}

const CACHE_CONFIGS: Record<string, CacheConfig> = {
  'get-room-availability': {
    type: 'private',
    maxAge: 60,
    staleWhileRevalidate: 30,
  },
  'get-room-types': {
    type: 'public',
    maxAge: 300,
    sMaxAge: 600,
    staleWhileRevalidate: 120,
  },
  'fetch-exchange-rates': {
    type: 'public',
    maxAge: 43200,
    sMaxAge: 43200,
    staleWhileRevalidate: 3600,
  },
  'validate-booking': {
    type: 'no-cache',
    mustRevalidate: true,
  },
  'newsletter-signup': {
    type: 'no-store',
  },
};

export function getCacheHeaders(endpoint: string, customConfig?: CacheConfig): Record<string, string> {
  const config = customConfig || CACHE_CONFIGS[endpoint];
  
  if (!config) {
    return {
      'Cache-Control': 'no-cache',
    };
  }

  const parts: string[] = [];

  if (config.type === 'no-store') {
    parts.push('no-store');
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
  }

  return {
    'Cache-Control': parts.join(', '),
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
  };
}

export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}
