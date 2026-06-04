/**
 * PII-Redacted Logger for GDPR Compliance
 * Automatically detects and redacts sensitive information from logs
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'security' | 'gdpr';

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  security: 2,
  gdpr: 1
} as const;

// PII detection patterns
const PII_PATTERNS = [
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '[EMAIL_REDACTED]' },
  { pattern: /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g, replacement: '[PHONE_REDACTED]' },
  { pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g, replacement: '[CARD_REDACTED]' },
  { pattern: /\b(?:sk-|pk_live_|pk_test_)[a-zA-Z0-9]{20,50}\b/g, replacement: '[API_KEY_REDACTED]' },
  { pattern: /\beyJ[A-Za-z0-9_/+-]*\.eyJ[A-Za-z0-9_/+-]*\.[A-Za-z0-9_/+-]*\b/g, replacement: '[JWT_REDACTED]' },
  { pattern: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g, replacement: '[IP_REDACTED]' },
  { pattern: /\b[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\b/g, replacement: '[UUID_REDACTED]' },
  { pattern: /\b(?:password|token|secret|key)\s*[:=]\s*["\']?[^\s"']{8,}["\']?/gi, replacement: '[CREDENTIAL_REDACTED]' }
];

function redactPII(message: string): string {
  let redactedMessage = message;
  
  PII_PATTERNS.forEach(({ pattern, replacement }) => {
    redactedMessage = redactedMessage.replace(pattern, replacement);
  });
  
  return redactedMessage;
}

function redactPIIFromObject(obj: any, depth = 0): any {
  if (depth > 10) return '[MAX_DEPTH_REACHED]'; // Prevent infinite recursion
  
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
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Redact sensitive field names
        if (/password|token|secret|key|email|phone|ssn|address/i.test(key)) {
          redactedObj[key] = '[SENSITIVE_FIELD_REDACTED]';
        } else {
          redactedObj[key] = redactPIIFromObject(obj[key], depth + 1);
        }
      }
    }
    return redactedObj;
  }
  
  return obj;
}

class ProductionLogger {
  private currentLevel: LogLevel = 'info';
  
  constructor() {
    // Set log level based on environment
    if (import.meta.env?.DEV) {
      this.currentLevel = 'debug';
    }
  }

  private formatLogEntry(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const redactedMessage = redactPII(message);
    const redactedData = data ? redactPIIFromObject(data) : undefined;
    
    return {
      timestamp,
      level: level.toUpperCase(),
      message: redactedMessage,
      data: redactedData,
      environment: typeof process !== 'undefined' ? process.env?.NODE_ENV || 'unknown' : 'browser'
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] <= LOG_LEVELS[this.currentLevel];
  }

  private log(level: LogLevel, message: string, data?: any) {
    if (!this.shouldLog(level)) return;
    
    const logEntry = this.formatLogEntry(level, message, data);
    
    // In development, use colored console output
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      const colors = {
        error: '\x1b[31m',
        warn: '\x1b[33m', 
        info: '\x1b[36m',
        debug: '\x1b[90m',
        security: '\x1b[35m',
        gdpr: '\x1b[32m'
      };
      const reset = '\x1b[0m';
      console.log(`${colors[level]}[${logEntry.level}] ${logEntry.timestamp}${reset} ${logEntry.message}`, logEntry.data || '');
    } else {
      // In production, use JSON format for structured logging
      console.log(JSON.stringify(logEntry));
    }
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  security(event: string, details?: any) {
    this.log('security', `SECURITY EVENT: ${event}`, details);
  }

  gdpr(action: string, details?: any) {
    this.log('gdpr', `GDPR ACTION: ${action}`, details);
  }
}

// Export singleton instance
export const logger = new ProductionLogger();

// Export utilities for testing
export { redactPII, redactPIIFromObject };