const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '80vqb77v',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function testSanityConnection() {
  try {
    console.log('🔍 Testing direct Sanity connection...');
    
    const query = `*[_type == "siteSettings"][0]{
      footerContent{
        faqs[]{
          question,
          answer
        }
      }
    }`;
    
    const data = await client.fetch(query);
    
    console.log('📊 Direct Sanity Query Results:');
    console.log('- Data exists:', !!data);
    console.log('- Footer content exists:', !!data?.footerContent);
    console.log('- FAQs exists:', !!data?.footerContent?.faqs);
    console.log('- FAQs count:', data?.footerContent?.faqs?.length || 0);
    console.log('- FAQs data:', JSON.stringify(data?.footerContent?.faqs, null, 2));
    
    if (data?.footerContent?.faqs?.length > 0) {
      console.log('✅ FAQ data found in Sanity!');
      data.footerContent.faqs.forEach((faq, index) => {
        console.log(`FAQ ${index + 1}:`);
        console.log(`  Question: ${faq.question}`);
        console.log(`  Answer exists: ${!!faq.answer}`);
        console.log(`  Answer type: ${Array.isArray(faq.answer) ? 'Array' : typeof faq.answer}`);
      });
    } else {
      console.log('❌ No FAQ data found in Sanity');
    }
    
  } catch (error) {
    console.error('❌ Sanity connection error:', error);
  }
}

testSanityConnection();
