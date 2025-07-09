import { NextResponse } from 'next/server';
import { getAllConferences } from '../../getSponsorshipData';

export async function GET() {
  try {
    console.log('🔍 API: Fetching conferences for sponsor selection...');
    
    const conferences = await getAllConferences();
    
    console.log('📊 API: Conferences fetched:', conferences?.length || 0);
    console.log('📊 API: Conference titles:', conferences?.map(c => c.title) || []);
    
    return NextResponse.json({
      success: true,
      count: conferences?.length || 0,
      conferences: conferences || [],
      message: conferences?.length > 0 ? `Found ${conferences.length} conferences` : 'No conferences found'
    });
  } catch (error) {
    console.error('❌ API: Error fetching conferences for sponsor:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      conferences: []
    }, { status: 500 });
  }
}
