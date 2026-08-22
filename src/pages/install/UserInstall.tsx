/**
 * User App Install Page - PWA install for travelers
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Smartphone, CheckCircle2, Wifi, Bell, MapPin, X, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from '@/lib/router-compat';
import { pushToDataLayer } from '@/utils/dataLayerService';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function UserInstall() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
  
  useEffect(() => {
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isStandalone]);
  
  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }
    
    if (!deferredPrompt) return;
    
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        pushToDataLayer({
          event: 'app_download',
          download_type: 'pwa_install',
          platform: navigator.userAgent.includes('Android') ? 'android' : 
                    navigator.userAgent.includes('iPhone') ? 'ios' : 'desktop',
          app_type: 'user',
          funnel_stage: 'intent',
          component: 'UserInstall',
        });
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };
  
  const features = [
    { icon: Wifi, title: 'Works Offline', description: 'Browse rooms & packages without internet' },
    { icon: Bell, title: 'Booking Updates', description: 'Real-time notifications on your stay' },
    { icon: MapPin, title: 'Quick Access', description: 'One tap to explore & book' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/')} className="p-2 -ml-2">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          <span className="text-sm font-medium text-foreground">Install XTSY</span>
          <div className="w-9" />
        </div>
      </div>
      
      <div className="px-4 py-8 max-w-md mx-auto space-y-8">
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
            <img src="/xtsy-favicon.png" alt="XTSY" className="w-12 h-12" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">XTSY Travel</h1>
            <p className="text-muted-foreground mt-1">Your pocket travel companion</p>
          </div>
          
          {isInstalled ? (
            <div className="flex items-center justify-center gap-2 text-green-500">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">App Installed!</span>
            </div>
          ) : null}
        </motion.div>
        
        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {features.map((feature, i) => (
            <Card key={i} className="p-4 bg-card/50 border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
        
        {/* Install Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {isInstalled ? (
            <Button 
              onClick={() => navigate('/')} 
              className="w-full h-12 text-base bg-primary hover:bg-primary/90"
            >
              Open XTSY App
            </Button>
          ) : (
            <Button 
              onClick={handleInstall}
              disabled={!deferredPrompt && !isIOS}
              className="w-full h-12 text-base bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              {isInstalling ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Installing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  {isIOS ? 'How to Install' : 'Install App'}
                </span>
              )}
            </Button>
          )}
          
          {!isInstalled && !deferredPrompt && !isIOS && (
            <p className="text-xs text-center text-muted-foreground">
              Open in Chrome or Safari to install
            </p>
          )}
        </motion.div>
        
        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-4 border-t border-border/50"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Size: ~2MB</span>
            <span>Free</span>
          </div>
        </motion.div>
      </div>
      
      {/* iOS Instructions Modal */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-end"
            onClick={() => setShowIOSInstructions(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-card rounded-t-3xl p-6 space-y-6"
            >
              <div className="w-12 h-1 bg-muted rounded-full mx-auto" />
              
              <h2 className="text-xl font-bold text-foreground text-center">
                Add to Home Screen
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">Tap the <Share className="inline w-4 h-4 mx-1" /> Share button</p>
                    <p className="text-sm text-muted-foreground mt-1">In Safari's bottom menu</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">Tap <Plus className="inline w-4 h-4 mx-1" /> Add to Home Screen</p>
                    <p className="text-sm text-muted-foreground mt-1">Scroll down to find it</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground">Tap Add to confirm</p>
                    <p className="text-sm text-muted-foreground mt-1">The app will appear on your home screen</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowIOSInstructions(false)}
                className="w-full h-12 bg-primary"
              >
                Got it
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
