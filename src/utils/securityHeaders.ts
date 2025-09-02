/**
 * EU-compliant security headers utility
 * For production deployment with HSTS and strict CSP
 */

export interface SecurityHeadersConfig {
  isDevelopment?: boolean;
  supabaseUrl?: string;
  customDomains?: string[];
}

export function generateSecurityHeaders(config: SecurityHeadersConfig = {}) {
  const {
    isDevelopment = process.env.NODE_ENV === 'development',
    supabaseUrl = 'https://oidnydyyjyjfnyadhyzn.supabase.co',
    customDomains = []
  } = config;

  const headers: Record<string, string> = {
    // Content Security Policy - strict for EU compliance
    'Content-Security-Policy': [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "script-src 'self'",
      `connect-src 'self' ${supabaseUrl} wss://*.supabase.co`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; '),

    // Referrer Policy - no referrer for privacy
    'Referrer-Policy': 'no-referrer',

    // Permissions Policy - restrict browser features
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',

    // Content Type Options
    'X-Content-Type-Options': 'nosniff',

    // Frame Options
    'X-Frame-Options': 'DENY',

    // XSS Protection (legacy but harmless)
    'X-XSS-Protection': '1; mode=block'
  };

  // Only add HSTS in production to avoid development issues
  if (!isDevelopment) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  return headers;
}

/**
 * Apply security headers to a Response object (for Edge Functions)
 */
export function withSecurityHeaders(
  response: Response, 
  config: SecurityHeadersConfig = {}
): Response {
  const securityHeaders = generateSecurityHeaders(config);
  const newHeaders = new Headers(response.headers);
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

/**
 * CORS headers for EU compliance
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400'
};