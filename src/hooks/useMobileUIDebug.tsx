import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MobileUIDebugOptions {
  componentName: string;
  enabled?: boolean;
}

interface DeviceInfo {
  user_agent: string;
  screen_width: number;
  screen_height: number;
  viewport_width: number;
  viewport_height: number;
  device_pixel_ratio: number;
  page_url: string;
}

const getDeviceInfo = (): DeviceInfo => ({
  user_agent: navigator.userAgent,
  screen_width: window.screen.width,
  screen_height: window.screen.height,
  viewport_width: window.innerWidth,
  viewport_height: window.innerHeight,
  device_pixel_ratio: window.devicePixelRatio || 1,
  page_url: window.location.href,
});

const isMobileDevice = (): boolean => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
};

/**
 * Hook for debugging mobile UI issues
 * Automatically detects viewport overflows and reports to Supabase
 */
export const useMobileUIDebug = ({ componentName, enabled = true }: MobileUIDebugOptions) => {
  const hasReported = useRef(false);
  const observerRef = useRef<MutationObserver | null>(null);

  const reportError = useCallback(async (
    errorType: string, 
    errorMessage?: string, 
    extraData?: Record<string, unknown>
  ) => {
    // Only report once per component instance to avoid spam
    if (hasReported.current || !enabled) return;
    
    // Only report on mobile devices
    if (!isMobileDevice()) return;

    hasReported.current = true;

    const deviceInfo = getDeviceInfo();

    try {
      // Use edge function for logging
      const { error } = await supabase.functions.invoke('mobile-ui-debug', {
        body: {
          ...deviceInfo,
          component_name: componentName,
          error_type: errorType,
          error_message: errorMessage,
          extra_data: extraData,
        },
      });

      if (error) {
        console.warn('[MobileUIDebug] Failed to report:', error);
      } else if (process.env.NODE_ENV === 'development') {
        console.log('[MobileUIDebug] Reported:', { componentName, errorType, errorMessage });
      }
    } catch (err) {
      console.warn('[MobileUIDebug] Error reporting:', err);
    }
  }, [componentName, enabled]);

  /**
   * Check if an element overflows the viewport
   */
  const checkOverflow = useCallback((element: HTMLElement | null) => {
    if (!element || !enabled || !isMobileDevice()) return;

    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const issues: string[] = [];

    // Check horizontal overflow
    if (rect.right > viewportWidth) {
      issues.push(`right_overflow_by_${Math.round(rect.right - viewportWidth)}px`);
    }
    if (rect.left < 0) {
      issues.push(`left_overflow_by_${Math.round(Math.abs(rect.left))}px`);
    }

    // Check vertical overflow
    if (rect.bottom > viewportHeight) {
      issues.push(`bottom_overflow_by_${Math.round(rect.bottom - viewportHeight)}px`);
    }

    // Check if element is wider than viewport
    if (rect.width > viewportWidth) {
      issues.push(`width_exceeds_viewport_by_${Math.round(rect.width - viewportWidth)}px`);
    }

    if (issues.length > 0) {
      reportError('viewport_overflow', issues.join(', '), {
        element_width: rect.width,
        element_height: rect.height,
        element_left: rect.left,
        element_right: rect.right,
        element_top: rect.top,
        element_bottom: rect.bottom,
        issues,
      });
    }
  }, [enabled, reportError]);

  /**
   * Create a ref callback that automatically checks for overflow
   */
  const createOverflowRef = useCallback(() => {
    return (element: HTMLElement | null) => {
      if (element) {
        // Check immediately
        requestAnimationFrame(() => {
          checkOverflow(element);
        });

        // Also check after a short delay (for animations)
        setTimeout(() => {
          checkOverflow(element);
        }, 300);
      }
    };
  }, [checkOverflow]);

  /**
   * Report a modal open event with dimensions
   */
  const reportModalOpen = useCallback((modalElement: HTMLElement | null) => {
    if (!modalElement || !enabled || !isMobileDevice()) return;

    const rect = modalElement.getBoundingClientRect();
    const deviceInfo = getDeviceInfo();

    // Check for potential issues
    const potentialIssues: string[] = [];
    
    if (rect.width > deviceInfo.viewport_width) {
      potentialIssues.push('modal_wider_than_viewport');
    }
    
    if (rect.left < 0 || rect.right > deviceInfo.viewport_width) {
      potentialIssues.push('modal_horizontal_overflow');
    }

    if (potentialIssues.length > 0) {
      reportError('modal_layout_issue', potentialIssues.join(', '), {
        modal_width: rect.width,
        modal_height: rect.height,
        modal_left: rect.left,
        modal_right: rect.right,
        computed_styles: {
          width: window.getComputedStyle(modalElement).width,
          maxWidth: window.getComputedStyle(modalElement).maxWidth,
          transform: window.getComputedStyle(modalElement).transform,
        },
      });
    }
  }, [enabled, reportError]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    reportError,
    checkOverflow,
    createOverflowRef,
    reportModalOpen,
    isMobile: isMobileDevice(),
    deviceInfo: getDeviceInfo,
  };
};

/**
 * Standalone function to log mobile UI errors without the hook
 */
export const logMobileUIError = async (
  componentName: string,
  errorType: string,
  errorMessage?: string,
  extraData?: Record<string, unknown>
) => {
  if (!isMobileDevice()) return;

  const deviceInfo = getDeviceInfo();

  try {
    await supabase.functions.invoke('mobile-ui-debug', {
      body: {
        ...deviceInfo,
        component_name: componentName,
        error_type: errorType,
        error_message: errorMessage,
        extra_data: extraData,
      },
    });
  } catch (err) {
    console.warn('[MobileUIDebug] Error logging:', err);
  }
};
