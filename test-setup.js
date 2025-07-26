#!/usr/bin/env node

const { createClient } = require('@sanity/client');

console.log('🔍 Testing Event Website Setup...\n');

// Test Sanity connection
const client = createClient({
  projectId: 'tq1qdk3m',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
  perspective: 'published'
});

async function testSetup() {
  try {
    console.log('✅ Environment Check:');
    console.log(`   Node.js: ${process.version}`);
    console.log(`   Working Directory: ${process.cwd()}`);
    console.log('');

    console.log('🔗 Testing Sanity CMS Connection...');
    
    // Test basic connection
    const result = await client.fetch('*[_type == "conference"][0..2]{title, _id}');
    
    if (result && result.length > 0) {
      console.log('✅ Sanity CMS: Connected successfully');
      console.log(`   Found ${result.length} conference(s)`);
      result.forEach((conf, index) => {
        console.log(`   ${index + 1}. ${conf.title || 'Untitled'} (${conf._id})`);
      });
    } else {
      console.log('⚠️  Sanity CMS: Connected but no conferences found');
      console.log('   This is normal for a fresh setup');
    }
    
    console.log('');
    console.log('🌐 Service URLs:');
    console.log('   Sanity Studio: http://localhost:3333');
    console.log('   Frontend App:  http://localhost:3000');
    console.log('');
    console.log('🎉 Setup verification complete!');
    console.log('');
    console.log('📝 Next Steps:');
    console.log('   1. Start services: npm run dev (in both directories)');
    console.log('   2. Open Sanity Studio to add content');
    console.log('   3. View your website at localhost:3000');
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Check internet connection');
    console.log('   2. Verify environment variables in .env.local');
    console.log('   3. Ensure Sanity project ID is correct');
  }
}

testSetup();
