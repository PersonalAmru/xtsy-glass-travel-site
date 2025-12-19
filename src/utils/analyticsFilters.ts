/**
 * Analytics Filters - Detect and filter out Lovable admin/preview traffic
 * This ensures only real user traffic is tracked in analytics
 */

// Lovable-related URL patterns and domains
const LOVABLE_PATTERNS = {
  urlParams: ['__lovable_token', 'forceHideBadge', '__lovable'],
  domains: ['lovable.dev', 'lovable.app', 'gptengineer.app'],
  previewDomains: ['preview.lovable.app', 'sandbox.lovable.app'],
};

/**
 * Check if current session is a Lovable admin/preview session
 */
export const isLovableSession = (): boolean => {
  // Check sessionStorage first (fastest check)
  const storedFlag = sessionStorage.getItem('xtsy_is_lovable_session');
  if (storedFlag === 'true') {
    return true;
  }

  // Check URL parameters - explicit Lovable admin markers
  const params = new URLSearchParams(window.location.search);
  for (const param of LOVABLE_PATTERNS.urlParams) {
    if (params.has(param)) {
      return true;
    }
  }

  // Check referrer for Lovable domains - only if directly referred
  if (document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      for (const domain of LOVABLE_PATTERNS.domains) {
        if (referrerUrl.hostname.includes(domain)) {
          return true;
        }
      }
    } catch {
      // Invalid referrer URL, ignore
    }
  }

  // REMOVED: Aggressive iframe detection that was blocking real traffic
  // The iframe check was too broad and blocked legitimate production traffic
  // when viewed in Lovable preview. Only explicit markers should block.

  return false;
};

/**
 * Mark the current session as a Lovable session (persists for session duration)
 */
export const markAsLovableSession = (): void => {
  sessionStorage.setItem('xtsy_is_lovable_session', 'true');
};

/**
 * Clean URL by removing internal/admin parameters
 * Returns a clean path suitable for analytics tracking
 */
export const cleanAnalyticsUrl = (url: string): string => {
  try {
    const urlObj = new URL(url, window.location.origin);
    
    // Remove Lovable-specific params
    for (const param of LOVABLE_PATTERNS.urlParams) {
      urlObj.searchParams.delete(param);
    }
    
    // Remove other internal tracking params that shouldn't be in analytics
    urlObj.searchParams.delete('_gl'); // Google cross-domain linker
    urlObj.searchParams.delete('_ga'); // Google Analytics
    
    // Return just the pathname + cleaned search params
    const cleanSearch = urlObj.searchParams.toString();
    return urlObj.pathname + (cleanSearch ? `?${cleanSearch}` : '');
  } catch {
    // If URL parsing fails, do basic string replacement
    let cleaned = url;
    for (const param of LOVABLE_PATTERNS.urlParams) {
      cleaned = cleaned.replace(new RegExp(`[?&]${param}=[^&]*`, 'g'), '');
    }
    return cleaned.replace(/[?&]$/, '').replace(/\?&/, '?');
  }
};

/**
 * Check if a landing page URL indicates Lovable admin traffic
 */
export const isLovableLandingPage = (landingPage: string): boolean => {
  for (const param of LOVABLE_PATTERNS.urlParams) {
    if (landingPage.includes(param)) {
      return true;
    }
  }
  return false;
};

/**
 * Check if a referrer indicates Lovable traffic
 */
export const isLovableReferrer = (referrer: string | null | undefined): boolean => {
  if (!referrer) return false;
  
  for (const domain of LOVABLE_PATTERNS.domains) {
    if (referrer.includes(domain)) {
      return true;
    }
  }
  return false;
};

/**
 * Initialize Lovable session detection on page load
 * Call this early in the app lifecycle
 */
export const initLovableSessionDetection = (): boolean => {
  const isLovable = isLovableSession();
  if (isLovable) {
    markAsLovableSession();
  }
  return isLovable;
};
