import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { clearSiteSettingsCache } from '../../getSiteSettings';

// CORS headers for API routes
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

// Manual revalidation endpoint for testing
export async function GET(_request: NextRequest) {
  try {
    console.warn('Manual revalidation triggered...');
    
    // Clear the in-memory cache
    clearSiteSettingsCache();

    // Aggressive revalidation of all pages and cache tags
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/conferences');
    revalidateTag('site-settings');
    revalidateTag('header');
    revalidateTag('favicon');
    
    console.warn('Manual revalidation completed successfully');
    
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: 'Manual cache revalidation completed successfully',
      paths: ['/', '/about'],
      tags: ['site-settings']
    }, { headers: corsHeaders });
  } catch (err) {
    console.error('Error in manual revalidation:', err);
    return NextResponse.json({
      revalidated: false,
      error: 'Failed to revalidate manually',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}

// Also support POST for consistency
export async function POST(request: NextRequest) {
  return GET(request);
}
