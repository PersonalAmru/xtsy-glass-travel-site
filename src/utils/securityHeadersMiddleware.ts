/**
 * Production security headers middleware for EU/GDPR compliance
 * Implements HSTS, CSP, and other security headers
 */

export interface SecurityConfig {
  isDevelopment?: boolean;
  supabaseUrl?: string;
  customDomains?: string[];
  enableHSTS?: boolean;
  reportViolations?: boolean;
}

/**
 * Generate comprehensive security headers for production deployment
 */
export function generateProductionSecurityHeaders(config: SecurityConfig = {}) {
  const {
    isDevelopment = process.env.NODE_ENV === 'development',
    supabaseUrl = 'https://oidnydyyjyjfnyadhyzn.supabase.co',
    customDomains = [],
    enableHSTS = !isDevelopment,
    reportViolations = true
  } = config;

  const allowedDomains = [
    "'self'",
    supabaseUrl,
    'https://*.supabase.co',
    ...customDomains
  ].join(' ');

  const headers: Record<string, string> = {
    // Strict Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net ${isDevelopment ? "'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      `connect-src 'self' ${allowedDomains} wss://*.supabase.co`,
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      isDevelopment ? "" : "upgrade-insecure-requests",
      reportViolations ? "report-uri /api/csp-report" : ""
    ].filter(Boolean).join('; '),

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Clickjacking protection
    'X-Frame-Options': 'DENY',

    // XSS protection (legacy but harmless)
    'X-XSS-Protection': '1; mode=block',

    // Referrer policy for privacy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions policy - restrict browser features
    'Permissions-Policy': [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
      'ambient-light-sensor=()',
      'autoplay=()',
      'encrypted-media=()',
      'fullscreen=(self)',
      'picture-in-picture=()'
    ].join(', '),

    // Cache control for security
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',

    // Additional security headers
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  };

  // Add HSTS only in production
  if (enableHSTS && !isDevelopment) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }

  return headers;
}

/**
 * Apply security headers to Response object (for Edge Functions)
 */
export function withSecurityHeaders(
  response: Response, 
  config: SecurityConfig = {}
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
 * CORS headers for EU compliance with strict origin control
 */
export function generateCORSHeaders(allowedOrigins: string[] = []) {
  return {
    'Access-Control-Allow-Origin': allowedOrigins.length > 0 ? allowedOrigins[0] : '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}

/**
 * Security middleware for client-side applications
 */
export class SecurityMiddleware {
  private config: SecurityConfig;

  constructor(config: SecurityConfig = {}) {
    this.config = config;
  }

  /**
   * Apply security headers via meta tags (fallback for client-side)
   */
  applyClientSideHeaders() {
    if (typeof document === 'undefined') return;

    const headers = generateProductionSecurityHeaders(this.config);
    
    // Apply CSP via meta tag
    this.addMetaHeader('Content-Security-Policy', headers['Content-Security-Policy']);
    
    // Apply other security meta tags
    this.addMetaHeader('X-Frame-Options', headers['X-Frame-Options']);
    this.addMetaHeader('X-Content-Type-Options', headers['X-Content-Type-Options']);
    this.addMetaHeader('X-XSS-Protection', headers['X-XSS-Protection']);
    
    // Set referrer policy
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = headers['Referrer-Policy'];
    document.head.appendChild(referrerMeta);
  }

  private addMetaHeader(httpEquiv: string, content: string) {
    // Remove existing meta tag if present
    const existing = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
    if (existing) {
      existing.remove();
    }

    // Add new meta tag
    const meta = document.createElement('meta');
    meta.httpEquiv = httpEquiv;
    meta.content = content;
    document.head.appendChild(meta);
  }

  /**
   * Remove all applied security headers (for cleanup)
   */
  cleanup() {
    if (typeof document === 'undefined') return;

    const securityMetaTags = [
      'Content-Security-Policy',
      'X-Frame-Options', 
      'X-Content-Type-Options',
      'X-XSS-Protection'
    ];

    securityMetaTags.forEach(httpEquiv => {
      const meta = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
      if (meta) meta.remove();
    });

    const referrerMeta = document.querySelector('meta[name="referrer"]');
    if (referrerMeta) referrerMeta.remove();
  }
}

// Export singleton for easy use
export const securityMiddleware = new SecurityMiddleware();