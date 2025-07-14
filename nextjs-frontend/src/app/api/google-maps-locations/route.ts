import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

// Define the Google Maps location type
export interface GoogleMapsLocation {
  _id: string;
  title: string;
  category?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  isActive: boolean;
  priority?: number;
  markerColor?: string;
}

// GROQ query to fetch active Google Maps locations
const GOOGLE_MAPS_LOCATIONS_QUERY = `
  *[_type == "mapLocation" && isActive == true] | order(priority desc, title asc) {
    _id,
    title,
    category,
    address,
    latitude,
    longitude,
    description,
    isActive,
    priority,
    markerColor
  }
`;

// Test data fallback
const testLocations: GoogleMapsLocation[] = [
  {
    _id: 'test-london',
    title: 'London Office',
    category: 'office',
    address: 'ExCeL London, Royal Victoria Dock, London E16 1XL, UK',
    latitude: 51.5074,
    longitude: -0.1278,
    description: 'Major European hub for international conferences and academic events.',
    isActive: true,
    priority: 90,
    markerColor: 'orange',
  },
  {
    _id: 'test-newyork',
    title: 'New York Conference Center',
    category: 'conference',
    address: 'Jacob K. Javits Convention Center, 429 11th Ave, New York, NY 10001, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    description: 'Premier destination for technology and business conferences in North America.',
    isActive: true,
    priority: 85,
    markerColor: 'orange',
  },
  {
    _id: 'test-singapore',
    title: 'Singapore Event Venue',
    category: 'venue',
    address: 'Marina Bay Sands Expo and Convention Centre, 10 Bayfront Ave, Singapore 018956',
    latitude: 1.3521,
    longitude: 103.8198,
    description: 'Gateway to Asia-Pacific conferences and international symposiums.',
    isActive: true,
    priority: 80,
    markerColor: 'green',
  },
  {
    _id: 'test-dubai',
    title: 'Dubai Regional Office',
    category: 'office',
    address: 'Dubai World Trade Centre, Sheikh Zayed Rd, Dubai, UAE',
    latitude: 25.2048,
    longitude: 55.2708,
    description: 'Middle East hub for global conferences and business events.',
    isActive: true,
    priority: 75,
    markerColor: 'orange',
  },
  {
    _id: 'test-tokyo',
    title: 'Tokyo Innovation Hub',
    category: 'partner',
    address: 'Tokyo International Forum, 3-5-1 Marunouchi, Chiyoda City, Tokyo 100-0005, Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    description: 'Leading venue for technology and innovation conferences in Asia.',
    isActive: true,
    priority: 70,
    markerColor: 'purple',
  },
];

export async function GET(request: NextRequest) {
  try {
    console.log('🗺️ Fetching Google Maps locations from Sanity...');

    let locations: GoogleMapsLocation[] = [];
    let dataSource = 'sanity';

    try {
      // Try to fetch Google Maps locations from Sanity
      locations = await client.fetch(
        GOOGLE_MAPS_LOCATIONS_QUERY,
        {},
        {
          cache: 'no-store', // Always fetch fresh data for real-time updates
          next: { revalidate: 60 }, // Revalidate every 60 seconds
        }
      );

      console.log(`✅ Successfully fetched ${locations.length} Google Maps locations from Sanity`);
    } catch (sanityError) {
      console.warn('⚠️ Sanity fetch failed, using test data:', sanityError);
      locations = testLocations;
      dataSource = 'test';
    }

    // If no Sanity data, use test data
    if (locations.length === 0) {
      console.log('📍 No Sanity data found, using test locations');
      locations = testLocations;
      dataSource = 'test';
    }

    // Validate location data
    const validLocations = locations.filter(location => {
      const isValid = 
        location.title &&
        location.address &&
        (location.latitude === undefined || (typeof location.latitude === 'number' && location.latitude >= -90 && location.latitude <= 90)) &&
        (location.longitude === undefined || (typeof location.longitude === 'number' && location.longitude >= -180 && location.longitude <= 180));

      if (!isValid) {
        console.warn(`⚠️ Invalid location data for: ${location.title || 'Unknown'}`);
      }

      return isValid;
    });

    console.log(`✅ ${validLocations.length} valid locations after validation`);

    // Return the locations with proper headers
    return NextResponse.json(
      {
        success: true,
        data: validLocations,
        count: validLocations.length,
        dataSource: dataSource,
        timestamp: new Date().toISOString(),
        ...(dataSource === 'test' && {
          note: 'Using test data. Configure Sanity CMS for dynamic locations.'
        }),
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );

  } catch (error) {
    console.error('❌ Error fetching Google Maps locations:', error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch Google Maps locations',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
