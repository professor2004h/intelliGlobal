// Quick test script to check testimonials data
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'tq1qdk3m',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function testTestimonials() {
  try {
    console.log('🔍 Testing testimonials data...');
    
    // Check all testimonials documents
    const allDocs = await client.fetch(`*[_type == "testimonialsSection"]{
      _id,
      _type,
      sectionTitle,
      isActive,
      testimonials
    }`);
    
    console.log('📊 All testimonials documents:', JSON.stringify(allDocs, null, 2));
    
    // Check active testimonials
    const activeDocs = await client.fetch(`*[_type == "testimonialsSection" && isActive == true]{
      _id,
      sectionTitle,
      isActive,
      testimonials
    }`);
    
    console.log('✅ Active testimonials documents:', JSON.stringify(activeDocs, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing testimonials:', error);
  }
}

testTestimonials();
