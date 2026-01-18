/**
 * Security Logging Service - Intrusion Detection & Fraud Prevention
 * Captures device fingerprint, geo-location, and logs unauthorized access attempts
 * LEGAL: This is for fraud prevention under legitimate interest (GDPR Article 6(1)(f))
 */

import { supabase } from '@/integrations/supabase/client';

interface GeoLocation {
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  ip?: string;
  timezone?: string;
}

interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  screenResolution: string;
  timezone: string;
  language: string;
  colorDepth: number;
  touchSupport: boolean;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
}

interface SecurityEvent {
  eventType: 'admin_login_attempt' | 'unauthorized_access' | 'brute_force' | 'suspicious_activity' | 'login_success' | 'login_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  email?: string;
  attemptDetails?: Record<string, any>;
}

// Generate device fingerprint
function generateDeviceFingerprint(): string {
  const components: string[] = [];
  
  // Screen info
  components.push(`${screen.width}x${screen.height}`);
  components.push(`${screen.colorDepth}`);
  
  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  
  // Language
  components.push(navigator.language);
  
  // Platform
  components.push(navigator.platform);
  
  // User agent hash (simplified)
  components.push(navigator.userAgent.length.toString());
  
  // Touch support
  components.push(('ontouchstart' in window).toString());
  
  // Hardware concurrency
  components.push(navigator.hardwareConcurrency?.toString() || '0');
  
  // Device memory (if available)
  components.push((navigator as any).deviceMemory?.toString() || '0');
  
  // Plugins length
  components.push(navigator.plugins?.length?.toString() || '0');
  
  // Create hash
  const fingerprint = components.join('|');
  return btoa(fingerprint).substring(0, 32);
}

// Detect device info
function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;
  
  // Detect browser
  let browser = 'Unknown';
  let browserVersion = '';
  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || '';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browser = 'Chrome';
    browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    browser = 'Safari';
    browserVersion = ua.match(/Version\/(\d+)/)?.[1] || '';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
    browserVersion = ua.match(/Edg\/(\d+)/)?.[1] || '';
  }
  
  // Detect OS
  let os = 'Unknown';
  let osVersion = '';
  if (ua.includes('Windows')) {
    os = 'Windows';
    osVersion = ua.match(/Windows NT (\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Mac OS')) {
    os = 'macOS';
    osVersion = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || '';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  } else if (ua.includes('Android')) {
    os = 'Android';
    osVersion = ua.match(/Android (\d+)/)?.[1] || '';
  } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
    osVersion = ua.match(/OS (\d+[._]\d+)/)?.[1]?.replace('_', '.') || '';
  }
  
  // Detect device type
  let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/Mobi|Android/i.test(ua)) {
    deviceType = /iPad|Tablet/i.test(ua) ? 'tablet' : 'mobile';
  }
  
  return {
    browser,
    browserVersion,
    os,
    osVersion,
    deviceType,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    colorDepth: screen.colorDepth,
    touchSupport: 'ontouchstart' in window,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === '1',
  };
}

// Fetch geo-location from IP
async function getGeoLocation(): Promise<GeoLocation> {
  try {
    // Using multiple free geo-IP services as fallback
    const response = await fetch('https://ipapi.co/json/', { 
      signal: AbortSignal.timeout(5000) 
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name || data.country,
        city: data.city,
        region: data.region,
        latitude: data.latitude,
        longitude: data.longitude,
        ip: data.ip,
        timezone: data.timezone,
      };
    }
  } catch (e) {
    console.warn('[Security] Geo-location fetch failed, trying fallback');
  }
  
  // Fallback to another service
  try {
    const response = await fetch('https://ip-api.com/json/', { 
      signal: AbortSignal.timeout(5000) 
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country,
        city: data.city,
        region: data.regionName,
        latitude: data.lat,
        longitude: data.lon,
        ip: data.query,
        timezone: data.timezone,
      };
    }
  } catch (e) {
    console.warn('[Security] Fallback geo-location also failed');
  }
  
  return { country: 'Unknown', city: 'Unknown' };
}

