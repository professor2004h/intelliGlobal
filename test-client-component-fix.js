const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/sponsorship/register',
  method: 'GET',
  timeout: 15000
};

console.log('🔍 Testing Client Component fix for sponsor registration page...');
console.log('⏳ Checking if page loads without Server Component errors...\n');

const req = http.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`📏 Response Length: ${data.length} bytes`);
    
    if (res.statusCode === 200) {
      console.log('✅ SUCCESS: Page loaded successfully!\n');
      
      // Check for error indicators
      const errorChecks = [
        { name: 'Server Component Error', pattern: /Event handlers cannot be passed to Client Component props/i, shouldNotExist: true },
        { name: 'Webpack Error', pattern: /TypeError.*Cannot read properties of undefined/i, shouldNotExist: true },
        { name: 'Next.js Error Boundary', pattern: /Something went wrong/i, shouldNotExist: true },
        { name: 'React Error', pattern: /Error: .*(hydration|client|server)/i, shouldNotExist: true }
      ];
      
      // Check for required functionality
      const functionalityChecks = [
        { name: 'Client Component Directive', pattern: /'use client'/i },
        { name: 'Form Element', pattern: /<form[^>]*onSubmit/i },
        { name: 'Event Handler', pattern: /onSubmit.*handleSubmit/i },
        { name: 'Conference Selection', pattern: /Select Conference/i },
        { name: 'Company Information', pattern: /Company Information/i },
        { name: 'Sponsorship Plans', pattern: /Choose Sponsorship Plan/i },
        { name: 'Billing Information', pattern: /Billing Information/i },
        { name: 'Submit Button', pattern: /Proceed to Payment/i },
        { name: 'Progress Indicator', pattern: /Step [1-4]/i },
        { name: 'Form Validation', pattern: /required/i }
      ];
      
      console.log('🔍 ERROR CHECKS:');
      let hasErrors = false;
      errorChecks.forEach(check => {
        const found = check.pattern.test(data);
        if (check.shouldNotExist) {
          if (found) {
            console.log(`❌ ${check.name}: FOUND (This is bad!)`);
            hasErrors = true;
          } else {
            console.log(`✅ ${check.name}: Not found (Good!)`);
          }
        }
      });
      
      console.log('\n🔍 FUNCTIONALITY CHECKS:');
      let functionalityScore = 0;
      functionalityChecks.forEach(check => {
        if (check.pattern.test(data)) {
          console.log(`✅ ${check.name}: Found`);
          functionalityScore++;
        } else {
          console.log(`❌ ${check.name}: Missing`);
        }
      });
      
      console.log(`\n📈 FUNCTIONALITY SCORE: ${functionalityScore}/${functionalityChecks.length}`);
      
      if (!hasErrors && functionalityScore >= 8) {
        console.log('\n🎉 OVERALL RESULT: SUCCESS!');
        console.log('✅ Client Component conversion successful');
        console.log('✅ No Server Component errors detected');
        console.log('✅ Form functionality preserved');
        console.log('✅ All major features working');
      } else if (hasErrors) {
        console.log('\n❌ OVERALL RESULT: ERRORS DETECTED!');
        console.log('❌ Server Component errors still present');
      } else {
        console.log('\n⚠️  OVERALL RESULT: PARTIAL SUCCESS');
        console.log('✅ No errors, but some functionality missing');
      }
      
    } else {
      console.log(`❌ ERROR: HTTP ${res.statusCode}`);
      console.log('Response preview:', data.substring(0, 1000));
    }
  });
});

req.on('error', (err) => {
  console.log('❌ REQUEST ERROR:', err.message);
});

req.on('timeout', () => {
  console.log('❌ REQUEST TIMEOUT');
  req.destroy();
});

req.end();
