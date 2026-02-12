/**
 * GTM Event Router - Backend GA4 Brain
 * 
 * This is the UNIFIED routing layer for all GTM triggers.
 * Every event passes through here BEFORE reaching GA4/GTM/Google Ads.
 * 
 * FLOW:
 * 1. Event triggered in component
 * 2. → GTM Event Router (THIS FILE) - Admin captures first
 * 3. → DataLayer push (for GTM processing)
 * 4. → GTM routes to GA4/Google Ads
 * 
 * This ensures Admin Dashboard has complete visibility.
 */

import { pushToDataLayer } from './dataLayerService';
import { isLovableSession } from './analyticsFilters';

// =============================================
// EVENT CATEGORIES & TYPES
// =============================================

export type GTMEventCategory = 
  | 'page_navigation'
  | 'button_action'
  | 'engagement'
  | 'conversion'
  | 'session_quality'
  | 'form_interaction'
  | 'error';

export type GTMEventPriority = 'critical' | 'high' | 'medium' | 'low';

export interface GTMEventConfig {
  eventName: string;
  category: GTMEventCategory;
  priority: GTMEventPriority;
  isConversion: boolean;
  requiresValidation: boolean;
  valueMultiplier?: number;
}

// =============================================
// REGISTERED GTM TRIGGERS
// =============================================

