'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

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

// API response interface
interface LocationsResponse {
  success: boolean;
  data: ConferenceLocation[];
  count: number;
  timestamp: string;
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

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

const ConferenceLocationsMap: React.FC = () => {
  const [locations, setLocations] = useState<ConferenceLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🗺️ Fetching conference locations...');

      const response = await fetch('/api/conference-locations', {
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

      console.log(`✅ Successfully loaded ${data.count} conference locations`);
      setLocations(data.data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error fetching conference locations:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchLocations();
  };

  useEffect(() => {
    fetchLocations();
  }, [retryCount]);

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
            <DynamicMap locations={locations} />
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
                  {location.address && (
                    <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                  )}
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

export default ConferenceLocationsMap;
