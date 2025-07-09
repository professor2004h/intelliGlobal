const puppeteer = require('puppeteer');

async function testPerformance() {
  console.log('🚀 Starting EventNextApp Performance Test...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Enable performance monitoring
  await page.setCacheEnabled(false); // Test without cache first
  
  const testPages = [
    { name: 'Homepage', url: 'http://localhost:3002' },
    { name: 'About Page', url: 'http://localhost:3002/about' },
    { name: 'Conferences', url: 'http://localhost:3002/conferences' },
    { name: 'Past Conferences', url: 'http://localhost:3002/past-conferences' },
    { name: 'Contact', url: 'http://localhost:3002/contact' }
  ];
  
  const results = [];
  
  for (const testPage of testPages) {
    console.log(`📊 Testing ${testPage.name}...`);
    
    try {
      // Start performance measurement
      const startTime = Date.now();
      
      // Navigate to page
      const response = await page.goto(testPage.url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      // Get performance metrics
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          transferSize: navigation.transferSize,
          encodedBodySize: navigation.encodedBodySize
        };
      });
      
      // Check for console errors
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      const result = {
        page: testPage.name,
        url: testPage.url,
        status: response.status(),
        loadTime: loadTime,
        metrics: performanceMetrics,
        errors: errors.length
      };
      
      results.push(result);
      
      console.log(`  ✅ Status: ${result.status}`);
      console.log(`  ⏱️  Load Time: ${result.loadTime}ms`);
      console.log(`  🎨 First Paint: ${result.metrics.firstPaint.toFixed(2)}ms`);
      console.log(`  📄 First Contentful Paint: ${result.metrics.firstContentfulPaint.toFixed(2)}ms`);
      console.log(`  📦 Transfer Size: ${(result.metrics.transferSize / 1024).toFixed(2)}KB`);
      console.log(`  ❌ Errors: ${result.errors}\n`);
      
    } catch (error) {
      console.error(`  ❌ Error testing ${testPage.name}:`, error.message);
      results.push({
        page: testPage.name,
        url: testPage.url,
        error: error.message
      });
    }
  }
  
  await browser.close();
  
  // Generate performance report
  console.log('📊 PERFORMANCE REPORT\n');
  console.log('='.repeat(60));
  
  const successfulTests = results.filter(r => !r.error);
  
  if (successfulTests.length > 0) {
    const avgLoadTime = successfulTests.reduce((sum, r) => sum + r.loadTime, 0) / successfulTests.length;
    const avgFirstPaint = successfulTests.reduce((sum, r) => sum + r.metrics.firstPaint, 0) / successfulTests.length;
    const avgFCP = successfulTests.reduce((sum, r) => sum + r.metrics.firstContentfulPaint, 0) / successfulTests.length;
    const totalTransferSize = successfulTests.reduce((sum, r) => sum + r.metrics.transferSize, 0);
    
    console.log(`📈 AVERAGE PERFORMANCE METRICS:`);
    console.log(`   Load Time: ${avgLoadTime.toFixed(2)}ms`);
    console.log(`   First Paint: ${avgFirstPaint.toFixed(2)}ms`);
    console.log(`   First Contentful Paint: ${avgFCP.toFixed(2)}ms`);
    console.log(`   Total Transfer Size: ${(totalTransferSize / 1024).toFixed(2)}KB`);
    console.log(`   Pages Tested: ${successfulTests.length}/${testPages.length}`);
    
    // Performance grades
    console.log(`\n🎯 PERFORMANCE GRADES:`);
    console.log(`   Load Time: ${avgLoadTime < 1500 ? '🟢 EXCELLENT' : avgLoadTime < 3000 ? '🟡 GOOD' : '🔴 NEEDS IMPROVEMENT'}`);
    console.log(`   First Paint: ${avgFirstPaint < 1000 ? '🟢 EXCELLENT' : avgFirstPaint < 2000 ? '🟡 GOOD' : '🔴 NEEDS IMPROVEMENT'}`);
    console.log(`   First Contentful Paint: ${avgFCP < 1500 ? '🟢 EXCELLENT' : avgFCP < 2500 ? '🟡 GOOD' : '🔴 NEEDS IMPROVEMENT'}`);
  }
  
  // Show individual results
  console.log(`\n📋 DETAILED RESULTS:`);
  results.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.page}: ERROR - ${result.error}`);
    } else {
      console.log(`✅ ${result.page}: ${result.loadTime}ms (${result.status})`);
    }
  });
  
  console.log('\n🎉 Performance test completed!');
}

// Run the test
testPerformance().catch(console.error);
