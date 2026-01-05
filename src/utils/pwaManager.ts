/**
 * PWA Manager - Handles manifest switching and install prompts for different app contexts
 * User App: /
 * Franchise App: /franchise
 * Admin App: /admin
 */

type AppType = 'user' | 'franchise' | 'admin';

const MANIFEST_MAP: Record<AppType, string> = {
  user: '/manifest-user.json',
  franchise: '/manifest-franchise.json',
  admin: '/manifest-admin.json',
};

export function getAppType(): AppType {
  const path = window.location.pathname;
  if (path.startsWith('/admin')) return 'admin';
  if (path.startsWith('/franchise')) return 'franchise';
  return 'user';
}

export function getManifestPath(): string {
  return MANIFEST_MAP[getAppType()];
}

export function updateManifestLink(): void {
  const appType = getAppType();
  const manifestPath = MANIFEST_MAP[appType];
  
  // Find or create manifest link
  let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
  
  if (!manifestLink) {
    manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    document.head.appendChild(manifestLink);
  }
  
  // Only update if different
  if (manifestLink.href !== manifestPath) {
    manifestLink.href = manifestPath;
  }
  
  // Update theme color based on app type
  const themeColors: Record<AppType, string> = {
    user: '#f97316',
    franchise: '#3b82f6',
    admin: '#6366f1',
  };
  
  let themeMetaTag = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
  if (!themeMetaTag) {
    themeMetaTag = document.createElement('meta');
    themeMetaTag.name = 'theme-color';
    document.head.appendChild(themeMetaTag);
  }
  themeMetaTag.content = themeColors[appType];
}

// Install prompt storage
let deferredPrompt: BeforeInstallPromptEvent | null = null;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function initPWAInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('pwainstallready'));
  });
}

export async function promptPWAInstall(): Promise<boolean> {
  if (!deferredPrompt) return false;
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  
  return outcome === 'accepted';
}

export function isPWAInstallable(): boolean {
  return deferredPrompt !== null;
}

export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}

// Initialize on load
if (typeof window !== 'undefined') {
  updateManifestLink();
  initPWAInstallPrompt();
  
  // Update manifest on navigation
  window.addEventListener('popstate', updateManifestLink);
}
