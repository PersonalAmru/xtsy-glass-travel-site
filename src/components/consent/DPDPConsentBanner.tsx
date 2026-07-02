/**
 * DPDP Consent Banner - India DPDP Compliance
 * Cookie consent with granular controls for analytics, marketing, personalization
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Cookie, Shield, ChevronDown, X } from 'lucide-react';

interface ConsentState {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const CONSENT_KEY = 'xtsy_dpdp_consent';
const CONSENT_VERSION = '1.0';

export function DPDPConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    essential: true, // Always required
    analytics: false,
    marketing: false,
    personalization: false,
  });

  useEffect(() => {
    // Check if consent already given
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Delay showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      // Parse and apply stored consent
      try {
        const parsed = JSON.parse(stored);
        setConsent(parsed.consent);
        // Apply consent to analytics
        applyConsent(parsed.consent);
      } catch (e) {
        setIsVisible(true);
      }
    }
  }, []);

  const getVisitorId = (): string => {
    const stored = localStorage.getItem('xtsy_visitor_id');
    if (stored) return stored;
    const id = 'v_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('xtsy_visitor_id', id);
    return id;
  };

  const saveConsent = async (consentData: ConsentState) => {
    const visitorId = getVisitorId();
    
    // Save to localStorage
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      consent: consentData,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
    }));

    // Save to database for compliance via a validated server-side function.
    // Direct client inserts are no longer permitted; the edge function captures
    // the IP server-side and validates consent fields before writing.
    try {
      const consents = Object.entries(consentData)
        .filter(([_, value]) => typeof value === 'boolean')
        .map(([type, granted]) => ({ consent_type: type, granted: granted as boolean }));

      await supabase.functions.invoke('record-consent', {
        body: {
          visitor_id: visitorId,
          consent_version: CONSENT_VERSION,
          consents,
        },
      });
    } catch (error) {
      console.error('Failed to save consent to database:', error);
    }

    applyConsent(consentData);
    setIsVisible(false);
  };

  const applyConsent = (consentData: ConsentState) => {
    // Set global consent flags for analytics
    (window as any).__XTSY_CONSENT = consentData;
    
    // Disable GA if analytics not consented
    if (!consentData.analytics) {
      (window as any)['ga-disable-G-XXXXXXXXXX'] = true;
    }

    // Update traveller profile consent
    if (consentData.analytics || consentData.marketing || consentData.personalization) {
      const visitorId = getVisitorId();
      supabase.from('traveller_profiles').upsert({
        visitor_id: visitorId,
        consent_analytics: consentData.analytics,
        consent_marketing: consentData.marketing,
        consent_personalization: consentData.personalization,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'visitor_id' });
    }
  };

  const handleAcceptAll = () => {
    const fullConsent = {
      essential: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    setConsent(fullConsent);
    saveConsent(fullConsent);
  };

  const handleAcceptSelected = () => {
    saveConsent(consent);
  };

  const handleRejectAll = () => {
    const minimalConsent = {
      essential: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    setConsent(minimalConsent);
    saveConsent(minimalConsent);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className={cn(
              "bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl",
              "overflow-hidden"
            )}>
              {/* Main Banner */}
              <div className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg mb-1">We value your privacy</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We use cookies and similar technologies to enhance your experience, analyze traffic, 
                      and for personalized advertising. By clicking "Accept All", you consent to our use of cookies.
                      <span className="text-primary ml-1 cursor-pointer hover:underline" onClick={() => setShowDetails(!showDetails)}>
                        Manage preferences
                      </span>
                    </p>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <Button onClick={handleAcceptAll} className="gap-2">
                        Accept All
                      </Button>
                      <Button variant="outline" onClick={handleRejectAll}>
                        Reject Non-Essential
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowDetails(!showDetails)}
                        className="gap-1 text-muted-foreground"
                      >
                        Customize
                        <ChevronDown className={cn("w-4 h-4 transition-transform", showDetails && "rotate-180")} />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRejectAll}
                    className="shrink-0 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Detailed Settings */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border/50"
                  >
                    <div className="p-5 md:p-6 space-y-4 bg-muted/30">
                      <h4 className="font-medium text-foreground">Cookie Preferences</h4>
                      
                      {/* Essential */}
                      <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">Essential Cookies</p>
                          <p className="text-sm text-muted-foreground">Required for the website to function. Cannot be disabled.</p>
                        </div>
                        <Switch checked={true} disabled className="opacity-50" />
                      </div>

                      {/* Analytics */}
                      <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">Analytics Cookies</p>
                          <p className="text-sm text-muted-foreground">Help us understand how visitors interact with our website.</p>
                        </div>
                        <Switch
                          checked={consent.analytics}
                          onCheckedChange={(checked) => setConsent(prev => ({ ...prev, analytics: checked }))}
                        />
                      </div>

                      {/* Marketing */}
                      <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">Marketing Cookies</p>
                          <p className="text-sm text-muted-foreground">Used to deliver personalized advertisements.</p>
                        </div>
                        <Switch
                          checked={consent.marketing}
                          onCheckedChange={(checked) => setConsent(prev => ({ ...prev, marketing: checked }))}
                        />
                      </div>

                      {/* Personalization */}
                      <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">Personalization Cookies</p>
                          <p className="text-sm text-muted-foreground">Remember your preferences and customize your experience.</p>
                        </div>
                        <Switch
                          checked={consent.personalization}
                          onCheckedChange={(checked) => setConsent(prev => ({ ...prev, personalization: checked }))}
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={handleRejectAll}>
                          Reject All
                        </Button>
                        <Button onClick={handleAcceptSelected}>
                          Save Preferences
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground text-center pt-2">
                        Compliant with India's Digital Personal Data Protection Act (DPDP) 2023
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DPDPConsentBanner;
