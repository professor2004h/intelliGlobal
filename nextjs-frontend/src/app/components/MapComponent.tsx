'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Define the conference location interface
interface ConferenceLocation {
  _id: string;
  title: string;
  address?: string;
  latitude: number;
  longitude: number;
  description?: string;
  isActive: boolean;
  order?: number;
}

interface MapComponentProps {
  locations: ConferenceLocation[];
}

const MapComponent: React.FC<MapComponentProps> = ({ locations }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || locations.length === 0) return;

    // Fix Leaflet default icon issue in SSR
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create custom icon for markers
    const createCustomIcon = () => {
      return L.divIcon({
        html: `
          <div style="
            background: linear-gradient(135deg, #f97316, #ea580c);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      });
    };

    // Calculate bounds for all locations
    const bounds = L.latLngBounds(
      locations.map(location => [location.latitude, location.longitude])
    );

    // Initialize map
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      dragging: true,
      tap: true,
      maxZoom: 18,
      minZoom: 2,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Fit map to show all locations with padding
    if (locations.length === 1) {
      // If only one location, center on it with a reasonable zoom
      map.setView([locations[0].latitude, locations[0].longitude], 10);
    } else {
      // If multiple locations, fit bounds with padding
      map.fitBounds(bounds, {
        padding: [20, 20],
        maxZoom: 12,
      });
    }

    // Add markers for each location
    locations.forEach((location) => {
      const marker = L.marker([location.latitude, location.longitude], {
        icon: createCustomIcon(),
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px; max-width: 300px;">
          <h3 style="
            margin: 0 0 8px 0;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            line-height: 1.3;
          ">${location.title}</h3>
          ${location.address ? `
            <p style="
              margin: 0 0 8px 0;
              font-size: 14px;
              color: #6b7280;
              line-height: 1.4;
            ">📍 ${location.address}</p>
          ` : ''}
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
        className: 'custom-popup',
      });

      // Add hover effects
      marker.on('mouseover', function() {
        this.openPopup();
      });

      // Keep popup open on mobile tap
      marker.on('click', function() {
        this.openPopup();
      });
    });

    // Store map instance
    mapInstanceRef.current = map;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-[400px] md:h-[500px] rounded-lg"
        style={{ zIndex: 1 }}
      />
      
      {/* Map Controls Info */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg z-10">
        <p className="text-xs text-gray-600">
          🗺️ {locations.length} location{locations.length !== 1 ? 's' : ''} • Click markers for details
        </p>
      </div>

      {/* Custom CSS for map styling */}
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 12px 16px;
          line-height: 1.4;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }
        
        .leaflet-control-zoom a {
          background: white !important;
          color: #374151 !important;
          border: none !important;
          font-weight: 600 !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #f3f4f6 !important;
          color: #f97316 !important;
        }
        
        .leaflet-container {
          font-family: inherit;
        }
        
        @media (max-width: 768px) {
          .leaflet-control-zoom {
            margin-right: 10px !important;
            margin-bottom: 10px !important;
          }
          
          .custom-popup .leaflet-popup-content-wrapper {
            max-width: 250px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
