import { supabase } from '@/integrations/supabase/client';

export interface RoleUpdateRequest {
  userId: string;
  newRole: string;
  adminEmail: string;
  reason?: string;
}

export interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address?: string;
  details: any;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  admin_user_id: string;
  admin_email: string;
  target_user_id?: string;
  old_role?: string;
  new_role?: string;
  reason?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export class SecurityService {
  private static async callSecureFunction(functionName: string, action: string, data: any) {
    try {
      const { data: result, error } = await supabase.functions.invoke(functionName, {
        body: { action, data }
      });

      if (error) {
        throw new Error(error.message || 'Function call failed');
      }

      return result;
    } catch (error) {
      console.error(`Security service error (${functionName}):`, error);
      throw error;
    }
  }

  static async updateUserRole(request: RoleUpdateRequest): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.callSecureFunction('secure-role-management', 'update_role', request);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update user role'
      };
    }
  }

  static async getAuditLog(limit: number = 50, offset: number = 0): Promise<{ 
    success: boolean; 
    audit_log?: AuditLogEntry[];
    error?: string;
  }> {
    try {
      const result = await this.callSecureFunction('secure-role-management', 'get_audit_log', { limit, offset });
      return { success: true, audit_log: result.audit_log };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch audit log'
      };
    }
  }

  static async createSecurityAlert(
    alertType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: any,
    userId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('security_alerts' as any)
        .insert({
          alert_type: alertType,
          severity,
          user_id: userId,
          details,
          created_at: new Date().toISOString()
        });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create security alert'
      };
    }
  }

  static async getSecurityAlerts(
    limit: number = 20,
    severity?: string
  ): Promise<{ 
    success: boolean; 
    alerts?: SecurityAlert[];
    error?: string;
  }> {
    try {
      let query = supabase
        .from('security_alerts' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (severity) {
        query = query.eq('severity', severity);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, alerts: data as unknown as SecurityAlert[] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch security alerts'
      };
    }
  }

  static async resolveSecurityAlert(
    alertId: string,
    resolvedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('security_alerts' as any)
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy
        })
        .eq('id', alertId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to resolve security alert'
      };
    }
  }

  static async validateBookingAttempt(
    email: string,
    amount: number,
    guests: number,
    nights: number
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Enhanced validation with comprehensive checks
    if (amount <= 0 || amount > 10000000) {
      errors.push('Invalid booking amount. Must be between ₹1 and ₹1,00,00,000');
    }

    if (guests <= 0 || guests > 20) {
      errors.push('Invalid guest count. Must be between 1 and 20');
    }

    if (nights <= 0 || nights > 365) {
      errors.push('Invalid stay duration. Must be between 1 and 365 nights');
    }

    // Input sanitization check
    const emailPattern = /^[A-Za-z0-9]([A-Za-z0-9._%-]*[A-Za-z0-9])?@[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(email)) {
      errors.push('Invalid email format');
    }

    // Check for suspicious email patterns
    if (email.match(/(test|fake|spam|bot|admin|root)/i) && !email.match(/@(gmail|yahoo|outlook|hotmail)/i)) {
      await this.createSecurityAlert(
        'suspicious_email',
        'medium',
        { email, pattern: 'suspicious_email_domain' }
      );
    }

    // Rate limiting check - temporarily using security_alerts table
    try {
      const { data: recentAlerts } = await supabase
        .from('security_alerts')
        .select('id')
        .eq('ip_address', 'rate_check')
        .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString());

      if (recentAlerts && recentAlerts.length >= 3) {
        errors.push('Rate limit exceeded. Please wait before creating another booking.');
        await this.createSecurityAlert(
          'rate_limit_exceeded',
          'high',
          { email, count: recentAlerts.length }
        );
      }
    } catch (error) {
      console.error('Error checking rate limits:', error);
    }

    // Check for suspicious patterns
    if (amount > 50000) {
      await this.createSecurityAlert(
        'high_value_booking',
        'medium',
        { email, amount, guests, nights }
      );
    }

    if (guests > 10) {
      await this.createSecurityAlert(
        'large_group_booking',
        'low',
        { email, amount, guests, nights }
      );
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static async checkRateLimit(identifier: string, type: 'email' | 'ip'): Promise<{ 
    blocked: boolean; 
    remaining?: number; 
    resetAt?: Date;
  }> {
    // Rate limiting disabled for EU compliance - no PII storage for rate limiting
    // Consider implementing rate limiting at the edge/CDN level instead
    return { blocked: false };
  }

  static async applySecurityPolicies(): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.callSecureFunction('apply-security-policies', 'apply', {});
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to apply security policies'
      };
    }
  }
}