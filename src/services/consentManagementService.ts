/**
 * Consent Management Service
 * GDPR & India DPDP Act Compliant
 * Google Consent Mode v2 (Advanced) Integration
 */

import { CONSENT_KEY, CONSENT_VERSION, DENIED_PREFERENCES, readConsent } from '@/lib/consent';

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
  private consentVersion: string = CONSENT_VERSION;
  
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
    
    this.preferences = this.loadPreferences();
    this.updateGoogleConsent();
    window.addEventListener('consent-update', (event) => {
      const prefs = (event as CustomEvent).detail?.preferences;
      if (prefs) this.preferences = { ...DENIED_PREFERENCES, ...prefs, necessary: true };
    });
    this.isInitialized = true;
  }
  
  /**
   * Set Google Consent Mode v2 defaults via dataLayer (GTM handles gtag routing)
   * NO direct gtag calls - GTM is the sole routing authority
   */
  private updateGoogleConsent(): void {
    window.__xtsyApplyConsent?.(this.preferences);
  }

  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): ConsentPreferences {
    return readConsent() ?? { ...DENIED_PREFERENCES };
  }

  private async savePreferences(_method: 'banner' | 'settings' | 'implied' | 'explicit'): Promise<void> {
    const timestamp = new Date().toISOString();
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...this.preferences, timestamp, version: CONSENT_VERSION }));
      localStorage.setItem('xtsy_consent_timestamp', timestamp);
    } catch { /* Still apply this visit's choice when storage is unavailable. */ }
    // Apply immediately; rejection never creates a visitor/session identifier.
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
    
    this.updateGoogleConsent();
    this.dispatchConsentEvent('revoked');
  }
  
  /**
   * Check if consent banner should be shown
   */
  shouldShowBanner(): boolean {
    return !readConsent();
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
    const timestamp = localStorage.getItem('xtsy_consent_timestamp');
    return {
      hasConsented: !!localStorage.getItem('xtsy_consent_v2'),
      consentedAt: timestamp,
      preferences: this.preferences,
    };
  }
}

// Export singleton instance — lazily constructed so SSR never touches
// localStorage at module evaluation. On the server every access is a no-op.
const consentSsrNoop = () => undefined;

export const consentManager = new Proxy({} as ConsentManagementService, {
  get(_, prop, receiver) {
    if (typeof window === 'undefined') return consentSsrNoop;
    const instance = ConsentManagementService.getInstance();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});

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
