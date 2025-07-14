import { NextRequest, NextResponse } from 'next/server';

// Test conference locations data (hardcoded for testing)
const testLocations = [
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
  {
    _id: 'test-dubai',
    title: 'Dubai, UAE',
    address: 'Dubai World Trade Centre, Sheikh Zayed Rd, Dubai, UAE',
    latitude: 25.2048,
    longitude: 55.2708,
    description: 'Middle East hub for global conferences and business events.',
    isActive: true,
    order: 4,
  },
  {
    _id: 'test-tokyo',
    title: 'Tokyo, Japan',
    address: 'Tokyo International Forum, 3-5-1 Marunouchi, Chiyoda City, Tokyo 100-0005, Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    description: 'Leading venue for technology and innovation conferences in Asia.',
    isActive: true,
    order: 5,
  },
];

export async function GET(request: NextRequest) {
  try {
    console.log('🗺️ Serving test conference locations...');

    // Return test locations with proper headers
    return NextResponse.json(
      {
        success: true,
        data: testLocations,
        count: testLocations.length,
        timestamp: new Date().toISOString(),
        note: 'This is test data. Configure Sanity CMS for dynamic locations.',
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );

  } catch (error) {
    console.error('❌ Error serving test locations:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to serve test locations',
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
