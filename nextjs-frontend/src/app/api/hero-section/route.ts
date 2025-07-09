import { NextResponse } from 'next/server';
import { getHeroSection } from '../../getHeroSection';

export async function GET() {
  try {
    console.log('🎯 API: Fetching hero section data from Sanity CMS...');

    const heroData = await getHeroSection();

    console.log('🎯 API: Hero section data fetched:', {
      hasData: !!heroData,
      primaryButton: heroData?.primaryButton,
      secondaryButton: heroData?.secondaryButton,
      welcomeText: heroData?.welcomeText
    });

    // Create response with hero data
    const response = NextResponse.json(heroData || {
      welcomeText: 'Welcome to Intelli Global Conferences',
      subtitle: 'A NEVER-ENDING JOURNEY OF SEEKING KNOWLEDGE - WITH PEOPLE AND THEIR THOUGHTS THAT ENABLE A BETTER LIVING',
      primaryButton: {
        text: 'View All Conferences',
        url: '/conferences'
      },
      secondaryButton: {
        text: 'Contact Us',
        url: '/contact'
      }
    });

    // Set headers for caching
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    response.headers.set('X-Data-Source', heroData ? 'sanity-cms' : 'fallback');
    response.headers.set('X-Last-Updated', new Date().toISOString());

    return response;
  } catch (error) {
    console.error('❌ API: Error fetching hero section data:', error);

    const errorResponse = NextResponse.json({
      error: 'Failed to fetch hero section data',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      fallback: {
        welcomeText: 'Welcome to Intelli Global Conferences',
        subtitle: 'A NEVER-ENDING JOURNEY OF SEEKING KNOWLEDGE - WITH PEOPLE AND THEIR THOUGHTS THAT ENABLE A BETTER LIVING',
        primaryButton: {
          text: 'View All Conferences',
          url: '/conferences'
        },
        secondaryButton: {
          text: 'Contact Us',
          url: '/contact'
        }
      }
    }, { status: 500 });

    errorResponse.headers.set('X-Data-Source', 'error-fallback');
    errorResponse.headers.set('X-Error', error instanceof Error ? error.message : 'Unknown error');

    return errorResponse;
  }
}
