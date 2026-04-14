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
    // Content Security Policy - GTM/GA4/Google Ads Compatible (EU Compliant)
    'Content-Security-Policy': [
      "default-src 'self'",
      "img-src 'self' data: https: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.google.co.in https://googleads.g.doubleclick.net https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://www.googlesyndication.com https://googleads.g.doubleclick.net https://www.gstatic.com https://www.google.com",
      `connect-src 'self' ${supabaseUrl} wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://www.google.com https://pagead2.googlesyndication.com`,
      "frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; '),

    // Referrer Policy - no referrer for privacy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

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