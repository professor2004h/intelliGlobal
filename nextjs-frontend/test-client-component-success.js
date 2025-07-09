// Comprehensive test to verify Client Component fix is working
const http = require('http');

console.log('🎯 Testing Client Component Fix for Sponsor Registration Page');
console.log('=' .repeat(60));

async function testSponsorPage() {
  return new Promise((resolve) => {
    const req = http.request('http://localhost:3001/sponsorship/register', (res) => {
      console.log(`📊 Response Status: ${res.statusCode}`);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Page loaded successfully!');
          console.log(`📄 Content length: ${data.length} characters`);
          
          // Test for key indicators that the Client Component is working
          const tests = [
            {
              name: 'Contains Sponsor Registration Form',
              test: () => data.includes('Sponsor Registration') || data.includes('sponsor'),
              critical: true
            },
            {
              name: 'Contains Form Elements',
              test: () => data.includes('<form') && data.includes('</form>'),
              critical: true
            },
            {
              name: 'No Server Component Error',
              test: () => !data.includes('Event handlers cannot be passed to Client Component props'),
              critical: true
            },
            {
              name: 'No Webpack Module Error',
              test: () => !data.includes('Module not found') && !data.includes('webpack'),
              critical: true
            },
            {
              name: 'Contains Interactive Elements',
              test: () => data.includes('input') || data.includes('button') || data.includes('select'),
              critical: false
            },
            {
              name: 'No Runtime Errors Visible',
              test: () => !data.includes('Error:') && !data.includes('TypeError'),
              critical: true
            },
            {
              name: 'Contains Next.js App Structure',
              test: () => data.includes('_next') && data.includes('__next'),
              critical: false
            }
          ];
          
          console.log('\n🧪 Running Tests:');
          console.log('-'.repeat(40));
          
          let passedTests = 0;
          let criticalFailures = 0;
          
          tests.forEach((test, index) => {
            const result = test.test();
            const status = result ? '✅ PASS' : '❌ FAIL';
            const critical = test.critical ? ' (CRITICAL)' : '';
            
            console.log(`${index + 1}. ${test.name}: ${status}${critical}`);
            
            if (result) {
              passedTests++;
            } else if (test.critical) {
              criticalFailures++;
            }
          });
          
          console.log('\n📈 Test Results:');
          console.log('-'.repeat(40));
          console.log(`✅ Passed: ${passedTests}/${tests.length}`);
          console.log(`❌ Failed: ${tests.length - passedTests}/${tests.length}`);
          console.log(`🚨 Critical Failures: ${criticalFailures}`);
          
          if (criticalFailures === 0) {
            console.log('\n🎉 SUCCESS: Client Component fix is working!');
            console.log('✅ The sponsor registration page loads without errors');
            console.log('✅ No "Event handlers cannot be passed to Client Component props" error');
            console.log('✅ Form should be interactive and functional');
            console.log('\n🌐 Page is accessible at: http://localhost:3001/sponsorship/register');
          } else {
            console.log('\n❌ ISSUES DETECTED: Some critical tests failed');
            console.log('⚠️  Manual verification may be needed');
          }
          
          resolve({ success: criticalFailures === 0, passedTests, totalTests: tests.length });
        } else {
          console.log(`❌ HTTP Error: ${res.statusCode}`);
          resolve({ success: false, error: `HTTP ${res.statusCode}` });
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Request Error: ${err.message}`);
      resolve({ success: false, error: err.message });
    });
    
    req.setTimeout(15000, () => {
      console.log('⏰ Request timeout');
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });
    
    req.end();
  });
}

// Run the test
testSponsorPage().then(result => {
  console.log('\n' + '='.repeat(60));
  if (result.success) {
    console.log('🏆 FINAL RESULT: CLIENT COMPONENT FIX SUCCESSFUL!');
    process.exit(0);
  } else {
    console.log('💥 FINAL RESULT: Issues detected - manual verification needed');
    process.exit(1);
  }
});
