// Test script to fetch and display conference data from Sanity
const { createClient } = require('@sanity/client');

// Initialize Sanity client with correct configuration
const client = createClient({
  projectId: '99kpz7t0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function testConferenceData() {
  try {
    console.log('🔍 Testing conference data fetch from Sanity...');
    
    // Test basic connection
    console.log('\n1. Testing Sanity connection...');
    const healthCheck = await client.fetch('*[_type == "conferenceEvent"][0...1]');
    console.log('✅ Connection successful, sample data:', healthCheck);
    
    // Fetch all conferences with detailed information
    console.log('\n2. Fetching detailed conference data...');
    const query = `*[_type == "conferenceEvent"] | order(date desc) {
      _id,
      title,
      slug,
      date,
      location,
      email,
      eventDomain,
      description,
      shortDescription,
      attendeeCount,
      topics,
      highlights,
      keySpeakers[]{
        name,
        title,
        organization
      },
      image {
        asset -> {
          url
        }
      }
    }`;
    
    const conferences = await client.fetch(query);
    console.log(`📊 Found ${conferences.length} conferences`);
    
    // Display conference details
    console.log('\n3. Conference Details:');
    conferences.forEach((conf, index) => {
      console.log(`\n--- Conference ${index + 1} ---`);
      console.log(`📅 Title: ${conf.title}`);
      console.log(`📍 Location: ${conf.location}`);
      console.log(`🗓️ Date: ${conf.date}`);
      
      if (conf.email) console.log(`📧 Email: ${conf.email}`);
      if (conf.eventDomain) console.log(`🌐 Domain: ${conf.eventDomain}`);
      if (conf.attendeeCount) console.log(`👥 Attendees: ${conf.attendeeCount}`);
      
      if (conf.topics && conf.topics.length > 0) {
        console.log(`🏷️ Topics: ${conf.topics.join(', ')}`);
      }
      
      if (conf.highlights && conf.highlights.length > 0) {
        console.log(`✨ Highlights: ${conf.highlights.slice(0, 3).join(', ')}`);
      }
      
      if (conf.keySpeakers && conf.keySpeakers.length > 0) {
        console.log(`🎤 Key Speakers: ${conf.keySpeakers.map(s => s.name).join(', ')}`);
      }
      
      // Check for technology keywords
      const techKeywords = ['robotics', 'robot', 'ai', 'artificial intelligence', 'machine learning', 'ml', 'technology', 'tech', 'hi', 'hello', 'automation', 'digital', 'cyber', 'data', 'blockchain', 'iot', 'cloud', 'software', 'hardware', 'innovation'];
      
      const hasTechKeywords = techKeywords.some(keyword => 
        conf.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        conf.description?.toLowerCase().includes(keyword.toLowerCase()) ||
        conf.topics?.some(topic => topic.toLowerCase().includes(keyword.toLowerCase()))
      );
      
      if (hasTechKeywords) {
        console.log('🤖 TECHNOLOGY-RELATED CONFERENCE ✅');
      }
    });
    
    // Filter and display technology-related conferences
    const techConferences = conferences.filter(conf => {
      const techKeywords = ['robotics', 'robot', 'ai', 'artificial intelligence', 'machine learning', 'ml', 'technology', 'tech', 'hi', 'hello', 'automation', 'digital', 'cyber', 'data', 'blockchain', 'iot', 'cloud', 'software', 'hardware', 'innovation'];
      
      return techKeywords.some(keyword => 
        conf.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        conf.description?.toLowerCase().includes(keyword.toLowerCase()) ||
        conf.topics?.some(topic => topic.toLowerCase().includes(keyword.toLowerCase()))
      );
    });
    
    console.log(`\n🤖 TECHNOLOGY-RELATED CONFERENCES: ${techConferences.length} found`);
    techConferences.forEach((conf, index) => {
      console.log(`${index + 1}. ${conf.title} (${conf.location})`);
    });
    
    console.log('\n✅ Conference data test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing conference data:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
}

// Run the test
testConferenceData();
