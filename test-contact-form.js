// Use built-in fetch (Node 18+) or http module for localhost
const http = require('http');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const data = options.body || '';
    const urlObj = new URL(url);

    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, ok: res.statusCode < 400, json: () => result });
        } catch {
          resolve({ status: res.statusCode, ok: res.statusCode < 400, text: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testContactForm() {
  console.log('🧪 Testing Contact Form with SMTP...\n');

  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1-555-123-4567',
    subject: 'SMTP Test Contact Form',
    message: 'This is a test to verify the contact form SMTP integration is working correctly with the app password: yurr bjrc bhfk eotm'
  };

  try {
    console.log('📧 Sending test contact form submission...');

    const response = await makeRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = response.json ? response.json() : { error: 'Invalid response' };

    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Data:', JSON.stringify(result, null, 2));

    if (response.ok && result.success) {
      console.log('✅ Contact form test SUCCESSFUL!');
      console.log('📬 Check intelliglobalconferences@gmail.com for the test email');
    } else {
      console.log('❌ Contact form test FAILED');
      console.log('Error:', result.error || 'Unknown error');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Also test SMTP endpoint
async function testSMTP() {
  console.log('\n🔧 Testing SMTP configuration...');

  try {
    const response = await makeRequest('http://localhost:3000/api/test-smtp');
    const result = response.json ? response.json() : { error: 'Invalid response' };

    console.log('📊 SMTP Test Result:', JSON.stringify(result, null, 2));

    if (result.connectionTest === 'SUCCESS') {
      console.log('✅ SMTP configuration is working!');
    } else {
      console.log('❌ SMTP configuration failed');
    }

  } catch (error) {
    console.error('❌ SMTP test failed:', error.message);
  }
}

async function runTests() {
  await testSMTP();
  await testContactForm();
}

runTests();
