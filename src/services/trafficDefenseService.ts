/**
 * Traffic Defense Service
 * 3-Layer Defense System for validating traffic quality
 * Layer 1: Ads Signal (Google Ads click fraud detection)
 * Layer 2: Website Detection (Bot/automation detection)
 * Layer 3: Server-Side Safeguards (Behavioral validation)
 */

import { supabase } from '@/integrations/supabase/client';

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface DefenseCheckResult {
  passed: boolean;
  score: number;
  details: Record<string, unknown>;
}

export interface DefenseLayerResult {
  layerNumber: 1 | 2 | 3;
  layerName: string;
  checks: {
    name: string;
    passed: boolean;
    score: number;
    details?: Record<string, unknown>;
  }[];
  totalScore: number;
  passed: boolean;
}

export interface DefenseReport {
  sessionId: string;
  visitorId: string;
  layers: DefenseLayerResult[];
  overallScore: number;
  classification: SessionClassification;
  timestamp: Date;
}

export type SessionClassification = 
  | 'hot_lead' 
  | 'high_intent' 
  | 'medium_intent' 
  | 'low_intent' 
  | 'junk' 
  | 'bot_detected';

export interface EnterpriseDeviceInfo {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  deviceModel: string;
  deviceVendor: string;
  operatingSystem: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  platform: string;
  language: string;
  languages: string[];
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  pixelRatio: number;
  hardwareConcurrency: number;
  deviceMemory: number;
  touchPoints: number;
  connectionType: string;
  timezoneOffset: number;
}

// =============================================
// DEVICE CAPTURE (Enterprise Level)
// =============================================

export const captureEnterpriseDeviceInfo = (): EnterpriseDeviceInfo => {
  const ua = navigator.userAgent;
  
  // Parse device info from user agent
  const getDeviceModel = (): string => {
    const matches = ua.match(/\(([^)]+)\)/);
    if (matches) {
      const parts = matches[1].split(';');
      if (parts.length > 1) return parts[1].trim();
    }
    return 'Unknown';
  };
  
  const getDeviceVendor = (): string => {
    if (/iPhone|iPad|iPod|Mac/.test(ua)) return 'Apple';
    if (/Samsung/.test(ua)) return 'Samsung';
    if (/Xiaomi|Redmi|POCO/.test(ua)) return 'Xiaomi';
    if (/OnePlus/.test(ua)) return 'OnePlus';
    if (/OPPO/.test(ua)) return 'OPPO';
    if (/vivo/.test(ua)) return 'Vivo';
    if (/Huawei/.test(ua)) return 'Huawei';
    if (/Pixel/.test(ua)) return 'Google';
    if (/Motorola/.test(ua)) return 'Motorola';
    if (/Nokia/.test(ua)) return 'Nokia';
    if (/LG/.test(ua)) return 'LG';
    if (/Sony/.test(ua)) return 'Sony';
    if (/HTC/.test(ua)) return 'HTC';
    if (/Windows/.test(ua)) return 'Microsoft';
    return 'Unknown';
  };
  
  const getOS = (): { name: string; version: string } => {
    const osPatterns: [RegExp, string][] = [
      [/iPhone OS (\d+[._]\d+)/, 'iOS'],
      [/iPad.*OS (\d+[._]\d+)/, 'iPadOS'],
      [/Mac OS X (\d+[._]\d+)/, 'macOS'],
      [/Android (\d+\.?\d*)/, 'Android'],
      [/Windows NT (\d+\.\d+)/, 'Windows'],
      [/Linux/, 'Linux'],
      [/CrOS/, 'Chrome OS'],
    ];
    
    for (const [pattern, name] of osPatterns) {
      const match = ua.match(pattern);
      if (match) {
        return { name, version: match[1]?.replace('_', '.') || 'Unknown' };
      }
    }
    return { name: 'Unknown', version: 'Unknown' };
  };
  
  const getBrowser = (): { name: string; version: string } => {
    const browserPatterns: [RegExp, string][] = [
      [/Edg\/(\d+\.\d+)/, 'Edge'],
      [/Chrome\/(\d+\.\d+)/, 'Chrome'],
      [/Safari\/(\d+\.\d+)/, 'Safari'],
      [/Firefox\/(\d+\.\d+)/, 'Firefox'],
      [/Opera\/(\d+\.\d+)/, 'Opera'],
      [/OPR\/(\d+\.\d+)/, 'Opera'],
    ];
    
    for (const [pattern, name] of browserPatterns) {
      const match = ua.match(pattern);
      if (match) {
        return { name, version: match[1] || 'Unknown' };
      }
    }
    return { name: 'Unknown', version: 'Unknown' };
  };
  
  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const isMobile = /iPhone|iPod|Android.*Mobile|Windows Phone|BlackBerry/.test(ua);
    const isTablet = /iPad|Android(?!.*Mobile)|Tablet/.test(ua);
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  };
  
  const getConnectionType = (): string => {
    const conn = (navigator as any).connection;
    if (conn) {
      return conn.effectiveType || conn.type || 'unknown';
    }
    return 'unknown';
  };
  
  const os = getOS();
  const browser = getBrowser();
  
  return {
    deviceType: getDeviceType(),
    deviceModel: getDeviceModel(),
    deviceVendor: getDeviceVendor(),
    operatingSystem: os.name,
    osVersion: os.version,
    browser: browser.name,
    browserVersion: browser.version,
    platform: navigator.platform || 'Unknown',
    language: navigator.language || 'en',
    languages: Array.from(navigator.languages || ['en']),
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio || 1,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory || 0,
    touchPoints: navigator.maxTouchPoints || 0,
    connectionType: getConnectionType(),
    timezoneOffset: new Date().getTimezoneOffset(),
  };
};

