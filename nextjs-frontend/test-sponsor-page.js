const http = require('http');

// Test function to check if sponsor registration page is working
async function testSponsorPage() {
  console.log('🔍 Testing Sponsor Registration Page...\n');
  
  const ports = [3000, 3001, 3002, 3003, 3004];
  
  for (const port of ports) {
    try {
      console.log(`Testing port ${port}...`);
      
      const response = await makeRequest(`http://localhost:${port}/sponsorship/register`);
      
      if (response.statusCode === 200) {
        console.log(`✅ SUCCESS: Port ${port} - Sponsor registration page is accessible`);
        console.log(`   Status: ${response.statusCode}`);
        console.log(`   Content-Type: ${response.headers['content-type']}`);
        
        // Check if it's HTML content
        if (response.headers['content-type']?.includes('text/html')) {
          console.log(`   ✅ HTML content detected - page is rendering properly`);
        }
        
        // Test API endpoints on the same port
        await testAPIEndpoints(port);
        
        return; // Exit after finding working port
      }
    } catch (error) {
      console.log(`❌ Port ${port}: ${error.message}`);
    }
  }
  
  console.log('\n❌ No working server found on any port');
}

// Test API endpoints
async function testAPIEndpoints(port) {
  console.log(`\n🔍 Testing API endpoints on port ${port}...`);
  
  const endpoints = [
    '/api/conferences',
    '/api/sponsorship-tiers'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`http://localhost:${port}${endpoint}`);
      
      if (response.statusCode === 200) {
        console.log(`   ✅ ${endpoint}: Status ${response.statusCode}`);
        
        // Try to parse JSON response
        try {
          const data = JSON.parse(response.data);
          if (Array.isArray(data)) {
            console.log(`      📊 Data: Array with ${data.length} items`);
            if (data.length > 0) {
              console.log(`      📝 Sample: ${JSON.stringify(data[0]).substring(0, 100)}...`);
            }
          } else {
            console.log(`      📊 Data: Object with keys: ${Object.keys(data).join(', ')}`);
          }
        } catch (parseError) {
          console.log(`      ⚠️  Response is not valid JSON`);
        }
      } else {
        console.log(`   ❌ ${endpoint}: Status ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint}: ${error.message}`);
    }
  }
}

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          data: data
        });
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    // Set timeout
    request.setTimeout(5000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Run the test
testSponsorPage().catch(console.error);
