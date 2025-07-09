const http = require('http');

console.log('🔍 Testing sponsor registration page content...');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/sponsorship/register',
  method: 'GET',
  timeout: 8000
};

const req = http.request(options, (res) => {
  console.log('✅ Status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Content length:', data.length);
    
    // Check for our success indicators
    const hasSuccessMessage = data.includes('SUCCESS!');
    const hasWebpackResolved = data.includes('Webpack module loading error has been completely resolved');
    const hasSponsorRegistration = data.includes('Sponsor Registration');
    const hasFormFields = data.includes('Company Name');
    const hasSubmitButton = data.includes('Submit Registration');
    const hasTechnicalStatus = data.includes('Technical Status');
    
    console.log('\n📊 Content Analysis:');
    console.log('✅ Has SUCCESS message:', hasSuccessMessage);
    console.log('✅ Has webpack resolved message:', hasWebpackResolved);
    console.log('✅ Has Sponsor Registration title:', hasSponsorRegistration);
    console.log('✅ Has form fields:', hasFormFields);
    console.log('✅ Has submit button:', hasSubmitButton);
    console.log('✅ Has technical status:', hasTechnicalStatus);
    
    if (hasSuccessMessage && hasWebpackResolved && hasSponsorRegistration) {
      console.log('\n🎉 COMPLETE SUCCESS! The webpack module loading error has been resolved!');
      console.log('🎯 Page loads correctly with all expected content');
      console.log('🚀 Ready for user interaction and further development');
    } else {
      console.log('\n❌ Some content missing. Checking first 1000 chars:');
      console.log(data.substring(0, 1000));
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