// =============================================
// LAYER 1: ADS SIGNAL CHECKS
// =============================================

const runLayer1Checks = (): DefenseLayerResult => {
  const checks: DefenseLayerResult['checks'] = [];
  
  // Check 1.1: GCLID presence (legitimate Google Ads click)
  const urlParams = new URLSearchParams(window.location.search);
  const hasGclid = urlParams.has('gclid');
  const hasFbclid = urlParams.has('fbclid');
  const hasUtmSource = urlParams.has('utm_source');
  
  checks.push({
    name: 'ads_click_id',
    passed: true, // Presence is informational, not blocking
    score: hasGclid ? 20 : (hasFbclid ? 15 : (hasUtmSource ? 10 : 5)),
    details: { hasGclid, hasFbclid, hasUtmSource },
  });
  
  // Check 1.2: Referrer legitimacy
  const referrer = document.referrer;
  const isLegitReferrer = !referrer || 
    /google\.|bing\.|yahoo\.|facebook\.|instagram\.|twitter\.|linkedin\.|youtube\./.test(referrer) ||
    referrer.includes(window.location.hostname);
  
  checks.push({
    name: 'referrer_legitimacy',
    passed: isLegitReferrer,
    score: isLegitReferrer ? 20 : 5,
    details: { referrer, isLegit: isLegitReferrer },
  });
  
  // Check 1.3: No suspicious URL parameters
  const suspiciousParams = ['__lovable', 'forceHideBadge', 'debug', 'test', 'bot'];
  const hasSuspiciousParams = suspiciousParams.some(p => urlParams.has(p));
  
  checks.push({
    name: 'url_params_clean',
    passed: !hasSuspiciousParams,
    score: hasSuspiciousParams ? 0 : 20,
    details: { hasSuspiciousParams },
  });
  
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const passed = totalScore >= 30;
  
  return {
    layerNumber: 1,
    layerName: 'Ads Signal',
    checks,
    totalScore,
    passed,
  };
};

// =============================================
// LAYER 2: WEBSITE DETECTION (Bot/Automation)
// =============================================

