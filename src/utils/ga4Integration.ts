/**
 * GA4 Integration Utility (DataLayer-Only Mode)
 * 
 * All events are pushed to window.dataLayer
 * GTM (GTM-5FXJ9QBK) is the SOLE routing authority to GA4 and Google Ads
 * 
 * NO DIRECT CALLS TO:
 * - gtag.js
 * - window.gtag
 * - G-* measurement IDs
 * - AW-* conversion IDs
 */

import {
  pushToDataLayer,
  trackWhatsAppEngaged,
  trackCallEngaged,
  trackLeadQualified as dlTrackLeadQualified,
  trackBookingComplete,
  trackSessionQuality,
  setUserProperties as dlSetUserProperties,
} from './dataLayerService';

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
// LEGACY COMPATIBILITY LAYER
// These functions now route through dataLayer instead of direct gtag
// =============================================

/**
 * Check if analytics is available (dataLayer exists)
 * @deprecated Use dataLayerService directly
 */
export const isGA4Available = (): boolean => {
  return typeof window !== 'undefined' && 
         Array.isArray((window as any).dataLayer) &&
         !(window as any).__isLovableAdmin;
};

/**
 * Send event to GA4 via dataLayer
 * @deprecated Use dataLayerService.pushToDataLayer directly
 */
export const sendToGA4 = (eventName: string, params: Record<string, unknown>): void => {
  if (!isGA4Available()) {
    console.log('[GA4→DataLayer] Skipped (not available or admin session):', eventName);
    return;
  }
  
  pushToDataLayer({
    event: eventName,
    ...params,
  });
  
  console.log('[GA4→DataLayer] Event pushed:', eventName, params);
};

/**
 * Send conversion to Google Ads via dataLayer
 * @deprecated GTM handles conversion routing
 */
export const sendToGoogleAds = (conversion: ConversionEvent): void => {
  if (!isGA4Available()) {
    console.log('[GAds→DataLayer] Skipped (not available or admin session):', conversion.conversionId);
    return;
  }
  
  pushToDataLayer({
    event: 'conversion',
    conversion_id: conversion.conversionId,
    conversion_label: conversion.conversionLabel,
    conversion_value: conversion.value,
    currency: conversion.currency,
  });
  
  console.log('[GAds→DataLayer] Conversion pushed:', conversion);
};

// =============================================
// VALIDATED EVENT TYPES (Route through dataLayer)
// =============================================

/**
 * Send validated WhatsApp engagement
 */
export const sendWhatsAppValidated = (params: {
  sessionId: string;
  value: number;
  intentScore: number;
  deviceTier: string;
  clickQualityScore: number;
}): void => {
  trackWhatsAppEngaged({
    validated: true,
    intentScore: params.intentScore,
    deviceTier: params.deviceTier,
    clickQualityScore: params.clickQualityScore,
    value: params.value,
  });
};

/**
 * Send validated Call engagement
 */
export const sendCallValidated = (params: {
  sessionId: string;
  value: number;
  intentScore: number;
  deviceTier: string;
  clickQualityScore: number;
  callDuration?: number;
}): void => {
  trackCallEngaged({
    validated: true,
    intentScore: params.intentScore,
    deviceTier: params.deviceTier,
    clickQualityScore: params.clickQualityScore,
    value: params.value,
    callDuration: params.callDuration,
  });
};

/**
 * Send qualified lead event
 */
export const sendLeadQualified = (params: {
  sessionId: string;
  value: number;
  intentScore: number;
  leadSource: string;
  contactType: 'whatsapp' | 'call' | 'email' | 'form';
}): void => {
  dlTrackLeadQualified({
    leadSource: params.leadSource,
    contactType: params.contactType,
    intentScore: params.intentScore,
    value: params.value,
  });
};

/**
 * Send booking confirmed event
 */
export const sendBookingConfirmed = (params: {
  sessionId: string;
  bookingId: string;
  value: number;
  roomType?: string;
}): void => {
  trackBookingComplete(
    params.bookingId,
    params.roomType || 'unknown',
    params.value
  );
};

// =============================================
// SESSION QUALITY EVENTS
// =============================================

/**
 * Send session quality update (for Smart Bidding signals)
 */
export const sendSessionQuality = (params: {
  sessionId: string;
  classification: string;
  defenseScore: number;
  intentScore: number;
  deviceTier: string;
  activeScrollSeconds: number;
}): void => {
  trackSessionQuality({
    classification: params.classification,
    defenseScore: params.defenseScore,
    intentScore: params.intentScore,
    deviceTier: params.deviceTier,
    activeScrollSeconds: params.activeScrollSeconds,
    isHighIntent: params.intentScore >= 60,
    isHotLead: params.classification === 'hot_lead',
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
  dlSetUserProperties(params);
};
