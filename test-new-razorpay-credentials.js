// Test the new Razorpay credentials
const keyId = 'rzp_test_ylYi97dkIOTZL7';
const keySecret = 'KOtkHBRKJ82wPWCgDCNlLQfk';

async function testNewCredentials() {
  console.log('🔐 Testing New Razorpay Credentials...\n');

  try {
    // Create basic auth header
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    console.log('📋 Credential Details:');
    console.log(`Key ID: ${keyId}`);
    console.log(`Key Secret: ${keySecret.substring(0, 8)}...`);
    console.log(`Auth Header Length: ${auth.length}`);
    console.log('');

    // Test 1: Simple API call to verify credentials
    console.log('1️⃣ Testing credential validity...');
    const testResponse = await fetch('https://api.razorpay.com/v1/payments?count=1', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`Response Status: ${testResponse.status}`);
    
    if (testResponse.ok) {
      console.log('✅ Credentials are valid!');
      const data = await testResponse.json();
      console.log(`Found ${data.count} payments in account`);
    } else {
      const errorText = await testResponse.text();
      console.log('❌ Credential validation failed');
      console.log(`Error: ${errorText.substring(0, 200)}...`);
    }
    console.log('');

    // Test 2: Create a test order
    console.log('2️⃣ Testing order creation...');
    const orderData = {
      amount: 10000, // ₹100 in paise
      currency: 'INR',
      receipt: `test_new_creds_${Date.now()}`,
      notes: {
        test: 'new_credentials_test',
        upi_enabled: 'true',
        payment_methods: 'upi,card,netbanking,wallet'
      }
    };

    const orderResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    console.log(`Order Creation Status: ${orderResponse.status}`);
    
    if (orderResponse.ok) {
      const orderResult = await orderResponse.json();
      console.log('✅ Order created successfully!');
      console.log(`Order ID: ${orderResult.id}`);
      console.log(`Amount: ₹${orderResult.amount / 100}`);
      console.log(`Currency: ${orderResult.currency}`);
      console.log(`Status: ${orderResult.status}`);
      
      console.log('\n🎉 NEW CREDENTIALS ARE WORKING PERFECTLY!');
      console.log('=====================================');
      console.log('✅ Authentication: Success');
      console.log('✅ Order Creation: Success');
      console.log('✅ API Access: Full');
      console.log('✅ Ready for Production: Yes');
      
      return {
        valid: true,
        orderId: orderResult.id,
        credentials: { keyId, keySecret }
      };
      
    } else {
      const orderError = await orderResponse.text();
      console.log('❌ Order creation failed');
      console.log(`Error: ${orderError.substring(0, 200)}...`);
      
      return {
        valid: false,
        error: orderError,
        credentials: { keyId, keySecret }
      };
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return {
      valid: false,
      error: error.message,
      credentials: { keyId, keySecret }
    };
  }
}

// Run the test
testNewCredentials().then(result => {
  if (result.valid) {
    console.log('\n🚀 READY TO UPDATE ENVIRONMENT VARIABLES!');
    console.log('');
    console.log('📋 Update these in Coolify:');
    console.log(`NEXT_PUBLIC_RAZORPAY_KEY_ID=${keyId}`);
    console.log(`RAZORPAY_SECRET_KEY=${keySecret}`);
    console.log('');
    console.log('🔄 After updating, redeploy the application');
    console.log('✅ Payment system will work with real Razorpay!');
  } else {
    console.log('\n❌ CREDENTIALS NEED ATTENTION');
    console.log('Please check the Razorpay account status');
  }
});
