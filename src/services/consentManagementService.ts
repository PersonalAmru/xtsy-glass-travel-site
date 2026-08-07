/**
 * Consent Management Service
 * GDPR & India DPDP Act Compliant
 * Google Consent Mode v2 (Advanced) Integration
 */

import { supabase } from '@/integrations/supabase/client';
import { generateVisitorId, generateSessionId } from './trafficAnalyticsService';

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface ConsentConfig {
  analytics_storage: 'granted' | 'denied';
  ad_storage: 'granted' | 'denied';
  ad_user_data: 'granted' | 'denied';
  ad_personalization: 'granted' | 'denied';
  functionality_storage: 'granted' | 'denied';
  security_storage: 'granted' | 'denied';
}

export interface ConsentPreferences {
  necessary: boolean; // Always true (required for site function)
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export interface ConsentRecord {
  visitor_id: string;
  session_id?: string;
  analytics_storage: boolean;
  ad_storage: boolean;
  ad_user_data: boolean;
  ad_personalization: boolean;
  functionality_storage: boolean;
  security_storage: boolean;
  consent_version: string;
  consent_method: 'banner' | 'settings' | 'implied' | 'explicit';
  granted_at?: string;
}

// =============================================
// CONSENT MANAGEMENT CLASS
// =============================================

class ConsentManagementService {
  private static instance: ConsentManagementService;
  private preferences: ConsentPreferences;
  private isInitialized: boolean = false;
  private consentVersion: string = 'v2.1';
  
  private constructor() {
    this.preferences = this.loadPreferences();
  }
  
  static getInstance(): ConsentManagementService {
    if (!ConsentManagementService.instance) {
      ConsentManagementService.instance = new ConsentManagementService();
    }
    return ConsentManagementService.instance;
  }
  
  /**
   * Initialize consent management with default denied state
   */
  initialize(): void {
    if (this.isInitialized) return;
    
    // Check if user has previously consented FIRST before pushing defaults
    const stored = localStorage.getItem('xtsy_consent_v2');
    let hasValidConsent = false;
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Check for valid consent (has version and timestamp)
        if (parsed.version && parsed.timestamp) {
          this.preferences = parsed;
          hasValidConsent = true;
          // Only push update, NOT defaults (index.html already handled defaults)
          this.updateGoogleConsent();
          console.log('[Consent] Valid stored consent found, restored. NOT pushing defaults.');
        }
      } catch {
        // Invalid stored consent, will fall through to defaults
        console.log('[Consent] Invalid stored consent, clearing.');
        localStorage.removeItem('xtsy_consent_v2');
      }
    }
    
    // Only push defaults if NO valid consent exists
    // CRITICAL: Don't overwrite the granted state from index.html restoration
    if (!hasValidConsent) {
      this.setGoogleConsentDefaults();
    }
    
