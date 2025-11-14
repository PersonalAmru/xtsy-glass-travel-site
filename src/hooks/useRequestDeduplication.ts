import { useRef } from 'react';

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

/**
 * Hook to prevent duplicate simultaneous requests
 * Returns a memoized function that deduplicates requests by key
 */
export function useRequestDeduplication<T>() {
  const pendingRequests = useRef<Map<string, PendingRequest<T>>>(new Map());

  const deduplicate = async (
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = 1000
  ): Promise<T> => {
    const now = Date.now();
    const pending = pendingRequests.current.get(key);

    // Check if there's a pending request that's still valid
    if (pending && (now - pending.timestamp) < ttlMs) {
      console.log(`[Dedup] Reusing pending request for: ${key}`);
      return pending.promise;
    }

    // Create new request
    console.log(`[Dedup] Creating new request for: ${key}`);
    const promise = fetcher().finally(() => {
      // Clean up after request completes
      setTimeout(() => {
        pendingRequests.current.delete(key);
      }, ttlMs);
    });

    pendingRequests.current.set(key, {
      promise,
      timestamp: now,
    });

    return promise;
  };

  return deduplicate;
}

// Singleton for global deduplication across components
class GlobalDeduplicator {
  private pendingRequests = new Map<string, PendingRequest<any>>();

  async deduplicate<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = 1000
  ): Promise<T> {
    const now = Date.now();
    const pending = this.pendingRequests.get(key);

    if (pending && (now - pending.timestamp) < ttlMs) {
      console.log(`[Global Dedup] Reusing pending request for: ${key}`);
      return pending.promise;
    }

    console.log(`[Global Dedup] Creating new request for: ${key}`);
    const promise = fetcher().finally(() => {
      setTimeout(() => {
        this.pendingRequests.delete(key);
      }, ttlMs);
    });

    this.pendingRequests.set(key, {
      promise,
      timestamp: now,
    });

    return promise;
  }

  clear(key?: string) {
    if (key) {
      this.pendingRequests.delete(key);
    } else {
      this.pendingRequests.clear();
    }
  }
}

export const globalDeduplicator = new GlobalDeduplicator();
