// Debug script to test conference data fetching in Next.js environment
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'tq1qdk3m',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function debugConferenceData() {
  try {
    console.log('🔍 Debugging conference data for frontend...');
    
    // Test the exact query used by getConferenceEvents function
    const frontendQuery = `*[
      _type == "conferenceEvent" && defined(slug.current)
    ]|order(date desc)[0...12]{
      _id,
      title,
      slug,
      date,
      location,
      email,
      registerNowUrl,
      submitAbstractUrl,
      "imageUrl": image.asset->url
    }`;
    
    console.log('📝 Executing frontend query...');
    const events = await client.fetch(frontendQuery);
    
    console.log(`\n📊 Total events found: ${events.length}`);
    
    events.forEach((event, index) => {
      console.log(`\n📋 Event ${index + 1}:`);
      console.log('  Title:', event.title);
      console.log('  ID:', event._id);
      console.log('  Slug:', event.slug?.current);
      console.log('  Date:', event.date);
      console.log('  Location:', event.location);
      console.log('  Email:', event.email || 'NOT SET');
      console.log('  Register Now URL:', event.registerNowUrl || 'NOT SET');
      console.log('  Submit Abstract URL:', event.submitAbstractUrl || 'NOT SET');
      console.log('  Image URL:', event.imageUrl || 'NOT SET');
      
      // Check if this is the Research Publication event
      if (event.title && event.title.toLowerCase().includes('research publication')) {
        console.log('  🎯 THIS IS THE RESEARCH PUBLICATION EVENT!');
        console.log('  🔗 Register URL Present:', !!event.registerNowUrl);
        console.log('  🔗 Submit URL Present:', !!event.submitAbstractUrl);
      }
    });
    
    // Test boolean evaluation
    const researchEvent = events.find(e => 
      e.title && e.title.toLowerCase().includes('research publication')
    );
    
    if (researchEvent) {
      console.log('\n🧪 Testing boolean evaluation for Research Publication:');
      console.log('  registerNowUrl value:', JSON.stringify(researchEvent.registerNowUrl));
      console.log('  submitAbstractUrl value:', JSON.stringify(researchEvent.submitAbstractUrl));
      console.log('  registerNowUrl truthy?', !!researchEvent.registerNowUrl);
      console.log('  submitAbstractUrl truthy?', !!researchEvent.submitAbstractUrl);
      console.log('  registerNowUrl type:', typeof researchEvent.registerNowUrl);
      console.log('  submitAbstractUrl type:', typeof researchEvent.submitAbstractUrl);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugConferenceData();
