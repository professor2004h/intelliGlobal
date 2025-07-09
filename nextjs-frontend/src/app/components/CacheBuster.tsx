'use client';

import { useEffect } from 'react';

export default function CacheBuster() {
  useEffect(() => {
    // Add cache-busting meta tags
    const addCacheBustingMeta = () => {
      // Remove existing cache-busting meta tags
      const existingMeta = document.querySelectorAll('meta[name="cache-control"], meta[http-equiv="cache-control"], meta[http-equiv="pragma"], meta[http-equiv="expires"]');
      existingMeta.forEach(meta => meta.remove());

      // Add new cache-busting meta tags
      const metaTags = [
        { httpEquiv: 'cache-control', content: 'no-cache, no-store, must-revalidate' },
        { httpEquiv: 'pragma', content: 'no-cache' },
        { httpEquiv: 'expires', content: '0' },
        { name: 'cache-control', content: 'no-cache' }
      ];

      metaTags.forEach(tagData => {
        const meta = document.createElement('meta');
        if (tagData.httpEquiv) {
          meta.httpEquiv = tagData.httpEquiv;
        }
        if (tagData.name) {
          meta.name = tagData.name;
        }
        meta.content = tagData.content;
        document.head.appendChild(meta);
      });
    };

    // Force favicon cache clearing
    const forceFaviconRefresh = () => {
      // Get current favicon
      const currentFavicon = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
      
      if (currentFavicon) {
        const originalHref = currentFavicon.href;
        
        // Temporarily change to empty data URL
        currentFavicon.href = 'data:,';
        
        // After a brief delay, restore with cache-busting parameter
        setTimeout(() => {
          const timestamp = Date.now();
          // Use crypto.getRandomValues for better randomness and avoid hydration issues
          const randomArray = new Uint32Array(1);
          crypto.getRandomValues(randomArray);
          const random = randomArray[0].toString(36);

          // Remove existing cache-busting parameters
          const cleanUrl = originalHref.split('?')[0];
          currentFavicon.href = `${cleanUrl}?v=${timestamp}&r=${random}`;
        }, 50);
      }
    };

    // Apply cache busting
    addCacheBustingMeta();
    
    // Force favicon refresh on component mount
    setTimeout(forceFaviconRefresh, 100);

    // Listen for page visibility changes to refresh favicon
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(forceFaviconRefresh, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
