import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const now = Date.now();

    // Check if cache is still valid
    if (cachedRates && (now - cachedRates.timestamp) < CACHE_TTL) {
      console.log('Returning cached exchange rates');
      return new Response(
        JSON.stringify({ 
          rates: cachedRates.rates,
          cached: true,
          timestamp: cachedRates.timestamp 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=43200', // 12 hours
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

    return new Response(
      JSON.stringify({ 
        rates,
        cached: false,
        timestamp: now 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=43200', // 12 hours
        } 
      }
    );
  } catch (error) {
    console.error('Failed to fetch exchange rates, using fallback:', error);
    
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
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600', // 1 hour for fallback
        } 
      }
    );
  }
});
