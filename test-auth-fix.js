// Test the authentication fix
const BASE_URL = 'http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io';

async function testAuthFix() {
  console.log('🔐 Testing Razorpay Authentication Fix...\n');

  try {
    // Test 1: Check authentication endpoint
    console.log('1️⃣ Testing authentication endpoint...');
    const authResponse = await fetch(`${BASE_URL}/api/test-razorpay-auth`);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Authentication endpoint working');
      
      if (authData.success) {
        console.log('🎉 Razorpay authentication successful!');
        console.log(`   - Key ID: ${authData.credentials.keyId}`);
        console.log(`   - Environment: ${authData.credentials.environment}`);
        console.log(`   - Test Order: ${authData.testOrder.id}`);
      } else {
        console.log('❌ Authentication failed:', authData.error);
        console.log('   - Details:', authData.details);
        if (authData.troubleshooting) {
          console.log('   - Troubleshooting:');
          authData.troubleshooting.forEach(tip => console.log(`     • ${tip}`));
        }
      }
    } else {
      console.log('❌ Authentication endpoint not available yet');
    }

    // Test 2: Test payment order creation
    console.log('\n2️⃣ Testing payment order creation...');
    const orderResponse = await fetch(`${BASE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 99,
        currency: 'INR',
        receipt: `auth_fix_test_${Date.now()}`,
        notes: {
          test: 'authentication_fix_verification'
        }
      })
    });

    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      console.log('✅ Payment order created successfully');
      console.log(`   - Order ID: ${orderData.order.id}`);
      console.log(`   - Amount: ₹${orderData.order.amount / 100}`);
      
      if (orderData.razorpay) {
        console.log('🎉 Real Razorpay integration working!');
        return true;
      } else {
        console.log('🔄 Still using fallback system');
        return false;
      }
    } else {
      const errorData = await orderResponse.json();
      console.log('❌ Payment order creation failed:', errorData.error);
      return false;
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Run the test
testAuthFix().then(success => {
  if (success) {
    console.log('\n🎉 AUTHENTICATION FIX SUCCESSFUL!');
    console.log('Real Razorpay integration is working correctly.');
  } else {
    console.log('\n⏳ Authentication fix may still be deploying...');
    console.log('Try again in a few minutes.');
  }
});
