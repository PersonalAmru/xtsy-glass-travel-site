import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  isLovableSession, 
  initLovableSessionDetection, 
  cleanAnalyticsUrl 
} from '@/utils/analyticsFilters';

// Check if this is a Lovable admin session - skip all tracking if so
let isAdminSession: boolean | null = null;
const checkAdminSession = (): boolean => {
  if (isAdminSession === null) {
    isAdminSession = initLovableSessionDetection();
    if (isAdminSession) {
      console.debug('[Analytics] Lovable admin session detected - tracking disabled');
    }
  }
  return isAdminSession;
};

// Generate anonymous visitor ID (fingerprint-like, no PII)
const generateVisitorId = (): string => {
  const stored = localStorage.getItem('xtsy_visitor_id');
  if (stored) return stored;
  
  const id = 'v_' + Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15) + 
             Date.now().toString(36);
  localStorage.setItem('xtsy_visitor_id', id);
  return id;
};

// Generate session ID (resets after 30 min inactivity)
const getSessionId = (): string => {
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const stored = sessionStorage.getItem('xtsy_session');
  
  if (stored) {
    const { id, lastActivity } = JSON.parse(stored);
    if (Date.now() - lastActivity < SESSION_TIMEOUT) {
      sessionStorage.setItem('xtsy_session', JSON.stringify({ id, lastActivity: Date.now() }));
      return id;
    }
  }
  
  const newId = 's_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  sessionStorage.setItem('xtsy_session', JSON.stringify({ id: newId, lastActivity: Date.now() }));
  return newId;
};

// Detect device type
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
};

// Get browser info
const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'unknown';
  let os = 'unknown';

  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  else if (ua.includes('Opera')) browser = 'Opera';

  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return { browser, os };
};

// Parse UTM parameters
const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_term: params.get('utm_term') || undefined,
    utm_content: params.get('utm_content') || undefined,
  };
};

// Parse referrer
const getReferrerInfo = () => {
  const referrer = document.referrer;
  if (!referrer) return { source: 'direct', medium: 'none', url: undefined };

  try {
    const url = new URL(referrer);
    const hostname = url.hostname;

    // Detect common sources
    if (hostname.includes('google')) return { source: 'google', medium: 'organic', url: referrer };
    if (hostname.includes('facebook') || hostname.includes('fb.')) return { source: 'facebook', medium: 'social', url: referrer };
    if (hostname.includes('instagram')) return { source: 'instagram', medium: 'social', url: referrer };
    if (hostname.includes('twitter') || hostname.includes('t.co')) return { source: 'twitter', medium: 'social', url: referrer };
    if (hostname.includes('linkedin')) return { source: 'linkedin', medium: 'social', url: referrer };
    if (hostname.includes('youtube')) return { source: 'youtube', medium: 'social', url: referrer };
    if (hostname.includes('booking.com')) return { source: 'booking.com', medium: 'referral', url: referrer };
    if (hostname.includes('tripadvisor')) return { source: 'tripadvisor', medium: 'referral', url: referrer };

    return { source: hostname, medium: 'referral', url: referrer };
  } catch {
    return { source: 'unknown', medium: 'unknown', url: referrer };
  }
};

interface AnalyticsContext {
  visitorId: string;
  sessionId: string;
  deviceType: string;
  browser: string;
  os: string;
}

let analyticsContext: AnalyticsContext | null = null;

const getAnalyticsContext = (): AnalyticsContext => {
  if (!analyticsContext) {
    const { browser, os } = getBrowserInfo();
    analyticsContext = {
      visitorId: generateVisitorId(),
      sessionId: getSessionId(),
      deviceType: getDeviceType(),
      browser,
      os,
    };
  }
  // Always update session ID in case of timeout
  analyticsContext.sessionId = getSessionId();
  return analyticsContext;
};

// Track function - sends data to edge function
// Skips tracking entirely for Lovable admin sessions
const sendAnalytics = async (endpoint: string, data: Record<string, unknown>) => {
  // Skip tracking for Lovable admin sessions
  if (checkAdminSession()) {
    return;
  }

  try {
    await supabase.functions.invoke('track-analytics', {
      body: { endpoint, data },
    });
  } catch (error) {
    // Silent fail - analytics should never break the app
    console.debug('Analytics error:', error);
  }
};

