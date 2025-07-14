'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Define the Google Maps location interface
interface GoogleMapsLocation {
  _id: string;
  title: string;
  category?: string;
  address: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  isActive: boolean;
  priority?: number;
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

  // Helper function to get marker color
  const getMarkerColor = (color?: string): string => {
    const colorMap: { [key: string]: string } = {
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#10b981',
      yellow: '#f59e0b',
      purple: '#8b5cf6',
      orange: '#f97316',
    };
    return colorMap[color || 'red'] || '#ef4444';
  };

  const initializeMap = async () => {
    if (!mapRef.current || locations.length === 0) return;

    try {
      // Initialize Google Maps with proper API key
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places', 'geometry'],
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

      // Create map with mobile-optimized settings
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom: validCoordinates === 1 ? 12 : 2,
        gestureHandling: 'cooperative', // Better mobile experience
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'transit',
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
          // Create custom marker with improved styling
          const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: location.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 14,
              fillColor: getMarkerColor(location.markerColor),
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 3,
              strokeOpacity: 1,
            },
            animation: google.maps.Animation.DROP,
          });

          // Create mobile-optimized info window
          const categoryIcon = location.category === 'office' ? '🏢' :
                              location.category === 'conference' ? '🏛️' :
                              location.category === 'venue' ? '🎪' :
                              location.category === 'partner' ? '🤝' : '📍';

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 280px; padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                  <span style="font-size: 20px; margin-right: 8px;">${categoryIcon}</span>
                  <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937; line-height: 1.3;">
                    ${location.title}
                  </h3>
                </div>
                ${location.category ? `
                  <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; background: ${getMarkerColor(location.markerColor)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; text-transform: capitalize;">
                      ${location.category}
                    </span>
                  </div>
                ` : ''}
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; line-height: 1.4;">
                  📍 ${location.address}
                </p>
                ${location.description ? `
                  <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.4;">
                    ${location.description}
                  </p>
                ` : ''}
              </div>
            `,
            maxWidth: 300,
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
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Global Locations
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our worldwide network of offices, conference centers, and partner locations.
            We connect professionals and innovators across the globe.
          </p>
          {!loading && !error && (
            <p className="text-sm text-gray-500 mt-3">
              {locations.length} active location{locations.length !== 1 ? 's' : ''} worldwide
            </p>
          )}
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {loading && <MapSkeleton />}
          {error && <MapError error={error} onRetry={handleRetry} />}
          {!loading && !error && locations.length > 0 && (
            <div
              ref={mapRef}
              className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px]"
              style={{ minHeight: '400px' }}
            />
          )}
        </div>

        {/* Enhanced Mobile Locations List */}
        {!loading && !error && locations.length > 0 && (
          <div className="mt-8 lg:hidden">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h3 className="text-xl font-semibold text-white">All Locations</h3>
                <p className="text-blue-100 text-sm mt-1">Tap any location to view details</p>
              </div>
              <div className="divide-y divide-gray-100">
                {locations
                  .sort((a, b) => (b.priority || 50) - (a.priority || 50))
                  .map((location) => {
                    const categoryIcon = location.category === 'office' ? '🏢' :
                                        location.category === 'conference' ? '🏛️' :
                                        location.category === 'venue' ? '🎪' :
                                        location.category === 'partner' ? '🤝' : '📍';

                    return (
                      <div key={location._id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div
                              className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                              style={{ backgroundColor: getMarkerColor(location.markerColor) }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{categoryIcon}</span>
                              <h4 className="font-semibold text-gray-900 text-lg">{location.title}</h4>
                            </div>
                            {location.category && (
                              <div className="mb-3">
                                <span
                                  className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white capitalize"
                                  style={{ backgroundColor: getMarkerColor(location.markerColor) }}
                                >
                                  {location.category}
                                </span>
                              </div>
                            )}
                            <p className="text-sm text-gray-600 mb-2 flex items-start">
                              <span className="mr-2 mt-0.5">📍</span>
                              <span className="leading-relaxed">{location.address}</span>
                            </p>
                            {location.description && (
                              <p className="text-sm text-gray-500 leading-relaxed">{location.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GoogleMapsLocations;
