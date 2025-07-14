// Test environment variables loading
const BASE_URL = 'http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io';

async function testEnvironmentVariables() {
  console.log('🔍 Testing Environment Variables Loading...\n');

  try {
    // Test debug endpoint
    console.log('1️⃣ Checking debug endpoint...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug-env`);
    
    if (debugResponse.ok) {
      const debugData = await debugResponse.json();
      console.log('✅ Debug endpoint working');
      console.log('Environment Data:', JSON.stringify(debugData, null, 2));
      
      if (debugData.razorpayKeyId === 'set' && debugData.razorpaySecret === 'set') {
        console.log('✅ Backend environment variables are loaded');
      } else {
        console.log('❌ Backend environment variables not loaded properly');
        console.log(`Key ID Status: ${debugData.razorpayKeyId}`);
        console.log(`Secret Status: ${debugData.razorpaySecret}`);
      }
    } else {
      console.log('❌ Debug endpoint not accessible');
    }

    // Test authentication endpoint
    console.log('\n2️⃣ Testing authentication endpoint...');
    const authResponse = await fetch(`${BASE_URL}/api/test-razorpay-auth`);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Authentication endpoint working');
      
      if (authData.success) {
        console.log('🎉 Razorpay authentication successful!');
        console.log(`Key ID: ${authData.credentials.keyId}`);
        console.log(`Environment: ${authData.credentials.environment}`);
        console.log(`Test Order: ${authData.testOrder.id}`);
      } else {
        console.log('❌ Razorpay authentication failed');
        console.log('Error:', authData.error);
        console.log('Details:', authData.details);
        
        if (authData.troubleshooting) {
          console.log('\nTroubleshooting steps:');
          authData.troubleshooting.forEach(step => console.log(`• ${step}`));
        }
      }
    } else {
      console.log('❌ Authentication endpoint not accessible');
    }

    // Test payment order creation
    console.log('\n3️⃣ Testing payment order creation...');
    const orderResponse = await fetch(`${BASE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 99,
        currency: 'INR',
        receipt: `env_test_${Date.now()}`,
        notes: {
          test: 'environment_variable_test'
        }
      })
    });

    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      console.log('✅ Payment order creation working');
      console.log(`Order ID: ${orderData.order.id}`);
      console.log(`Amount: ₹${orderData.order.amount / 100}`);
      
      if (orderData.razorpay) {
        console.log('🎉 Real Razorpay integration active!');
        return true;
      } else {
        console.log('🔄 Using fallback system - environment variables may not be loaded');
        return false;
      }
    } else {
      const errorData = await orderResponse.json();
      console.log('❌ Payment order creation failed');
      console.log('Error:', errorData);
      return false;
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testEnvironmentVariables().then(success => {
  console.log('\n🎯 ENVIRONMENT VARIABLE TEST RESULTS:');
  console.log('=====================================');
  
  if (success) {
    console.log('✅ Environment variables are working correctly');
    console.log('✅ Real Razorpay integration is active');
    console.log('');
    console.log('If you\'re still getting "Payment configuration error":');
    console.log('1. Clear browser cache and cookies');
    console.log('2. Try in incognito/private browsing mode');
    console.log('3. Check browser console for detailed error messages');
  } else {
    console.log('❌ Environment variables need attention');
    console.log('');
    console.log('Possible solutions:');
    console.log('1. Restart the deployment in Coolify');
    console.log('2. Verify environment variables are saved correctly');
    console.log('3. Check if deployment completed successfully');
    console.log('4. Ensure no typos in variable names');
  }
});
