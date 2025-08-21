// Image performance monitoring and optimization utilities

interface ImagePerformanceEntry extends PerformanceEntry {
  transferSize?: number;
  decodedBodySize?: number;
  responseEnd?: number;
  responseStart?: number;
}

interface ImageMetrics {
  loadTime: number;
  size: number;
  cached: boolean;
  format: string;
  url: string;
  timestamp: number;
}

class ImagePerformanceMonitor {
  private metrics: ImageMetrics[] = [];
  private observer: PerformanceObserver | null = null;
  private isMonitoring = false;

  start() {
    if (this.isMonitoring || !('PerformanceObserver' in window)) return;

    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        const resource = entry as ImagePerformanceEntry;
        
        // Only track image resources
        if (!resource.name.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?|$)/i)) return;

        const metrics: ImageMetrics = {
          loadTime: resource.responseEnd! - resource.responseStart!,
          size: resource.transferSize || 0,
          cached: resource.transferSize === 0,
          format: this.getImageFormat(resource.name),
          url: resource.name,
          timestamp: Date.now()
        };

        this.metrics.push(metrics);
        this.analyzePerformance(metrics);
      });
    });

    this.observer.observe({ entryTypes: ['resource'] });
    this.isMonitoring = true;
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isMonitoring = false;
  }

  private getImageFormat(url: string): string {
    const match = url.match(/\.([^.?]+)(\?|$)/);
    return match ? match[1].toLowerCase() : 'unknown';
  }

  private analyzePerformance(metrics: ImageMetrics) {
    // Log slow-loading images (> 1 second)
    if (metrics.loadTime > 1000) {
      console.warn('Slow image loading detected:', {
        url: metrics.url,
        loadTime: `${metrics.loadTime.toFixed(0)}ms`,
        size: `${(metrics.size / 1024).toFixed(1)}KB`,
        format: metrics.format
      });
    }

    // Log large images (> 500KB)
    if (metrics.size > 500 * 1024) {
      console.warn('Large image detected:', {
        url: metrics.url,
        size: `${(metrics.size / 1024 / 1024).toFixed(2)}MB`,
        format: metrics.format
      });
    }

    // Suggest WebP for non-WebP images
    if (metrics.format !== 'webp' && metrics.size > 50 * 1024) {
      console.info('Consider WebP format for:', {
        url: metrics.url,
        currentFormat: metrics.format,
        size: `${(metrics.size / 1024).toFixed(1)}KB`
      });
    }
  }

  getMetrics(): ImageMetrics[] {
    return [...this.metrics];
  }

  getAverageLoadTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, metric) => sum + metric.loadTime, 0);
    return total / this.metrics.length;
  }

  getCacheHitRate(): number {
    if (this.metrics.length === 0) return 0;
    const cachedCount = this.metrics.filter(metric => metric.cached).length;
    return (cachedCount / this.metrics.length) * 100;
  }

  getTotalBytesTransferred(): number {
    return this.metrics.reduce((sum, metric) => sum + metric.size, 0);
  }

  getFormatDistribution(): { [format: string]: number } {
    const distribution: { [format: string]: number } = {};
    
    this.metrics.forEach(metric => {
      distribution[metric.format] = (distribution[metric.format] || 0) + 1;
    });

    return distribution;
  }

  generateReport(): string {
    const avgLoadTime = this.getAverageLoadTime();
    const cacheHitRate = this.getCacheHitRate();
    const totalBytes = this.getTotalBytesTransferred();
    const formatDist = this.getFormatDistribution();

    return `
Image Performance Report:
========================
Images Loaded: ${this.metrics.length}
Average Load Time: ${avgLoadTime.toFixed(0)}ms
Cache Hit Rate: ${cacheHitRate.toFixed(1)}%
Total Bytes: ${(totalBytes / 1024 / 1024).toFixed(2)}MB

Format Distribution:
${Object.entries(formatDist)
  .map(([format, count]) => `  ${format}: ${count}`)
  .join('\n')}

Recommendations:
${this.generateRecommendations()}
    `.trim();
  }

  private generateRecommendations(): string {
    const recommendations: string[] = [];
    const avgLoadTime = this.getAverageLoadTime();
    const cacheHitRate = this.getCacheHitRate();
    const formatDist = this.getFormatDistribution();

    if (avgLoadTime > 500) {
      recommendations.push('• Consider image compression and resizing');
    }

    if (cacheHitRate < 50) {
      recommendations.push('• Implement better caching strategies');
    }

    if (!formatDist.webp || formatDist.webp < this.metrics.length * 0.5) {
      recommendations.push('• Consider using WebP format for better compression');
    }

    if (this.metrics.some(m => m.size > 1024 * 1024)) {
      recommendations.push('• Some images are over 1MB - consider optimization');
    }

    return recommendations.length > 0 ? recommendations.join('\n') : '• Performance looks good!';
  }

  clear() {
    this.metrics = [];
  }
}

// Singleton instance
export const imagePerformanceMonitor = new ImagePerformanceMonitor();

// Auto-start monitoring in development
if (import.meta.env.DEV) {
  imagePerformanceMonitor.start();
  
  // Log report every 30 seconds in dev mode
  setInterval(() => {
    if (imagePerformanceMonitor.getMetrics().length > 0) {
      console.group('📊 Image Performance Report');
      console.log(imagePerformanceMonitor.generateReport());
      console.groupEnd();
    }
  }, 30000);
}

// Preload critical images based on current route
export const preloadCriticalImages = (route?: string) => {
  const criticalImages: { [key: string]: string[] } = {
    '/': [
      '/src/assets/xtsy-brand-logo.png',
      '/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png'
    ],
    '/gallery': [
      'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Signature%20270%20Glass%20Suite/Screenshot%202025-08-17%20140811.png'
    ],
    '/travel': [
      '/src/assets/meghalaya-nature-authentic.jpg',
      '/src/assets/kerala-backwaters-authentic.jpg'
    ]
  };

  const imagesToPreload = criticalImages[route || '/'] || criticalImages['/'];
  
  imagesToPreload.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
};

// Initialize image optimizations
export const initializeImageOptimizations = (currentRoute?: string) => {
  // Start performance monitoring
  imagePerformanceMonitor.start();
  
  // Preload critical images for current route
  preloadCriticalImages(currentRoute);
  
  // Setup cleanup on page unload
  window.addEventListener('beforeunload', () => {
    imagePerformanceMonitor.stop();
  });
};