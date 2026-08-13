/**
 * useConversionSignals - Auto-fires GTM engagement/intent signals
 * 
 * Monitors session behavior and pushes events that match GTM triggers:
 * - engaged_property_explorer (scroll > 50% + time > 40s)
 * - intent_score_update (periodic intent scoring)
 * - high_value_abandonment (estimated_revenue > 999 on exit)
 * - repeat_high_intent_visitor (session_count > 2)
 * - luxury_room_interest (viewed 270° room)
 * - whatsapp_hot_lead (nights > 2 with WhatsApp click)
 * - high_value_search_detected (nights > 1, guests > 2, revenue > 999)
 * - destination_interest_detected (browsed destination pages)
 * - lead_initiated (first form/CTA interaction)
 * - qualified_booking_intent (high intent + booking page)
 */

import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from '@/lib/router-compat';
import { routeGTMEvent } from '@/utils/gtmEventRouter';

interface SessionSignals {
  pagesViewed: number;
  timeOnSiteSeconds: number;
  scrollDepthPercent: number;
  engagementScore: number;
  hasSearched: boolean;
  estimatedRevenue: number;
  luxuryRoomViewed: boolean;
  leadInitiated: boolean;
  engagedPropertyFired: boolean;
  intentUpdateFired: boolean;
  repeatVisitorFired: boolean;
}

