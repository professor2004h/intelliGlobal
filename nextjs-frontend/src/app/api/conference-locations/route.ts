import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/app/sanity/client';

// Define the conference location type
export interface ConferenceLocation {
  _id: string;
  title: string;
  address?: string;
  latitude: number;
  longitude: number;
  description?: string;
  isActive: boolean;
  order?: number;
}

// GROQ query to fetch active conference locations
const CONFERENCE_LOCATIONS_QUERY = `
  *[_type == "conferenceLocation" && isActive == true] | order(order asc, title asc) {
    _id,
    title,
    address,
    latitude,
    longitude,
    description,
    isActive,
    order
  }
`;

// Test data fallback
const testLocations: ConferenceLocation[] = [
  {
    _id: 'test-london',
    title: 'London, United Kingdom',
    address: 'ExCeL London, Royal Victoria Dock, London E16 1XL, UK',
    latitude: 51.5074,
    longitude: -0.1278,
    description: 'Major European hub for international conferences and academic events.',
    isActive: true,
    order: 1,
  },
  {
    _id: 'test-newyork',
    title: 'New York, USA',
    address: 'Jacob K. Javits Convention Center, 429 11th Ave, New York, NY 10001, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    description: 'Premier destination for technology and business conferences in North America.',
    isActive: true,
    order: 2,
  },
  {
    _id: 'test-singapore',
    title: 'Singapore',
    address: 'Marina Bay Sands Expo and Convention Centre, 10 Bayfront Ave, Singapore 018956',
    latitude: 1.3521,
    longitude: 103.8198,
    description: 'Gateway to Asia-Pacific conferences and international symposiums.',
    isActive: true,
    order: 3,
  },
];

export async function GET(request: NextRequest) {
  try {
    console.log('🗺️ Fetching conference locations from Sanity...');
    console.log('📊 Sanity client config:', {
      projectId: client.config().projectId,
      dataset: client.config().dataset,
      apiVersion: client.config().apiVersion,
    });

    let locations: ConferenceLocation[] = [];
    let dataSource = 'sanity';

    try {
      // Fetch conference locations from Sanity
      locations = await client.fetch(
        CONFERENCE_LOCATIONS_QUERY,
        {},
        {
          cache: 'no-store', // Always fetch fresh data for real-time updates
          next: { revalidate: 60 }, // Revalidate every 60 seconds
        }
      );

      console.log(`✅ Successfully fetched ${locations.length} conference locations from Sanity`);
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
        typeof location.latitude === 'number' &&
        typeof location.longitude === 'number' &&
        location.latitude >= -90 &&
        location.latitude <= 90 &&
        location.longitude >= -180 &&
        location.longitude <= 180;

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
    console.error('❌ Error fetching conference locations:', error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conference locations',
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
