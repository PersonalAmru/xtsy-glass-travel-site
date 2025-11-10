export interface PerformanceMetrics {
  endpoint: string;
  duration: number;
  timestamp: Date;
  status: number;
  cacheHit?: boolean;
  error?: string;
}

const metricsBuffer: PerformanceMetrics[] = [];
const BUFFER_SIZE = 100;

export class PerformanceMonitor {
  private startTime: number;
  private endpoint: string;

  constructor(endpoint: string) {
    this.startTime = Date.now();
    this.endpoint = endpoint;
  }

  complete(status: number, options: { cacheHit?: boolean; error?: string } = {}): PerformanceMetrics {
    const duration = Date.now() - this.startTime;
    
    const metrics: PerformanceMetrics = {
      endpoint: this.endpoint,
      duration,
      timestamp: new Date(),
      status,
      ...options,
    };

    // Log to console
    const logData = {
      endpoint: this.endpoint,
      duration_ms: duration,
      status,
      cache_hit: options.cacheHit || false,
      error: options.error,
    };

    if (status >= 400) {
      console.error('Performance metrics:', logData);
    } else {
      console.log('Performance metrics:', logData);
    }

    // Buffer for batch processing
    metricsBuffer.push(metrics);
    if (metricsBuffer.length > BUFFER_SIZE) {
      metricsBuffer.shift();
    }

    return metrics;
  }

  static getMetrics(): PerformanceMetrics[] {
    return [...metricsBuffer];
  }

  static getAverageResponseTime(endpoint?: string): number {
    const relevantMetrics = endpoint
      ? metricsBuffer.filter(m => m.endpoint === endpoint)
      : metricsBuffer;

    if (relevantMetrics.length === 0) return 0;

    const sum = relevantMetrics.reduce((acc, m) => acc + m.duration, 0);
    return Math.round(sum / relevantMetrics.length);
  }

  static getCacheHitRate(endpoint?: string): number {
    const relevantMetrics = endpoint
      ? metricsBuffer.filter(m => m.endpoint === endpoint)
      : metricsBuffer;

    if (relevantMetrics.length === 0) return 0;

    const cacheHits = relevantMetrics.filter(m => m.cacheHit).length;
    return Math.round((cacheHits / relevantMetrics.length) * 100);
  }

  static getErrorRate(endpoint?: string): number {
    const relevantMetrics = endpoint
      ? metricsBuffer.filter(m => m.endpoint === endpoint)
      : metricsBuffer;

    if (relevantMetrics.length === 0) return 0;

    const errors = relevantMetrics.filter(m => m.status >= 400).length;
    return Math.round((errors / relevantMetrics.length) * 100);
  }
}
