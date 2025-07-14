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

export async function GET(request: NextRequest) {
  try {
    console.log('🗺️ Fetching conference locations from Sanity...');

    // Fetch conference locations from Sanity
    const locations: ConferenceLocation[] = await client.fetch(
      CONFERENCE_LOCATIONS_QUERY,
      {},
      {
        cache: 'no-store', // Always fetch fresh data for real-time updates
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    console.log(`✅ Successfully fetched ${locations.length} conference locations`);

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
        timestamp: new Date().toISOString(),
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
