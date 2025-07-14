'use client';

import React, { useEffect, useState } from 'react';

// Simple test component to verify the map section works
const SimpleMapTest: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        console.log('🗺️ Testing API endpoint...');

        // Try API first
        try {
          const response = await fetch('/api/conference-locations', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('📡 API Response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('📍 API Response data:', data);

            if (data.success) {
              setLocations(data.data);
              setLoading(false);
              return;
            }
          }
        } catch (apiError) {
          console.warn('⚠️ API failed, using fallback data:', apiError);
        }

        // Fallback to hardcoded data
        console.log('📍 Using hardcoded fallback data');
        const fallbackLocations = [
          {
            _id: 'fallback-london',
            title: 'London, United Kingdom',
            address: 'ExCeL London, Royal Victoria Dock, London E16 1XL, UK',
            latitude: 51.5074,
            longitude: -0.1278,
            description: 'Major European hub for international conferences and academic events.',
            isActive: true,
            order: 1,
          },
          {
            _id: 'fallback-newyork',
            title: 'New York, USA',
            address: 'Jacob K. Javits Convention Center, 429 11th Ave, New York, NY 10001, USA',
            latitude: 40.7128,
            longitude: -74.0060,
            description: 'Premier destination for technology and business conferences in North America.',
            isActive: true,
            order: 2,
          },
          {
            _id: 'fallback-singapore',
            title: 'Singapore',
            address: 'Marina Bay Sands Expo and Convention Centre, 10 Bayfront Ave, Singapore 018956',
            latitude: 1.3521,
            longitude: 103.8198,
            description: 'Gateway to Asia-Pacific conferences and international symposiums.',
            isActive: true,
            order: 3,
          },
        ];

        setLocations(fallbackLocations);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('❌ Error:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Conference Locations (Test Mode)
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading conference locations...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Conference Locations (Test Mode)
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Global Presence
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our conference locations around the world - {locations.length} locations worldwide
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Loaded Locations:</h3>
            
            {locations.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No locations found</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {locations.map((location) => (
                  <div key={location._id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{location.title}</h4>
                    {location.address && (
                      <p className="text-sm text-gray-600 mb-2">📍 {location.address}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Coordinates: {location.latitude}, {location.longitude}
                    </p>
                    {location.description && (
                      <p className="text-sm text-gray-700 mt-2">{location.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">🗺️ Interactive Map Coming Soon</h4>
              <p className="text-sm text-orange-700">
                We're currently displaying our conference locations in list format.
                An interactive map with markers and popups will be available soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleMapTest;
