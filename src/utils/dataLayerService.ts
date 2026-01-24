/**
 * DataLayer Service
 * 
 * SOLE ANALYTICS CONTRACT: All user interactions push to window.dataLayer
 * Google Tag Manager (GTM-5FXJ9QBK) is the ONLY external routing authority.
 * 
 * GTM CONFIGURATION IDs (configure these in GTM, NOT in code):
 * - GA4 Measurement ID: G-SJY2WX6L4B
 * - Google Ads Conversion ID: AW-17352497815
 * 
 * NO direct calls to:
 * - gtag.js
 * - Google Analytics (G-*)
 * - Google Ads (AW-*)
 * - Google Tags (GT-*)
 */

export interface DataLayerEvent {
  event: string;
  timestamp: string;
  page_path: string;
  page_url: string;
  page_title: string;
  component?: string;
  funnel_stage?: 'discovery' | 'consideration' | 'intent' | 'booking_start' | 'booking_complete';
  session_id?: string;
  visitor_id?: string;
  [key: string]: unknown;
}

// Session and visitor ID storage
let cachedSessionId: string | null = null;
let cachedVisitorId: string | null = null;

/**
 * Generate or retrieve anonymous session ID
 */
const getSessionId = (): string => {
  if (cachedSessionId) return cachedSessionId;
  
  const SESSION_KEY = 'xtsy_session_id';
  const SESSION_TIMESTAMP_KEY = 'xtsy_session_ts';
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  const storedId = sessionStorage.getItem(SESSION_KEY);
  const storedTs = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);
  const now = Date.now();
  
  if (storedId && storedTs && (now - parseInt(storedTs)) < SESSION_TIMEOUT) {
    sessionStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
    cachedSessionId = storedId;
    return storedId;
  }
  
  const newId = `ses_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem(SESSION_KEY, newId);
  sessionStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
  cachedSessionId = newId;
  return newId;
};

/**
 * Generate or retrieve anonymous visitor ID
 */
const getVisitorId = (): string => {
  if (cachedVisitorId) return cachedVisitorId;
  
  const VISITOR_KEY = 'xtsy_visitor_id';
  const storedId = localStorage.getItem(VISITOR_KEY);
  
  if (storedId) {
    cachedVisitorId = storedId;
    return storedId;
  }
  
  const newId = `vis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem(VISITOR_KEY, newId);
  cachedVisitorId = newId;
  return newId;
};

/**
 * Check if current session is admin/preview
 */
const isAdminSession = (): boolean => {
  return typeof window !== 'undefined' && (window as any).__isLovableAdmin === true;
};

/**
 * Get current consent preferences from localStorage
 */
