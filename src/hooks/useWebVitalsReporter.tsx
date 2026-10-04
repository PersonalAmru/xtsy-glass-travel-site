import { SELF_TRACKING_ENABLED } from '@/lib/selfTracking';
import { useEffect, useRef } from 'react';
import { useLocation } from '@/lib/router-compat';
import { supabase } from '@/integrations/supabase/client';

/**
 * Real User Monitoring — captures LCP/INP/CLS/FCP/TTFB via PerformanceObserver
 * and batch-sends a single sample per route mount. Non-blocking; uses
 * requestIdleCallback + sendBeacon when available so it never delays paint.
 *
 * Storage: route_performance_metrics (admin-only read; public insert)
 */

const DEPLOY_VERSION =
  (typeof window !== 'undefined' && (window as any).__BUILD_ID__) || 'dev';

const getDeviceType = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
};

const getConnectionType = (): string => {
  const c = (navigator as any).connection;
  return c?.effectiveType || 'unknown';
};

interface VitalsSample {
  route: string;
  lcp_ms: number | null;
  inp_ms: number | null;
  cls_score: number | null;
  fcp_ms: number | null;
  ttfb_ms: number | null;
  tbt_ms: number | null;
  long_tasks_count: number | null;
  device_type: string;
  connection_type: string;
  deploy_version: string;
  skeleton_dismissed: boolean;
  gtm_loaded: boolean;
  seo_jsonld_size: number;
  user_agent: string;
  visitor_id: string | null;
  is_returning_visitor: boolean;
  visit_number: number;
}

const sendSample = async (sample: VitalsSample) => {
  if (!SELF_TRACKING_ENABLED) return;
  try {
    // Prefer fire-and-forget insert to avoid blocking on edge cold-starts
    await supabase.from('route_performance_metrics').insert(sample as any);
  } catch {
    // Silently swallow — RUM must never break the page
  }
};

export const useWebVitalsReporter = () => {
  const { pathname } = useLocation();
  const sentRef = useRef(false);
  const metricsRef = useRef<Partial<VitalsSample>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('PerformanceObserver' in window)) return;
    sentRef.current = false;
    metricsRef.current = {};

    let lcp = 0;
    let cls = 0;
    let inp = 0;
    let fcp = 0;
    let ttfb = 0;
    let tbt = 0;
    let longTasksCount = 0;

    const lcpObs = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as any;
      if (last?.startTime) lcp = Math.round(last.startTime);
    });

    const clsObs = new PerformanceObserver((list) => {
      list.getEntries().forEach((e: any) => {
        if (!e.hadRecentInput) cls += e.value;
      });
    });

    const inpObs = new PerformanceObserver((list) => {
      list.getEntries().forEach((e: any) => {
        if (e.duration > inp) inp = Math.round(e.duration);
      });
    });

    const paintObs = new PerformanceObserver((list) => {
      list.getEntries().forEach((e) => {
        if (e.name === 'first-contentful-paint') fcp = Math.round(e.startTime);
      });
    });

    // Long tasks — used to derive TBT (portion of each long task > 50ms)
    let longTaskObs: PerformanceObserver | null = null;
    try {
      longTaskObs = new PerformanceObserver((list) => {
        list.getEntries().forEach((e) => {
          const over = e.duration - 50;
          if (over > 0) tbt += Math.round(over);
          longTasksCount += 1;
        });
      });
      longTaskObs.observe({ type: 'longtask', buffered: true });
    } catch {}

    try { lcpObs.observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
    try { clsObs.observe({ type: 'layout-shift', buffered: true }); } catch {}
    try { inpObs.observe({ type: 'event', buffered: true, durationThreshold: 40 } as any); } catch {}
    try { paintObs.observe({ type: 'paint', buffered: true }); } catch {}

    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (navEntry) ttfb = Math.round(navEntry.responseStart - navEntry.requestStart);

    const flush = () => {
      if (sentRef.current) return;
      sentRef.current = true;

      const skeletonDismissed = !document.getElementById('lcp-skeleton');
      const gtmLoaded = !!(window as any).google_tag_manager;
      const jsonldSize = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .reduce((sum, el) => sum + (el.textContent?.length || 0), 0);
      const visitorId = localStorage.getItem('xtsy_visitor_id');

      // Visit counter — persisted in localStorage. Increments on each hard load
      // so we can split RUM cohorts by first-visit vs returning.
      let visitNumber = 1;
      try {
        const raw = localStorage.getItem('xtsy_visit_count');
        visitNumber = raw ? Math.min(parseInt(raw, 10) + 1, 9999) : 1;
        if (!sessionStorage.getItem('xtsy_visit_counted')) {
          localStorage.setItem('xtsy_visit_count', String(visitNumber));
          sessionStorage.setItem('xtsy_visit_counted', '1');
        } else {
          visitNumber = parseInt(localStorage.getItem('xtsy_visit_count') || '1', 10);
        }
      } catch {}
      const isReturning = visitNumber > 1;

      const sample: VitalsSample = {
        route: pathname,
        lcp_ms: lcp || null,
        inp_ms: inp || null,
        cls_score: cls > 0 ? Number(cls.toFixed(3)) : null,
        fcp_ms: fcp || null,
        ttfb_ms: ttfb || null,
        tbt_ms: tbt || null,
        long_tasks_count: longTasksCount || null,
        device_type: getDeviceType(),
        connection_type: getConnectionType(),
        deploy_version: DEPLOY_VERSION,
        skeleton_dismissed: skeletonDismissed,
        gtm_loaded: gtmLoaded,
        seo_jsonld_size: jsonldSize,
        user_agent: navigator.userAgent.slice(0, 255),
        visitor_id: visitorId,
        is_returning_visitor: isReturning,
        visit_number: visitNumber,
      };

      const idle = (cb: () => void) =>
        (window as any).requestIdleCallback ? (window as any).requestIdleCallback(cb, { timeout: 2000 }) : setTimeout(cb, 1500);
      idle(() => sendSample(sample));
    };

    // Flush on hidden (best for INP) and after 8s as safety net
    const onHidden = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onHidden);
    const timer = window.setTimeout(flush, 8000);

    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      clearTimeout(timer);
      try { lcpObs.disconnect(); } catch {}
      try { clsObs.disconnect(); } catch {}
      try { inpObs.disconnect(); } catch {}
      try { paintObs.disconnect(); } catch {}
      try { longTaskObs?.disconnect(); } catch {}
      flush();
    };
  }, [pathname]);
};

export default useWebVitalsReporter;
