// Idempotency Service for Failure-Safe Operations
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { 
  OperationType, 
  IdempotencyCheckResult,
  IdempotencyKey 
} from '@/types/commercial';

/**
 * Generate a unique idempotency key
 */
export function generateIdempotencyKey(
  operationType: OperationType,
  ...identifiers: string[]
): string {
  const timestamp = Date.now();
  const combined = [operationType, ...identifiers, timestamp].join(':');
  return btoa(combined).replace(/[^a-zA-Z0-9]/g, '').slice(0, 64);
}

/**
 * Generate a hash of request payload for duplicate detection
 */
export function hashRequest(payload: Record<string, unknown>): string {
  const sorted = JSON.stringify(payload, Object.keys(payload).sort());
  // Simple hash function for browser compatibility
  let hash = 0;
  for (let i = 0; i < sorted.length; i++) {
    const char = sorted.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Check idempotency before performing an operation
 */
export async function checkIdempotency(
  key: string,
  operationType: OperationType,
  requestHash?: string
): Promise<IdempotencyCheckResult> {
  try {
    const { data, error } = await supabase.rpc('check_idempotency', {
      p_key: key,
      p_operation_type: operationType,
      p_request_hash: requestHash || undefined
    });

    if (error) {
      console.error('Idempotency check error:', error);
      return { exists: false, status: 'error', can_proceed: true };
    }

    const result = data as Record<string, unknown>;
    return {
      exists: Boolean(result?.exists),
      status: String(result?.status || 'unknown'),
      can_proceed: Boolean(result?.can_proceed),
      result: result?.result as Record<string, unknown> | undefined,
      message: result?.message as string | undefined,
      idempotency_id: result?.idempotency_id as string | undefined,
    };
  } catch (err) {
    console.error('Idempotency check exception:', err);
    return { exists: false, status: 'error', can_proceed: true };
  }
}

/**
 * Complete an idempotent operation
 */
export async function completeIdempotentOperation(
  idempotencyId: string,
  success: boolean,
  result?: Record<string, unknown>,
  errorMessage?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('idempotency_keys')
      .update({
        status: success ? 'completed' : 'failed',
        result: (result || null) as Json,
        error_message: errorMessage || null,
        completed_at: new Date().toISOString()
      })
      .eq('id', idempotencyId);

    if (error) {
      console.error('Failed to complete idempotent operation:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Complete operation exception:', err);
    return false;
  }
}

/**
 * Wrapper for idempotent operations
 */
export async function withIdempotency<T>(
  key: string,
  operationType: OperationType,
  operation: () => Promise<T>,
  requestPayload?: Record<string, unknown>
): Promise<{ result: T | null; fromCache: boolean; error?: string }> {
  const requestHash = requestPayload ? hashRequest(requestPayload) : undefined;
  
  // Check if operation already exists
  const check = await checkIdempotency(key, operationType, requestHash);
  
  if (!check.can_proceed) {
    if (check.status === 'completed' && check.result) {
      return { result: check.result as T, fromCache: true };
    }
    return { 
      result: null, 
      fromCache: false, 
      error: check.message || 'Operation already in progress' 
    };
  }

  try {
    // Execute the operation
    const result = await operation();
    
    // Mark as completed
    if (check.idempotency_id) {
      await completeIdempotentOperation(
        check.idempotency_id,
        true,
        (typeof result === 'object' && result !== null ? result : {}) as Record<string, unknown>
      );
    }

    return { result, fromCache: false };
  } catch (err) {
    // Mark as failed
    if (check.idempotency_id) {
      await completeIdempotentOperation(
        check.idempotency_id,
        false,
        undefined,
        err instanceof Error ? err.message : 'Unknown error'
      );
    }

    throw err;
  }
}

/**
 * Clean up expired idempotency keys
 */
export async function cleanupExpiredKeys(): Promise<number> {
  const { data, error } = await supabase
    .from('idempotency_keys')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .select('id');

  if (error) {
    console.error('Cleanup error:', error);
    return 0;
  }

  return data?.length || 0;
}

/**
 * Get recent idempotency operations for debugging
 */
export async function getRecentOperations(
  limit: number = 50
): Promise<IdempotencyKey[]> {
  const { data, error } = await supabase
    .from('idempotency_keys')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching operations:', error);
    return [];
  }

  return data as IdempotencyKey[];
}
