'use client';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start monitoring Core Web Vitals
  startMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor navigation timing
    this.observeNavigation();
    
    // Monitor paint timing
    this.observePaint();
    
    // Monitor largest contentful paint
    this.observeLCP();
    
    // Monitor first input delay
    this.observeFID();
    
    // Monitor cumulative layout shift
    this.observeCLS();
  }

  private observeNavigation() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('domContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
            this.recordMetric('loadComplete', navEntry.loadEventEnd - navEntry.loadEventStart);
            this.recordMetric('firstPaint', navEntry.responseEnd - navEntry.requestStart);
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Navigation timing not supported:', error);
    }
  }

  private observePaint() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(entry.name, entry.startTime);
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Paint timing not supported:', error);
    }
  }

  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('largest-contentful-paint', entry.startTime);
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('LCP not supported:', error);
    }
  }

  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEventTiming;
          this.recordMetric('first-input-delay', fidEntry.processingStart - fidEntry.startTime);
        }
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID not supported:', error);
    }
  }

  private observeCLS() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            this.recordMetric('cumulative-layout-shift', clsEntry.value);
          }
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('CLS not supported:', error);
    }
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${name}: ${value.toFixed(2)}ms`);
    }
  }

  // Get performance metrics
  getMetrics() {
    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      if (values.length > 0) {
        result[name] = {
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      }
    }
    
    return result;
  }

  // Clean up observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// Utility functions for performance measurement
export function measureAsync<T>(
  name: string,
  asyncFn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  
  return asyncFn().then(
    (result) => {
      const end = performance.now();
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
      }
      return result;
    },
    (error) => {
      const end = performance.now();
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${name} failed: ${(end - start).toFixed(2)}ms`, error);
      }
      throw error;
    }
  );
}

export function measureSync<T>(name: string, syncFn: () => T): T {
  const start = performance.now();
  try {
    const result = syncFn();
    const end = performance.now();
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
    }
    return result;
  } catch (error) {
    const end = performance.now();
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ ${name} failed: ${(end - start).toFixed(2)}ms`, error);
    }
    throw error;
  }
}

// Resource loading optimization
export function preloadResource(href: string, as: string, crossorigin?: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = crossorigin;
  
  document.head.appendChild(link);
}

export function prefetchResource(href: string) {
  if (typeof document === 'undefined') return;
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  
  document.head.appendChild(link);
}

// Image optimization utilities
export function getOptimizedImageUrl(
  baseUrl: string,
  width: number,
  height?: number,
  quality = 80
): string {
  if (!baseUrl) return '';
  
  const params = new URLSearchParams();
  params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());
  params.set('auto', 'format');
  
  return `${baseUrl}?${params.toString()}`;
}

// Bundle size analysis (development only)
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== 'development') return;
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  console.group('📦 Bundle Analysis');
  console.log('Scripts:', scripts.length);
  console.log('Stylesheets:', styles.length);
  
  scripts.forEach((script: any) => {
    console.log(`📄 ${script.src}`);
  });
  
  styles.forEach((style: any) => {
    console.log(`🎨 ${style.href}`);
  });
  
  console.groupEnd();
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  const monitor = PerformanceMonitor.getInstance();
  monitor.startMonitoring();
  
  // Report metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const metrics = monitor.getMetrics();
      console.group('📊 Performance Metrics');
      console.table(metrics);
      console.groupEnd();
      
      if (process.env.NODE_ENV === 'development') {
        analyzeBundleSize();
      }
    }, 1000);
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    monitor.cleanup();
  });
}
