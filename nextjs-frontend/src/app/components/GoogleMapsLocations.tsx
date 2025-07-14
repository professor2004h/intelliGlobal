'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Define the Google Maps location interface
interface GoogleMapsLocation {
  _id: string;
  title: string;
  address: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  isActive: boolean;
  order?: number;
  markerColor?: string;
}

// API response interface
interface LocationsResponse {
  success: boolean;
  data: GoogleMapsLocation[];
  count: number;
  dataSource: string;
  timestamp: string;
  note?: string;
  message?: string; // For error responses
}

// Loading component
const MapSkeleton = () => (
  <div className="w-full h-[400px] md:h-[500px] bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading Conference Locations...</p>
    </div>
  </div>
);

// Error component
const MapError = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="w-full h-[400px] md:h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Map</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const GoogleMapsLocations: React.FC = () => {
  const [locations, setLocations] = useState<GoogleMapsLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🗺️ Fetching Google Maps locations...');

      const response = await fetch('/api/google-maps-locations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LocationsResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch locations');
      }

      console.log(`✅ Successfully loaded ${data.count} Google Maps locations`);
      setLocations(data.data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error fetching Google Maps locations:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = async () => {
    if (!mapRef.current || locations.length === 0) return;

    try {
      // Initialize Google Maps
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places'],
      });

      const google = await loader.load();

      // Calculate center point
      let centerLat = 0;
      let centerLng = 0;
      let validCoordinates = 0;

      locations.forEach(location => {
        if (location.latitude && location.longitude) {
          centerLat += location.latitude;
          centerLng += location.longitude;
          validCoordinates++;
        }
      });

      if (validCoordinates > 0) {
        centerLat /= validCoordinates;
        centerLng /= validCoordinates;
      }

      // Create map
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: validCoordinates === 1 ? 10 : 2,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      mapInstanceRef.current = map;

      // Add markers
      const bounds = new google.maps.LatLngBounds();

      for (const location of locations) {
        let position: google.maps.LatLng | null = null;

        if (location.latitude && location.longitude) {
          position = new google.maps.LatLng(location.latitude, location.longitude);
        } else {
          // Geocode address if no coordinates
          const geocoder = new google.maps.Geocoder();
          try {
            const result = await geocoder.geocode({ address: location.address });
            if (result.results[0]) {
              position = result.results[0].geometry.location;
            }
          } catch (geocodeError) {
            console.warn(`Failed to geocode ${location.title}:`, geocodeError);
            continue;
          }
        }

        if (position) {
          // Create custom marker
          const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: location.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: location.markerColor || '#f97316',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            },
          });

          // Create info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 300px; padding: 8px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                  ${location.title}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                  📍 ${location.address}
                </p>
                ${location.description ? `
                  <p style="margin: 0; font-size: 14px; color: #4b5563;">
                    ${location.description}
                  </p>
                ` : ''}
              </div>
            `,
          });

          // Add click listener
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });

          bounds.extend(position);
        }
      }

      // Fit map to bounds
      if (validCoordinates > 1) {
        map.fitBounds(bounds);
      }

    } catch (mapError) {
      console.error('❌ Error initializing Google Maps:', mapError);
      setError('Failed to load Google Maps. Please check your API key configuration.');
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchLocations();
  };

  useEffect(() => {
    fetchLocations();
  }, [retryCount]);

  useEffect(() => {
    if (!loading && !error && locations.length > 0) {
      initializeMap();
    }
  }, [locations, loading, error]);

  // Don't render anything if there are no locations and no error
  if (!loading && !error && locations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Global Presence
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our conference locations around the world. We bring together experts, 
            researchers, and professionals from diverse fields across multiple continents.
          </p>
          {!loading && !error && (
            <p className="text-sm text-gray-500 mt-2">
              {locations.length} active location{locations.length !== 1 ? 's' : ''} worldwide
            </p>
          )}
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading && <MapSkeleton />}
          {error && <MapError error={error} onRetry={handleRetry} />}
          {!loading && !error && locations.length > 0 && (
            <div
              ref={mapRef}
              className="w-full h-[400px] md:h-[500px]"
              style={{ minHeight: '400px' }}
            />
          )}
        </div>

        {/* Locations List (Mobile-friendly) */}
        {!loading && !error && locations.length > 0 && (
          <div className="mt-8 md:hidden">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Conference Locations</h3>
            <div className="grid gap-4">
              {locations.map((location) => (
                <div key={location._id} className="bg-white p-4 rounded-lg shadow border">
                  <h4 className="font-semibold text-gray-900">{location.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">📍 {location.address}</p>
                  {location.description && (
                    <p className="text-sm text-gray-500 mt-2">{location.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GoogleMapsLocations;
