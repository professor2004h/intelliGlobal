// Test script to debug payment order creation
const BASE_URL = 'http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io';

async function testPaymentOrder() {
  console.log('🧪 Testing Payment Order Creation...\n');

  try {
    // Test 1: Check environment variables
    console.log('1️⃣ Checking environment variables...');
    const envResponse = await fetch(`${BASE_URL}/api/debug-env`);
    const envData = await envResponse.json();
    
    console.log('Environment Status:');
    console.log('- Razorpay Key ID:', envData.razorpayKeyId);
    console.log('- Razorpay Secret:', envData.razorpaySecret);
    console.log('- Node Env:', envData.nodeEnv);
    console.log('');

    // Test 2: Check Razorpay configuration
    console.log('2️⃣ Testing Razorpay configuration...');
    const razorpayResponse = await fetch(`${BASE_URL}/api/test-razorpay`);
    
    if (razorpayResponse.ok) {
      const razorpayData = await razorpayResponse.json();
      console.log('Razorpay Test Results:');
      console.log('- Initialization:', razorpayData.initialization?.success ? '✅ SUCCESS' : '❌ FAILED');
      console.log('- Order Creation:', razorpayData.orderCreationTest?.success ? '✅ SUCCESS' : '❌ FAILED');
      
      if (!razorpayData.initialization?.success) {
        console.log('- Error:', razorpayData.initialization?.error);
      }
      
      if (!razorpayData.orderCreationTest?.success) {
        console.log('- Order Error:', razorpayData.orderCreationTest?.error);
      }
    } else {
      console.log('❌ Razorpay test endpoint failed');
    }
    console.log('');

    // Test 3: Try creating actual payment order
    console.log('3️⃣ Testing actual payment order creation...');
    const orderResponse = await fetch(`${BASE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 99,
        currency: 'INR',
        receipt: `test_receipt_${Date.now()}`,
        notes: {
          test: 'payment_order_debug'
        }
      })
    });

    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      console.log('✅ Payment order created successfully!');
      console.log('Order Details:', orderData);
    } else {
      const errorData = await orderResponse.json();
      console.log('❌ Payment order creation failed');
      console.log('Status:', orderResponse.status);
      console.log('Error:', errorData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPaymentOrder();
