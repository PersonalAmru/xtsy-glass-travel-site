import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface ClientConfig {
  useServiceRole?: boolean;
  timeout?: number;
}

export function createOptimizedClient(config: ClientConfig = {}): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = config.useServiceRole
    ? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    : Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'supabase-edge-function',
      },
    },
  });
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 5000
): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  initialDelayMs: number = 100
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = initialDelayMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
