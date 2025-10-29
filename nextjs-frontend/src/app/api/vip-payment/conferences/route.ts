import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

/**
 * API to fetch all conferences for VIP payment dropdown
 */

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '99kpz7t0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: true,
});

export async function GET(request: NextRequest) {
  try {
    console.log('📋 Fetching conferences for VIP payment page');

    const query = `*[_type == "conferenceEvent"] | order(startDate desc) {
      _id,
      title,
      startDate,
      endDate,
      location,
      "isUpcoming": startDate > now()
    }`;

    const conferences = await sanityClient.fetch(query);

    console.log(`✅ Found ${conferences.length} conferences`);

    return NextResponse.json({
      success: true,
      conferences,
      count: conferences.length
    });

  } catch (error: any) {
    console.error('❌ Error fetching conferences:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch conferences',
        details: error.message
      },
      { status: 500 }
    );
  }
}

