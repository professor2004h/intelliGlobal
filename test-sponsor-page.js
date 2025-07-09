const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/sponsorship/register',
  method: 'GET',
  timeout: 10000
};

console.log('Testing sponsor registration page...');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Response Length: ${data.length} bytes`);
    
    if (res.statusCode === 200) {
      console.log('✅ SUCCESS: Page loaded successfully!');
      
      // Check for key elements
      const checks = [
        { name: 'Title', pattern: /Sponsor Registration/i },
        { name: 'Form', pattern: /<form/i },
        { name: 'Conference Selection', pattern: /Select Conference/i },
        { name: 'Company Details', pattern: /Company Information/i },
        { name: 'Sponsorship Plans', pattern: /Sponsorship Plan/i },
        { name: 'Submit Button', pattern: /Proceed to Payment/i }
      ];
      
      checks.forEach(check => {
        if (check.pattern.test(data)) {
          console.log(`✅ ${check.name}: Found`);
        } else {
          console.log(`❌ ${check.name}: Missing`);
        }
      });
      
    } else {
      console.log(`❌ ERROR: HTTP ${res.statusCode}`);
      console.log('Response preview:', data.substring(0, 500));
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