    this.isInitialized = true;
  }
  
  /**
   * Set Google Consent Mode v2 defaults via dataLayer (GTM handles gtag routing)
   * NO direct gtag calls - GTM is the sole routing authority
   */
  private setGoogleConsentDefaults(): void {
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: 'consent_default',
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
        wait_for_update: 500,
      });
      
      console.log('[Consent→DataLayer] Defaults pushed: all denied');
    }
  }
  
  /**
   * Update Google Consent Mode via dataLayer (GTM handles gtag routing)
   * NO direct gtag calls - GTM is the sole routing authority
   */
  private updateGoogleConsent(): void {
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      
      const config = {
        event: 'consent_update',
        analytics_storage: this.preferences.analytics ? 'granted' : 'denied',
        ad_storage: this.preferences.marketing ? 'granted' : 'denied',
        ad_user_data: this.preferences.marketing ? 'granted' : 'denied',
        ad_personalization: this.preferences.personalization ? 'granted' : 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
      };
      
      (window as any).dataLayer.push(config);
      
      // HIGH VISIBILITY DEBUG for GTM Preview
      console.log('%c[CONSENT→GTM] consent_update PUSHED', 
        'background: #4CAF50; color: white; font-weight: bold; padding: 4px 12px; border-radius: 4px;');
      console.log('[CONSENT→GTM] Payload:', config);
      console.log('[CONSENT→GTM] analytics_storage:', config.analytics_storage);
      console.log('[CONSENT→GTM] ad_storage:', config.ad_storage);
    }
  }
  
  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): ConsentPreferences {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('xtsy_consent_v2') : null;
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Return defaults
      }
    }
    
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
  }
  
  /**
   * Save preferences to localStorage and database
   */
  private async savePreferences(method: 'banner' | 'settings' | 'implied' | 'explicit'): Promise<void> {
    // Save to localStorage
    localStorage.setItem('xtsy_consent_v2', JSON.stringify(this.preferences));
    localStorage.setItem('xtsy_consent_timestamp', new Date().toISOString());
    
    // Save to database for compliance records
    try {
      const record: ConsentRecord = {
        visitor_id: generateVisitorId(),
        session_id: generateSessionId(),
        analytics_storage: this.preferences.analytics,
        ad_storage: this.preferences.marketing,
        ad_user_data: this.preferences.marketing,
        ad_personalization: this.preferences.personalization,
        functionality_storage: true,
        security_storage: true,
        consent_version: this.consentVersion,
        consent_method: method,
        granted_at: new Date().toISOString(),
      };
      
      await supabase
        .from('consent_records')
        .insert(record as any);
        
      console.log('[Consent] Saved to database');
    } catch (err) {
      console.error('[Consent] Database save error:', err);
    }
    
    // Update Google Consent Mode
    this.updateGoogleConsent();
  }
  
  /**
   * Accept all cookies
   */
  async acceptAll(): Promise<void> {
    this.preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    
    await this.savePreferences('explicit');
    this.dispatchConsentEvent('accept_all');
  }
  
  /**
   * Reject all optional cookies (only necessary)
   */
  async rejectAll(): Promise<void> {
    this.preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    
    await this.savePreferences('explicit');
    this.dispatchConsentEvent('reject_all');
  }
  
  /**
   * Accept only analytics (common middle ground)
   */
  async acceptAnalyticsOnly(): Promise<void> {
    this.preferences = {
      necessary: true,
      analytics: true,
      marketing: false,
      personalization: false,
    };
    
    await this.savePreferences('explicit');
    this.dispatchConsentEvent('analytics_only');
  }
  
  /**
   * Set custom preferences
   */
  async setPreferences(prefs: Partial<ConsentPreferences>): Promise<void> {
    this.preferences = {
      necessary: true, // Always true
      analytics: prefs.analytics ?? this.preferences.analytics,
      marketing: prefs.marketing ?? this.preferences.marketing,
      personalization: prefs.personalization ?? this.preferences.personalization,
    };
    
    await this.savePreferences('settings');
    this.dispatchConsentEvent('custom');
  }
  
  /**
   * Revoke all consent
   */
  async revokeConsent(): Promise<void> {
    this.preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    
    // Clear stored data
    localStorage.removeItem('xtsy_consent_v2');
    localStorage.removeItem('xtsy_consent_timestamp');
    
    // Update database
    try {
      await supabase
        .from('consent_records')
        .update({ revoked_at: new Date().toISOString() } as any)
        .eq('visitor_id', generateVisitorId())
        .is('revoked_at', null);
    } catch (err) {
      console.error('[Consent] Revoke error:', err);
    }
    
    this.updateGoogleConsent();
    this.dispatchConsentEvent('revoked');
  }
  
  /**
   * Check if consent banner should be shown
   */
  shouldShowBanner(): boolean {
    const stored = localStorage.getItem('xtsy_consent_v2');
    return !stored;
  }
  
  /**
   * Get current preferences
   */
  getPreferences(): ConsentPreferences {
    return { ...this.preferences };
  }
  
  /**
   * Check if analytics is consented
   */
  hasAnalyticsConsent(): boolean {
    return this.preferences.analytics;
  }
  
  /**
   * Check if marketing is consented
   */
  hasMarketingConsent(): boolean {
    return this.preferences.marketing;
  }
  
  /**
   * Dispatch consent event for other services to listen
   */
  private dispatchConsentEvent(action: string): void {
    window.dispatchEvent(new CustomEvent('consent-update', {
      detail: {
        action,
        preferences: this.preferences,
        timestamp: new Date().toISOString(),
      },
    }));
  }
  
  /**
   * Get consent status for display
   */
  getConsentStatus(): {
    hasConsented: boolean;
    consentedAt: string | null;
    preferences: ConsentPreferences;
  } {
    const canStore = typeof window !== 'undefined';
    const timestamp = canStore ? localStorage.getItem('xtsy_consent_timestamp') : null;
    return {
      hasConsented: canStore ? !!localStorage.getItem('xtsy_consent_v2') : false,
      consentedAt: timestamp,
      preferences: this.preferences,
    };
  }
}

// Export singleton instance — lazily created via Proxy so importing this
// module during SSR never touches localStorage.
export const consentManager: ConsentManagementService = new Proxy(
  {} as ConsentManagementService,
  {
    get(_target, prop: string | symbol) {
      const inst = ConsentManagementService.getInstance();
      const value = inst[prop as keyof ConsentManagementService];
      return typeof value === 'function' ? (value as Function).bind(inst) : value;
    },
  }
);

// Export convenience functions
export const initConsent = () => consentManager.initialize();
export const acceptAllCookies = () => consentManager.acceptAll();
export const rejectAllCookies = () => consentManager.rejectAll();
export const acceptAnalyticsOnly = () => consentManager.acceptAnalyticsOnly();
export const setConsentPreferences = (prefs: Partial<ConsentPreferences>) => consentManager.setPreferences(prefs);
export const revokeConsent = () => consentManager.revokeConsent();
export const shouldShowConsentBanner = () => consentManager.shouldShowBanner();
export const getConsentPreferences = () => consentManager.getPreferences();
export const hasAnalyticsConsent = () => consentManager.hasAnalyticsConsent();
export const hasMarketingConsent = () => consentManager.hasMarketingConsent();
