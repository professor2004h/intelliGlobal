// Test the sponsor registration page
const http = require('http');

console.log('🧪 Testing sponsor registration page...');

// Test different ports
const ports = [3001, 3000, 3002];

async function testPort(port) {
  return new Promise((resolve) => {
    const req = http.request(`http://localhost:${port}/sponsorship/register`, (res) => {
      console.log(`✅ Port ${port}: Status ${res.statusCode}`);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ Port ${port}: Page loaded successfully!`);
          console.log(`📄 Content length: ${data.length} characters`);
          
          // Check for key elements
          if (data.includes('Sponsor Registration')) {
            console.log(`✅ Port ${port}: Contains sponsor registration content`);
          }
          if (data.includes('form')) {
            console.log(`✅ Port ${port}: Contains form elements`);
          }
          if (data.includes('onSubmit')) {
            console.log(`✅ Port ${port}: Contains form submission handler`);
          }
          
          resolve({ port, success: true, status: res.statusCode });
        } else {
          resolve({ port, success: false, status: res.statusCode });
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Port ${port}: ${err.message}`);
      resolve({ port, success: false, error: err.message });
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ Port ${port}: Request timeout`);
      req.destroy();
      resolve({ port, success: false, error: 'timeout' });
    });
    
    req.end();
  });
}

async function testAllPorts() {
  console.log('Testing all possible ports...');
  
  for (const port of ports) {
    const result = await testPort(port);
    if (result.success) {
      console.log(`🎉 SUCCESS: Sponsor registration page is working on port ${port}!`);
      return;
    }
  }
  
  console.log('❌ FAILED: Could not access sponsor registration page on any port');
}

testAllPorts();
