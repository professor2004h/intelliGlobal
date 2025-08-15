'use client';

import React, { useEffect, useRef, useState } from 'react';
// NOTE: Do NOT import 'leaflet' or its CSS at the module level because it accesses `window`.
// We'll dynamically import both inside useEffect to avoid SSR "window is not defined" errors.

interface MapLocation {
  _id: string;
  title: string;
  category?: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  isActive: boolean;
  priority?: number;
  markerColor?: string;
}

interface LeafletMapProps {
  locations: MapLocation[];
  getMarkerColor: (color?: string) => string;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ locations, getMarkerColor }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null);

  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState('');

  useEffect(() => {
    let L: any;
    let wheelListener: ((e: WheelEvent) => void) | null = null;
    let touchStartListener: ((ev: TouchEvent) => void) | null = null;
    let isTouchDevice = false;
    let hintTimeout: any = null;

    const init = async () => {
      // Only run on client side
      if (typeof window === 'undefined' || !mapRef.current || locations.length === 0) return;

      // Avoid double-initialization in React Strict Mode / hot reloads
      if (mapInstanceRef.current) {
        return; // Map already initialized
      }
      // Some Leaflet versions tag the DOM node; clear that tag if present
      if ((mapRef.current as any)?._leaflet_id) {
        try { (mapRef.current as any)._leaflet_id = undefined; } catch {}
      }

      // Dynamically import leaflet on the client
      const leaflet = await import('leaflet');
      L = leaflet.default || leaflet;

      // Inject Leaflet CSS via CDN (avoids Next/TS CSS module issues)
      const leafletCssId = 'leaflet-css-cdn';
      if (!document.getElementById(leafletCssId)) {
        const link = document.createElement('link');
        link.id = leafletCssId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Fix for default markers in Leaflet with Next.js (after import)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Initialize map (ensure container not already initialized)
      if ((mapRef.current as any)?._leaflet_id) {
        try { (mapRef.current as any)._leaflet_id = undefined; } catch {}
        try { mapRef.current.innerHTML = ''; } catch {}
      }

      // Detect device capabilities
      isTouchDevice = ('ontouchstart' in window) || ((navigator as any).maxTouchPoints ? ((navigator as any).maxTouchPoints > 0) : false);

      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false, // disable by default; we'll implement ctrl+wheel ourselves on desktop
        doubleClickZoom: true,
        touchZoom: true, // allow pinch on touch devices
        dragging: !isTouchDevice, // disable single-finger drag on touch to allow page scroll
        tap: false,
      });

      // Apply per-device interaction tweaks
      if (isTouchDevice) {
        map.dragging.disable(); // ensure single-finger scroll goes to page
        map.touchZoom.enable(); // ensure two-finger pinch works
      } else {
        map.scrollWheelZoom.disable(); // keep disabled; we handle ctrl+wheel
      }

      mapInstanceRef.current = map;

      // Show initial hint overlay for 5s
      setHintText(isTouchDevice ? 'Use two fingers to zoom' : 'Ctrl + scroll to zoom');
      setShowHint(true);
      hintTimeout = setTimeout(() => setShowHint(false), 5000);

      // Desktop: implement Ctrl + wheel zoom without page-scroll conflicts
      if (!isTouchDevice && mapRef.current) {
        const container = mapRef.current;
        wheelListener = (e: WheelEvent) => {
          if (!mapInstanceRef.current) return;
          // Only handle when map is fully initialized and panes exist and container is in DOM
          // @ts-expect-error private props on Leaflet Map for safety checks
          if (!map._loaded || !map._panes || !map._panes.mapPane || !document.body.contains(container)) return;

          if (e.ctrlKey) {
            // zoom the map and prevent page scroll
            e.preventDefault();
            const stepIn = e.deltaY < 0;
            if (stepIn) {
              map.zoomIn(1, { animate: true });
            } else {
              map.zoomOut(1, { animate: true });
            }
          } else {
            // show hint briefly but allow normal page scroll
            setHintText('Ctrl + scroll to zoom');
            setShowHint(true);
            if (hintTimeout) clearTimeout(hintTimeout);
            hintTimeout = setTimeout(() => setShowHint(false), 3000);
          }
        };
        container.addEventListener('wheel', wheelListener, { passive: false });
      }

      // Mobile: show hint when user touches with one finger on the map
      if (isTouchDevice && mapRef.current) {
        touchStartListener = (ev: TouchEvent) => {
          if (ev.touches && ev.touches.length === 1) {
            setHintText('Use two fingers to zoom');
            setShowHint(true);
            if (hintTimeout) clearTimeout(hintTimeout);
            hintTimeout = setTimeout(() => setShowHint(false), 3000);
          }
        };
        mapRef.current.addEventListener('touchstart', touchStartListener as EventListener, { passive: true });
      }

      // Add CartoDB Positron tiles (English-only labels, clean design)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '', // Hide attribution as requested
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Process locations (decimal coordinates only)
      console.log('🗺️ LeafletMap: Processing', locations.length, 'locations');

      const validLocations = locations
        .filter((location) => {
          // Validate decimal coordinates
          if (typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
            console.log(`❌ LeafletMap: Invalid coordinates for:`, location.title);
            return false;
          }

          // Validate coordinate ranges
          if (location.latitude < -90 || location.latitude > 90 ||
              location.longitude < -180 || location.longitude > 180) {
            console.log(`❌ LeafletMap: Coordinates out of range for:`, location.title);
            return false;
          }

          console.log(`✅ LeafletMap: Valid coordinates for ${location.title}:`, {
            latitude: location.latitude,
            longitude: location.longitude
          });

          return true;
        });

      console.log('🗺️ LeafletMap: Valid locations count:', validLocations.length);

      if (validLocations.length === 0) {
        // Default to world view if no coordinates
        map.setView([20, 0], 2);
        return;
      }

      const bounds = L.latLngBounds([]);

      // Add markers with decimal coordinates
      validLocations.forEach((location) => {
        console.log(`📍 LeafletMap: Creating marker for ${location.title} at:`, {
          latitude: location.latitude,
          longitude: location.longitude
        });

        const latLng = L.latLng(location.latitude, location.longitude);
        bounds.extend(latLng);

        // Create custom marker icon
        const markerColor = getMarkerColor(location.markerColor);
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: 28px;
              height: 28px;
              background-color: ${markerColor};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            ">
              <div style="
                width: 8px;
                height: 8px;
                background-color: white;
                border-radius: 50%;
              "></div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        // Create marker
        const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

        // Create popup content
        const categoryIcon = location.category === 'office' ? '🏢' :
                            location.category === 'conference' ? '🏛️' :
                            location.category === 'venue' ? '🎪' :
                            location.category === 'partner' ? '🤝' :
                            location.category === 'hotel' ? '🏨' :
                            location.category === 'restaurant' ? '🍽️' : '📍';

        const popupContent = `
          <div style="
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 280px;
            padding: 0;
          ">
            <div style="
              background: linear-gradient(135deg, ${markerColor}, ${markerColor}dd);
              color: white;
              padding: 12px 16px;
              margin: -12px -16px 12px -16px;
              border-radius: 8px 8px 0 0;
            ">
              <div style="
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;
              ">
                <span style="font-size: 18px;">${categoryIcon}</span>
                <h3 style="
                  margin: 0;
                  font-size: 16px;
                  font-weight: 600;
                  line-height: 1.3;
                ">${location.title}</h3>
              </div>
              ${location.category ? `
                <span style="
                  display: inline-block;
                  background: rgba(255,255,255,0.2);
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 500;
                  text-transform: capitalize;
                ">${location.category}</span>
              ` : ''}
            </div>
            <p style="
              margin: 0 0 8px 0;
              font-size: 14px;
              color: #6b7280;
              line-height: 1.4;
            ">📍 ${location.address}</p>
            <p style="
              margin: 8px 0;
              font-size: 12px;
              color: #6b7280;
              font-family: monospace;
              background: #f3f4f6;
              padding: 4px 8px;
              border-radius: 4px;
              line-height: 1.3;
            ">🌍 ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}</p>
            ${location.description ? `
              <p style="
                margin: 0;
                font-size: 14px;
                color: #4b5563;
                line-height: 1.4;
              ">${location.description}</p>
            ` : ''}
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup'
        });
      });

      // Fit map to bounds with exact coordinates
      if (validLocations.length === 1) {
        // Single location - center and zoom to exact coordinates
        const location = validLocations[0];
        map.setView([location.latitude, location.longitude], 15);
      } else if (validLocations.length > 1) {
        // Multiple locations - fit bounds with padding
        map.fitBounds(bounds, {
          padding: [20, 20],
          maxZoom: 15
        });
      }
    };

    init();

    // Cleanup function
    return () => {
      try {
        if (hintTimeout) clearTimeout(hintTimeout);
        if (wheelListener && mapRef.current) {
          mapRef.current.removeEventListener('wheel', wheelListener as EventListener);
        }
        if (touchStartListener && mapRef.current) {
          mapRef.current.removeEventListener('touchstart', touchStartListener as EventListener);
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        // Also clear any Leaflet instance attached to the DOM node
        if ((mapRef.current as any)?._leaflet_id) {
          (mapRef.current as any)._leaflet_id = undefined;
        }
      } catch {}
    };
  }, [locations, getMarkerColor]);


  return (
    <>
      <div ref={wrapperRef} className="relative">
        {/* Map Container */}
        <div
          ref={mapRef}
          className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] relative overflow-hidden"
          style={{
            minHeight: '400px',
            position: 'relative',
            zIndex: 1,
            isolation: 'isolate'
          }}
        />

        {/* Instruction overlay top-right */}
        {showHint && (
          <div
            className="pointer-events-none absolute top-3 right-3 bg-black/60 text-white text-xs md:text-sm px-2.5 py-1.5 rounded-md shadow"
            style={{ zIndex: 1000 }}
          >
            {hintText}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
        }

        .custom-popup .leaflet-popup-content {
          margin: 12px 16px;
          line-height: 1.4;
        }

        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        .leaflet-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative !important;
          z-index: 1 !important;
          overflow: hidden !important;
          touch-action: pan-y pinch-zoom; /* allow page scroll on Y and pinch zoom */
        }

        /* Fix for mobile scrolling issues */
        .leaflet-container .leaflet-control-container {
          position: relative !important;
        }

        /* Prevent map from overlaying other elements */
        .leaflet-pane {
          z-index: 1 !important;
        }

        /* Fix touch issues on mobile */
        .leaflet-container .leaflet-control-zoom {
          position: absolute !important;
          top: 10px !important;
          left: 10px !important;
          z-index: 1000 !important;
        }

        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
        }

        .leaflet-control-zoom a {
          border: none !important;
          background: white !important;
          color: #374151 !important;
          font-weight: 600 !important;
        }

        .leaflet-control-zoom a:hover {
          background: #f3f4f6 !important;
        }

        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>
    </>
  );
};

export default LeafletMap;
