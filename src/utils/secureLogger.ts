/**
 * PII-redacted logging utility for EU/GDPR compliance
 * Automatically removes sensitive data from logs
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVELS = {
  ERROR: 'error' as const,
  WARN: 'warn' as const,
  INFO: 'info' as const,
  DEBUG: 'debug' as const
};

// Patterns for PII detection and redaction
const PII_PATTERNS = [
  // Email addresses
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '[EMAIL_REDACTED]' },
  
  // Phone numbers (various formats)
  { pattern: /\+?[\d\s\-\(\)]{10,15}/g, replacement: '[PHONE_REDACTED]' },
  
  // Credit card numbers
  { pattern: /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g, replacement: '[CARD_REDACTED]' },
  
  // API keys and tokens
  { pattern: /\b[sS][kK]-[a-zA-Z0-9]{48}\b/g, replacement: '[API_KEY_REDACTED]' },
  { pattern: /\brzp_(test|live)_[A-Za-z0-9]{14}\b/g, replacement: '[RAZORPAY_KEY_REDACTED]' },
  { pattern: /\bAIza[0-9A-Za-z\-_]{35}\b/g, replacement: '[GOOGLE_KEY_REDACTED]' },
  
  // JWT tokens
  { pattern: /\beyJ[A-Za-z0-9_\/+-]*\.eyJ[A-Za-z0-9_\/+-]*\.[A-Za-z0-9_\/+-]*/g, replacement: '[JWT_TOKEN_REDACTED]' },
  
  // IP addresses (partial redaction)
  { pattern: /\b(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\b/g, replacement: '$1.$2.XXX.XXX' },
  
  // Common sensitive field names and their values
  { pattern: /"(password|pwd|secret|key|token)":\s*"[^"]*"/gi, replacement: '"$1": "[REDACTED]"' },
  { pattern: /'(password|pwd|secret|key|token)':\s*'[^']*'/gi, replacement: "'$1': '[REDACTED]'" },
  
  // Booking IDs (partial redaction for correlation while hiding full data)
  { pattern: /\bXTSY-\d{8}-(\d{4})\b/g, replacement: 'XTSY-XXXXXXXX-$1' },
];

/**
 * Redacts PII from log messages
 */
function redactPII(message: string): string {
  let redacted = message;
  
  for (const { pattern, replacement } of PII_PATTERNS) {
    redacted = redacted.replace(pattern, replacement);
  }
  
  return redacted;
}

/**
 * Redacts PII from objects (recursive)
 */
function redactPIIFromObject(obj: any, depth = 0): any {
  // Prevent infinite recursion
  if (depth > 10) return '[MAX_DEPTH_REACHED]';
  
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return redactPII(obj);
  }
  
  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => redactPIIFromObject(item, depth + 1));
  }
  
  if (typeof obj === 'object') {
    const redactedObj: any = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Redact sensitive field names entirely
      if (/^(password|pwd|secret|key|token|whatsapp|phone|email|address|emergency_contact)$/i.test(key)) {
        redactedObj[key] = '[REDACTED]';
      } else {
        redactedObj[key] = redactPIIFromObject(value, depth + 1);
      }
    }
    
    return redactedObj;
  }
  
  return obj;
}

/**
 * Enhanced logger with PII redaction and structured logging
 */
export class SecureLogger {
  private isDevelopment = import.meta.env.MODE === 'development';
  private isProduction = import.meta.env.MODE === 'production';
  
  private formatLogEntry(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message: redactPII(message),
      ...(data && { data: redactPIIFromObject(data) }),
      // Add environment context
      environment: import.meta.env.MODE || 'unknown',
      // Add user context if available (but redacted)
      userContext: this.getUserContext()
    };
    
    return logEntry;
  }
  
  private getUserContext() {
    // In browser environment, we might have user context
    if (typeof window !== 'undefined') {
      return {
        userAgent: navigator.userAgent ? '[USER_AGENT_REDACTED]' : undefined,
        url: window.location.pathname, // Safe to log
        timestamp: Date.now()
      };
    }
    return null;
  }
  
  private log(level: LogLevel, message: string, data?: any) {
    const logEntry = this.formatLogEntry(level, message, data);
    
    // In development, use console with colors
    if (this.isDevelopment) {
      const colors = {
        error: '\x1b[31m',
        warn: '\x1b[33m',
        info: '\x1b[36m',
        debug: '\x1b[90m',
        reset: '\x1b[0m'
      };
      
      console[level](
        `${colors[level]}[${logEntry.level}]${colors.reset} ${logEntry.message}`,
        data ? logEntry.data : ''
      );
      return;
    }
    
    // In production, use structured JSON logging
    if (this.isProduction) {
      console.log(JSON.stringify(logEntry));
      return;
    }
    
    // Fallback for other environments
    console[level](`[${logEntry.level}] ${logEntry.message}`, data || '');
  }
  
  error(message: string, data?: any) {
    this.log(LOG_LEVELS.ERROR, message, data);
  }
  
  warn(message: string, data?: any) {
    this.log(LOG_LEVELS.WARN, message, data);
  }
  
  info(message: string, data?: any) {
    this.log(LOG_LEVELS.INFO, message, data);
  }
  
  debug(message: string, data?: any) {
    this.log(LOG_LEVELS.DEBUG, message, data);
  }
  
  /**
   * Log security events with enhanced metadata
   */
  security(event: string, details?: any) {
    this.log(LOG_LEVELS.WARN, `[SECURITY] ${event}`, {
      ...details,
      securityEvent: true,
      timestamp: Date.now()
    });
  }
  
  /**
   * Log GDPR compliance events
   */
  gdpr(action: string, details?: any) {
    this.log(LOG_LEVELS.INFO, `[GDPR] ${action}`, {
      ...details,
      gdprEvent: true,
      timestamp: Date.now()
    });
  }
}

// Export singleton instance
export const logger = new SecureLogger();

// Export for testing
export { redactPII, redactPIIFromObject };