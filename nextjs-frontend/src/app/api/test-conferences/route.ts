import { NextResponse } from 'next/server';
import { getAllConferences } from '../../getSponsorshipData';

export async function GET() {
  try {
    console.log('🔍 API: Testing conference data fetch...');

    const conferences = await getAllConferences();

    console.log('📊 API: Conferences fetched:', conferences);
    console.log('📊 API: Conference count:', conferences?.length || 0);
    console.log('📊 API: Conference titles:', conferences?.map(c => c.title) || []);

    return NextResponse.json({
      success: true,
      count: conferences.length,
      conferences: conferences,
      titles: conferences.map(c => c.title),
      message: `Found ${conferences.length} conferences`
    });
  } catch (error) {
    console.error('❌ API: Error fetching conferences:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      conferences: []
    }, { status: 500 });
  }
}
