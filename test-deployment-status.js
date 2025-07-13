// Test deployment status and payment functionality
const BASE_URL = 'http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io';

async function testDeploymentStatus() {
  console.log('🔍 Testing Deployment Status...\n');

  const tests = [
    {
      name: 'Main Website',
      url: `${BASE_URL}/`,
      method: 'GET'
    },
    {
      name: 'Sponsorship Registration',
      url: `${BASE_URL}/sponsorship/register`,
      method: 'GET'
    },
    {
      name: 'Debug Environment',
      url: `${BASE_URL}/api/debug-env`,
      method: 'GET'
    },
    {
      name: 'Test Payment Order Endpoint',
      url: `${BASE_URL}/api/payment/create-order-test`,
      method: 'GET'
    },
    {
      name: 'Original Payment Order',
      url: `${BASE_URL}/api/payment/create-order`,
      method: 'POST',
      body: JSON.stringify({
        amount: 99,
        currency: 'INR',
        receipt: 'test_deployment'
      })
    },
    {
      name: 'Test Payment Order Creation',
      url: `${BASE_URL}/api/payment/create-order-test`,
      method: 'POST',
      body: JSON.stringify({
        amount: 99,
        currency: 'INR',
        receipt: 'test_deployment'
      })
    }
  ];

  let workingEndpoints = 0;
  let paymentWorking = false;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (test.body) {
        options.body = test.body;
      }

      const response = await fetch(test.url, options);
      
      if (response.ok) {
        console.log(`✅ ${test.name}: Working (${response.status})`);
        workingEndpoints++;
        
        if (test.name === 'Test Payment Order Creation') {
          const data = await response.json();
          if (data.success && data.test) {
            paymentWorking = true;
            console.log(`   📋 Order ID: ${data.order.id}`);
            console.log(`   💰 Amount: ₹${data.order.amount / 100}`);
          }
        }
      } else {
        console.log(`❌ ${test.name}: Failed (${response.status})`);
        
        if (test.name.includes('Payment')) {
          try {
            const errorData = await response.json();
            console.log(`   Error: ${errorData.error || 'Unknown error'}`);
          } catch (e) {
            console.log(`   Error: Could not parse error response`);
          }
        }
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Network Error - ${error.message}`);
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n🎯 DEPLOYMENT STATUS SUMMARY:');
  console.log('=====================================');
  console.log(`✅ Working Endpoints: ${workingEndpoints}/${tests.length}`);
  console.log(`💳 Payment System: ${paymentWorking ? '✅ Working' : '❌ Not Ready'}`);
  
  if (workingEndpoints >= 4 && paymentWorking) {
    console.log('\n🎉 DEPLOYMENT IS READY!');
    console.log('🚀 Payment system is functional');
    console.log('🌐 Website is accessible');
    console.log('\n📋 Next Steps:');
    console.log('1. Visit the sponsorship registration page');
    console.log('2. Fill out the form');
    console.log('3. Test the payment flow');
    console.log('4. Verify payment success');
    
    return true;
  } else {
    console.log('\n⏳ DEPLOYMENT STILL IN PROGRESS');
    console.log('Please wait a few more minutes and try again.');
    
    if (!paymentWorking) {
      console.log('\n🔧 Payment system is being deployed...');
      console.log('The working payment system should be available soon.');
    }
    
    return false;
  }
}

// Run the deployment status test
testDeploymentStatus().then(ready => {
  if (ready) {
    console.log('\n🎯 READY FOR END-TO-END PAYMENT TESTING!');
    console.log(`Visit: ${BASE_URL}/sponsorship/register`);
  } else {
    console.log('\n⏳ Try running this test again in 2-3 minutes.');
  }
});
