/**
 * Traffic Analytics Service
 * Core tracking engine for the Smart Analytics & Traffic Defense System
 * Admin dashboard is the SOURCE OF TRUTH - GA4 is downstream
 */

import { supabase } from '@/integrations/supabase/client';

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface SessionData {
  session_id: string;
  visitor_id: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  operating_system: string;
  user_device_tier: 'premium' | 'standard' | 'neutral';
  browser: string;
  screen_width: number;
  screen_height: number;
  country?: string;
  country_code?: string;
  state?: string;
  city?: string;
  timezone?: string;
  ip_hash?: string;
  landing_page: string;
  referrer_url?: string;
  referrer_source?: string;
  referrer_medium?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  consent_state: ConsentState;
}

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  functionality: boolean;
}

export interface PageEvent {
  session_id: string;
  page_url: string;
  page_path: string;
  page_title: string;
  referrer?: string;
  is_entrance?: boolean;
}

export interface InteractionEvent {
  session_id: string;
  event_type: 'click' | 'scroll' | 'form' | 'whatsapp' | 'call' | 'hover' | 'video' | 'download' | 'share' | 'custom';
  event_name: string;
  event_category?: string;
  page_url?: string;
  element_id?: string;
  element_class?: string;
  element_text?: string;
  metadata?: Record<string, unknown>;
}

export interface ValidatedEvent {
  session_id: string;
  event_name: string;
  event_category?: string;
  validation_passed: boolean;
  validation_reason?: string;
  validation_rules_met?: string[];
  conversion_value?: number;
}