const runLayer2Checks = (): DefenseLayerResult => {
  const checks: DefenseLayerResult['checks'] = [];
  
  // Check 2.1: WebDriver detection
  const hasWebDriver = !!(navigator as any).webdriver;
  checks.push({
    name: 'webdriver_absent',
    passed: !hasWebDriver,
    score: hasWebDriver ? 0 : 15,
    details: { webdriver: hasWebDriver },
  });
  
  // Check 2.2: Plugins present (headless browsers often have none)
  const hasPlugins = navigator.plugins.length > 0;
  const deviceType = captureEnterpriseDeviceInfo().deviceType;
  const pluginCheckApplies = deviceType === 'desktop';
  
  checks.push({
    name: 'plugins_present',
    passed: !pluginCheckApplies || hasPlugins,
    score: (!pluginCheckApplies || hasPlugins) ? 10 : 0,
    details: { pluginCount: navigator.plugins.length, deviceType },
  });
  
  // Check 2.3: Languages array present
  const hasLanguages = navigator.languages && navigator.languages.length > 0;
  checks.push({
    name: 'languages_present',
    passed: hasLanguages,
    score: hasLanguages ? 10 : 0,
    details: { languages: navigator.languages },
  });
  
  // Check 2.4: Reasonable viewport
  const hasViewport = window.innerWidth > 0 && window.innerHeight > 0;
  checks.push({
    name: 'viewport_valid',
    passed: hasViewport,
    score: hasViewport ? 10 : 0,
    details: { width: window.innerWidth, height: window.innerHeight },
  });
  
  // Check 2.5: User agent legitimacy
  const ua = navigator.userAgent;
  const suspiciousUAPatterns = [
    /headless/i, /phantom/i, /selenium/i, /puppeteer/i, /playwright/i,
    /bot/i, /crawler/i, /spider/i, /scraper/i
  ];
  const hasSuspiciousUA = suspiciousUAPatterns.some(p => p.test(ua));
  
  checks.push({
    name: 'user_agent_clean',
    passed: !hasSuspiciousUA,
    score: hasSuspiciousUA ? 0 : 15,
    details: { userAgent: ua.substring(0, 100), suspicious: hasSuspiciousUA },
  });
  
  // Check 2.6: Hardware info present
  const hasHardwareInfo = typeof navigator.hardwareConcurrency !== 'undefined';
  checks.push({
    name: 'hardware_info_present',
    passed: hasHardwareInfo,
    score: hasHardwareInfo ? 10 : 0,
    details: { hardwareConcurrency: navigator.hardwareConcurrency },
  });
  
  // Check 2.7: Touch capability matches device
  const hasTouchCapability = navigator.maxTouchPoints > 0;
  const isMobileDevice = deviceType !== 'desktop';
  const touchMatchesDevice = (isMobileDevice && hasTouchCapability) || (!isMobileDevice);
  
  checks.push({
    name: 'touch_capability_consistent',
    passed: touchMatchesDevice,
    score: touchMatchesDevice ? 10 : 5,
    details: { touchPoints: navigator.maxTouchPoints, deviceType },
  });
  
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const passed = totalScore >= 50;
  
  return {
    layerNumber: 2,
    layerName: 'Website Detection',
    checks,
    totalScore,
    passed,
  };
};

// =============================================
// LAYER 3: SERVER-SIDE SAFEGUARDS (Behavioral)
// =============================================

export const runLayer3Checks = (
  sessionDurationSeconds: number,
  scrollDepth: number,
  interactionCount: number,
  pageViews: number
): DefenseLayerResult => {
  const checks: DefenseLayerResult['checks'] = [];
  
  // Check 3.1: 15-second active scroll threshold (CRITICAL)
  const meetsScrollThreshold = sessionDurationSeconds >= 15;
  checks.push({
    name: '15s_scroll_threshold',
    passed: meetsScrollThreshold,
    score: meetsScrollThreshold ? 25 : 0,
    details: { durationSeconds: sessionDurationSeconds, threshold: 15 },
  });
  
  // Check 3.2: Meaningful scroll depth (≥50%)
  const hasMeaningfulScroll = scrollDepth >= 50;
  checks.push({
    name: 'scroll_depth_50',
    passed: hasMeaningfulScroll,
    score: hasMeaningfulScroll ? 20 : Math.round(scrollDepth / 5),
    details: { scrollDepth, threshold: 50 },
  });
  
  // Check 3.3: User interactions present
  const hasInteractions = interactionCount >= 2;
  checks.push({
    name: 'interactions_present',
    passed: hasInteractions,
    score: hasInteractions ? 15 : Math.min(10, interactionCount * 5),
    details: { interactionCount, threshold: 2 },
  });
  
  // Check 3.4: Multiple page views (engagement)
  const hasMultiplePages = pageViews >= 2;
  checks.push({
    name: 'multiple_pages',
    passed: hasMultiplePages,
    score: hasMultiplePages ? 10 : 0,
    details: { pageViews, threshold: 2 },
  });
  
  // Check 3.5: Not a bounce
  const notBounce = sessionDurationSeconds >= 30 || pageViews >= 2;
  checks.push({
    name: 'not_bounce',
    passed: notBounce,
    score: notBounce ? 10 : 0,
    details: { isBounce: !notBounce },
  });
  
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const passed = totalScore >= 40;
  
  return {
    layerNumber: 3,
    layerName: 'Server-Side Safeguards',
    checks,
    totalScore,
    passed,
  };
};

