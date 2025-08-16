import { useState, useEffect, useCallback } from 'react';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';

// High-performance hook for data fetching with caching and error handling
export const useHighPerformanceData = <T,>(
  key: string,
  fetchFn: () => Promise<T>,
  fallbackData: T,
  options: {
    cacheDuration?: number;
    retryCount?: number;
    retryDelay?: number;
  } = {}
) => {
  const [data, setData] = useState<T>(fallbackData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    cacheDuration = 5 * 60 * 1000, // 5 minutes
    retryCount = 2,
    retryDelay = 1000
  } = options;

  const fetchData = useCallback(async (attempt = 0) => {
    if (attempt === 0) {
      setLoading(true);
      setError(null);
    }

    try {
      const result = await PerformanceOptimizer.cachedRequest(
        key,
        fetchFn,
        cacheDuration
      );
      setData(result);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      // Retry logic with exponential backoff
      if (attempt < retryCount) {
        setTimeout(() => {
          fetchData(attempt + 1);
        }, retryDelay * Math.pow(2, attempt));
      } else {
        setError(errorMessage);
        console.warn(`Failed to fetch ${key} after ${retryCount + 1} attempts:`, errorMessage);
        // Keep fallback data instead of failing completely
      }
    } finally {
      if (attempt === 0) {
        setLoading(false);
      }
    }
  }, [key, fetchFn, cacheDuration, retryCount, retryDelay]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// Hook for handling heavy lists with virtual scrolling support
export const useVirtualizedList = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop
  };
};

// Hook for managing concurrent requests
export const useConcurrentRequests = () => {
  const [activeRequests, setActiveRequests] = useState(0);
  const maxConcurrentRequests = 5; // Limit concurrent requests

  const executeRequest = useCallback(async <T,>(
    requestFn: () => Promise<T>
  ): Promise<T> => {
    // Wait if too many requests are active
    while (activeRequests >= maxConcurrentRequests) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setActiveRequests(prev => prev + 1);
    
    try {
      const result = await requestFn();
      return result;
    } finally {
      setActiveRequests(prev => prev - 1);
    }
  }, [activeRequests, maxConcurrentRequests]);

  return { executeRequest, activeRequests };
};
