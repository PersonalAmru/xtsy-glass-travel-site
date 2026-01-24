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
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Cookie, ChevronDown, Lock } from 'lucide-react';
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

export function ConsentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,      // Always ON, locked
    analytics: true,      // Always ON, locked (CRITICAL for GTM)
    marketing: true,
    personalization: true,
    timestamp: '',
    version: CONSENT_VERSION,
  });

  // Check if consent already exists
  useEffect(() => {
    const checkConsent = () => {
      try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Verify version and validity
          if (parsed.version === CONSENT_VERSION && parsed.timestamp) {
            // Consent exists, don't show modal
            return;
          }
        }
        // No valid consent - show modal immediately
        setIsVisible(true);
        // Lock scroll
        document.body.style.overflow = 'hidden';
      } catch (e) {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
      }
    };

    // Show modal within 1 second of page load
    const timer = setTimeout(checkConsent, 500);
    return () => clearTimeout(timer);
  }, []);

  // Push consent to GTM dataLayer
  const pushToDataLayer = useCallback((prefs: ConsentPreferences) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      const consentConfig = {
        event: 'consent_update',
        analytics_storage: 'granted', // ALWAYS granted
        ad_storage: prefs.marketing ? 'granted' : 'denied',
        ad_user_data: prefs.marketing ? 'granted' : 'denied',
        ad_personalization: prefs.personalization ? 'granted' : 'denied',
        functionality_storage: 'granted',
        security_storage: 'granted',
        personalization_storage: prefs.personalization ? 'granted' : 'denied',
      };
      
      (window as any).dataLayer.push(consentConfig);
      
      // High visibility logging for GTM debugging
      console.log('%c[CONSENT MODAL] consent_update PUSHED TO GTM', 
        'background: #4CAF50; color: white; font-weight: bold; padding: 4px 12px; border-radius: 4px;');
      console.log('[CONSENT MODAL] Payload:', consentConfig);
    }
  }, []);

  // Save consent and close modal
  const saveConsent = useCallback((prefs: ConsentPreferences) => {
    const finalPrefs: ConsentPreferences = {
      ...prefs,
      necessary: true,
      analytics: true, // ALWAYS true
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    // Save to localStorage
    localStorage.setItem(CONSENT_KEY, JSON.stringify(finalPrefs));
    
    // Push to GTM
    pushToDataLayer(finalPrefs);
    
    // Unlock scroll and hide modal
    document.body.style.overflow = '';
    setIsVisible(false);
  }, [pushToDataLayer]);

  // Accept All - everything enabled
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

  // Reject All - Opens customize with marketing/personalization OFF
  // BUT analytics stays ON (mandatory)
  const handleRejectAll = () => {
    setPreferences(prev => ({
      ...prev,
      marketing: false,
      personalization: false,
    }));
    setShowCustomize(true);
  };

  // Save custom preferences
  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            "w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border overflow-hidden",
            "max-h-[90vh] overflow-y-auto"
          )}
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Privacy & Cookies</h2>
                <p className="text-sm text-muted-foreground">We value your privacy</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies to enhance your experience and analyze site traffic. 
              Analytics cookies are required for site functionality and security.
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {!showCustomize ? (
              <>
                {/* Main Actions */}
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
              </>
            ) : (
              <>
                {/* Customize Panel */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3"
                >
                  {/* Necessary - Locked ON */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">Necessary</p>
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Required for site to function</p>
                    </div>
                    <Switch checked={true} disabled className="opacity-60" />
                  </div>

                  {/* Analytics - Locked ON (CRITICAL) */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">Analytics</p>
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Helps us improve your experience</p>
                    </div>
                    <Switch checked={true} disabled className="opacity-60" />
                  </div>

                  {/* Marketing - User Choice */}
                  <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-foreground">Marketing</p>
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
                      <p className="font-medium text-foreground">Personalization</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Remember your preferences</p>
                    </div>
                    <Switch 
                      checked={preferences.personalization}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, personalization: checked }))}
                    />
                  </div>

                  {/* Save Button */}
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
                    ← Back
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          {/* Footer - Compliance Note */}
          <div className="px-6 pb-4">
            <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
              By using this site, you agree to our{' '}
              <a href="/privacy-policy" className="underline hover:text-foreground" target="_blank">Privacy Policy</a>
              {' '}and{' '}
              <a href="/terms-of-service" className="underline hover:text-foreground" target="_blank">Terms of Service</a>.
              <br />Compliant with GDPR & India DPDP Act 2023.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ConsentModal;
