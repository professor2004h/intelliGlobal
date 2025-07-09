// Test the getSiteSettingsFresh function specifically
const { getSiteSettingsFresh } = require('./src/app/getSiteSettings.ts');

async function testFAQFresh() {
  try {
    console.log('🔍 Testing getSiteSettingsFresh function...\n');
    
    const siteSettings = await getSiteSettingsFresh();
    
    console.log('📊 Results:');
    console.log('- Site Settings:', !!siteSettings);
    console.log('- Footer Content:', !!siteSettings?.footerContent);
    console.log('- FAQs Array:', !!siteSettings?.footerContent?.faqs);
    console.log('- FAQs Count:', siteSettings?.footerContent?.faqs?.length || 0);
    
    if (siteSettings?.footerContent?.faqs?.length > 0) {
      console.log('\n✅ FAQ Data Found:');
      siteSettings.footerContent.faqs.forEach((faq, index) => {
        console.log(`${index + 1}. "${faq.question}"`);
        console.log(`   Answer: ${faq.answer ? 'Present' : 'Missing'}`);
      });
    } else {
      console.log('\n❌ No FAQ data found');
      console.log('Full footerContent:', JSON.stringify(siteSettings?.footerContent, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testFAQFresh();
