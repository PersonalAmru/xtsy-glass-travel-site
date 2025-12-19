import { useCallback, useEffect, useRef, useState } from 'react';
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
      console.debug('[EnhancedAnalytics] Lovable admin session detected - tracking disabled');
    }
  }
  return isAdminSession;
};

// Generate persistent visitor ID
const generateVisitorId = (): string => {
  const stored = localStorage.getItem('xtsy_visitor_id');
  if (stored) return stored;
  
  const id = 'v_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  localStorage.setItem('xtsy_visitor_id', id);
  return id;
};

// Generate session ID (expires after 30 min inactivity)
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
  
  const newId = 's_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  sessionStorage.setItem('xtsy_session', JSON.stringify({ id: newId, lastActivity: Date.now() }));
  return newId;
};

// Get device type
const getDeviceType = (): string => {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  if (/mobile|android|iphone/i.test(ua)) return 'mobile';
  return 'desktop';
};

// Get browser info
const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';
  
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone')) os = 'iOS';
  
  return { browser, os };
};

// Parse UTM params
const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
  };
};

// Get referrer info
const getReferrerInfo = () => {
  const referrer = document.referrer;
  if (!referrer) return { source: 'direct', medium: 'none', url: null };
  
  try {
    const url = new URL(referrer);
    const hostname = url.hostname;
    
    if (hostname.includes('google')) return { source: 'google', medium: 'organic', url: referrer };
    if (hostname.includes('facebook') || hostname.includes('fb.')) return { source: 'facebook', medium: 'social', url: referrer };
    if (hostname.includes('instagram')) return { source: 'instagram', medium: 'social', url: referrer };
    if (hostname.includes('twitter') || hostname.includes('t.co')) return { source: 'twitter', medium: 'social', url: referrer };
    if (hostname.includes('linkedin')) return { source: 'linkedin', medium: 'social', url: referrer };
    if (hostname.includes('booking.com')) return { source: 'booking.com', medium: 'referral', url: referrer };
    if (hostname.includes('tripadvisor')) return { source: 'tripadvisor', medium: 'referral', url: referrer };
    
    return { source: hostname, medium: 'referral', url: referrer };
  } catch {
    return { source: 'unknown', medium: 'referral', url: referrer };
  }
};

// Send analytics to edge function - skip for Lovable admin sessions
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
    console.error('[Analytics] Failed to send:', error);
  }
};

export interface EnhancedAnalyticsContext {
  visitorId: string;
  sessionId: string;
  deviceType: string;
  browser: string;
  os: string;
}