export interface BotSignal {
  type: string;
  score: number;
  details?: string;
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Generate a unique visitor ID (persisted in localStorage)
 */
export const generateVisitorId = (): string => {
  if (typeof window === 'undefined') return 'v_ssr';
  const stored = localStorage.getItem('xtsy_vid');
  if (stored) return stored;
  
  const id = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem('xtsy_vid', id);
  return id;
};

/**
 * Generate a session ID (persisted in sessionStorage with 30-min timeout)
 */
export const generateSessionId = (): string => {
  if (typeof window === 'undefined') return 's_ssr';
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const stored = sessionStorage.getItem('xtsy_sid');
  const lastActivity = sessionStorage.getItem('xtsy_last_activity');
  
  if (stored && lastActivity) {
    const elapsed = Date.now() - parseInt(lastActivity);
    if (elapsed < SESSION_TIMEOUT) {
      sessionStorage.setItem('xtsy_last_activity', Date.now().toString());
      return stored;
    }
  }
  
  const id = `s_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  sessionStorage.setItem('xtsy_sid', id);
  sessionStorage.setItem('xtsy_last_activity', Date.now().toString());
  return id;
};

/**
 * Hash a value for privacy (simple hash for IP anonymization)
 */
export const hashValue = async (value: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value + 'xtsy_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
};

/**
 * Detect device type from user agent
 */
export const detectDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipod|android.*mobile|windows phone|blackberry/.test(ua);
  const isTablet = /ipad|android(?!.*mobile)|tablet/.test(ua);
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
};

/**
 * Detect operating system
 */
export const detectOS = (): string => {
  const ua = navigator.userAgent;
  
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (/Android/.test(ua)) return 'Android';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac OS/.test(ua)) return 'macOS';
  if (/Linux/.test(ua)) return 'Linux';
  if (/CrOS/.test(ua)) return 'Chrome OS';
  
  return 'Unknown';
};

/**
 * Determine device tier (iOS = premium for Smart Bidding optimization)
 */
export const determineDeviceTier = (): 'premium' | 'standard' | 'neutral' => {
  const os = detectOS();
  const deviceType = detectDeviceType();
  
  // iOS devices are premium tier (higher LTV typically)
  if (os === 'iOS') return 'premium';
  
  // Android mobile = standard
  if (os === 'Android' && deviceType === 'mobile') return 'standard';
  
  // Desktop and others = neutral
  return 'neutral';
};

/**
 * Detect browser
 */
export const detectBrowser = (): string => {
  const ua = navigator.userAgent;
  
  if (/Edg/.test(ua)) return 'Edge';
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) return 'Chrome';
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
  if (/Firefox/.test(ua)) return 'Firefox';
  if (/Opera|OPR/.test(ua)) return 'Opera';
  
  return 'Other';
};

/**
 * Parse UTM parameters from URL
 */
export const parseUTMParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  };
};

/**
 * Parse referrer information
 */
export const parseReferrer = (): { source: string; medium: string } => {
  const referrer = document.referrer;
  if (!referrer) return { source: 'direct', medium: 'none' };
  
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    
    // Search engines
    if (/google\.|bing\.|yahoo\.|duckduckgo\.|baidu\./.test(host)) {
      return { source: host.split('.')[0], medium: 'organic' };
    }
    
    // Social networks
    if (/facebook\.|instagram\.|twitter\.|linkedin\.|youtube\.|tiktok\./.test(host)) {
      return { source: host.split('.')[0], medium: 'social' };
    }
    
    // Email providers
    if (/mail\.|outlook\.|gmail\./.test(host)) {
      return { source: 'email', medium: 'email' };
    }
    
    // Default to referral
    return { source: host, medium: 'referral' };
  } catch {
    return { source: 'unknown', medium: 'unknown' };
  }
};

/**
 * Get geo location from IP (using free service)
 */
export const getGeoLocation = async (): Promise<{
  country: string;
  country_code: string;
  state: string;
  city: string;
  timezone: string;
  ip_hash: string;
  latitude: number;
  longitude: number;
} | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/', { 
      signal: AbortSignal.timeout(3000) 
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const ipHash = await hashValue(data.ip || '');
    
    return {
      country: data.country_name || 'Unknown',
      country_code: data.country_code || 'XX',
      state: data.region || '',
      city: data.city || '',
      timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      ip_hash: ipHash,
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
    };
  } catch {
    return null;
  }
};

// =============================================
// BOT DETECTION (Layer 2)
// =============================================

/**
 * Detect bot signals and compute likelihood score
 */
export const detectBotSignals = (): { score: number; signals: BotSignal[] } => {
  const signals: BotSignal[] = [];
  let totalScore = 0;
  
  // Check for headless browser indicators
  if (navigator.webdriver) {
    signals.push({ type: 'webdriver', score: 40, details: 'WebDriver detected' });
    totalScore += 40;
  }
  
  // Check for missing features
  if (!navigator.languages || navigator.languages.length === 0) {
    signals.push({ type: 'no_languages', score: 20, details: 'No languages array' });
    totalScore += 20;
  }
  
  // Check for automation frameworks
  const automationIndicators = ['phantom', 'nightmare', 'selenium', 'puppeteer', 'playwright'];
  const ua = navigator.userAgent.toLowerCase();
  for (const indicator of automationIndicators) {
    if (ua.includes(indicator)) {
      signals.push({ type: 'automation', score: 50, details: `${indicator} detected` });
      totalScore += 50;
      break;
    }
  }
  
  // Check for suspicious screen dimensions
  if (window.innerWidth === 0 || window.innerHeight === 0) {
    signals.push({ type: 'zero_viewport', score: 30, details: 'Zero viewport dimensions' });
    totalScore += 30;
  }
  
  // Check for plugins (headless browsers often have none)
  if (navigator.plugins.length === 0 && detectDeviceType() === 'desktop') {
    signals.push({ type: 'no_plugins', score: 15, details: 'No plugins on desktop' });
    totalScore += 15;
  }
  
  // Check for missing or suspicious user agent
  if (!navigator.userAgent || navigator.userAgent.length < 20) {
    signals.push({ type: 'suspicious_ua', score: 25, details: 'Short or missing UA' });
    totalScore += 25;
  }
  
  // Check for missing navigator properties
  if (typeof navigator.hardwareConcurrency === 'undefined') {
    signals.push({ type: 'no_hardware_concurrency', score: 10, details: 'Missing hardware info' });
    totalScore += 10;
  }
  
  // Check timezone consistency
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) {
      signals.push({ type: 'no_timezone', score: 15, details: 'No timezone' });
      totalScore += 15;
    }
  } catch {
    signals.push({ type: 'tz_error', score: 10, details: 'Timezone error' });
    totalScore += 10;
  }
  
  return {
    score: Math.min(100, totalScore),
    signals
  };
};

// =============================================
// MAIN TRACKING CLASS
// =============================================

class TrafficAnalyticsService {
  private sessionId: string;
  private visitorId: string;
  private sessionStartTime: number;
  private maxScrollDepth: number = 0;
  private interactionCount: number = 0;
  private pageViewCount: number = 0;
  private currentPageStartTime: number = Date.now();
  private isInitialized: boolean = false;
  private botLikelihood: number = 0;
  private deviceTier: 'premium' | 'standard' | 'neutral' = 'neutral';
  
  constructor() {
    this.visitorId = generateVisitorId();
    this.sessionId = generateSessionId();
    this.sessionStartTime = Date.now();
    this.deviceTier = determineDeviceTier();
    
    // Detect bot signals immediately
    const botResult = detectBotSignals();
    this.botLikelihood = botResult.score;
  }
  
  /**
   * Initialize session tracking
   */
  async initSession(): Promise<void> {
    if (this.isInitialized) return;
    
    // Don't track admin/preview sessions
    if (this.isAdminSession()) {
      console.log('[Analytics] Skipping admin session');
      return;
    }
    
    const geo = await getGeoLocation();
    const utmParams = parseUTMParams();
    const referrer = parseReferrer();
    const consentState = this.getConsentState();
    
    const sessionData = {
      session_id: this.sessionId,
      visitor_id: this.visitorId,
      device_type: detectDeviceType(),
      operating_system: detectOS(),
      user_device_tier: this.deviceTier,
      browser: detectBrowser(),
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      country: geo?.country,
      country_code: geo?.country_code,
      state: geo?.state,
      city: geo?.city,
      timezone: geo?.timezone,
      latitude: geo?.latitude,
      longitude: geo?.longitude,
      ip_hash: geo?.ip_hash,
      landing_page: window.location.pathname,
      referrer_url: document.referrer || null,
      referrer_source: utmParams.utm_source || referrer.source,
      referrer_medium: utmParams.utm_medium || referrer.medium,
      utm_source: utmParams.utm_source || null,
      utm_medium: utmParams.utm_medium || null,
      utm_campaign: utmParams.utm_campaign || null,
      utm_content: utmParams.utm_content || null,
      utm_term: utmParams.utm_term || null,
      consent_state: consentState,
      bot_likelihood_score: this.botLikelihood,
      traffic_quality: this.computeTrafficQuality(),
    };
    
    try {
      // Use type assertion for the insert
      const { error } = await supabase
        .from('traffic_sessions')
        .insert(sessionData as any);
      
      if (error) {
        console.error('[Analytics] Session init error:', error);
      } else {
        this.isInitialized = true;
        console.log('[Analytics] Session initialized:', this.sessionId);
      }
    } catch (err) {
      console.error('[Analytics] Session init failed:', err);
    }
    
    // Log bot detection if significant
    if (this.botLikelihood > 30) {
      const botResult = detectBotSignals();
      this.logBotDetection(botResult.signals);
    }
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Check if current session is admin/preview
   */
  private isAdminSession(): boolean {
    const params = new URLSearchParams(window.location.search);
    if (params.has('__lovable_token') || params.has('forceHideBadge')) return true;
    if (window.location.hostname.includes('lovable.')) return true;
    if (typeof window !== 'undefined' && (window as any).__isLovableAdmin) return true;
    return false;
  }
  
  /**
   * Get current consent state
   */
  private getConsentState(): ConsentState {
    const stored = localStorage.getItem('xtsy_consent');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { analytics: false, marketing: false, personalization: false, functionality: true };
      }
    }
    return { analytics: false, marketing: false, personalization: false, functionality: true };
  }
  
  /**
   * Compute initial traffic quality
   */
  private computeTrafficQuality(): 'high' | 'medium' | 'low' | 'junk' {
    if (this.botLikelihood > 70) return 'junk';
    if (this.botLikelihood > 40) return 'low';
    return 'medium';
  }
  
  /**
   * Set up scroll and interaction listeners
   */
  private setupEventListeners(): void {
    // Scroll tracking
    let scrollTimeout: ReturnType<typeof setTimeout>;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const depth = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 0;
        if (depth > this.maxScrollDepth) {
          this.maxScrollDepth = depth;
        }
      }, 100);
    }, { passive: true });
    
    // Click tracking
    document.addEventListener('click', (e) => {
      this.interactionCount++;
      const target = e.target as HTMLElement;
      
      // Track significant clicks
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        this.trackInteraction({
          session_id: this.sessionId,
          event_type: 'click',
          event_name: target.textContent?.trim().substring(0, 50) || 'unknown_click',
          element_id: target.id || undefined,
          element_class: target.className?.toString().substring(0, 100) || undefined,
          element_text: target.textContent?.trim().substring(0, 50) || undefined,
          page_url: window.location.pathname,
        });
      }
    }, { passive: true });
    
    // Visibility change (tab switch/close)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.updateSessionOnExit();
      }
    });
    
    // Before unload
    window.addEventListener('beforeunload', () => {
      this.updateSessionOnExit();
    });
  }
  
  /**
   * Track page view
   */
  async trackPageView(pageData?: Partial<PageEvent>): Promise<void> {
    if (!this.isInitialized || this.isAdminSession()) return;
    
    // Close previous page event
    if (this.pageViewCount > 0) {
      await this.closeCurrentPage();
    }
    
    this.pageViewCount++;
    this.currentPageStartTime = Date.now();
    
    const event = {
      session_id: this.sessionId,
      page_url: window.location.href,
      page_path: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer || null,
      is_entrance: this.pageViewCount === 1,
      is_exit: false,
    };
    
    try {
      await supabase
        .from('traffic_page_events')
        .insert(event as any);
      
      // Update session page count
      await supabase
        .from('traffic_sessions')
        .update({ 
          page_views: this.pageViewCount,
          is_bounce: this.pageViewCount === 1,
          last_activity_at: new Date().toISOString(),
        } as any)
        .eq('session_id', this.sessionId);
    } catch (err) {
      console.error('[Analytics] Page view error:', err);
    }
  }
  
  /**
   * Close current page with time spent
   */
  private async closeCurrentPage(): Promise<void> {
    const timeSpent = Math.round((Date.now() - this.currentPageStartTime) / 1000);
    
    try {
      await supabase
        .from('traffic_page_events')
        .update({
          exit_timestamp: new Date().toISOString(),
          time_spent_seconds: timeSpent,
          scroll_depth: this.maxScrollDepth,
          interaction_count: this.interactionCount,
        } as any)
        .eq('session_id', this.sessionId)
        .is('exit_timestamp', null);
    } catch (err) {
      console.error('[Analytics] Close page error:', err);
    }
    
    // Reset for next page
    this.maxScrollDepth = 0;
    this.interactionCount = 0;
  }
  
  /**
   * Track interaction event
   */
  async trackInteraction(event: InteractionEvent): Promise<void> {
    if (!this.isInitialized || this.isAdminSession()) return;
    
    try {
      await supabase
        .from('traffic_interaction_events')
        .insert(event as any);
    } catch (err) {
      console.error('[Analytics] Interaction error:', err);
    }
  }
  
  /**
   * Track WhatsApp engagement (with validation)
   */
  async trackWhatsAppEngagement(metadata?: Record<string, unknown>): Promise<void> {
    if (!this.isInitialized) return;
    
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
    
    // Track the raw click first
    await this.trackInteraction({
      session_id: this.sessionId,
      event_type: 'whatsapp',
      event_name: 'whatsapp_click',
      event_category: 'engagement',
      page_url: window.location.pathname,
      metadata,
    });
    
    // Validate for conversion
    const validationRules: string[] = [];
    let isValid = true;
    
    if (sessionDuration >= 15) {
      validationRules.push('session_duration_15s');
    } else {
      isValid = false;
    }
    
    if (this.maxScrollDepth >= 50) {
      validationRules.push('scroll_depth_50');
    } else {
      isValid = false;
    }
    
    if (this.computeClickQualityScore() >= 40) {
      validationRules.push('click_quality_40');
    } else {
      isValid = false;
    }
    
    // Create validated event
    await this.createValidatedEvent({
      session_id: this.sessionId,
      event_name: isValid ? 'whatsapp_engaged_validated' : 'whatsapp_click_unvalidated',
      event_category: 'engagement',
      validation_passed: isValid,
      validation_reason: isValid ? 'All validation rules met' : 'Failed validation checks',
      validation_rules_met: validationRules,
      conversion_value: isValid ? this.computeConversionValue('whatsapp') : 0,
    });
  }
  
  /**
   * Track Call engagement (with validation)
   */
  async trackCallEngagement(callDurationSeconds?: number, metadata?: Record<string, unknown>): Promise<void> {
    if (!this.isInitialized) return;
    
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
    
    // Track the raw click first
    await this.trackInteraction({
      session_id: this.sessionId,
      event_type: 'call',
      event_name: 'call_click',
      event_category: 'engagement',
      page_url: window.location.pathname,
      metadata: { ...metadata, call_duration: callDurationSeconds },
    });
    
    // Validate for conversion
    const validationRules: string[] = [];
    let isValid = true;
    
    if (sessionDuration >= 15) {
      validationRules.push('session_duration_15s');
    } else {
      isValid = false;
    }
    
    if (this.maxScrollDepth >= 50) {
      validationRules.push('scroll_depth_50');
    } else {
      isValid = false;
    }
    
    if (this.computeClickQualityScore() >= 40) {
      validationRules.push('click_quality_40');
    } else {
      isValid = false;
    }
    
    if (callDurationSeconds && callDurationSeconds >= 10) {
      validationRules.push('call_duration_10s');
    } else if (callDurationSeconds !== undefined) {
      isValid = false;
    }
    
    // Create validated event
    await this.createValidatedEvent({
      session_id: this.sessionId,
      event_name: isValid ? 'call_engaged_validated' : 'call_click_unvalidated',
      event_category: 'engagement',
      validation_passed: isValid,
      validation_reason: isValid ? 'All validation rules met' : 'Failed validation checks',
      validation_rules_met: validationRules,
      conversion_value: isValid ? this.computeConversionValue('call') : 0,
    });
  }
  
  /**
   * Track lead qualification
   */
  async trackLeadQualified(leadData: {
    lead_source: string;
    contact_type: 'whatsapp' | 'call' | 'email' | 'form';
    lead_value?: number;
  }): Promise<void> {
    if (!this.isInitialized) return;
    
    const intentScore = this.computeUnifiedIntentScore();
    
    // Only qualify high/hot intent leads
    if (intentScore < 60) {
      console.log('[Analytics] Lead not qualified - intent score too low:', intentScore);
      return;
    }
    
    try {
      await supabase
        .from('traffic_lead_events')
        .insert({
          session_id: this.sessionId,
          visitor_id: this.visitorId,
          lead_stage: 'qualified',
          lead_source: leadData.lead_source,
          contact_type: leadData.contact_type,
          lead_value: leadData.lead_value || this.computeConversionValue('lead'),
          first_touch_source: sessionStorage.getItem('first_touch_source') || 'direct',
          last_touch_source: parseReferrer().source,
        } as any);
      
      // Create validated event for GA4
      await this.createValidatedEvent({
        session_id: this.sessionId,
        event_name: 'lead_qualified',
        event_category: 'conversion',
        validation_passed: true,
        validation_reason: 'High intent lead qualified',
        conversion_value: leadData.lead_value || this.computeConversionValue('lead'),
      });
    } catch (err) {
      console.error('[Analytics] Lead tracking error:', err);
    }
  }
  
  /**
   * Track booking confirmed
   */
  async trackBookingConfirmed(bookingData: {
    booking_id: string;
    booking_value: number;
    room_type?: string;
  }): Promise<void> {
    if (!this.isInitialized) return;
    
    try {
      await supabase
        .from('traffic_lead_events')
        .insert({
          session_id: this.sessionId,
          visitor_id: this.visitorId,
          lead_stage: 'converted',
          lead_source: parseReferrer().source,
          lead_value: bookingData.booking_value,
        } as any);
      
      // Create validated event for GA4
      await this.createValidatedEvent({
        session_id: this.sessionId,
        event_name: 'booking_confirmed',
        event_category: 'conversion',
        validation_passed: true,
        validation_reason: 'Booking confirmed',
        conversion_value: bookingData.booking_value,
      });
    } catch (err) {
      console.error('[Analytics] Booking tracking error:', err);
    }
  }
  
  /**
   * Create validated event (for GA4/Ads)
   */
  private async createValidatedEvent(event: ValidatedEvent): Promise<void> {
    const valueMultiplier = this.getValueMultiplier();
    const adjustedValue = (event.conversion_value || 0) * valueMultiplier;
    
    try {
      await supabase
        .from('traffic_validated_events')
        .insert({
          ...event,
          value_multiplier: valueMultiplier,
          adjusted_conversion_value: adjustedValue,
          click_quality_score: this.computeClickQualityScore(),
          unified_intent_score: this.computeUnifiedIntentScore(),
          intent_category: this.categorizeIntent(this.computeUnifiedIntentScore()),
          user_device_tier: this.deviceTier,
        } as any);
      
      // Send to GA4 if validated and consent granted
      if (event.validation_passed && this.getConsentState().analytics) {
        this.sendToGA4(event.event_name, {
          session_id: this.sessionId,
          value: adjustedValue,
          currency: 'INR',
          traffic_quality: this.computeTrafficQuality(),
          click_quality_score: this.computeClickQualityScore(),
          unified_intent_score: this.computeUnifiedIntentScore(),
          intent_category: this.categorizeIntent(this.computeUnifiedIntentScore()),
          user_device_tier: this.deviceTier,
        });
      }
    } catch (err) {
      console.error('[Analytics] Validated event error:', err);
    }
  }
  
  /**
   * Get value multiplier based on device tier
   */
  private getValueMultiplier(): number {
    switch (this.deviceTier) {
      case 'premium': return 1.5; // iOS users
      case 'standard': return 1.0; // Android
      case 'neutral': return 0.8; // Desktop
      default: return 1.0;
    }
  }
  
  /**
   * Compute click quality score
   */
  private computeClickQualityScore(): number {
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
    let score = 50; // Base score
    
    // Duration bonus
    score += Math.min(20, sessionDuration / 6); // Max +20 at 2 min
    
    // Scroll bonus
    score += Math.min(15, this.maxScrollDepth / 6.67); // Max +15 at 100%
    
    // Interaction bonus
    score += Math.min(10, this.interactionCount * 2); // Max +10 at 5 interactions
    
    // Page view bonus
    score += Math.min(5, (this.pageViewCount - 1) * 2.5); // Max +5 at 3 pages
    
    // Bot penalty
    score -= this.botLikelihood * 0.3;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  /**
   * Compute unified intent score
   */
  private computeUnifiedIntentScore(): number {
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
    
    let score = 0;
    
    // Duration score (0-25)
    score += Math.min(25, sessionDuration / 12);
    
    // Engagement score (0-50)
    score += Math.min(30, this.pageViewCount * 3);
    score += Math.min(20, this.maxScrollDepth / 5);
    
    // Device tier bonus (0-15)
    if (this.deviceTier === 'premium') score += 15;
    else if (this.deviceTier === 'standard') score += 5;
    
    // Bot penalty
    score -= this.botLikelihood * 0.4;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  /**
   * Categorize intent based on score
   */
  private categorizeIntent(score: number): 'junk' | 'low' | 'medium' | 'high' | 'hot' {
    if (score >= 80) return 'hot';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'junk';
  }
  
  /**
   * Compute conversion value based on event type
   */
  private computeConversionValue(eventType: string): number {
    const baseValues: Record<string, number> = {
      whatsapp: 100,
      call: 150,
      lead: 500,
      booking: 2000,
    };
    
    return baseValues[eventType] || 50;
  }
  
  /**
   * Send validated event to dataLayer (GTM routes to GA4)
   * NO direct gtag calls - GTM is the sole routing authority
   */
  private sendToGA4(eventName: string, params: Record<string, unknown>): void {
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: eventName,
        timestamp: new Date().toISOString(),
        ...params,
      });
      console.log('[Analytics→DataLayer] Event pushed:', eventName, params);
    }
  }
  
  /**
   * Log bot detection
   */
  private async logBotDetection(signals: BotSignal[]): Promise<void> {
    try {
      await supabase
        .from('bot_detection_logs')
        .insert({
          session_id: this.sessionId,
          visitor_id: this.visitorId,
          detection_type: 'automated',
          detection_score: this.botLikelihood,
          detection_signals: signals,
          is_confirmed_bot: this.botLikelihood > 70,
        } as any);
    } catch (err) {
      console.error('[Analytics] Bot log error:', err);
    }
  }
  
  /**
   * Update session on exit
   */
  private async updateSessionOnExit(): Promise<void> {
    if (!this.isInitialized) return;
    
    const duration = Math.round((Date.now() - this.sessionStartTime) / 1000);
    const intentScore = this.computeUnifiedIntentScore();
    
    try {
      // Use sendBeacon for reliability
      const data = {
        ended_at: new Date().toISOString(),
        duration_seconds: duration,
        exit_page: window.location.pathname,
        max_scroll_depth: this.maxScrollDepth,
        total_interactions: this.interactionCount,
        unified_intent_score: intentScore,
        intent_category: this.categorizeIntent(intentScore),
        click_quality_score: this.computeClickQualityScore(),
        traffic_quality: this.computeTrafficQuality(),
      };
      
      navigator.sendBeacon(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-analytics`,
        JSON.stringify({
          endpoint: 'session-end',
          data: {
            session_id: this.sessionId,
            ...data,
          },
        })
      );
    } catch (err) {
      console.error('[Analytics] Session exit error:', err);
    }
  }
  
  // Public getters
  getSessionId = () => this.sessionId;
  getVisitorId = () => this.visitorId;
  getDeviceTier = () => this.deviceTier;
  getBotLikelihood = () => this.botLikelihood;
  getIntentScore = () => this.computeUnifiedIntentScore();
  getClickQualityScore = () => this.computeClickQualityScore();
}

// Export singleton instance — lazily created so importing this module during
// SSR never touches localStorage/sessionStorage/navigator. The instance is
// only constructed on first property access, which happens client-side.
let _instance: TrafficAnalyticsService | null = null;
const getInstance = (): TrafficAnalyticsService => {
  if (!_instance) _instance = new TrafficAnalyticsService();
  return _instance;
};

export const trafficAnalytics: TrafficAnalyticsService = new Proxy(
  {} as TrafficAnalyticsService,
  {
    get(_target, prop: string | symbol) {
      const inst = getInstance();
      const value = inst[prop as keyof TrafficAnalyticsService];
      return typeof value === 'function' ? (value as Function).bind(inst) : value;
    },
  }
);

// Export initialization function
export const initTrafficAnalytics = async () => {
  if (typeof window === 'undefined') return;
  await trafficAnalytics.initSession();
  trafficAnalytics.trackPageView();
};
