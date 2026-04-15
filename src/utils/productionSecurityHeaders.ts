/**
 * Production Security Headers for EU/GDPR Compliance
 * Implements HSTS, CSP, and privacy-focused security headers
 */

export interface SecurityHeadersConfig {
  isDevelopment?: boolean;
  supabaseUrl?: string;
  customDomains?: string[];
  enableHSTS?: boolean;
}

export function generateProductionSecurityHeaders(config: SecurityHeadersConfig = {}) {
  const {
    isDevelopment = import.meta.env.MODE === 'development',
    supabaseUrl = 'https://oidnydyyjyjfnyadhyzn.supabase.co',
    customDomains = [],
    enableHSTS = !isDevelopment
  } = config;

  const headers: Record<string, string> = {
    // Content Security Policy - GTM/GA4/Google Ads Compatible
    // Allows Google Tag Manager as sole analytics authority
    'Content-Security-Policy': [
      "default-src 'self'",
      // Images: Allow Google tracking pixels + general https
      "img-src 'self' data: https: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.google.co.in https://googleads.g.doubleclick.net https://www.gstatic.com https://ssl.gstatic.com",
      // Styles: Allow Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com",
      // Fonts: Google Fonts
      "font-src 'self' https://fonts.gstatic.com data:",
      // Scripts: GTM, GA4, Google Ads (inline needed for GTM to inject tags)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://www.googlesyndication.com https://googleads.g.doubleclick.net https://www.gstatic.com https://ssl.gstatic.com https://www.google.com",
      // Connect: API endpoints for analytics + Supabase
      `connect-src 'self' ${supabaseUrl} wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://www.google.com https://pagead2.googlesyndication.com`,
      // Frames: Allow GTM preview/debug mode
      "frame-src 'self' https://www.googletagmanager.com https://td.doubleclick.net",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; '),

    // Referrer Policy - No referrer for maximum privacy
    'Referrer-Policy': 'no-referrer',

    // Permissions Policy - Restrict browser features
    'Permissions-Policy': [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=()',
      'usb=()',
      'bluetooth=()'
    ].join(', '),

    // Content Type Options
    'X-Content-Type-Options': 'nosniff',

    // Frame Options
    'X-Frame-Options': 'DENY',

    // XSS Protection
    'X-XSS-Protection': '1; mode=block',

    // Cache Control for sensitive pages
    'Cache-Control': 'no-cache, no-store, must-revalidate, private',

    // GDPR-compliant privacy headers
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'same-origin'
  };

  // HSTS only in production to avoid localhost issues
  if (enableHSTS && !isDevelopment) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  return headers;
}

/**
 * Apply security headers to Response (for Edge Functions)
 */
export function withProductionSecurityHeaders(
  response: Response, 
  config: SecurityHeadersConfig = {}
): Response {
  const securityHeaders = generateProductionSecurityHeaders(config);
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
 * Client-side security headers via meta tags
 */
export function applyClientSideSecurityHeaders(config: SecurityHeadersConfig = {}) {
  if (typeof document === 'undefined') return;

  const securityHeaders = generateProductionSecurityHeaders(config);
  
  // Remove existing security meta tags
  document.querySelectorAll('meta[data-security-header]').forEach(meta => meta.remove());

  // Add new security meta tags
  Object.entries(securityHeaders).forEach(([name, content]) => {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', name);
    meta.setAttribute('content', content);
    meta.setAttribute('data-security-header', 'true');
    document.head.appendChild(meta);
  });
}

/**
 * CORS headers for API endpoints
 */
export const secureCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin, Authorization'
};