export const useEnhancedAnalytics = () => {
  const location = useLocation();
  const [context, setContext] = useState<EnhancedAnalyticsContext | null>(null);
  const lastPath = useRef<string>('');
  const pageStartTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);
  const isFirstPageview = useRef<boolean>(true);

  // Initialize context
  useEffect(() => {
    const visitorId = generateVisitorId();
    const sessionId = getSessionId();
    const deviceType = getDeviceType();
    const { browser, os } = getBrowserInfo();
    
    setContext({ visitorId, sessionId, deviceType, browser, os });
  }, []);

  // Track pageview on route change
  useEffect(() => {
    // Skip tracking for Lovable admin sessions
    if (!context || checkAdminSession()) return;
    
    // Clean the URL to remove internal tracking parameters
    const currentPath = cleanAnalyticsUrl(location.pathname + location.search);
    
    // Send pageview-end for previous page
    if (lastPath.current && lastPath.current !== currentPath) {
      const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);
      
      sendAnalytics('pageview-end', {
        sessionId: context.sessionId,
        visitorId: context.visitorId,
        page_path: lastPath.current,
        time_on_page_seconds: timeOnPage,
        scroll_depth_percent: maxScrollDepth.current,
        is_exit: false,
      });
    }

    // Send new pageview
    const referrer = getReferrerInfo();
    const utmParams = getUtmParams();

    sendAnalytics('pageview', {
      sessionId: context.sessionId,
      visitorId: context.visitorId,
      page_path: currentPath,
      page_title: document.title,
      referrer_path: lastPath.current || null,
      is_entrance: isFirstPageview.current,
      deviceType: context.deviceType,
      browser: context.browser,
      os: context.os,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      ...referrer,
      ...utmParams,
    });

    // Reset tracking for new page
    lastPath.current = currentPath;
    pageStartTime.current = Date.now();
    maxScrollDepth.current = 0;
    isFirstPageview.current = false;
  }, [location.pathname, location.search, context]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const currentDepth = Math.round((window.scrollY / scrollHeight) * 100);
        maxScrollDepth.current = Math.max(maxScrollDepth.current, currentDepth);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track page unload
  useEffect(() => {
    if (!context) return;

    const handleUnload = () => {
      const timeOnPage = Math.round((Date.now() - pageStartTime.current) / 1000);
      
      // Use sendBeacon for reliable exit tracking
      const data = {
        endpoint: 'pageview-end',
        data: {
          sessionId: context.sessionId,
          visitorId: context.visitorId,
          page_path: lastPath.current,
          time_on_page_seconds: timeOnPage,
          scroll_depth_percent: maxScrollDepth.current,
          is_exit: true,
        },
      };

      navigator.sendBeacon(
        `${import.meta.env.VITE_SUPABASE_URL || 'https://oidnydyyjyjfnyadhyzn.supabase.co'}/functions/v1/track-analytics`,
        JSON.stringify(data)
      );
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [context]);

  // Realtime presence ping
  useEffect(() => {
    if (!context) return;

    const pingRealtime = () => {
      sendAnalytics('realtime', {
        sessionId: context.sessionId,
        visitorId: context.visitorId,
        page_path: location.pathname,
        deviceType: context.deviceType,
      });
    };

    // Initial ping
    pingRealtime();

    // Ping every 30 seconds
    const interval = setInterval(pingRealtime, 30000);
    return () => clearInterval(interval);
  }, [context, location.pathname]);

  // Track custom event
  const trackEvent = useCallback((
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, unknown>
  ) => {
    if (!context) return;

    sendAnalytics('event', {
      sessionId: context.sessionId,
      visitorId: context.visitorId,
      event_category: category,
      event_action: action,
      event_label: label,
      event_value: value,
      page_path: location.pathname,
      metadata,
    });
  }, [context, location.pathname]);

  // Track conversion funnel step
  const trackConversion = useCallback((
    funnelName: string,
    funnelStep: string,
    stepOrder: number,
    options?: {
      roomType?: string;
      packageType?: string;
      value?: number;
      isCompleted?: boolean;
    }
  ) => {
    if (!context) return;

    sendAnalytics('conversion', {
      sessionId: context.sessionId,
      visitorId: context.visitorId,
      funnel_name: funnelName,
      funnel_step: funnelStep,
      step_order: stepOrder,
      room_type: options?.roomType,
      package_type: options?.packageType,
      conversion_value: options?.value,
      is_completed: options?.isCompleted || false,
    });
  }, [context]);

  // Track error
  const trackError = useCallback((
    errorType: string,
    errorMessage: string,
    component?: string,
    stack?: string
  ) => {
    if (!context) return;

    sendAnalytics('error', {
      sessionId: context.sessionId,
      visitorId: context.visitorId,
      error_type: errorType,
      error_message: errorMessage,
      component,
      stack,
      page_path: location.pathname,
      user_agent: navigator.userAgent,
      url: window.location.href,
    });
  }, [context, location.pathname]);

  // Submit exit survey
  const submitExitSurvey = useCallback((data: {
    exit_reason: string;
    feedback?: string;
    was_looking_for?: string;
    would_return: boolean;
  }) => {
    if (!context) return;

    sendAnalytics('exit_survey', {
      sessionId: context.sessionId,
      visitorId: context.visitorId,
      ...data,
    });
  }, [context]);

  // Update visitor profile (progressive profiling)
  const updateProfile = useCallback((data: {
    name?: string;
    email?: string;
    age?: number;
    marital_status?: string;
    has_pet?: boolean;
    travel_style?: string;
    preferred_activities?: string[];
    is_solo_traveller?: boolean;
    is_group_organizer?: boolean;
    trip_purpose?: string;
    location_granted?: boolean;
    location_city?: string;
    location_country?: string;
  }) => {
    if (!context) return;

    sendAnalytics('profile_update', {
      sessionId: context.sessionId,
      visitorId: context.visitorId,
      ...data,
    });
  }, [context]);

  // Convenience methods
  const trackClick = useCallback((element: string, label?: string) => {
    trackEvent('click', element, label);
  }, [trackEvent]);

  const trackModalOpen = useCallback((modalName: string) => {
    trackEvent('modal', 'open', modalName);
  }, [trackEvent]);

  const trackModalClose = useCallback((modalName: string) => {
    trackEvent('modal', 'close', modalName);
  }, [trackEvent]);

  const trackBookingStart = useCallback((roomType: string, value: number) => {
    trackConversion('booking', 'start', 1, { roomType, value });
  }, [trackConversion]);

  const trackBookingComplete = useCallback((roomType: string, value: number) => {
    trackConversion('booking', 'complete', 4, { roomType, value, isCompleted: true });
  }, [trackConversion]);

  const trackSearch = useCallback((query: string, resultCount: number) => {
    trackEvent('search', 'execute', query, resultCount);
  }, [trackEvent]);

  return {
    context,
    trackEvent,
    trackConversion,
    trackError,
    submitExitSurvey,
    updateProfile,
    trackClick,
    trackModalOpen,
    trackModalClose,
    trackBookingStart,
    trackBookingComplete,
    trackSearch,
  };
};

// Provider component to wrap app
export const EnhancedAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEnhancedAnalytics();
  return <>{children}</>;
};
