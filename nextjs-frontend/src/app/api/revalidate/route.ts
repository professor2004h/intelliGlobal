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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.warn('Revalidation request received:', body);

    // Verify the request is from Sanity (you can add webhook secret validation here)
    const { _type: contentType, slug } = body;

    // Revalidate specific paths based on content type
    if (contentType === 'siteSettings') {
      console.warn('Revalidating site settings...');
      // Clear the in-memory cache first
      clearSiteSettingsCache();
      // Aggressive revalidation for site settings
      revalidatePath('/', 'layout'); // Revalidate layout
      revalidatePath('/'); // Revalidate homepage
      revalidatePath('/about'); // Revalidate about page
      revalidatePath('/conferences'); // Revalidate conferences page
      revalidateTag('site-settings'); // Revalidate by tag
      // Force revalidation of all pages that might use site settings
      revalidateTag('header'); // If you have header-specific tags
      revalidateTag('favicon'); // If you have favicon-specific tags
      console.warn('Site settings revalidated successfully');
    } else if (contentType === 'conferenceEvent') {
      console.warn('Revalidating conference events...');
      // Revalidate conference-related pages
      revalidatePath('/');
      revalidatePath('/conferences');
      revalidateTag('conference-events'); // Revalidate conference events tag
      if (slug?.current) {
        revalidatePath(`/conferences/${slug.current}`);
      }
    } else if (contentType === 'conferences') {
      console.warn('Revalidating conferences section...');
      // Revalidate conferences section content
      revalidatePath('/');
      revalidatePath('/conferences');
      revalidateTag('conferences-section'); // Revalidate conferences section tag
    } else if (contentType === 'aboutUs') {
      console.warn('Revalidating about page...');
      revalidatePath('/about');
    } else if (contentType === 'heroSection') {
      console.warn('Revalidating hero section...');
      // Aggressive revalidation for hero section
      revalidatePath('/', 'layout'); // Revalidate layout
      revalidatePath('/'); // Revalidate homepage
      revalidateTag('hero-section'); // Revalidate hero section tag
      // Force immediate cache clearing
      console.warn('Hero section revalidated successfully with aggressive cache clearing');
    } else {
      console.warn('Unknown content type, revalidating all pages...');
      // Fallback: revalidate all main pages
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/about');
      revalidateTag('site-settings');
    }

    console.warn('Revalidation completed successfully');
    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: contentType,
      message: 'Cache revalidated successfully'
    }, { headers: corsHeaders });
  } catch (err) {
    console.error('Error revalidating:', err);
    return NextResponse.json({
      revalidated: false,
      error: 'Failed to revalidate',
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders });
  }
}
