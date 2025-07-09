// Simple test to verify API endpoints are accessible
async function testAPI() {
  console.log('🧪 Testing API endpoints accessibility...\n');
  
  const BASE_URL = 'http://localhost:3002';
  
  // Test 1: Health check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    console.log(`   Status: ${healthResponse.status}`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   ✅ Health endpoint working');
    }
  } catch (error) {
    console.log('   ❌ Health endpoint failed:', error.message);
  }
  
  // Test 2: Payment order creation (should fail with validation error for missing data)
  try {
    console.log('\n2. Testing payment order creation endpoint...');
    const orderResponse = await fetch(`${BASE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Empty body to test validation
    });
    console.log(`   Status: ${orderResponse.status}`);
    const orderData = await orderResponse.json();
    console.log('   ✅ Payment order endpoint accessible');
    console.log('   Response:', orderData);
  } catch (error) {
    console.log('   ❌ Payment order endpoint failed:', error.message);
  }
  
  // Test 3: Payment verification (should fail with validation error)
  try {
    console.log('\n3. Testing payment verification endpoint...');
    const verifyResponse = await fetch(`${BASE_URL}/api/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Empty body to test validation
    });
    console.log(`   Status: ${verifyResponse.status}`);
    const verifyData = await verifyResponse.json();
    console.log('   ✅ Payment verification endpoint accessible');
    console.log('   Response:', verifyData);
  } catch (error) {
    console.log('   ❌ Payment verification endpoint failed:', error.message);
  }
  
  console.log('\n🏁 API endpoint tests completed!');
}

testAPI().catch(console.error);