export const useConversionSignals = () => {
  const location = useLocation();
  const startTime = useRef(Date.now());
  const signals = useRef<SessionSignals>({
    pagesViewed: 0,
    timeOnSiteSeconds: 0,
    scrollDepthPercent: 0,
    engagementScore: 0,
    hasSearched: false,
    estimatedRevenue: 0,
    luxuryRoomViewed: false,
    leadInitiated: false,
    engagedPropertyFired: false,
    intentUpdateFired: false,
    repeatVisitorFired: false,
  });

  // Track page count
  useEffect(() => {
    signals.current.pagesViewed++;

    // Destination interest detection
    const destinationPages = ['/properties', '/travel', '/female-travellers', '/pet-friendly'];
    const destination = destinationPages.find(p => location.pathname.startsWith(p));
    if (destination) {
      routeGTMEvent({
        eventName: 'destination_interest_detected',
        params: {
          destination: location.pathname,
          page_path: location.pathname,
          pages_viewed: signals.current.pagesViewed,
        },
      });
    }
  }, [location.pathname]);

  // Periodic engagement scoring
  useEffect(() => {
    const interval = setInterval(() => {
      const timeOnSite = Math.round((Date.now() - startTime.current) / 1000);
      signals.current.timeOnSiteSeconds = timeOnSite;

      // Update scroll depth from DOM
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      if (docHeight > winHeight) {
        signals.current.scrollDepthPercent = Math.min(
          Math.round((scrollTop / (docHeight - winHeight)) * 100), 100
        );
      }

      // Calculate engagement score
      const score = Math.min(100,
        (signals.current.pagesViewed * 15) +
        (Math.min(timeOnSite, 300) / 3) +
        (signals.current.scrollDepthPercent * 0.2) +
        (signals.current.hasSearched ? 20 : 0)
      );
      signals.current.engagementScore = Math.round(score);

      // Fire engaged_property_explorer (scroll > 50% + time > 40s)
      if (
        !signals.current.engagedPropertyFired &&
        signals.current.scrollDepthPercent > 50 &&
        timeOnSite > 40
      ) {
        signals.current.engagedPropertyFired = true;
        routeGTMEvent({
          eventName: 'engaged_property_explorer',
          params: {
            scroll_depth_percent: signals.current.scrollDepthPercent,
            time_on_site: timeOnSite,
            pages_viewed: signals.current.pagesViewed,
            page_path: window.location.pathname,
          },
        });
      }

      // Fire intent_score_update periodically (every 30s after 30s)
      if (timeOnSite > 30 && timeOnSite % 30 < 5 && !signals.current.intentUpdateFired) {
        signals.current.intentUpdateFired = true;
        const intentLevel = score > 70 ? 'hot' : score > 40 ? 'high' : score > 20 ? 'medium' : 'low';
        routeGTMEvent({
          eventName: 'intent_score_update',
          params: {
            engagement_score: signals.current.engagementScore,
            pages_viewed: signals.current.pagesViewed,
            time_on_site: timeOnSite,
            intent_level: intentLevel,
            page_path: window.location.pathname,
          },
        });
        // Allow re-firing after 30s
        setTimeout(() => { signals.current.intentUpdateFired = false; }, 25000);
      }

      // Check repeat visitor
      if (!signals.current.repeatVisitorFired) {
        const visitorId = localStorage.getItem('xtsy_visitor_id') || '';
        const sessionCountStr = localStorage.getItem('xtsy_session_count');
        const sessionCount = sessionCountStr ? parseInt(sessionCountStr) : 1;
        if (sessionCount > 2 && visitorId) {
          signals.current.repeatVisitorFired = true;
          routeGTMEvent({
            eventName: 'repeat_high_intent_visitor',
            params: {
              visitor_id: visitorId,
              session_count: sessionCount,
              engagement_score: signals.current.engagementScore,
              page_path: window.location.pathname,
            },
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Increment session count on mount
  useEffect(() => {
    const key = 'xtsy_session_count';
    const current = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, String(current + 1));
  }, []);

  // High-value abandonment on beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (signals.current.estimatedRevenue > 999) {
        routeGTMEvent({
          eventName: 'high_value_abandonment',
          params: {
            estimated_revenue: signals.current.estimatedRevenue,
            pages_viewed: signals.current.pagesViewed,
            time_on_site: signals.current.timeOnSiteSeconds,
            page_path: window.location.pathname,
          },
        });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Public methods for components to call
  const trackSearchAvailability = useCallback((params: {
    property_id: string;
    checkin_date: string;
    checkout_date: string;
    guests: number;
    nights: number;
    estimated_revenue: number;
  }) => {
    signals.current.hasSearched = true;
    signals.current.estimatedRevenue = Math.max(signals.current.estimatedRevenue, params.estimated_revenue);

    routeGTMEvent({
      eventName: 'search_availability',
      params: {
        ...params,
        page_path: window.location.pathname,
      },
    });

    // High-value search detection
    if (params.nights > 1 && params.guests > 2 && params.estimated_revenue > 999) {
      routeGTMEvent({
        eventName: 'high_value_search_detected',
        params: {
          nights: params.nights,
          guests: params.guests,
          estimated_revenue: params.estimated_revenue,
          page_path: window.location.pathname,
        },
      });
    }
  }, []);

  const trackViewRoom = useCallback((params: {
    room_type: string;
    room_name: string;
    base_price: number;
    nights?: number;
    property_name?: string;
  }) => {
    routeGTMEvent({
      eventName: 'view_room',
      params: {
        ...params,
        nights: params.nights || 1,
        page_path: window.location.pathname,
      },
    });

    // Luxury room interest
    if (
      (params.property_name?.toLowerCase().includes('luxury') ||
       params.room_type?.toLowerCase().includes('270'))
    ) {
      signals.current.luxuryRoomViewed = true;
      routeGTMEvent({
        eventName: 'luxury_room_interest',
        params: {
          property_name: params.property_name || '',
          room_type: params.room_type,
          base_price: params.base_price,
          page_path: window.location.pathname,
        },
      });
    }
  }, []);

  const trackViewPackage = useCallback((params: {
    package_id: string;
    package_name: string;
    duration_days: number;
    base_price: number;
  }) => {
    routeGTMEvent({
      eventName: 'view_package',
      params: {
        ...params,
        page_path: window.location.pathname,
      },
    });
  }, []);

  const trackBookingCreated = useCallback((params: {
    transaction_id: string;
    property_id: string;
    value: number;
    room_type: string;
    nights: number;
    guests: number;
    currency?: string;
  }) => {
    signals.current.estimatedRevenue = params.value;
    routeGTMEvent({
      eventName: 'booking_created',
      params: {
        ...params,
        currency: params.currency || 'INR',
        page_path: window.location.pathname,
      },
    });
  }, []);

  const trackBookingCancelled = useCallback((params: {
    transaction_id: string;
    refund_value: number;
    reason?: string;
  }) => {
    routeGTMEvent({
      eventName: 'booking_cancelled',
      params: {
        ...params,
        page_path: window.location.pathname,
      },
    });
  }, []);

  const trackBookingPaymentInitiated = useCallback((params: {
    estimated_revenue: number;
    room_type: string;
    nights: number;
    currency?: string;
  }) => {
    signals.current.estimatedRevenue = params.estimated_revenue;
    routeGTMEvent({
      eventName: 'booking_payment_initiated',
      params: {
        ...params,
        currency: params.currency || 'INR',
        page_path: window.location.pathname,
      },
    });
  }, []);

  const trackLeadInitiated = useCallback((params: {
    lead_type: 'whatsapp' | 'call' | 'form' | 'enquiry';
    estimated_revenue: number;
  }) => {
    if (signals.current.leadInitiated) return;
    signals.current.leadInitiated = true;
    signals.current.estimatedRevenue = Math.max(signals.current.estimatedRevenue, params.estimated_revenue);

    routeGTMEvent({
      eventName: 'lead_initiated',
      params: {
        ...params,
        page_path: window.location.pathname,
      },
    });
  }, []);

  const trackWhatsAppHotLead = useCallback((params: {
    nights: number;
    estimated_revenue: number;
    room_type?: string;
  }) => {
    if (params.nights > 2) {
      routeGTMEvent({
        eventName: 'whatsapp_hot_lead',
        params: {
          ...params,
          page_path: window.location.pathname,
        },
      });
    }
  }, []);

  const trackQualifiedBookingIntent = useCallback((params: {
    room_type: string;
    estimated_revenue: number;
    intent_level: string;
    lead_score: number;
  }) => {
    routeGTMEvent({
      eventName: 'qualified_booking_intent',
      params: {
        ...params,
        page_path: window.location.pathname,
      },
    });
  }, []);

  return {
    trackSearchAvailability,
    trackViewRoom,
    trackViewPackage,
    trackBookingCreated,
    trackBookingCancelled,
    trackBookingPaymentInitiated,
    trackLeadInitiated,
    trackWhatsAppHotLead,
    trackQualifiedBookingIntent,
    getSignals: () => ({ ...signals.current }),
  };
};

export default useConversionSignals;