// Main security logging function
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  console.log('[Security] Logging event:', event.eventType, event.severity);
  
  try {
    const [geoLocation, deviceInfo] = await Promise.all([
      getGeoLocation(),
      Promise.resolve(getDeviceInfo()),
    ]);
    
    const fingerprint = generateDeviceFingerprint();
    
    const logEntry = {
      event_type: event.eventType,
      severity: event.severity,
      email: event.email || null,
      ip_address: geoLocation.ip || null,
      user_agent: navigator.userAgent,
      device_fingerprint: fingerprint,
      geo_location: geoLocation as any,
      device_info: deviceInfo as any,
      attempt_details: (event.attemptDetails || null) as any,
    };
    
    console.log('[Security] Full log entry:', logEntry);
    
    // Insert into security_intrusion_logs (use array format for insert)
    const { error } = await supabase
      .from('security_intrusion_logs')
      .insert([logEntry]);
    
    if (error) {
      console.error('[Security] Failed to log event:', error);
    } else {
      console.log('[Security] Event logged successfully');
    }
    
    // For high/critical events, also store in localStorage for immediate UI notification
    if (event.severity === 'high' || event.severity === 'critical') {
      const pendingAlerts = JSON.parse(localStorage.getItem('xtsy_pending_security_alerts') || '[]');
      pendingAlerts.push({
        id: crypto.randomUUID(),
        ...logEntry,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('xtsy_pending_security_alerts', JSON.stringify(pendingAlerts.slice(-10)));
    }
    
  } catch (error) {
    console.error('[Security] Error logging security event:', error);
  }
}

// Log admin login attempt
export async function logAdminLoginAttempt(email: string, success: boolean, reason?: string): Promise<void> {
  const isAuthorizedAdmin = email.trim().toLowerCase() === 'xtsy.social@gmail.com';
  
  await logSecurityEvent({
    eventType: success ? 'login_success' : (isAuthorizedAdmin ? 'login_failure' : 'unauthorized_access'),
    severity: success ? 'low' : (isAuthorizedAdmin ? 'medium' : 'critical'),
    email,
    attemptDetails: {
      admin_email_attempted: email,
      is_authorized_email: isAuthorizedAdmin,
      login_success: success,
      reason: reason || (success ? 'Successful admin login' : 'Failed login attempt'),
      attempted_at: new Date().toISOString(),
      page: 'admin_login',
    },
  });
}

// Log unauthorized access attempt (someone trying to access admin without being admin)
export async function logUnauthorizedAccess(email: string, attemptedResource: string): Promise<void> {
  await logSecurityEvent({
    eventType: 'unauthorized_access',
    severity: 'critical',
    email,
    attemptDetails: {
      attempted_resource: attemptedResource,
      access_denied_reason: 'Not an authorized admin',
      attempted_at: new Date().toISOString(),
    },
  });
}

// Get unread security alerts for admin
export async function getUnreadSecurityAlerts(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('admin_security_alerts')
      .select('*, security_intrusion_logs:intrusion_log_id(*)')
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('[Security] Error fetching alerts:', error);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.error('[Security] Exception fetching alerts:', e);
    return [];
  }
}

// Mark alert as read
export async function markAlertAsRead(alertId: string): Promise<void> {
  try {
    await supabase
      .from('admin_security_alerts')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', alertId);
  } catch (e) {
    console.error('[Security] Error marking alert as read:', e);
  }
}

// Get recent intrusion logs
export async function getIntrusionLogs(limit = 50): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('security_intrusion_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('[Security] Error fetching intrusion logs:', error);
      return [];
    }
    
    return data || [];
  } catch (e) {
    console.error('[Security] Exception fetching intrusion logs:', e);
    return [];
  }
}

// Export types
export type { SecurityEvent, GeoLocation, DeviceInfo };
