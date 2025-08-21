import xtsyLogo from "@/assets/xtsy-brand-logo.png";

/**
 * Preloads the XTSY logo to prevent loading delays and visual jumps
 */
export const preloadXTSYLogo = () => {
  // Create a preload link for the logo
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = xtsyLogo;
  link.fetchPriority = 'high';
  
  // Add to document head if not already present
  if (!document.querySelector(`link[href="${xtsyLogo}"]`)) {
    document.head.appendChild(link);
  }

  // Also preload using Image constructor for better browser support
  const img = new Image();
  img.src = xtsyLogo;
  
  return new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Resolve anyway to prevent hanging
  });
};

/**
 * Initialize logo preloading on app startup
 */
export const initializeLogoPreloading = () => {
  // Preload immediately when module loads
  preloadXTSYLogo();
  
  // Also preload when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadXTSYLogo);
  } else {
    preloadXTSYLogo();
  }
};