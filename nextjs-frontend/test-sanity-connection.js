const { createClient } = require('next-sanity');

console.log('🔍 Testing Sanity CMS Connection...\n');

// Create Sanity client with exact same config as the app
const client = createClient({
  projectId: 'tq1qdk3m',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
  perspective: 'published'
});

async function testConnection() {
  try {
    console.log('📡 Testing basic connection...');
    const result = await client.fetch('*[_type == "siteSettings"][0]._id');
    console.log('✅ Basic connection successful');
    
    console.log('\n🧪 Testing all data fetching functions...');
    
    // Test conferences
    console.log('📋 Testing conferences...');
    const conferences = await client.fetch(`
      *[_type == "conference"] | order(_createdAt desc) {
        _id,
        title,
        location,
        startDate,
        endDate,
        description,
        registerNowUrl,
        submitAbstractUrl,
        "imageUrl": image.asset->url
      }
    `);
    console.log(`✅ Found ${conferences.length} conferences`);
    conferences.slice(0, 3).forEach((c, i) => {
      console.log(`   ${i+1}. "${c.title}" - ${c.location}`);
    });
    
    // Test sponsorship tiers
    console.log('\n💰 Testing sponsorship tiers...');
    const sponsorshipTiers = await client.fetch(`
      *[_type == "sponsorshipTier"] | order(price asc) {
        _id,
        name,
        price,
        description,
        benefits,
        featured
      }
    `);
    console.log(`✅ Found ${sponsorshipTiers.length} sponsorship tiers`);
    sponsorshipTiers.forEach((t, i) => {
      console.log(`   ${i+1}. "${t.name}" - $${t.price}`);
    });
    
    // Test about us content
    console.log('\n📖 Testing about us content...');
    const aboutUs = await client.fetch(`
      *[_type == "aboutUs"][0] {
        _id,
        title,
        description,
        "imageUrl": image.asset->url
      }
    `);
    console.log(`✅ About us content: ${aboutUs ? 'Found' : 'Not found'}`);
    if (aboutUs) {
      console.log(`   Title: "${aboutUs.title}"`);
    }
    
    // Test site settings
    console.log('\n⚙️ Testing site settings...');
    const siteSettings = await client.fetch(`
      *[_type == "siteSettings"][0] {
        _id,
        siteName,
        contactInfo
      }
    `);
    console.log(`✅ Site settings: ${siteSettings ? 'Found' : 'Not found'}`);
    if (siteSettings) {
      console.log(`   Site name: "${siteSettings.siteName}"`);
    }
    
    // Test past conferences styling
    console.log('\n🎨 Testing past conferences styling...');
    const pastConferencesStyling = await client.fetch(`
      *[_type == "pastConferencesSectionStyling"][0] {
        _id,
        enabled,
        backgroundImage,
        overlayColor,
        overlayOpacity
      }
    `);
    console.log(`✅ Past conferences styling: ${pastConferencesStyling ? 'Found' : 'Not found'}`);
    
    console.log('\n🎉 ALL SANITY CMS TESTS PASSED!');
    console.log('✅ Connection working');
    console.log('✅ All data types accessible');
    console.log('✅ Backend integration functional');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ SANITY CONNECTION TEST FAILED:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('\n🔧 Network connectivity issue detected');
      console.error('This suggests a network or DNS problem, not a configuration issue');
    } else if (error.message.includes('Unauthorized') || error.message.includes('403')) {
      console.error('\n🔧 Authentication issue detected');
      console.error('Check project ID and dataset permissions');
    } else {
      console.error('\n🔧 Configuration issue detected');
      console.error('Check project ID: tq1qdk3m');
      console.error('Check dataset: production');
    }
    
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