// =============================================
// MAIN DEFENSE ENGINE
// =============================================

export class TrafficDefenseEngine {
  private sessionId: string;
  private visitorId: string;
  private layer1Result: DefenseLayerResult | null = null;
  private layer2Result: DefenseLayerResult | null = null;
  private layer3Result: DefenseLayerResult | null = null;
  private activeScrollStart: number = 0;
  private totalActiveScrollSeconds: number = 0;
  private isScrolling: boolean = false;
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  
  constructor(sessionId: string, visitorId: string) {
    this.sessionId = sessionId;
    this.visitorId = visitorId;
    this.setupActiveScrollTracking();
  }
  
  /**
   * Track active scroll time (user must be actively scrolling)
   */
  private setupActiveScrollTracking(): void {
    window.addEventListener('scroll', () => {
      if (!this.isScrolling) {
        this.isScrolling = true;
        this.activeScrollStart = Date.now();
      }
      
      // Reset the timeout on each scroll
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      
      // After 2 seconds of no scrolling, stop counting
      this.scrollTimeout = setTimeout(() => {
        if (this.isScrolling) {
          this.isScrolling = false;
          const scrollDuration = (Date.now() - this.activeScrollStart) / 1000;
          this.totalActiveScrollSeconds += scrollDuration;
        }
      }, 2000);
    }, { passive: true });
  }
  
  /**
   * Get total active scroll seconds
   */
  getActiveScrollSeconds(): number {
    // If currently scrolling, include current duration
    if (this.isScrolling) {
      const currentDuration = (Date.now() - this.activeScrollStart) / 1000;
      return this.totalActiveScrollSeconds + currentDuration;
    }
    return this.totalActiveScrollSeconds;
  }
  
  /**
   * Check if 15-second threshold is met
   */
  meetsScrollThreshold(): boolean {
    return this.getActiveScrollSeconds() >= 15;
  }
  
  /**
   * Run Layer 1 & 2 checks (immediate)
   */
  runInitialChecks(): { layer1: DefenseLayerResult; layer2: DefenseLayerResult } {
    this.layer1Result = runLayer1Checks();
    this.layer2Result = runLayer2Checks();
    
    // Log to defense audit trail
    this.logDefenseChecks(this.layer1Result);
    this.logDefenseChecks(this.layer2Result);
    
    return {
      layer1: this.layer1Result,
      layer2: this.layer2Result,
    };
  }
  
  /**
   * Run Layer 3 checks (behavioral - requires session data)
   */
  runBehavioralChecks(
    sessionDurationSeconds: number,
    scrollDepth: number,
    interactionCount: number,
    pageViews: number
  ): DefenseLayerResult {
    this.layer3Result = runLayer3Checks(
      sessionDurationSeconds,
      scrollDepth,
      interactionCount,
      pageViews
    );
    
    this.logDefenseChecks(this.layer3Result);
    return this.layer3Result;
  }
  
  /**
   * Get full defense report
   */
  getDefenseReport(
    sessionDurationSeconds: number,
    scrollDepth: number,
    interactionCount: number,
    pageViews: number
  ): DefenseReport {
    // Ensure all layers are run
    if (!this.layer1Result || !this.layer2Result) {
      this.runInitialChecks();
    }
    
    this.runBehavioralChecks(
      sessionDurationSeconds,
      scrollDepth,
      interactionCount,
      pageViews
    );
    
    const layers = [this.layer1Result!, this.layer2Result!, this.layer3Result!];
    const overallScore = Math.round(
      layers.reduce((sum, l) => sum + l.totalScore, 0) / 3
    );
    
    // Classify session
    const classification = this.classifySession(
      overallScore,
      this.layer2Result!.totalScore < 40, // Likely bot
      this.computeIntentScore(sessionDurationSeconds, scrollDepth, pageViews)
    );
    
    return {
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      layers,
      overallScore,
      classification,
      timestamp: new Date(),
    };
  }
  
