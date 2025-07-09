'use client';

import { useEffect } from 'react';

interface FaviconManagerProps {
  faviconUrl: string | null;
}

export default function FaviconManager({ faviconUrl }: FaviconManagerProps) {
  useEffect(() => {
    // Function to clear all existing favicons
    const clearExistingFavicons = () => {
      const selectors = [
        'link[rel="icon"]',
        'link[rel="shortcut icon"]',
        'link[rel="apple-touch-icon"]',
        'link[rel*="icon"]'
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => element.remove());
      });
    };

    // Clear existing favicons first
    clearExistingFavicons();

    if (faviconUrl) {
      // Add new favicon with cache busting
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const faviconWithCacheBust = `${faviconUrl}?v=${timestamp}&r=${random}`;

      // Create new favicon link with proper MIME type detection
      const link = document.createElement('link');
      link.rel = 'icon';

      // Detect image type from URL
      if (faviconUrl.includes('.png')) {
        link.type = 'image/png';
      } else if (faviconUrl.includes('.svg')) {
        link.type = 'image/svg+xml';
      } else {
        link.type = 'image/x-icon';
      }

      link.href = faviconWithCacheBust;
      document.head.appendChild(link);

      // Also add shortcut icon for IE compatibility
      const shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      shortcutLink.type = link.type;
      shortcutLink.href = faviconWithCacheBust;
      document.head.appendChild(shortcutLink);

      console.warn('Favicon updated:', faviconWithCacheBust);
    } else {
      // Force clear favicon by setting multiple empty data URLs
      const clearMethods = [
        { rel: 'icon', href: 'data:,' },
        { rel: 'shortcut icon', href: 'data:,' },
        { rel: 'icon', href: 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==' }
      ];

      clearMethods.forEach(method => {
        const clearLink = document.createElement('link');
        clearLink.rel = method.rel;
        clearLink.href = method.href;
        document.head.appendChild(clearLink);
      });

      // Force browser to refresh favicon
      setTimeout(() => {
        clearExistingFavicons();
      }, 100);

      console.warn('Favicon cleared - no favicon set in Sanity');
    }
  }, [faviconUrl]);

  // This component doesn't render anything
  return null;
}
