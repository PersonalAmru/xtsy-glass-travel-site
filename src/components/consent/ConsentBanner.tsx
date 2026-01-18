/**
 * Consent Banner Component
 * GDPR & India DPDP Act Compliant
 * No dark patterns, clear choices
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cookie, Settings, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  consentManager, 
  shouldShowConsentBanner,
  ConsentPreferences
} from '@/services/consentManagementService';

interface ConsentBannerProps {
  onClose?: () => void;
}

const ConsentBanner: React.FC<ConsentBannerProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  // Default all consent options to enabled - user can explicitly turn off
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: true,
    marketing: true,
    personalization: true,
  });
  
  useEffect(() => {
    // Initialize consent system
    consentManager.initialize();
    
    // Check if banner should be shown
    if (shouldShowConsentBanner()) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleAcceptAll = async () => {
    await consentManager.acceptAll();
    setIsVisible(false);
    onClose?.();
  };
  
  const handleRejectAll = async () => {
    await consentManager.rejectAll();
    setIsVisible(false);
    onClose?.();
  };
  
  const handleSavePreferences = async () => {
    await consentManager.setPreferences(preferences);
    setIsVisible(false);
    onClose?.();
  };
  
  const handleAcceptAnalyticsOnly = async () => {
    await consentManager.acceptAnalyticsOnly();
    setIsVisible(false);
    onClose?.();
  };
  
  if (!isVisible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      >
        <div className="mx-auto max-w-4xl">
          <div className="bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-border/50">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">Privacy & Cookies</h3>
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-500 rounded-full flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      GDPR & DPDP Compliant
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We use cookies to enhance your experience. You're in control - choose what you're comfortable with.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Cookie Categories (Expandable) */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-border/50 overflow-hidden"
                >
                  <div className="p-4 md:p-6 space-y-4">
                    {/* Necessary Cookies */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">Necessary</span>
                          <span className="px-1.5 py-0.5 text-xs bg-muted text-muted-foreground rounded">Always On</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Essential for the website to function. Cannot be disabled.
                        </p>
                      </div>
                      <Switch checked disabled className="data-[state=checked]:bg-primary" />
                    </div>
                    
                    {/* Analytics Cookies */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex-1">
                        <span className="font-medium text-sm">Analytics</span>
                        <p className="text-xs text-muted-foreground mt-1">
                          Help us understand how visitors interact with our website to improve it.
                        </p>
                      </div>
                      <Switch
                        checked={preferences.analytics}
                        onCheckedChange={(checked) => setPreferences(p => ({ ...p, analytics: checked }))}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                    
                    {/* Marketing Cookies */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex-1">
                        <span className="font-medium text-sm">Marketing</span>
                        <p className="text-xs text-muted-foreground mt-1">
                          Used to deliver relevant ads and measure their effectiveness.
                        </p>
                      </div>
                      <Switch
                        checked={preferences.marketing}
                        onCheckedChange={(checked) => setPreferences(p => ({ ...p, marketing: checked }))}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                    
                    {/* Personalization Cookies */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex-1">
                        <span className="font-medium text-sm">Personalization</span>
                        <p className="text-xs text-muted-foreground mt-1">
                          Remember your preferences and provide personalized features.
                        </p>
                      </div>
                      <Switch
                        checked={preferences.personalization}
                        onCheckedChange={(checked) => setPreferences(p => ({ ...p, personalization: checked }))}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Actions */}
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Toggle Details */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>{showDetails ? 'Hide' : 'Customize'}</span>
                  {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                <div className="flex-1" />
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={handleRejectAll}
                    className="px-4 py-2 text-sm"
                  >
                    Reject All
                  </Button>
                  
                  {showDetails ? (
                    <Button
                      onClick={handleSavePreferences}
                      className="px-4 py-2 text-sm bg-primary hover:bg-primary/90"
                    >
                      Save Preferences
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        onClick={handleAcceptAnalyticsOnly}
                        className="px-4 py-2 text-sm"
                      >
                        Analytics Only
                      </Button>
                      <Button
                        onClick={handleAcceptAll}
                        className="px-4 py-2 text-sm bg-primary hover:bg-primary/90"
                      >
                        Accept All
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Links */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50">
                <a
                  href="/privacy-policy"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  Privacy Policy
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-muted-foreground/30">|</span>
                <a
                  href="/terms-of-service"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  Cookie Policy
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConsentBanner;
