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
    supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://kzhsxemkntfwsakhkylt.supabase.co',
    customDomains = [],
    enableHSTS = !isDevelopment
  } = config;

  const headers: Record<string, string> = {
    // Content Security Policy - GTM/GA4/Google Ads Compatible
    // Allows Google Tag Manager as sole analytics authority
    'Content-Security-Policy': [
      "default-src 'self'",
      // Images: Allow Google tracking pixels + general https
      "img-src 'self' data: blob: https:",
      // Styles: Allow Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com https://tagmanager.google.com",
      // Fonts: Google Fonts
      "font-src 'self' data: https://fonts.gstatic.com https://*.hotjar.com",
      // Scripts: GTM, GA4, Google Ads (inline needed for GTM to inject tags).
      // 'self' covers the first-party /cs/uxa proxy path; Contentsquare/Hotjar kept as fallback origins.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://www.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://ssl.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.googlesyndication.com https://pagead2.googlesyndication.com https://adservice.google.com https://www.gstatic.com https://ssl.gstatic.com https://www.google.com https://www.google.co.in https://tagassistant.google.com https://t.contentsquare.net https://*.contentsquare.net https://script.hotjar.com https://static.hotjar.com",
      // Connect: API endpoints for analytics + Supabase + Contentsquare/Hotjar beacons + Sentry error
      // reports (without the Sentry ingest hosts every crash report was blocked by this policy).
      `connect-src 'self' https://kzhsxemkntfwsakhkylt.supabase.co wss://kzhsxemkntfwsakhkylt.supabase.co https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://*.analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com https://tagassistant.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://td.doubleclick.net https://*.g.doubleclick.net https://adservice.google.com https://www.google.com https://www.google.co.in https://pagead2.googlesyndication.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://fonts.googleapis.com https://fonts.gstatic.com https://t.contentsquare.net https://*.contentsquare.net https://*.hotjar.com https://*.hotjar.io https://*.doubleclick.net wss://*.hotjar.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io`,
      // Frames: Allow GTM preview/debug mode
      "frame-src 'self' https://www.googletagmanager.com https://tagassistant.google.com https://td.doubleclick.net https://*.doubleclick.net https://www.google.com https://*.hotjar.com",
      "frame-ancestors 'self' https://tagassistant.google.com https://tagmanager.google.com",
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
 * Directives and headers a browser ignores when they arrive in a <meta http-equiv> tag.
 * Sending them that way only logs console errors on every page; they must be real HTTP headers
 * (see serverOnlySecurityHeaders, applied in src/server.ts).
 */
const META_IGNORED_CSP_DIRECTIVES = ['frame-ancestors', 'report-uri', 'report-to', 'sandbox'];

/** The part of the policy that only works as an HTTP header: framing protection and nosniff. */
export function serverOnlySecurityHeaders(config: SecurityHeadersConfig = {}): Record<string, string> {
  const csp = generateProductionSecurityHeaders(config)['Content-Security-Policy'] || '';
  const frameAncestors = csp.split(';').map((d) => d.trim()).find((d) => d.startsWith('frame-ancestors')) || "frame-ancestors 'self'";
  return {
    'Content-Security-Policy': frameAncestors,
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
  };
}

/**
 * Client-side Content-Security-Policy via a meta tag. Only the CSP is emitted, minus the
 * directives browsers ignore in meta form; every other security header is header-only and is
 * either sent by the server or not applicable to a page.
 */
export function applyClientSideSecurityHeaders(config: SecurityHeadersConfig = {}) {
  if (typeof document === 'undefined') return;

  const csp = (generateProductionSecurityHeaders(config)['Content-Security-Policy'] || '')
    .split(';')
    .map((d) => d.trim())
    .filter((d) => d && !META_IGNORED_CSP_DIRECTIVES.some((x) => d.startsWith(x)))
    .join('; ');

  document.querySelectorAll('meta[data-security-header]').forEach(meta => meta.remove());
  if (!csp) return;
  const meta = document.createElement('meta');
  meta.setAttribute('http-equiv', 'Content-Security-Policy');
  meta.setAttribute('content', csp);
  meta.setAttribute('data-security-header', 'true');
  document.head.appendChild(meta);
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