export const useAnalytics = () => {
  const location = useLocation();
  const pageStartTime = useRef<number>(Date.now());
  const lastPagePath = useRef<string>('');
  const scrollDepth = useRef<number>(0);
  const isFirstPage = useRef<boolean>(true);

  // Track scroll depth (rAF-throttled to avoid forced layout on every scroll tick)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          const currentDepth = Math.round((window.scrollY / scrollHeight) * 100);
          scrollDepth.current = Math.max(scrollDepth.current, currentDepth);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page views on route change
  useEffect(() => {
    // Skip tracking for Lovable admin sessions
    if (checkAdminSession()) {
      return;
    }

    const ctx = getAnalyticsContext();
    // Clean the URL to remove internal tracking parameters
    const currentPath = cleanAnalyticsUrl(location.pathname + location.search);

    // Send time on page for previous page
    if (lastPagePath.current && lastPagePath.current !== currentPath) {
      const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);
      sendAnalytics('pageview-end', {
        ...ctx,
        page_path: lastPagePath.current,
        time_on_page_seconds: timeOnPage,
        scroll_depth_percent: scrollDepth.current,
        is_exit: false,
      });
    }

    // Track new page view
    const referrer = getReferrerInfo();
    const utm = getUtmParams();

    sendAnalytics('pageview', {
      ...ctx,
      page_path: currentPath,
      page_title: document.title,
      referrer_path: lastPagePath.current || undefined,
      is_entrance: isFirstPage.current,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      ...referrer,
      ...utm,
    });

    // Reset for new page
    pageStartTime.current = Date.now();
    scrollDepth.current = 0;
    lastPagePath.current = currentPath;
    isFirstPage.current = false;

    // Update realtime presence
    sendAnalytics('realtime', {
      ...ctx,
      page_path: currentPath,
    });
  }, [location.pathname, location.search]);

  // Track exit on page unload
  useEffect(() => {
    const handleUnload = () => {
      const ctx = getAnalyticsContext();
      const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);
      
      // Use sendBeacon for reliable exit tracking
      const data = JSON.stringify({
        endpoint: 'pageview-end',
        data: {
          ...ctx,
          page_path: lastPagePath.current,
          time_on_page_seconds: timeOnPage,
          scroll_depth_percent: scrollDepth.current,
          is_exit: true,
        },
      });

      navigator.sendBeacon?.(
        `https://oidnydyyjyjfnyadhyzn.supabase.co/functions/v1/track-analytics`,
        data
      );
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // Track custom events
  const trackEvent = useCallback((
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, unknown>
  ) => {
    const ctx = getAnalyticsContext();
    sendAnalytics('event', {
      ...ctx,
      event_category: category,
      event_action: action,
      event_label: label,
      event_value: value,
      page_path: window.location.pathname,
      metadata,
    });
  }, []);

  // Track conversion funnel steps
  const trackConversion = useCallback((
    funnelName: string,
    step: string,
    stepOrder: number,
    options?: {
      roomType?: string;
      packageType?: string;
      value?: number;
      currency?: string;
      isCompleted?: boolean;
      metadata?: Record<string, unknown>;
    }
  ) => {
    const ctx = getAnalyticsContext();
    sendAnalytics('conversion', {
      ...ctx,
      funnel_name: funnelName,
      funnel_step: step,
      step_order: stepOrder,
      room_type: options?.roomType,
      package_type: options?.packageType,
      conversion_value: options?.value,
      currency: options?.currency || 'INR',
      is_completed: options?.isCompleted || false,
      metadata: options?.metadata,
    });
  }, []);

  // Common tracking helpers
  const trackClick = useCallback((elementId: string, elementText?: string) => {
    trackEvent('interaction', 'click', elementId, undefined, { element_text: elementText });
  }, [trackEvent]);

  const trackModalOpen = useCallback((modalName: string) => {
    trackEvent('modal', 'open', modalName);
  }, [trackEvent]);

  const trackModalClose = useCallback((modalName: string) => {
    trackEvent('modal', 'close', modalName);
  }, [trackEvent]);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackEvent('search', 'query', query, resultsCount);
  }, [trackEvent]);

  const trackRoomView = useCallback((roomType: string, price?: number) => {
    trackEvent('room', 'view', roomType, price);
    trackConversion('booking', 'room_view', 1, { roomType, value: price });
  }, [trackEvent, trackConversion]);

  const trackBookingStart = useCallback((roomType: string, totalAmount: number) => {
    trackEvent('booking', 'start', roomType, totalAmount);
    trackConversion('booking', 'booking_start', 2, { 
      roomType, 
      value: totalAmount,
    });
  }, [trackEvent, trackConversion]);

  const trackBookingComplete = useCallback((roomType: string, totalAmount: number, bookingId: string) => {
    trackEvent('booking', 'complete', roomType, totalAmount, { bookingId });
    trackConversion('booking', 'booking_complete', 3, { 
      roomType, 
      value: totalAmount,
      isCompleted: true,
      metadata: { bookingId },
    });
  }, [trackEvent, trackConversion]);

  const trackTourPackageView = useCallback((packageName: string, price?: number) => {
    trackEvent('tour', 'view', packageName, price);
    trackConversion('tour_inquiry', 'package_view', 1, { packageType: packageName, value: price });
  }, [trackEvent, trackConversion]);

  const trackCTAClick = useCallback((ctaName: string, location: string) => {
    trackEvent('cta', 'click', ctaName, undefined, { location });
  }, [trackEvent]);

  const trackCurrencyChange = useCallback((fromCurrency: string, toCurrency: string) => {
    trackEvent('preference', 'currency_change', `${fromCurrency}_to_${toCurrency}`);
  }, [trackEvent]);

  return {
    trackEvent,
    trackConversion,
    trackClick,
    trackModalOpen,
    trackModalClose,
    trackSearch,
    trackRoomView,
    trackBookingStart,
    trackBookingComplete,
    trackTourPackageView,
    trackCTAClick,
    trackCurrencyChange,
  };
};

// Analytics Provider component for automatic tracking
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useAnalytics();
  return <>{children}</>;
};
