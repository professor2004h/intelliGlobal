// Test script for payment API endpoints
// Using built-in fetch (Node.js 18+)

const BASE_URL = 'http://localhost:3002';

async function testCreateOrder() {
  console.log('🧪 Testing payment order creation...');

  try {
    const response = await fetch(`${BASE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 99,
        currency: 'USD',
        receipt: 'test_receipt_123',
        notes: {
          paymentMethod: 'Stripe',
          conferenceId: 'test-conference',
          tierId: 'test-tier',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Order creation failed:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log('✅ Order creation successful:', data);
    return data.order;
  } catch (error) {
    console.error('❌ Error testing order creation:', error.message);
    return null;
  }
}

async function testPaymentVerification() {
  console.log('🧪 Testing payment verification...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: 'test_order_123',
        razorpay_payment_id: 'test_payment_123',
        razorpay_signature: 'test_signature_123',
        sponsorshipData: {
          companyName: 'Test Company',
          contactPerson: 'John Doe',
          email: 'test@example.com',
          amount: 99,
        },
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Payment verification endpoint accessible:', data);
    } else {
      console.log('⚠️ Payment verification failed (expected for test data):', data);
    }
  } catch (error) {
    console.error('❌ Error testing payment verification:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting payment API tests...\n');
  
  // Test order creation
  const order = await testCreateOrder();
  
  console.log('\n');
  
  // Test payment verification
  await testPaymentVerification();
  
  console.log('\n🏁 Payment API tests completed!');
}

// Run tests
runTests().catch(console.error);