export const GTM_TRIGGERS: Record<string, GTMEventConfig> = {
  // === PAGE NAVIGATION EVENTS ===
  page_load: {
    eventName: 'page_load',
    category: 'page_navigation',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  page_navigation: {
    eventName: 'page_navigation',
    category: 'page_navigation',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  virtual_page_view: {
    eventName: 'virtual_page_view',
    category: 'page_navigation',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },

  // === BUTTON ACTION EVENTS ===
  button_click: {
    eventName: 'button_click',
    category: 'button_action',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  cta_click: {
    eventName: 'cta_click',
    category: 'button_action',
    priority: 'high',
    isConversion: false,
    requiresValidation: false,
  },
  back_navigation: {
    eventName: 'back_navigation',
    category: 'button_action',
    priority: 'low',
    isConversion: false,
    requiresValidation: false,
  },
  card_click: {
    eventName: 'card_click',
    category: 'button_action',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  link_click: {
    eventName: 'link_click',
    category: 'button_action',
    priority: 'low',
    isConversion: false,
    requiresValidation: false,
  },
  carousel_navigate: {
    eventName: 'carousel_navigate',
    category: 'button_action',
    priority: 'low',
    isConversion: false,
    requiresValidation: false,
  },

  // === ENGAGEMENT EVENTS ===
  section_view: {
    eventName: 'section_view',
    category: 'engagement',
    priority: 'low',
    isConversion: false,
    requiresValidation: false,
  },
  scroll_depth: {
    eventName: 'scroll_depth',
    category: 'engagement',
    priority: 'low',
    isConversion: false,
    requiresValidation: false,
  },
  modal_interaction: {
    eventName: 'modal_interaction',
    category: 'engagement',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  package_viewed: {
    eventName: 'package_viewed',
    category: 'engagement',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  room_viewed: {
    eventName: 'room_viewed',
    category: 'engagement',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  property_viewed: {
    eventName: 'property_viewed',
    category: 'engagement',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },

  // === FORM INTERACTION EVENTS ===
  form_start: {
    eventName: 'form_start',
    category: 'form_interaction',
    priority: 'high',
    isConversion: false,
    requiresValidation: false,
  },
  form_field_focus: {
    eventName: 'form_field_focus',
    category: 'form_interaction',
    priority: 'low',
    isConversion: false,
    requiresValidation: false,
  },
  form_submit: {
    eventName: 'form_submit',
    category: 'form_interaction',
    priority: 'high',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 0.5,
  },
  form_abandon: {
    eventName: 'form_abandon',
    category: 'form_interaction',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },

  // === CONVERSION EVENTS (Validated Only) ===
  whatsapp_engaged_validated: {
    eventName: 'whatsapp_engaged_validated',
    category: 'conversion',
    priority: 'critical',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 1.0,
  },
  whatsapp_click: {
    eventName: 'whatsapp_click',
    category: 'button_action',
    priority: 'high',
    isConversion: false,
    requiresValidation: false,
  },
  call_engaged_validated: {
    eventName: 'call_engaged_validated',
    category: 'conversion',
    priority: 'critical',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 1.2,
  },
  call_click: {
    eventName: 'call_click',
    category: 'button_action',
    priority: 'high',
    isConversion: false,
    requiresValidation: false,
  },
  lead_qualified: {
    eventName: 'lead_qualified',
    category: 'conversion',
    priority: 'critical',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 1.5,
  },
  booking_initiated: {
    eventName: 'booking_initiated',
    category: 'conversion',
    priority: 'critical',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 0.8,
  },
  booking_confirmed: {
    eventName: 'booking_confirmed',
    category: 'conversion',
    priority: 'critical',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 1.0,
  },
  get_directions_click: {
    eventName: 'get_directions_click',
    category: 'conversion',
    priority: 'high',
    isConversion: true,
    requiresValidation: false,
    valueMultiplier: 0.3,
  },
  app_download: {
    eventName: 'app_download',
    category: 'conversion',
    priority: 'high',
    isConversion: true,
    requiresValidation: false,
    valueMultiplier: 0.4,
  },

  // === SESSION QUALITY EVENTS ===
  session_quality_signal: {
    eventName: 'session_quality_signal',
    category: 'session_quality',
    priority: 'high',
    isConversion: false,
    requiresValidation: true,
  },
  high_intent_detected: {
    eventName: 'high_intent_detected',
    category: 'session_quality',
    priority: 'high',
    isConversion: false,
    requiresValidation: true,
  },
  hot_lead_detected: {
    eventName: 'hot_lead_detected',
    category: 'session_quality',
    priority: 'critical',
    isConversion: false,
    requiresValidation: true,
  },

  // === NEW GTM TRIGGERS (matching GTM container) ===
  booking_created: {
    eventName: 'booking_created',
    category: 'conversion',
    priority: 'critical',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 0.9,
  },
  booking_cancelled: {
    eventName: 'booking_cancelled',
    category: 'conversion',
    priority: 'high',
    isConversion: false,
    requiresValidation: false,
  },
  booking_payment_initiated: {
    eventName: 'booking_payment_initiated',
    category: 'conversion',
    priority: 'critical',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 0.8,
  },
  search_availability: {
    eventName: 'search_availability',
    category: 'engagement',
    priority: 'high',
    isConversion: false,
    requiresValidation: false,
  },
  view_room: {
    eventName: 'view_room',
    category: 'engagement',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  view_package: {
    eventName: 'view_package',
    category: 'engagement',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  destination_interest_detected: {
    eventName: 'destination_interest_detected',
    category: 'engagement',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  engaged_property_explorer: {
    eventName: 'engaged_property_explorer',
    category: 'session_quality',
    priority: 'high',
    isConversion: false,
    requiresValidation: true,
  },
  high_value_search_detected: {
    eventName: 'high_value_search_detected',
    category: 'session_quality',
    priority: 'high',
    isConversion: false,
    requiresValidation: true,
  },
  high_value_abandonment: {
    eventName: 'high_value_abandonment',
    category: 'session_quality',
    priority: 'high',
    isConversion: false,
    requiresValidation: true,
  },
  intent_score_update: {
    eventName: 'intent_score_update',
    category: 'session_quality',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  lead_initiated: {
    eventName: 'lead_initiated',
    category: 'form_interaction',
    priority: 'high',
    isConversion: false,
    requiresValidation: false,
  },
  luxury_room_interest: {
    eventName: 'luxury_room_interest',
    category: 'engagement',
    priority: 'high',
    isConversion: false,
    requiresValidation: false,
  },
  repeat_high_intent_visitor: {
    eventName: 'repeat_high_intent_visitor',
    category: 'session_quality',
    priority: 'high',
    isConversion: false,
    requiresValidation: true,
  },
  whatsapp_hot_lead: {
    eventName: 'whatsapp_hot_lead',
    category: 'conversion',
    priority: 'critical',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 1.3,
  },
  qualified_booking_intent: {
    eventName: 'qualified_booking_intent',
    category: 'conversion',
    priority: 'critical',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 0.7,
  },

  // === GROUP & B2B ENQUIRY EVENTS ===
  group_enquiry_start: {
    eventName: 'group_enquiry_start',
    category: 'form_interaction',
    priority: 'high',
    isConversion: false,
    requiresValidation: false,
  },
  group_enquiry_submit: {
    eventName: 'group_enquiry_submit',
    category: 'conversion',
    priority: 'critical',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 1.5,
  },
  b2b_enquiry_start: {
    eventName: 'b2b_enquiry_start',
    category: 'form_interaction',
    priority: 'high',
    isConversion: false,
    requiresValidation: false,
  },
  b2b_enquiry_submit: {
    eventName: 'b2b_enquiry_submit',
    category: 'conversion',
    priority: 'critical',
    isConversion: true,
    requiresValidation: true,
    valueMultiplier: 2.0,
  },

  // === REVIEW INTERACTION EVENTS ===
  review_interaction: {
    eventName: 'review_interaction',
    category: 'engagement',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  review_source_click: {
    eventName: 'review_source_click',
    category: 'engagement',
    priority: 'medium',
    isConversion: false,
    requiresValidation: false,
  },
  trust_signal_view: {
    eventName: 'trust_signal_view',
    category: 'engagement',
    priority: 'low',
    isConversion: false,
    requiresValidation: false,
  },

  // === ERROR EVENTS ===
  tracking_error: {
    eventName: 'tracking_error',
    category: 'error',
    priority: 'high',
    isConversion: false,
    requiresValidation: false,
  },
};

// =============================================
// EVENT STATS ACCUMULATOR (In-Memory for Admin)
// =============================================

interface EventStats {
  totalCount: number;
  lastFired: string;
  byPage: Record<string, number>;
  byHour: Record<number, number>;
}

const eventStatsMap = new Map<string, EventStats>();

const updateEventStats = (eventName: string, pagePath: string) => {
  const now = new Date();
  const hour = now.getHours();
  
  const existing = eventStatsMap.get(eventName) || {
    totalCount: 0,
    lastFired: '',
    byPage: {},
    byHour: {},
  };
  
  existing.totalCount++;
  existing.lastFired = now.toISOString();
  existing.byPage[pagePath] = (existing.byPage[pagePath] || 0) + 1;
  existing.byHour[hour] = (existing.byHour[hour] || 0) + 1;
  
  eventStatsMap.set(eventName, existing);
};

// =============================================
// UNIFIED EVENT ROUTER
// =============================================

export interface RouteEventParams {
  eventName: string;
  params: Record<string, unknown>;
  skipDataLayer?: boolean;
}

/**
 * Route an event through the unified GTM system
 * This is the SINGLE ENTRY POINT for all trackable events
 */
export const routeGTMEvent = (config: RouteEventParams): boolean => {
  const { eventName, params, skipDataLayer = false } = config;
  
  // 1. BLOCK ADMIN/LOVABLE TRAFFIC
  if (isLovableSession()) {
    console.log(`[GTM Router] BLOCKED (admin): ${eventName}`);
    return false;
  }
  
  // 2. GET EVENT CONFIG
  const eventConfig = GTM_TRIGGERS[eventName];
  if (!eventConfig) {
    console.warn(`[GTM Router] Unknown event: ${eventName} - routing anyway`);
  }
  
  // 3. UPDATE LOCAL STATS FOR ADMIN
  const pagePath = (params.page_path as string) || window.location.pathname;
  updateEventStats(eventName, pagePath);
  
  // 4. EMIT INTERNAL EVENT FOR ADMIN MONITORING
  window.dispatchEvent(new CustomEvent('gtm-event-routed', {
    detail: {
      eventName,
      category: eventConfig?.category || 'unknown',
      priority: eventConfig?.priority || 'medium',
      isConversion: eventConfig?.isConversion || false,
      params,
      timestamp: new Date().toISOString(),
    },
  }));
  
  // 5. PUSH TO DATALAYER (unless skipped)
  if (!skipDataLayer) {
    pushToDataLayer({
      event: eventName,
      event_category: eventConfig?.category,
      event_priority: eventConfig?.priority,
      is_conversion: eventConfig?.isConversion,
      ...params,
    });
  }
  
  console.log(`[GTM Router] ✓ ${eventName} (${eventConfig?.category || 'unknown'})`);
  return true;
};

// =============================================
// CONVENIENCE METHODS FOR SPECIFIC EVENT TYPES
// =============================================

/**
 * Track page navigation events
 */
export const routePageEvent = (
  eventName: 'page_load' | 'page_navigation' | 'virtual_page_view',
  params: {
    page_path: string;
    page_category?: string;
    previous_page?: string;
    navigation_type?: string;
    is_returning_user?: boolean;
  }
) => {
  return routeGTMEvent({ eventName, params });
};

/**
 * Track button/CTA actions
 */
export const routeButtonEvent = (
  buttonName: string,
  buttonLocation: string,
  metadata?: Record<string, unknown>
) => {
  return routeGTMEvent({
    eventName: 'button_click',
    params: {
      button_name: buttonName,
      button_location: buttonLocation,
      page_path: window.location.pathname,
      ...metadata,
    },
  });
};

/**
 * Track CTA clicks (high priority)
 */
export const routeCTAEvent = (
  ctaName: string,
  ctaLocation: string,
  metadata?: Record<string, unknown>
) => {
  return routeGTMEvent({
    eventName: 'cta_click',
    params: {
      cta_name: ctaName,
      cta_location: ctaLocation,
      page_path: window.location.pathname,
      ...metadata,
    },
  });
};

/**
 * Track engagement events
 */
export const routeEngagementEvent = (
  eventName: 'section_view' | 'scroll_depth' | 'modal_interaction' | 'package_viewed' | 'room_viewed' | 'property_viewed' | 'view_room' | 'view_package' | 'destination_interest_detected' | 'luxury_room_interest' | 'search_availability',
  params: Record<string, unknown>
) => {
  return routeGTMEvent({ eventName, params });
};

/**
 * Track form interactions
 */
export const routeFormEvent = (
  eventName: 'form_start' | 'form_field_focus' | 'form_submit' | 'form_abandon',
  formName: string,
  params?: Record<string, unknown>
) => {
  return routeGTMEvent({
    eventName,
    params: {
      form_name: formName,
      page_path: window.location.pathname,
      ...params,
    },
  });
};

/**
 * Track validated conversion events
 */
export const routeConversionEvent = (
  eventName: 'whatsapp_engaged_validated' | 'call_engaged_validated' | 'lead_qualified' | 'booking_initiated' | 'booking_confirmed' | 'booking_created' | 'booking_cancelled' | 'booking_payment_initiated' | 'whatsapp_hot_lead' | 'qualified_booking_intent',
  params: {
    value: number;
    currency?: string;
    session_id?: string;
    [key: string]: unknown;
  }
) => {
  const config = GTM_TRIGGERS[eventName];
  const adjustedValue = params.value * (config?.valueMultiplier || 1);
  
  return routeGTMEvent({
    eventName,
    params: {
      ...params,
      value: adjustedValue,
      currency: params.currency || 'INR',
      is_validated_conversion: true,
    },
  });
};

/**
 * Track session quality signals
 */
export const routeSessionQualityEvent = (params: {
  classification: string;
  intent_score: number;
  defense_score: number;
  device_tier: string;
  is_high_intent: boolean;
  is_hot_lead: boolean;
}) => {
  // Only route high-quality sessions
  if (params.defense_score < 40) {
    console.log('[GTM Router] Session quality blocked (low defense score)');
    return false;
  }
  
  const eventName = params.is_hot_lead 
    ? 'hot_lead_detected' 
    : params.is_high_intent 
      ? 'high_intent_detected' 
      : 'session_quality_signal';
  
  return routeGTMEvent({
    eventName,
    params: {
      ...params,
      page_path: window.location.pathname,
    },
  });
};

// =============================================
// ADMIN ANALYTICS API
// =============================================

/**
 * Get current session event stats (for admin dashboard)
 */
export const getEventStats = (): Record<string, EventStats> => {
  return Object.fromEntries(eventStatsMap);
};

/**
 * Get registered trigger list (for admin dashboard)
 */
export const getRegisteredTriggers = (): typeof GTM_TRIGGERS => {
  return GTM_TRIGGERS;
};

/**
 * Get conversion event names
 */
export const getConversionEvents = (): string[] => {
  return Object.entries(GTM_TRIGGERS)
    .filter(([_, config]) => config.isConversion)
    .map(([name]) => name);
};

/**
 * Reset stats (for testing/debugging)
 */
export const resetEventStats = () => {
  eventStatsMap.clear();
};
