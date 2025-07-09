// Direct test of conference data fetching
const { createClient } = require('next-sanity');

const client = createClient({
  projectId: "tq1qdk3m",
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: false,
  token: undefined,
});

async function testConferences() {
  try {
    console.log('🔍 Testing direct conference fetch...');
    
    const query = `*[_type == "conferenceEvent"] | order(date desc) {
      _id,
      title,
      slug,
      date,
      location,
      image {
        asset -> {
          url
        }
      }
    }`;

    console.log('📝 Query:', query);
    
    const conferences = await client.fetch(query);
    
    console.log('📊 Raw result:', JSON.stringify(conferences, null, 2));
    console.log(`📅 Found ${conferences?.length || 0} conferences`);
    
    if (conferences && conferences.length > 0) {
      console.log('✅ Conference titles:');
      conferences.forEach((conf, index) => {
        console.log(`  ${index + 1}. ${conf.title} (ID: ${conf._id})`);
      });
    } else {
      console.log('❌ No conferences found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testConferences();