const getConsentPreferences = (): { analytics: boolean; marketing: boolean } => {
  if (typeof window === 'undefined') return { analytics: false, marketing: false };
  
  try {
    const consent = localStorage.getItem('xtsy_consent_v2');
    if (consent) {
      const parsed = JSON.parse(consent);
      return {
        analytics: parsed.analytics ?? false,
        marketing: parsed.marketing ?? false,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return { analytics: false, marketing: false };
};

/**
 * Push event to dataLayer
 * GTM will handle all external routing (GA4, Google Ads, etc.)
 */
export const pushToDataLayer = (event: Partial<DataLayerEvent>): void => {
  if (typeof window === 'undefined') return;
  
  // Skip tracking for admin sessions (GTM will also check this)
  if (isAdminSession()) {
    console.log('[DataLayer] Skipped (admin session):', event.event);
    return;
  }
  
  // Ensure dataLayer exists
  (window as any).dataLayer = (window as any).dataLayer || [];
  
  // Build full event with required fields
  const fullEvent: DataLayerEvent = {
    event: event.event || 'custom_event',
    timestamp: new Date().toISOString(),
    page_path: window.location.pathname,
    page_url: window.location.href,
    page_title: document.title,
    session_id: getSessionId(),
    visitor_id: getVisitorId(),
    ...event,
  };
  
  (window as any).dataLayer.push(fullEvent);
  console.log('[DataLayer] Event pushed:', fullEvent.event, fullEvent);
  
  // Emit debug event for the debug panel
  window.dispatchEvent(new CustomEvent('datalayer-push', { detail: fullEvent }));
};

/**
 * Push event with consent check
 * Blocks events that require consent that hasn't been granted
 */
export const pushToDataLayerWithConsent = (
  event: Partial<DataLayerEvent>,
  requiresConsent: 'analytics' | 'marketing' | 'none' = 'analytics'
): boolean => {
  const consent = getConsentPreferences();
  
  if (requiresConsent === 'marketing' && !consent.marketing) {
    console.log('[DataLayer] Blocked (no marketing consent):', event.event);
    return false;
  }
  
  if (requiresConsent === 'analytics' && !consent.analytics) {
    console.log('[DataLayer] Blocked (no analytics consent):', event.event);
    return false;
  }
  
  pushToDataLayer(event);
  return true;
};

/**
 * Check if marketing consent is granted (for ads tracking)
 */
export const hasMarketingConsent = (): boolean => {
  return getConsentPreferences().marketing;
};

/**
 * Check if analytics consent is granted
 */
export const hasAnalyticsConsent = (): boolean => {
  return getConsentPreferences().analytics;
};

// =============================================
// PAGE VIEW & NAVIGATION EVENTS
// =============================================

export const trackPageView = (metadata?: Record<string, unknown>): void => {
  pushToDataLayer({
    event: 'page_view',
    funnel_stage: 'discovery',
    ...metadata,
  });
};

export const trackVirtualPageView = (pagePath: string, pageTitle: string): void => {
  pushToDataLayer({
    event: 'virtual_page_view',
    page_path: pagePath,
    page_title: pageTitle,
    funnel_stage: 'discovery',
  });
};

// =============================================
// USER INTERACTION EVENTS
// =============================================

export const trackClick = (
  componentName: string,
  elementId?: string,
  metadata?: Record<string, unknown>
): void => {
  pushToDataLayer({
    event: 'element_click',
    component: componentName,
    element_id: elementId,
    funnel_stage: 'consideration',
    ...metadata,
  });
};

export const trackScroll = (
  scrollDepth: number,
  activeScrollSeconds: number
): void => {
  pushToDataLayer({
    event: 'scroll_depth',
    scroll_depth_percent: scrollDepth,
    active_scroll_seconds: activeScrollSeconds,
    funnel_stage: 'discovery',
  });
};

export const trackFormInteraction = (
  formName: string,
  action: 'start' | 'field_focus' | 'field_blur' | 'submit' | 'abandon',
  metadata?: Record<string, unknown>
): void => {
  pushToDataLayer({
    event: `form_${action}`,
    component: formName,
    funnel_stage: action === 'submit' ? 'intent' : 'consideration',
    ...metadata,
  });
};

// =============================================
// TOUR PACKAGE EVENTS
// =============================================

export const trackPackageViewed = (
  packageId: string,
  packageName: string,
  category: string,
  price?: number
): void => {
  pushToDataLayer({
    event: 'package_viewed',
    package_id: packageId,
    package_name: packageName,
    package_category: category,
    package_price: price,
    funnel_stage: 'discovery',
    component: 'TourPackageCard',
  });
};

export const trackPackageSelected = (
  packageId: string,
  packageName: string,
  intentLevel: 'low' | 'medium' | 'high'
): void => {
  pushToDataLayer({
    event: 'package_selected',
    package_id: packageId,
    package_name: packageName,
    intent_level: intentLevel,
    funnel_stage: 'intent',
    component: 'TourPackageCard',
  });
};

export const trackPackageBookingStart = (
  packageId: string,
  packageName: string,
  price: number
): void => {
  pushToDataLayer({
    event: 'booking_flow_started',
    package_id: packageId,
    package_name: packageName,
    package_value: price,
    currency: 'INR',
    funnel_stage: 'booking_start',
    component: 'TourPackageModal',
  });
};

// =============================================
// ROOM BOOKING EVENTS
// =============================================

export const trackRoomViewed = (
  roomType: string,
  roomName: string,
  price: number
): void => {
  pushToDataLayer({
    event: 'room_viewed',
    room_type: roomType,
    room_name: roomName,
    room_price: price,
    currency: 'INR',
    funnel_stage: 'discovery',
    component: 'RoomCard',
  });
};

export const trackRoomSelected = (
  roomType: string,
  roomName: string,
  checkIn?: string,
  checkOut?: string,
  guests?: number
): void => {
  pushToDataLayer({
    event: 'room_selected',
    room_type: roomType,
    room_name: roomName,
    check_in: checkIn,
    check_out: checkOut,
    guests: guests,
    funnel_stage: 'intent',
    component: 'BookingModal',
  });
};

export const trackBookingStart = (
  roomType: string,
  value: number,
  checkIn: string,
  checkOut: string,
  guests: number
): void => {
  pushToDataLayer({
    event: 'booking_initiated',
    room_type: roomType,
    booking_value: value,
    currency: 'INR',
    check_in: checkIn,
    check_out: checkOut,
    guests: guests,
    funnel_stage: 'booking_start',
    component: 'BookingFlow',
  });
};

export const trackBookingComplete = (
  bookingId: string,
  roomType: string,
  value: number,
  paymentMethod?: string
): void => {
  pushToDataLayer({
    event: 'booking_confirmed',
    transaction_id: bookingId,
    room_type: roomType,
    booking_value: value,
    currency: 'INR',
    payment_method: paymentMethod,
    funnel_stage: 'booking_complete',
    component: 'BookingConfirmation',
  });
};

// =============================================
// HIGH-INTENT ENGAGEMENT EVENTS (Validated)
// =============================================

export const trackWhatsAppEngaged = (params: {
  validated: boolean;
  intentScore: number;
  deviceTier: string;
  clickQualityScore: number;
  value: number;
}): void => {
  pushToDataLayer({
    event: params.validated ? 'whatsapp_engaged_validated' : 'whatsapp_clicked',
    validated: params.validated,
    intent_score: params.intentScore,
    device_tier: params.deviceTier,
    click_quality_score: params.clickQualityScore,
    engagement_value: params.value,
    currency: 'INR',
    funnel_stage: 'intent',
    component: 'WhatsAppButton',
  });
};

export const trackCallEngaged = (params: {
  validated: boolean;
  intentScore: number;
  deviceTier: string;
  clickQualityScore: number;
  value: number;
  callDuration?: number;
}): void => {
  pushToDataLayer({
    event: params.validated ? 'call_engaged_validated' : 'call_clicked',
    validated: params.validated,
    intent_score: params.intentScore,
    device_tier: params.deviceTier,
    click_quality_score: params.clickQualityScore,
    engagement_value: params.value,
    call_duration_seconds: params.callDuration,
    currency: 'INR',
    funnel_stage: 'intent',
    component: 'CallButton',
  });
};

export const trackLeadQualified = (params: {
  leadSource: string;
  contactType: 'whatsapp' | 'call' | 'email' | 'form';
  intentScore: number;
  value: number;
}): void => {
  pushToDataLayer({
    event: 'lead_qualified',
    lead_source: params.leadSource,
    contact_type: params.contactType,
    intent_score: params.intentScore,
    lead_value: params.value,
    currency: 'INR',
    funnel_stage: 'intent',
  });
};

// =============================================
// SESSION QUALITY SIGNALS (for Smart Bidding)
// =============================================

export const trackSessionQuality = (params: {
  classification: string;
  defenseScore: number;
  intentScore: number;
  deviceTier: string;
  activeScrollSeconds: number;
  isHighIntent: boolean;
  isHotLead: boolean;
}): void => {
  // Only send for validated sessions
  if (params.defenseScore < 40 || params.activeScrollSeconds < 15) {
    return;
  }
  
  pushToDataLayer({
    event: 'session_quality_signal',
    classification: params.classification,
    defense_score: params.defenseScore,
    intent_score: params.intentScore,
    device_tier: params.deviceTier,
    active_scroll_seconds: params.activeScrollSeconds,
    high_intent: params.isHighIntent,
    hot_lead: params.isHotLead,
    funnel_stage: params.isHotLead ? 'intent' : 'consideration',
  });
};

// =============================================
// CATEGORY BROWSING EVENTS
// =============================================

export const trackCategoryViewed = (
  category: string,
  itemCount: number
): void => {
  pushToDataLayer({
    event: 'category_viewed',
    category_name: category,
    item_count: itemCount,
    funnel_stage: 'discovery',
    component: 'CategoryFilter',
  });
};

export const trackSearchPerformed = (
  searchQuery: string,
  resultsCount: number
): void => {
  pushToDataLayer({
    event: 'search_performed',
    search_query: searchQuery,
    results_count: resultsCount,
    funnel_stage: 'discovery',
    component: 'SearchBar',
  });
};

// =============================================
// USER PROPERTIES (for audience segmentation)
// =============================================

export const setUserProperties = (props: {
  deviceTier: string;
  intentCategory: string;
  isReturnVisitor: boolean;
  visitCount: number;
}): void => {
  pushToDataLayer({
    event: 'user_properties_set',
    user_device_tier: props.deviceTier,
    user_intent_category: props.intentCategory,
    user_is_return_visitor: props.isReturnVisitor,
    user_visit_count: props.visitCount,
  });
};

// =============================================
// EXPORT SESSION/VISITOR IDs FOR EXTERNAL USE
// =============================================

export { getSessionId, getVisitorId, isAdminSession };
