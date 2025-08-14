// Test script to verify conferenceImageUrl functionality
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'tq1qdk3m',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function testConferenceImageUrl() {
  try {
    console.log('🔍 Testing Conference Image URL functionality...\n');

    // Test 1: Check if conferenceImageUrl field exists in schema
    console.log('1. Fetching conference events with conferenceImageUrl field...');
    const query = `*[_type == "conferenceEvent"] | order(date desc) {
      _id,
      title,
      slug,
      conferenceImageUrl,
      registerNowUrl,
      submitAbstractUrl,
      "imageUrl": image.asset->url
    }`;

    const conferences = await client.fetch(query);
    console.log(`✅ Found ${conferences.length} conference events\n`);

    // Test 2: Check each conference for conferenceImageUrl
    conferences.forEach((conf, index) => {
      console.log(`📋 Conference ${index + 1}: ${conf.title}`);
      console.log(`   Conference Image URL: ${conf.conferenceImageUrl || '❌ NOT SET'}`);
      console.log(`   Register URL: ${conf.registerNowUrl || '❌ NOT SET'}`);
      console.log(`   Submit Abstract URL: ${conf.submitAbstractUrl || '❌ NOT SET'}`);
      console.log(`   Event Image URL: ${conf.imageUrl || '❌ NOT SET'}`);
      console.log('');
    });

    // Test 3: Check if any conferences have conferenceImageUrl set
    const withImageUrl = conferences.filter(conf => conf.conferenceImageUrl);
    console.log(`📊 Summary:`);
    console.log(`   Total conferences: ${conferences.length}`);
    console.log(`   With Conference Image URL: ${withImageUrl.length}`);
    console.log(`   Without Conference Image URL: ${conferences.length - withImageUrl.length}`);

    if (withImageUrl.length > 0) {
      console.log('\n✅ Conference Image URL field is working!');
      console.log('🔗 Conferences with image URLs:');
      withImageUrl.forEach(conf => {
        console.log(`   - ${conf.title}: ${conf.conferenceImageUrl}`);
      });
    } else {
      console.log('\n⚠️  No conferences have Conference Image URL set yet.');
      console.log('💡 To test the functionality:');
      console.log('   1. Go to: https://intelliglobalconferences.sanity.studio/structure/conferenceEvent');
      console.log('   2. Edit any conference event');
      console.log('   3. Add a URL in the "Conference Image URL" field');
      console.log('   4. Save and test on the frontend');
    }

  } catch (error) {
    console.error('❌ Error testing Conference Image URL:', error);
  }
}

testConferenceImageUrl();