  /**
   * Classify session based on defense scores
   */
  private classifySession(
    defenseScore: number,
    isLikelyBot: boolean,
    intentScore: number
  ): SessionClassification {
    if (isLikelyBot || defenseScore < 20) {
      return 'bot_detected';
    }
    
    if (defenseScore < 35) {
      return 'junk';
    }
    
    if (!this.meetsScrollThreshold()) {
      return 'low_intent';
    }
    
    if (intentScore >= 80 && defenseScore >= 70) {
      return 'hot_lead';
    }
    
    if (intentScore >= 60 && defenseScore >= 50) {
      return 'high_intent';
    }
    
    if (intentScore >= 40) {
      return 'medium_intent';
    }
    
    return 'low_intent';
  }
  
  /**
   * Compute intent score
   */
  private computeIntentScore(
    sessionDurationSeconds: number,
    scrollDepth: number,
    pageViews: number
  ): number {
    let score = 0;
    
    // Duration score (0-30)
    score += Math.min(30, sessionDurationSeconds / 6);
    
    // Scroll depth score (0-30)
    score += Math.min(30, scrollDepth * 0.3);
    
    // Page views score (0-20)
    score += Math.min(20, (pageViews - 1) * 5);
    
    // Active scroll bonus (0-20)
    if (this.meetsScrollThreshold()) {
      score += 20;
    }
    
    return Math.round(Math.min(100, score));
  }
  
  /**
   * Log defense checks to audit trail
   */
  private async logDefenseChecks(layer: DefenseLayerResult): Promise<void> {
    try {
      const logs = layer.checks.map(check => ({
        session_id: this.sessionId,
        visitor_id: this.visitorId,
        layer_number: layer.layerNumber,
        layer_name: layer.layerName,
        check_name: check.name,
        check_passed: check.passed,
        check_score: check.score,
        check_details: check.details || {},
      }));
      
      await supabase
        .from('traffic_defense_logs')
        .insert(logs as any);
    } catch (err) {
      console.error('[Defense] Log error:', err);
    }
  }
  
  /**
   * Validate WhatsApp engagement
   */
  async validateWhatsAppEngagement(): Promise<{
    validated: boolean;
    reason: string;
  }> {
    const activeScrollSeconds = this.getActiveScrollSeconds();
    
    if (activeScrollSeconds < 15) {
      return {
        validated: false,
        reason: `Active scroll time (${Math.round(activeScrollSeconds)}s) below 15s threshold`,
      };
    }
    
    if (!this.layer1Result || !this.layer2Result) {
      this.runInitialChecks();
    }
    
    const defenseScore = ((this.layer1Result?.totalScore || 0) + (this.layer2Result?.totalScore || 0)) / 2;
    
    if (defenseScore < 40) {
      return {
        validated: false,
        reason: `Defense score (${Math.round(defenseScore)}) below threshold`,
      };
    }
    
    return {
      validated: true,
      reason: 'All validation checks passed',
    };
  }
  
  /**
   * Validate Call engagement
   */
  async validateCallEngagement(callDurationSeconds?: number): Promise<{
    validated: boolean;
    reason: string;
  }> {
    const whatsAppValidation = await this.validateWhatsAppEngagement();
    
    if (!whatsAppValidation.validated) {
      return whatsAppValidation;
    }
    
    if (callDurationSeconds !== undefined && callDurationSeconds < 10) {
      return {
        validated: false,
        reason: `Call duration (${callDurationSeconds}s) below 10s threshold`,
      };
    }
    
    return {
      validated: true,
      reason: 'All validation checks passed',
    };
  }
}

// Export singleton factory
let defenseEngineInstance: TrafficDefenseEngine | null = null;

export const getDefenseEngine = (sessionId: string, visitorId: string): TrafficDefenseEngine => {
  if (!defenseEngineInstance || 
      (defenseEngineInstance as any).sessionId !== sessionId) {
    defenseEngineInstance = new TrafficDefenseEngine(sessionId, visitorId);
  }
  return defenseEngineInstance;
};
