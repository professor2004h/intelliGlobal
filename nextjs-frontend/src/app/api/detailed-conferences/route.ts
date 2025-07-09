import { NextResponse } from 'next/server';
import { getDetailedConferences } from '../../getSponsorshipData';

export async function GET() {
  try {
    console.log('🔍 API: Fetching detailed conferences...');
    
    const conferences = await getDetailedConferences();
    
    console.log('📅 API: Detailed conferences fetched:', conferences?.length || 0);
    console.log('📊 API: Conference titles:', conferences?.map(c => c.title) || []);
    
    // Filter and prioritize technology-related conferences
    const techKeywords = ['robotics', 'robot', 'ai', 'artificial intelligence', 'machine learning', 'ml', 'technology', 'tech', 'hi', 'hello', 'automation', 'digital', 'cyber', 'data', 'blockchain', 'iot', 'cloud', 'software', 'hardware', 'innovation'];
    
    const conferencesWithTechFlag = conferences.map(conf => ({
      ...conf,
      isTechnologyRelated: techKeywords.some(keyword => 
        conf.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        conf.description?.toLowerCase().includes(keyword.toLowerCase()) ||
        conf.topics?.some((topic: string) => topic.toLowerCase().includes(keyword.toLowerCase()))
      )
    }));
    
    // Sort to prioritize technology-related conferences
    const sortedConferences = conferencesWithTechFlag.sort((a, b) => {
      if (a.isTechnologyRelated && !b.isTechnologyRelated) return -1;
      if (!a.isTechnologyRelated && b.isTechnologyRelated) return 1;
      return 0;
    });
    
    console.log('🤖 Technology-related conferences found:', 
      sortedConferences.filter(c => c.isTechnologyRelated).map(c => c.title)
    );
    
    return NextResponse.json(sortedConferences || []);
  } catch (error) {
    console.error('❌ API: Error fetching detailed conferences:', error);
    return NextResponse.json([], { status: 500 });
  }
}
