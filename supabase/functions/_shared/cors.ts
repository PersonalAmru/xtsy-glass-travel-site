// List of allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://xtsy.one',
  'https://www.xtsy.one',
  'https://xtsy-one.lovable.app',
  'http://localhost:5173',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
];

// Allowed domain suffixes for dynamic origin matching
const ALLOWED_DOMAIN_SUFFIXES = [
  '.lovable.app',
  '.lovableproject.com',
];

/**
 * Get CORS headers with validated origin
 * Returns appropriate headers based on request origin
 */
export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  
  // Check if origin is in allowed list or matches allowed domain suffixes
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin) || 
    ALLOWED_DOMAIN_SUFFIXES.some(suffix => origin.endsWith(suffix));
  
  const corsOrigin = isAllowedOrigin ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}

/**
 * Legacy export for backwards compatibility
 * @deprecated Use getCorsHeaders(req) instead for proper origin validation
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
