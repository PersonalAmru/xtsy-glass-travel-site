/**
 * Hotjar Tracking Component
 * Loads Hotjar for heatmaps, session recordings, and user journey tracking
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isLovableSession } from '@/utils/analyticsFilters';

declare global {
  interface Window {
    hj: any;
    _hjSettings: { hjid: number; hjsv: number };
  }
}

export function HotjarTracking() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Skip Hotjar for Lovable admin sessions
    if (isLovableSession()) {
      console.log('Hotjar: Skipping for Lovable admin session');
      return;
    }

    // Prevent double initialization
    if (initialized || window.hj) {
      return;
    }

    const loadHotjar = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-hotjar-config');
        
        if (error || !data?.siteId) {
          console.warn('Hotjar: Configuration not available');
          return;
        }

        const siteId = parseInt(data.siteId, 10);
        
        if (isNaN(siteId)) {
          console.error('Hotjar: Invalid Site ID');
          return;
        }

        // Initialize Hotjar
        (function(h: Window, o: Document, t: string, j: string, a?: HTMLHeadElement, r?: HTMLScriptElement) {
          h.hj = h.hj || function(...args: any[]) {
            (h.hj.q = h.hj.q || []).push(args);
          };
          h._hjSettings = { hjid: siteId, hjsv: 6 };
          a = o.getElementsByTagName('head')[0] as HTMLHeadElement;
          r = o.createElement('script') as HTMLScriptElement;
          r.async = true;
          r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
          a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

        setInitialized(true);
        console.log('Hotjar: Initialized successfully');
      } catch (err) {
        console.error('Hotjar: Failed to load', err);
      }
    };

    // CRITICAL: Load Hotjar after LCP to not block performance
    // Use requestIdleCallback if available for even better deferral
    const loadWithDelay = () => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(loadHotjar, { timeout: 5000 });
      } else {
        setTimeout(loadHotjar, 3000);
      }
    };
    
    // Wait for load event + additional delay
    if (document.readyState === 'complete') {
      const timer = setTimeout(loadWithDelay, 1000);
      return () => clearTimeout(timer);
    } else {
      const handleLoad = () => setTimeout(loadWithDelay, 1000);
      window.addEventListener('load', handleLoad, { once: true });
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [initialized]);

  return null; // This component doesn't render anything
}
