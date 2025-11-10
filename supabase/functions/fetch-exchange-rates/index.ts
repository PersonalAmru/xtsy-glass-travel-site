import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';
import { createOptimizedClient } from '../_shared/supabaseClient.ts';
import { checkRateLimit, getClientIp, getRateLimitHeaders } from '../_shared/rateLimiter.ts';
import { getCacheHeaders } from '../_shared/cacheHeaders.ts';
import { PerformanceMonitor } from '../_shared/performanceMonitor.ts';

// In-memory cache with 12-hour TTL
let cachedRates: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

// Fallback rates if API fails
const FALLBACK_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
};

// Retry logic with exponential backoff
async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      if (response.ok) return response;
    } catch (error) {
      console.warn(`Fetch attempt ${i + 1} failed:`, error);
      if (i < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  throw new Error('All retry attempts failed');
}

serve(async (req) => {
  const monitor = new PerformanceMonitor('fetch-exchange-rates');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createOptimizedClient({ useServiceRole: true });
    
    // Rate limiting
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkRateLimit(supabase, clientIp, 'fetch-exchange-rates');
    
    if (!rateLimitResult.allowed) {
      monitor.complete(429);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429,
          headers: { 
            ...corsHeaders,
            ...getCacheHeaders('fetch-exchange-rates'),
            ...getRateLimitHeaders(rateLimitResult),
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const now = Date.now();

    // Check if cache is still valid
    if (cachedRates && (now - cachedRates.timestamp) < CACHE_TTL) {
      console.log('Returning cached exchange rates');
      monitor.complete(200, { cacheHit: true });
      
      return new Response(
        JSON.stringify({ 
          rates: cachedRates.rates,
          cached: true,
          timestamp: cachedRates.timestamp 
        }),
        { 
          headers: { 
            ...corsHeaders,
            ...getCacheHeaders('fetch-exchange-rates'),
            ...getRateLimitHeaders(rateLimitResult),
            'Content-Type': 'application/json',
          } 
        }
      );
    }

    // Fetch fresh rates with retry logic
    console.log('Fetching fresh exchange rates from API');
    const response = await fetchWithRetry('https://api.exchangerate-api.com/v4/latest/INR');
    const data = await response.json();

    const rates = {
      INR: 1,
      USD: data.rates.USD || FALLBACK_RATES.USD,
      EUR: data.rates.EUR || FALLBACK_RATES.EUR,
    };

    // Update cache
    cachedRates = {
      rates,
      timestamp: now,
    };

    console.log('Successfully fetched and cached new rates:', rates);
    monitor.complete(200, { cacheHit: false });

    return new Response(
      JSON.stringify({ 
        rates,
        cached: false,
        timestamp: now 
      }),
      { 
        headers: { 
          ...corsHeaders,
          ...getCacheHeaders('fetch-exchange-rates'),
          ...getRateLimitHeaders(rateLimitResult),
          'Content-Type': 'application/json',
        } 
      }
    );
  } catch (error) {
    console.error('Failed to fetch exchange rates, using fallback:', error);
    monitor.complete(200, { cacheHit: false });
    
    // Return fallback rates
    return new Response(
      JSON.stringify({ 
        rates: FALLBACK_RATES,
        fallback: true,
        error: 'API unavailable',
        timestamp: Date.now() 
      }),
      { 
        headers: { 
          ...corsHeaders,
          ...getCacheHeaders('fetch-exchange-rates'),
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // 1 hour for fallback
        } 
      }
    );
  }
});
