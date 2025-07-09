const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'tq1qdk3m',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function testConnection() {
  console.log('🔍 Testing Sanity Backend Connection...\n');
  
  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const basicTest = await client.fetch('*[_type == "siteSettings"][0]._id');
    console.log('✅ Basic connection successful');
    
    // Test 2: Site Settings
    console.log('\n2. Testing site settings...');
    const siteSettings = await client.fetch(`*[_type == "siteSettings"][0]{
      _id,
      logo,
      email,
      phone,
      socialMedia,
      favicon
    }`);
    console.log('✅ Site settings:', siteSettings ? 'Available' : 'Not found');
    
    // Test 3: Hero Section
    console.log('\n3. Testing hero section...');
    const heroSection = await client.fetch(`*[_type == "heroSection"][0]{
      _id,
      welcomeText,
      images,
      slideshowSettings
    }`);
    console.log('✅ Hero section:', heroSection ? 'Available' : 'Not found');
    
    // Test 4: Conference Events
    console.log('\n4. Testing conference events...');
    const events = await client.fetch(`*[_type == "conferenceEvent"][0...3]{
      _id,
      title,
      date,
      location
    }`);
    console.log('✅ Conference events:', events?.length || 0, 'found');
    
    // Test 5: Statistics
    console.log('\n5. Testing statistics...');
    const statistics = await client.fetch(`*[_type == "statistics"][0]{
      _id,
      title,
      statistics
    }`);
    console.log('✅ Statistics:', statistics ? 'Available' : 'Not found');
    
    // Test 6: About section
    console.log('\n6. Testing about section...');
    const about = await client.fetch(`*[_type == "about"][0]{
      _id,
      title,
      description
    }`);
    console.log('✅ About section:', about ? 'Available' : 'Not found');
    
    console.log('\n🎉 All tests passed! Sanity backend is properly connected.');
    console.log('\n📋 Summary:');
    console.log('- Project ID: tq1qdk3m');
    console.log('- Dataset: production');
    console.log('- API Version: 2024-01-01');
    console.log('- CDN: Disabled for real-time updates');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Check if Sanity Studio is running on port 3333');
    console.error('2. Verify project ID and dataset in configuration');
    console.error('3. Ensure you have proper permissions');
    console.error('4. Check network connectivity');
  }
}

testConnection();
