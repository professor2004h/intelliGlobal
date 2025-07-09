const http = require('http');

console.log('🔍 Testing sponsor registration page...');

const req = http.get('http://localhost:3002/sponsorship/register', (res) => {
  console.log('✅ Status:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Content length:', data.length);
    
    const hasSuccess = data.includes('SUCCESS!');
    const hasWebpack = data.includes('Webpack module loading error');
    const hasSponsor = data.includes('Sponsor Registration');
    
    console.log('✅ Has SUCCESS:', hasSuccess);
    console.log('✅ Has webpack message:', hasWebpack);
    console.log('✅ Has Sponsor Registration:', hasSponsor);
    
    if (hasSuccess && hasWebpack && hasSponsor) {
      console.log('\n🎉 COMPLETE SUCCESS! Page is working perfectly!');
    } else {
      console.log('\n❌ Missing some content');
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Error:', err.message);
});

req.setTimeout(5000, () => {
  console.error('❌ Timeout');
  req.destroy();
});
