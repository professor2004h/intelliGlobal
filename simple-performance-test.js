const http = require('http');
const https = require('https');

async function testPageLoad(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const loadTime = endTime - startTime;
        
        resolve({
          url,
          status: res.statusCode,
          loadTime,
          contentLength: data.length,
          headers: res.headers
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runPerformanceTest() {
  console.log('🚀 EventNextApp Simple Performance Test\n');
  
  const testUrls = [
    'http://localhost:3003',
    'http://localhost:3003/about',
    'http://localhost:3003/conferences',
    'http://localhost:3003/past-conferences',
    'http://localhost:3003/contact'
  ];
  
  const results = [];
  
  for (const url of testUrls) {
    try {
      console.log(`📊 Testing: ${url}`);
      const result = await testPageLoad(url);
      results.push(result);
      
      console.log(`  ✅ Status: ${result.status}`);
      console.log(`  ⏱️  Load Time: ${result.loadTime}ms`);
      console.log(`  📄 Content Size: ${(result.contentLength / 1024).toFixed(2)}KB`);
      console.log(`  🗜️  Compression: ${result.headers['content-encoding'] || 'none'}`);
      console.log('');
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
      results.push({ url, error: error.message });
    }
  }
  
  // Calculate averages
  const successfulResults = results.filter(r => !r.error);
  
  if (successfulResults.length > 0) {
    const avgLoadTime = successfulResults.reduce((sum, r) => sum + r.loadTime, 0) / successfulResults.length;
    const avgContentSize = successfulResults.reduce((sum, r) => sum + r.contentLength, 0) / successfulResults.length;
    
    console.log('📊 PERFORMANCE SUMMARY');
    console.log('='.repeat(40));
    console.log(`📈 Average Load Time: ${avgLoadTime.toFixed(2)}ms`);
    console.log(`📄 Average Content Size: ${(avgContentSize / 1024).toFixed(2)}KB`);
    console.log(`✅ Successful Tests: ${successfulResults.length}/${testUrls.length}`);
    
    // Performance assessment
    console.log('\n🎯 PERFORMANCE ASSESSMENT:');
    if (avgLoadTime < 500) {
      console.log('🟢 EXCELLENT - Very fast response times!');
    } else if (avgLoadTime < 1000) {
      console.log('🟡 GOOD - Acceptable response times');
    } else {
      console.log('🔴 NEEDS IMPROVEMENT - Consider further optimization');
    }
  }
  
  console.log('\n🎉 Test completed!');
}

// Check if server is running first
async function checkServer() {
  try {
    await testPageLoad('http://localhost:3003');
    console.log('✅ Server is running on port 3003\n');
    return true;
  } catch (error) {
    console.log('❌ Server not running on port 3003');
    console.log('Please start the development server with: npm run dev\n');
    return false;
  }
}

// Run the test
checkServer().then(isRunning => {
  if (isRunning) {
    runPerformanceTest();
  }
}).catch(console.error);
