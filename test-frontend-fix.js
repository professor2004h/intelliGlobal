// Test the frontend Razorpay key fix
const BASE_URL = 'http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io';

async function testFrontendFix() {
  console.log('🔧 Testing Frontend Razorpay Key Fix...\n');

  try {
    // Test 1: Frontend environment check
    console.log('1️⃣ Testing frontend environment check...');
    const frontendEnvResponse = await fetch(`${BASE_URL}/api/frontend-env-check`);
    
    if (frontendEnvResponse.ok) {
      const frontendEnvData = await frontendEnvResponse.json();
      console.log('✅ Frontend environment check working');
      console.log('Frontend Environment:', JSON.stringify(frontendEnvData.environment, null, 2));
      
      if (frontendEnvData.environment.razorpayKeyId === 'set') {
        console.log('✅ Frontend has access to Razorpay key');
      } else {
        console.log('❌ Frontend does not have access to Razorpay key');
        console.log(`Key Status: ${frontendEnvData.environment.razorpayKeyId}`);
        console.log(`Key Value: ${frontendEnvData.environment.razorpayKeyValue}`);
      }
    } else {
      console.log('❌ Frontend environment check endpoint not available yet');
    }

    // Test 2: Razorpay key endpoint
    console.log('\n2️⃣ Testing Razorpay key endpoint...');
    const keyResponse = await fetch(`${BASE_URL}/api/get-razorpay-key`);
    
    if (keyResponse.ok) {
      const keyData = await keyResponse.json();
      console.log('✅ Razorpay key endpoint working');
      
      if (keyData.success) {
        console.log('🎉 Backend can provide Razorpay key to frontend!');
        console.log(`Key ID: ${keyData.keyId.substring(0, 8)}...`);
        console.log(`Environment: ${keyData.environment}`);
      } else {
        console.log('❌ Backend cannot provide Razorpay key');
        console.log('Error:', keyData.error);
      }
    } else {
      console.log('❌ Razorpay key endpoint not available yet');
    }

    // Test 3: Payment order creation (should work now)
    console.log('\n3️⃣ Testing payment order creation...');
    const orderResponse = await fetch(`${BASE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 99,
        currency: 'INR',
        receipt: `frontend_fix_test_${Date.now()}`,
        notes: {
          test: 'frontend_fix_verification'
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
        console.log('🔄 Using fallback system');
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
testFrontendFix().then(success => {
  console.log('\n🎯 FRONTEND FIX TEST RESULTS:');
  console.log('=====================================');
  
  if (success) {
    console.log('✅ Frontend fix is working correctly');
    console.log('✅ Payment system should work now');
    console.log('');
    console.log('🎯 NEXT STEPS:');
    console.log('1. Clear browser cache and cookies');
    console.log('2. Try the payment form again');
    console.log('3. Check browser console for detailed debugging info');
    console.log('4. The system now has fallback to get key from backend');
    console.log('');
    console.log('🌐 Test the payment form:');
    console.log('Visit: http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io/sponsorship/register');
  } else {
    console.log('❌ Frontend fix needs more work');
    console.log('');
    console.log('The system is still deploying or needs additional fixes.');
    console.log('Try again in a few minutes.');
  }
});
