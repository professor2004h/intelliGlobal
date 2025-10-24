/**
 * Verification Script for New Sanity Credentials
 * This script tests the connection to the new Sanity project
 */

const sanityClient = require('@sanity/client');

// New credentials
const client = sanityClient.default({
  projectId: '99kpz7t0',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: 'sk9AT29IvzRfmgY689QmLwq0DjIvPznQlIyXqLgsS3x1heb7HMZnYQvVzdvsOKaW96yBW6At143GLei8Ss9eXEe2DdxrS4Gop6KAP3tbTbGYXC8m2mq3D9UHRloFdDQbvEmF2ZKqkE9wd3NbD1q5an7vIqLzCpY80BkM0LfAYZBVLZg86cES'
});

console.log('========================================');
console.log('SANITY CREDENTIAL VERIFICATION');
console.log('========================================');
console.log('');
console.log('Testing connection to new Sanity project...');
console.log('Project ID: 99kpz7t0');
console.log('Dataset: production');
console.log('');

async function verifyConnection() {
  try {
    // Test 1: Fetch project info
    console.log('Test 1: Fetching project configuration...');
    const datasets = await client.datasets.list();
    console.log('✓ Successfully connected to Sanity project');
    console.log(`  Available datasets: ${datasets.map(d => d.name).join(', ')}`);
    console.log('');

    // Test 2: Query for documents
    console.log('Test 2: Querying for documents...');
    const query = '*[_type == "siteSettings"][0]';
    const result = await client.fetch(query);
    
    if (result) {
      console.log('✓ Successfully fetched data from Sanity');
      console.log(`  Document type: ${result._type}`);
      console.log(`  Document ID: ${result._id}`);
    } else {
      console.log('⚠ No siteSettings document found (project may be empty)');
    }
    console.log('');

    // Test 3: Count all documents
    console.log('Test 3: Counting all documents...');
    const countQuery = 'count(*)';
    const totalDocs = await client.fetch(countQuery);
    console.log(`✓ Total documents in project: ${totalDocs}`);
    console.log('');

    // Test 4: List document types
    console.log('Test 4: Listing document types...');
    const typesQuery = 'array::unique(*[]._type)';
    const types = await client.fetch(typesQuery);
    console.log(`✓ Document types found: ${types.length}`);
    if (types.length > 0) {
      console.log(`  Types: ${types.join(', ')}`);
    }
    console.log('');

    // Summary
    console.log('========================================');
    console.log('VERIFICATION SUMMARY');
    console.log('========================================');
    console.log('✓ Connection: SUCCESS');
    console.log('✓ Authentication: SUCCESS');
    console.log('✓ Data Access: SUCCESS');
    console.log(`✓ Total Documents: ${totalDocs}`);
    console.log(`✓ Document Types: ${types.length}`);
    console.log('');
    console.log('🎉 All tests passed! New credentials are working correctly.');
    console.log('');

    if (totalDocs === 0) {
      console.log('⚠ NOTE: The project appears to be empty.');
      console.log('  You may need to:');
      console.log('  1. Migrate data from the old project');
      console.log('  2. Create new content in Sanity Studio');
      console.log('  3. Import sample data');
      console.log('');
    }

  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('VERIFICATION FAILED');
    console.error('========================================');
    console.error('✗ Error:', error.message);
    console.error('');
    console.error('Possible issues:');
    console.error('1. Invalid API token');
    console.error('2. Incorrect project ID');
    console.error('3. Network connectivity issues');
    console.error('4. API token lacks required permissions');
    console.error('');
    console.error('Please check:');
    console.error('- Project ID: 99kpz7t0');
    console.error('- Dataset: production');
    console.error('- API token permissions in Sanity dashboard');
    console.error('');
    process.exit(1);
  }
}

// Run verification
verifyConnection();

