// Direct Sanity connection test without Next.js
const { createClient } = require('next-sanity');

console.log('🔍 DIRECT SANITY CONNECTION TEST');
console.log('================================');

const client = createClient({
  projectId: 'tq1qdk3m',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
  perspective: 'published'
});

async function testDirectConnection() {
  console.log('\n1. Testing basic connection...');
  try {
    const basicTest = await client.fetch('*[_type == "siteSettings"][0]._id');
    console.log('✅ Basic connection successful');
  } catch (error) {
    console.error('❌ Basic connection failed:', error.message);
    return false;
  }

  console.log('\n2. Testing conference events...');
  try {
    const conferences = await client.fetch(`
      *[_type == "conferenceEvent"] {
        _id,
        title,
        location,
        date
      }
    `);
    console.log(`✅ Found ${conferences.length} conference events`);
    conferences.forEach((c, i) => {
      console.log(`   ${i+1}. "${c.title}" - ${c.location}`);
    });
  } catch (error) {
    console.error('❌ Conference events failed:', error.message);
  }

  console.log('\n3. Testing sponsorship tiers...');
  try {
    const tiers = await client.fetch(`
      *[_type == "sponsorshipTiers"] {
        _id,
        name,
        price
      }
    `);
    console.log(`✅ Found ${tiers.length} sponsorship tiers`);
    tiers.forEach((t, i) => {
      console.log(`   ${i+1}. "${t.name}" - $${t.price}`);
    });
  } catch (error) {
    console.error('❌ Sponsorship tiers failed:', error.message);
  }

  console.log('\n4. Testing about content...');
  try {
    const about = await client.fetch(`
      *[_type == "about"][0] {
        _id,
        title
      }
    `);
    console.log(`✅ About content: ${about ? 'Found' : 'Not found'}`);
    if (about) {
      console.log(`   Title: "${about.title}"`);
    }
  } catch (error) {
    console.error('❌ About content failed:', error.message);
  }

  console.log('\n5. Testing all document types...');
  try {
    const allTypes = await client.fetch(`
      array::unique(*[]._type)
    `);
    console.log('✅ Available document types:', allTypes);
  } catch (error) {
    console.error('❌ Document types query failed:', error.message);
  }

  return true;
}

testDirectConnection().then(() => {
  console.log('\n🎉 DIRECT CONNECTION TEST COMPLETED');
}).catch(error => {
  console.error('\n❌ DIRECT CONNECTION TEST FAILED:', error);
});
