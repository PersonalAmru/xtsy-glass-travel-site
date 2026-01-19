/**
 * GA4 Integration Utility
 * Sends validated events to GA4 and Google Ads through GTM
 * Only validated, high-intent signals pass through
 */

export interface GA4Event {
  eventName: string;
  params: Record<string, unknown>;
}

export interface ConversionEvent {
  conversionId: string;
  conversionLabel?: string;
  value: number;
  currency: string;
}

// =============================================
// GA4 EVENT FORWARDING
// =============================================

/**
 * Check if GA4/GTM is available
 */
export const isGA4Available = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof (window as any).gtag === 'function' &&
         !(window as any).__isLovableAdmin;
};

/**
 * Send event to GA4
 */
export const sendToGA4 = (eventName: string, params: Record<string, unknown>): void => {
  if (!isGA4Available()) {
    console.log('[GA4] Skipped (not available or admin session):', eventName);
    return;
  }
  
  try {
    (window as any).gtag('event', eventName, {
      ...params,
      send_to: 'G-SJY2WX6L4B',
    });
    console.log('[GA4] Event sent:', eventName, params);
  } catch (err) {
    console.error('[GA4] Error sending event:', err);
  }
};

/**
 * Send conversion to Google Ads
 */
export const sendToGoogleAds = (conversion: ConversionEvent): void => {
  if (!isGA4Available()) {
    console.log('[GAds] Skipped (not available or admin session):', conversion.conversionId);
    return;
  }
  
  try {
    (window as any).gtag('event', 'conversion', {
      send_to: `AW-17456979648/${conversion.conversionLabel || ''}`,
      value: conversion.value,
      currency: conversion.currency,
    });
    console.log('[GAds] Conversion sent:', conversion);
  } catch (err) {
    console.error('[GAds] Error sending conversion:', err);
  }
};

// =============================================
// VALIDATED EVENT TYPES
// =============================================

/**
 * Send validated WhatsApp engagement to GA4
 */
export const sendWhatsAppValidated = (params: {
  sessionId: string;
  value: number;
  intentScore: number;
  deviceTier: string;
  clickQualityScore: number;
}): void => {
  sendToGA4('whatsapp_engaged_validated', {
    session_id: params.sessionId,
    value: params.value,
    currency: 'INR',
    intent_score: params.intentScore,
    device_tier: params.deviceTier,
    click_quality: params.clickQualityScore,
    validated: true,
  });
  
  // Also send as conversion to Google Ads
  sendToGoogleAds({
    conversionId: 'whatsapp_engaged',
    conversionLabel: 'WhatsApp_Engaged',
    value: params.value,
    currency: 'INR',
  });
};

/**
 * Send validated Call engagement to GA4
 */
export const sendCallValidated = (params: {
  sessionId: string;
  value: number;
  intentScore: number;
  deviceTier: string;
  clickQualityScore: number;
  callDuration?: number;
}): void => {
  sendToGA4('call_engaged_validated', {
    session_id: params.sessionId,
    value: params.value,
    currency: 'INR',
    intent_score: params.intentScore,
    device_tier: params.deviceTier,
    click_quality: params.clickQualityScore,
    call_duration: params.callDuration,
    validated: true,
  });
  
  // Also send as conversion to Google Ads
  sendToGoogleAds({
    conversionId: 'call_engaged',
    conversionLabel: 'Call_Engaged',
    value: params.value,
    currency: 'INR',
  });
};

/**
 * Send qualified lead event to GA4
 */
export const sendLeadQualified = (params: {
  sessionId: string;
  value: number;
  intentScore: number;
  leadSource: string;
  contactType: string;
}): void => {
  sendToGA4('lead_qualified', {
    session_id: params.sessionId,
    value: params.value,
    currency: 'INR',
    intent_score: params.intentScore,
    lead_source: params.leadSource,
    contact_type: params.contactType,
    qualified: true,
  });
  
  sendToGoogleAds({
    conversionId: 'lead_qualified',
    conversionLabel: 'Lead_Qualified',
    value: params.value,
    currency: 'INR',
  });
};

/**
 * Send booking confirmed event to GA4
 */
export const sendBookingConfirmed = (params: {
  sessionId: string;
  bookingId: string;
  value: number;
  roomType?: string;
}): void => {
  sendToGA4('booking_confirmed', {
    session_id: params.sessionId,
    transaction_id: params.bookingId,
    value: params.value,
    currency: 'INR',
    room_type: params.roomType,
    confirmed: true,
  });
  
  // Purchase conversion for Google Ads
  sendToGoogleAds({
    conversionId: 'purchase',
    conversionLabel: 'Booking_Confirmed',
    value: params.value,
    currency: 'INR',
  });
};

// =============================================
// SESSION QUALITY EVENTS
// =============================================

/**
 * Send session quality update to GA4 (for Smart Bidding signals)
 */
export const sendSessionQuality = (params: {
  sessionId: string;
  classification: string;
  defenseScore: number;
  intentScore: number;
  deviceTier: string;
  activeScrollSeconds: number;
}): void => {
  // Only send for validated sessions
  if (params.defenseScore < 40 || params.activeScrollSeconds < 15) {
    return;
  }
  
  sendToGA4('session_quality_signal', {
    session_id: params.sessionId,
    classification: params.classification,
    defense_score: params.defenseScore,
    intent_score: params.intentScore,
    device_tier: params.deviceTier,
    active_scroll_seconds: params.activeScrollSeconds,
    high_intent: params.intentScore >= 60,
    hot_lead: params.classification === 'hot_lead',
  });
};

/**
 * Set user properties for audience segmentation
 */
export const setUserProperties = (params: {
  deviceTier: string;
  intentCategory: string;
  isReturnVisitor: boolean;
  visitCount: number;
}): void => {
  if (!isGA4Available()) return;
  
  try {
    (window as any).gtag('set', 'user_properties', {
      device_tier: params.deviceTier,
      intent_category: params.intentCategory,
      is_return_visitor: params.isReturnVisitor,
      visit_count: params.visitCount,
    });
  } catch (err) {
    console.error('[GA4] Error setting user properties:', err);
  }
};
