/**
 * Franchise App Install Page - PWA install for property owners
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Building2, CheckCircle2, Calendar, DollarSign, ClipboardList, X, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from '@/lib/router-compat';
import { pushToDataLayer } from '@/utils/dataLayerService';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function FranchiseInstall() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  useEffect(() => {
    // Update manifest for franchise app
    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (manifestLink) {
      manifestLink.href = '/manifest-franchise.json';
    }
    
    const themeColor = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (themeColor) {
      themeColor.content = '#3b82f6';
    }
    
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
          app_type: 'franchise',
          funnel_stage: 'intent',
          component: 'FranchiseInstall',
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
    { icon: Calendar, title: 'Booking Calendar', description: 'View & manage all reservations' },
    { icon: ClipboardList, title: 'Inventory Control', description: 'Update room availability instantly' },
    { icon: DollarSign, title: 'Payout Tracking', description: 'Monitor your earnings & settlements' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-blue-950/20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/franchise')} className="p-2 -ml-2">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
          <span className="text-sm font-medium text-white">Install Franchise App</span>
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
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-white">XTSY Ops</h1>
            <p className="text-zinc-400 mt-1">Property Management Portal</p>
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
            <Card key={i} className="p-4 bg-zinc-900/50 border-zinc-800">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{feature.title}</h3>
                  <p className="text-sm text-zinc-500 mt-0.5">{feature.description}</p>
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
              onClick={() => navigate('/franchise')} 
              className="w-full h-12 text-base bg-blue-500 hover:bg-blue-600"
            >
              Open Franchise App
            </Button>
          ) : (
            <Button 
              onClick={handleInstall}
              disabled={!deferredPrompt && !isIOS}
              className="w-full h-12 text-base bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
            >
              {isInstalling ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Installing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  {isIOS ? 'How to Install' : 'Install Franchise App'}
                </span>
              )}
            </Button>
          )}
          
          {!isInstalled && !deferredPrompt && !isIOS && (
            <p className="text-xs text-center text-zinc-500">
              Open in Chrome or Safari to install
            </p>
          )}
        </motion.div>
        
        {/* Access Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-200 font-medium">Property Owner Access</p>
              <p className="text-xs text-blue-300/70 mt-1">
                Features are based on permissions granted by the super admin. Contact support for access changes.
              </p>
            </div>
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
              className="w-full bg-zinc-900 rounded-t-3xl p-6 space-y-6"
            >
              <div className="w-12 h-1 bg-zinc-700 rounded-full mx-auto" />
              
              <h2 className="text-xl font-bold text-white text-center">
                Add to Home Screen
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-400">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white">Tap the <Share className="inline w-4 h-4 mx-1" /> Share button</p>
                    <p className="text-sm text-zinc-500 mt-1">In Safari's bottom menu</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-400">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white">Tap <Plus className="inline w-4 h-4 mx-1" /> Add to Home Screen</p>
                    <p className="text-sm text-zinc-500 mt-1">Scroll down to find it</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-blue-400">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white">Tap Add to confirm</p>
                    <p className="text-sm text-zinc-500 mt-1">The app will appear on your home screen</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowIOSInstructions(false)}
                className="w-full h-12 bg-blue-500"
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
