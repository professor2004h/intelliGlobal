'use client';

import { useEffect } from 'react';

interface PerformanceMonitorProps {
  enabled?: boolean;
}

export default function PerformanceMonitor({ enabled = false }: PerformanceMonitorProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          console.warn('🚀 Navigation Performance:', {
            domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            firstPaint: navEntry.responseEnd - navEntry.requestStart,
          });
        }

        if (entry.entryType === 'paint') {
          console.warn(`🎨 ${entry.name}:`, entry.startTime);
        }

        if (entry.entryType === 'largest-contentful-paint') {
          console.warn('📏 Largest Contentful Paint:', entry.startTime);
        }

        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          console.warn('👆 First Input Delay:', fidEntry.processingStart - fidEntry.startTime);
        }

        if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            console.warn('📐 Cumulative Layout Shift:', clsEntry.value);
          }
        }
      }
    });

    // Observe different performance metrics
    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      console.warn('Performance monitoring not fully supported:', error);
    }

    // Monitor memory usage if available
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.warn('💾 Memory Usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
        });
      }
    };

    // Check memory every 30 seconds
    const memoryInterval = setInterval(checkMemory, 30000);
    checkMemory(); // Initial check

    return () => {
      observer.disconnect();
      clearInterval(memoryInterval);
    };
  }, [enabled]);

  // This component doesn't render anything
  return null;
}
