import { NextResponse } from 'next/server';
import { getSponsorshipTiers } from '../../getSponsorshipData';

export async function GET() {
  try {
    console.log('🔍 API: Fetching REAL-TIME sponsorship tiers from Sanity CMS...');

    const tiers = await getSponsorshipTiers();

    console.log('📊 API: Real-time sponsorship tiers fetched:', tiers?.length || 0);
    console.log('🔍 API: Tier names:', tiers?.map(t => t.name) || []);

    // Create response with real-time data and appropriate caching headers
    const response = NextResponse.json(tiers || []);

    // Set headers for real-time synchronization (5-second cache)
    response.headers.set('Cache-Control', 'public, max-age=5, stale-while-revalidate=10');
    response.headers.set('X-Data-Source', tiers?.length > 0 ? 'sanity-cms' : 'fallback');
    response.headers.set('X-Last-Updated', new Date().toISOString());

    return response;
  } catch (error) {
    console.error('❌ API: Error fetching real-time sponsorship tiers:', error);

    const errorResponse = NextResponse.json([], { status: 500 });
    errorResponse.headers.set('X-Data-Source', 'error');
    errorResponse.headers.set('X-Error', 'Failed to fetch sponsorship tiers');

    return errorResponse;
  }
}
