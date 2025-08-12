'use client';

import React, { useState, useEffect } from 'react';

// Define the map location type (decimal coordinates only)
export interface MapLocation {
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

interface LocationsResponse {
  success: boolean;
  data: MapLocation[];
  count: number;
  dataSource: string;
  timestamp: string;
  message?: string;
  note?: string;
}

// Loading skeleton component
const MapSkeleton: React.FC = () => (
  <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-24 mx-auto"></div>
    </div>
  </div>
);

// Error component
const MapError: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] bg-red-50 rounded-lg flex items-center justify-center">
    <div className="text-center p-6">
      <div className="text-red-500 text-4xl mb-4">🗺️</div>
      <h3 className="text-lg font-semibold text-red-800 mb-2">Map Loading Error</h3>
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

// Import the map component dynamically to avoid SSR evaluation
import dynamic from 'next/dynamic';
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

const LeafletMapLocations: React.FC = () => {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🗺️ Fetching map locations...');

      const response = await fetch('/api/map-locations', {
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

      console.log(`✅ Successfully loaded ${data.count} map locations`);
      setLocations(data.data);
      setLoading(false);
    } catch (fetchError) {
      console.error('❌ Error fetching locations:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'Failed to load map locations');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [retryCount]);

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
    return colorMap[color || 'orange'] || '#f97316';
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchLocations();
  };

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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 relative" style={{ isolation: 'isolate', zIndex: 1 }}>
          {loading && <MapSkeleton />}
          {error && <MapError error={error} onRetry={handleRetry} />}
          {!loading && !error && locations.length > 0 && (
            <LeafletMap
              locations={locations}
              getMarkerColor={getMarkerColor}
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
                                        location.category === 'partner' ? '🤝' :
                                        location.category === 'hotel' ? '🏨' :
                                        location.category === 'restaurant' ? '🍽️' : '📍';

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
                            <p className="text-gray-600 text-sm mb-2">📍 {location.address}</p>
                            {location.description && (
                              <p className="text-gray-500 text-sm">{location.description}</p>
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

        {/* No locations message */}
        {!loading && !error && locations.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Locations Found</h3>
            <p className="text-gray-600">
              No active map locations are currently configured. Please add locations in the Sanity CMS.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LeafletMapLocations;
