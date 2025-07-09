import { NextResponse } from 'next/server';
import { getAllConferences } from '../../getSponsorshipData';

export async function GET() {
  try {
    console.log('🔍 API: Fetching REAL-TIME conferences from Sanity CMS...');

    const conferences = await getAllConferences();

    console.log('📅 API: Real-time conferences fetched:', conferences?.length || 0);
    console.log('🔍 API: Conference titles:', conferences?.map(c => c.title) || []);

    // Create response with real-time data and appropriate caching headers
    const response = NextResponse.json(conferences || []);

    // Set headers for real-time synchronization (5-second cache)
    response.headers.set('Cache-Control', 'public, max-age=5, stale-while-revalidate=10');
    response.headers.set('X-Data-Source', conferences?.length > 0 ? 'sanity-cms' : 'fallback');
    response.headers.set('X-Last-Updated', new Date().toISOString());

    return response;
  } catch (error) {
    console.error('❌ API: Error fetching real-time conferences:', error);

    const errorResponse = NextResponse.json([], { status: 500 });
    errorResponse.headers.set('X-Data-Source', 'error');
    errorResponse.headers.set('X-Error', 'Failed to fetch conferences');

    return errorResponse;
  }
}
