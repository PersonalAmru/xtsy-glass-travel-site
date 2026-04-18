/**
 * ConsentModal - GDPR/DPDP Compliant Consent Modal
 * 
 * CRITICAL DESIGN DECISIONS:
 * 1. Analytics is ALWAYS granted (mandatory for business operations)
 * 2. Marketing & Personalization are user-choice
 * 3. Modal blocks ALL interaction until consent is saved
 * 4. No close button - user MUST make a choice
 * 5. "Reject All" opens customize with analytics locked ON
 */

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Cookie, ChevronDown, Lock, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  timestamp: string;
  version: string;
}

const CONSENT_KEY = 'xtsy_consent_v2';
const CONSENT_VERSION = '2.0';
// Consent valid for 365 days (in milliseconds) - returning users within this window skip the modal
const CONSENT_VALIDITY_MS = 365 * 24 * 60 * 60 * 1000;

export function ConsentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: true,
    marketing: true,
    personalization: true,
    timestamp: '',
    version: CONSENT_VERSION,
  });

  useEffect(() => {
    const checkConsent = () => {
      try {
        const stored = localStorage.getItem(CONSENT_KEY);
        console.log('[ConsentModal] Checking stored consent:', stored);
        
        if (stored) {
          const parsed = JSON.parse(stored);
          // Check for valid consent with BOTH version and timestamp
          // Version must match current version AND consent must be within validity period (365 days)
          if (parsed.version === CONSENT_VERSION && parsed.timestamp) {
            const consentAge = Date.now() - new Date(parsed.timestamp).getTime();
            
            // If consent is still valid (within 365 days), skip modal - RETURNING USER
            if (consentAge < CONSENT_VALIDITY_MS) {
              console.log('[ConsentModal] Valid consent found (v' + parsed.version + '), returning user - not showing modal');
              console.log('[ConsentModal] Consent age: ' + Math.round(consentAge / (24 * 60 * 60 * 1000)) + ' days');
              // Ensure body scroll is enabled (in case of stuck state)
              document.body.style.overflow = '';
              
              // Mark as returning user for analytics
              sessionStorage.setItem('xtsy_returning_user', 'true');
              return; // Valid consent exists
            } else {
              console.log('[ConsentModal] Consent expired after 365 days, showing modal for re-consent');
            }
          } else {
            console.log('[ConsentModal] Consent version mismatch or missing timestamp, clearing');
          }
          localStorage.removeItem(CONSENT_KEY);
        }
        // No valid consent - show modal
        console.log('[ConsentModal] No valid consent, showing modal');
        setIsVisible(true);
        setIsReady(true);
        document.body.style.overflow = 'hidden';
      } catch (e) {
        console.log('[ConsentModal] Error parsing consent, clearing and showing modal:', e);
        localStorage.removeItem(CONSENT_KEY);
        setIsVisible(true);
        setIsReady(true);
        document.body.style.overflow = 'hidden';
      }
    };

    // Show modal within 300ms
    const timer = setTimeout(checkConsent, 300);
    return () => {
      clearTimeout(timer);
      // Ensure body scroll is re-enabled on unmount
      document.body.style.overflow = '';
    };
  }, []);

  const pushToDataLayer = useCallback((prefs: ConsentPreferences) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      const consentConfig = {
        event: 'consent_update',
        analytics_storage: 'granted',
        ad_storage: prefs.marketing ? 'granted' : 'denied',
        ad_user_data: prefs.marketing ? 'granted' : 'denied',
        ad_personalization: prefs.personalization ? 'granted' : 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
        personalization_storage: prefs.personalization ? 'granted' : 'denied',
      };
      
      (window as any).dataLayer.push(consentConfig);
      
      console.log('%c[CONSENT MODAL] consent_update PUSHED TO GTM', 
        'background: #4CAF50; color: white; font-weight: bold; padding: 4px 12px; border-radius: 4px;');
      console.log('[CONSENT MODAL] Payload:', consentConfig);
    }
  }, []);

  const saveConsent = useCallback((prefs: ConsentPreferences) => {
    const finalPrefs: ConsentPreferences = {
      ...prefs,
      necessary: true,
      analytics: true,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    localStorage.setItem(CONSENT_KEY, JSON.stringify(finalPrefs));
    pushToDataLayer(finalPrefs);
    document.body.style.overflow = '';
    setIsVisible(false);
  }, [pushToDataLayer]);

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
      timestamp: '',
      version: CONSENT_VERSION,
    });
  };

  const handleRejectAll = () => {
    setPreferences(prev => ({
      ...prev,
      marketing: false,
      personalization: false,
    }));
    setShowCustomize(true);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible || !isReady) return null;

  return (
    <>
      {/* Global style for animation */}
      <style>{`
        @keyframes consentFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .consent-modal-backdrop {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 16px !important;
          z-index: 2147483647 !important;
          background-color: rgba(0, 0, 0, 0.45) !important;
          backdrop-filter: blur(4px) !important;
          -webkit-backdrop-filter: blur(4px) !important;
          animation: consentBackdropFade 0.25s ease-out forwards !important;
        }
        @keyframes consentBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .consent-modal-content {
          width: 100% !important;
          max-width: 420px !important;
          background: linear-gradient(180deg, #2a2a4a 0%, #1e1e38 100%) !important;
          border-radius: 16px !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1) !important;
          overflow: hidden !important;
          max-height: 90vh !important;
          overflow-y: auto !important;
          animation: consentFadeIn 0.3s ease-out forwards !important;
        }
      `}</style>
      
      <div
        className="consent-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
      >
        <div className="consent-modal-content">

        {/* Header */}
        <div className="p-5 pb-4 border-b border-white/10" style={{ backgroundColor: '#1f1f3a' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(236, 72, 153, 0.2)' }}>
              <Shield className="w-6 h-6" style={{ color: '#ec4899' }} />
            </div>
            <div>
              <h2 id="consent-title" className="text-xl font-semibold" style={{ color: '#ffffff' }}>Privacy & Cookies</h2>
              <p className="text-sm" style={{ color: '#9ca3af' }}>We value your privacy</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#d1d5db' }}>
            We use cookies to enhance your experience and analyze site traffic. 
            Analytics cookies are required for site functionality.
          </p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!showCustomize ? (
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleAcceptAll} 
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                <Cookie className="w-5 h-5 mr-2" />
                Accept All
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleRejectAll}
                className="w-full h-11"
              >
                Reject Non-Essential
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => setShowCustomize(true)}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Customize Preferences
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Necessary - Locked ON */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">Necessary</p>
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Required for site to function</p>
                </div>
                <Switch checked={true} disabled className="opacity-60" aria-label="Necessary cookies always enabled" />
              </div>

              {/* Analytics - Locked ON */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">Analytics</p>
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Helps us improve your experience</p>
                </div>
                <Switch checked={true} disabled className="opacity-60" aria-label="Analytics cookies always enabled" />
              </div>

              {/* Marketing - User Choice */}
              <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl">
                <div className="flex-1 pr-4">
                  <p className="font-medium text-foreground text-sm">Marketing</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Personalized advertisements</p>
                </div>
                <Switch 
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, marketing: checked }))}
                />
              </div>

              {/* Personalization - User Choice */}
              <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl">
                <div className="flex-1 pr-4">
                  <p className="font-medium text-foreground text-sm">Personalization</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Remember your preferences</p>
                </div>
                <Switch 
                  checked={preferences.personalization}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, personalization: checked }))}
                />
              </div>

              {/* Actions */}
              <Button 
                onClick={handleSavePreferences} 
                className="w-full h-11 mt-2"
              >
                Save Preferences
              </Button>

              <Button 
                variant="ghost" 
                onClick={() => setShowCustomize(false)}
                className="w-full text-sm text-muted-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </div>
          )}
        </div>

        {/* Footer - Global compliance */}
        <div className="px-5 pb-4">
          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            By using this site, you agree to our{' '}
            <a href="/privacy-policy" className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            {' '}and{' '}
            <a href="/terms-of-service" className="underline hover:text-foreground" target="_blank" rel="noopener noreferrer">Terms of Service</a>.
            <br />Compliant with GDPR (EU), India DPDP Act 2023, CCPA (US), LGPD (Brazil) &amp; POPIA (South Africa).
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default ConsentModal;
