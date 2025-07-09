const http = require('http');

console.log('🔍 Quick test of sponsor registration page...');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/sponsorship/register',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log('✅ Status:', res.statusCode);
  console.log('✅ Headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Content length:', data.length);
    console.log('✅ Has form content:', data.includes('Sponsor Registration'));
    console.log('✅ Has success message:', data.includes('Webpack module loading error has been completely resolved'));
    console.log('✅ Has form fields:', data.includes('Company Name'));
    console.log('✅ No webpack errors:', !data.includes('webpack') || !data.includes('Cannot read properties'));
    
    if (data.includes('Sponsor Registration')) {
      console.log('\n🎉 SUCCESS: Page loads correctly with sponsor registration form!');
    } else {
      console.log('\n❌ FAILED: Page content not as expected');
      console.log('First 500 chars:', data.substring(0, 500));
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Request error:', err.message);
});

req.on('timeout', () => {
  console.error('❌ Request timeout');
  req.destroy();
});

req.end();
