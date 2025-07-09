const { createClient } = require('next-sanity');

// Create a fresh client (no CDN) to test FAQ data
const freshClient = createClient({
  projectId: 'tq1qdk3m',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // No CDN to get fresh data
  perspective: 'published'
});

async function testFAQData() {
  try {
    console.log('🔍 Testing FAQ Data Fetch (Fresh Client)...\n');
    
    // Test the exact query structure used in getSiteSettings
    const query = `*[_type == "siteSettings"][0]{
      _id,
      footerContent{
        termsAndConditions,
        privacyPolicy,
        faqs[]{
          question,
          answer
        },
        footerSocialMedia{
          twitter,
          instagram,
          linkedin,
          facebook
        }
      }
    }`;
    
    console.log('📝 GROQ Query:', query);
    console.log('\n🚀 Executing query...');
    
    const result = await freshClient.fetch(query);
    
    console.log('\n📊 Query Result:');
    console.log('- Site Settings Found:', !!result);
    console.log('- Footer Content Found:', !!result?.footerContent);
    console.log('- FAQs Array Found:', !!result?.footerContent?.faqs);
    console.log('- FAQs Count:', result?.footerContent?.faqs?.length || 0);
    
    if (result?.footerContent?.faqs?.length > 0) {
      console.log('\n✅ FAQ Data:');
      result.footerContent.faqs.forEach((faq, index) => {
        console.log(`${index + 1}. Question: "${faq.question}"`);
        console.log(`   Answer: ${faq.answer ? 'Present' : 'Missing'}`);
        if (faq.answer) {
          console.log(`   Answer Type: ${Array.isArray(faq.answer) ? 'Array' : typeof faq.answer}`);
          console.log(`   Answer Length: ${Array.isArray(faq.answer) ? faq.answer.length : 'N/A'}`);
        }
        console.log('');
      });
    } else {
      console.log('\n❌ No FAQ data found!');
      console.log('Full footerContent:', JSON.stringify(result?.footerContent, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error testing FAQ data:', error.message);
    console.error('Error details:', error);
  }
}

testFAQData();
