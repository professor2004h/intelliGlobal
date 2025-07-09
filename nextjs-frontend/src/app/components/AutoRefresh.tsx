'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface AutoRefreshProps {
  interval?: number; // Refresh interval in milliseconds
  enabled?: boolean; // Whether auto-refresh is enabled
}

export default function AutoRefresh({
  interval = 30000, // Increased to 30 seconds to reduce network load
  enabled = process.env.NODE_ENV === 'development'
}: AutoRefreshProps) {
  const router = useRouter();
  const lastRefreshRef = useRef<number>(0);
  const isRefreshingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;

    const refreshData = async () => {
      // Prevent multiple simultaneous refresh attempts
      if (isRefreshingRef.current) return;

      const now = Date.now();
      // Throttle requests to prevent excessive API calls
      if (now - lastRefreshRef.current < 15000) return; // Minimum 15 seconds between requests

      isRefreshingRef.current = true;
      lastRefreshRef.current = now;

      try {
        // Use a more efficient approach - just refresh the router without API call
        router.refresh();
      } catch (error) {
        console.warn('Auto-refresh failed:', error);
      } finally {
        isRefreshingRef.current = false;
      }
    };

    // Set up interval for auto-refresh
    const intervalId = setInterval(refreshData, interval);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [interval, enabled, router]);

  // Listen for visibility change to refresh when tab becomes active (with throttling)
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = async () => {
      if (!document.hidden && !isRefreshingRef.current) {
        const now = Date.now();
        // Only refresh if it's been more than 30 seconds since last refresh
        if (now - lastRefreshRef.current > 30000) {
          isRefreshingRef.current = true;
          lastRefreshRef.current = now;

          try {
            router.refresh();
          } catch (error) {
            console.warn('Visibility refresh failed:', error);
          } finally {
            isRefreshingRef.current = false;
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, router]);

  // This component doesn't render anything
  return null;
}
