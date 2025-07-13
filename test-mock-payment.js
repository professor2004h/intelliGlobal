// Test mock payment system
const BASE_URL = 'http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io';

async function testMockPayment() {
  console.log('🧪 Testing Mock Payment System...\n');

  try {
    console.log('📋 Testing payment order creation...');
    
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
          test: 'mock_payment_test'
        }
      })
    });

    console.log('Response Status:', orderResponse.status);
    
    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      console.log('✅ Payment order created successfully!');
      console.log('Order Data:', JSON.stringify(orderData, null, 2));
      
      if (orderData.mock) {
        console.log('🧪 Mock payment system is working!');
        
        // Test payment verification
        console.log('\n📋 Testing payment verification...');
        const verifyResponse = await fetch(`${BASE_URL}/api/payment/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_order_id: orderData.order.id,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: 'mock_signature',
            sponsorshipData: {
              test: 'verification_test'
            }
          })
        });

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          console.log('✅ Payment verification successful!');
          console.log('Verification Data:', JSON.stringify(verifyData, null, 2));
        } else {
          const verifyError = await verifyResponse.json();
          console.log('❌ Payment verification failed:', verifyError);
        }
      }
      
    } else {
      const errorData = await orderResponse.json();
      console.log('❌ Payment order creation failed');
      console.log('Error:', JSON.stringify(errorData, null, 2));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMockPayment();
