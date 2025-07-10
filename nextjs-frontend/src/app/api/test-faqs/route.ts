import { NextResponse } from 'next/server';
import { getSiteSettingsFresh } from '../../getSiteSettings';

export async function GET() {
  try {
    console.log('🔍 API: Testing FAQ data fetch...');
    
    const siteSettings = await getSiteSettingsFresh();
    
    const response = {
      timestamp: new Date().toISOString(),
      siteSettingsExists: !!siteSettings,
      footerContentExists: !!siteSettings?.footerContent,
      faqsExists: !!siteSettings?.footerContent?.faqs,
      faqsCount: siteSettings?.footerContent?.faqs?.length || 0,
      faqsData: siteSettings?.footerContent?.faqs || [],
      fullFooterContent: siteSettings?.footerContent
    };
    
    console.log('📊 API Response:', JSON.stringify(response, null, 2));
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
