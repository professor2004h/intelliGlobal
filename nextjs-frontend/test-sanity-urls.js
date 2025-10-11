const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '80vqb77v',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03'
});

async function testSanityUrls() {
  try {
    console.log('🔍 Testing Sanity URL data...\n');
    
    const query = `*[_type == "conferenceEvent"] {
      _id,
      title,
      registerNowUrl,
      submitAbstractUrl,
      "registerUrlLength": length(registerNowUrl),
      "submitUrlLength": length(submitAbstractUrl)
    }`;
    
    const events = await client.fetch(query);
    
    console.log(`📊 Found ${events.length} conference events\n`);
    
    events.forEach((event, index) => {
      console.log(`${index + 1}. ${event.title || 'Untitled Event'}`);
      console.log(`   ID: ${event._id}`);
      console.log(`   Register URL: "${event.registerNowUrl || 'null'}" (${event.registerUrlLength || 0} chars)`);
      console.log(`   Submit URL: "${event.submitAbstractUrl || 'null'}" (${event.submitUrlLength || 0} chars)`);
      console.log('');
    });
    
    // Focus on Research Publication event
    const researchEvent = events.find(e => e.title && e.title.toLowerCase().includes('research'));
    if (researchEvent) {
      console.log('🎯 RESEARCH PUBLICATION EVENT DETAILS:');
      console.log(`Title: ${researchEvent.title}`);
      console.log(`Register URL: "${researchEvent.registerNowUrl}"`);
      console.log(`Submit URL: "${researchEvent.submitAbstractUrl}"`);
      console.log(`Register URL Length: ${researchEvent.registerUrlLength} characters`);
      console.log(`Submit URL Length: ${researchEvent.submitUrlLength} characters`);
      
      // Check if URLs are truncated
      const expectedUrl = 'https://www.youtube.com/watch?v=fqbSpK9z4dk';
      console.log(`\n🔍 URL ANALYSIS:`);
      console.log(`Expected URL: "${expectedUrl}" (${expectedUrl.length} chars)`);
      console.log(`Actual Register URL: "${researchEvent.registerNowUrl}" (${researchEvent.registerUrlLength} chars)`);
      console.log(`URLs match: ${researchEvent.registerNowUrl === expectedUrl ? '✅ YES' : '❌ NO'}`);
      
      if (researchEvent.registerNowUrl !== expectedUrl) {
        console.log(`\n⚠️  URL TRUNCATION DETECTED!`);
        console.log(`Missing part: "${expectedUrl.substring(researchEvent.registerUrlLength || 0)}"`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing Sanity URLs:', error);
  }
}

testSanityUrls();
