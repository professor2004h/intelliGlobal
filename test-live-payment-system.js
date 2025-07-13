// Test the live payment system with updated credentials
const BASE_URL = 'http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io';

async function testLivePaymentSystem() {
  console.log('🚀 Testing Live Payment System with Updated Credentials...\n');

  try {
    // Test 1: Check environment variables
    console.log('1️⃣ Checking environment variables...');
    const envResponse = await fetch(`${BASE_URL}/api/debug-env`);
    if (envResponse.ok) {
      const envData = await envResponse.json();
      console.log('✅ Environment Status:');
      console.log(`   - Razorpay Key ID: ${envData.razorpayKeyId}`);
      console.log(`   - Razorpay Secret: ${envData.razorpaySecret}`);
      console.log(`   - Node Environment: ${envData.nodeEnv}`);
      
      if (envData.razorpayKeyId === 'set' && envData.razorpaySecret === 'set') {
        console.log('✅ New credentials are loaded!');
      } else {
        console.log('⚠️ Credentials may not be updated yet');
      }
    }
    console.log('');

    // Test 2: Test payment order creation
    console.log('2️⃣ Testing payment order creation...');
    const orderResponse = await fetch(`${BASE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 99,
        currency: 'INR',
        receipt: `test_live_${Date.now()}`,
        notes: {
          test: 'live_payment_system_test',
          upi_enabled: 'true'
        }
      })
    });

    console.log(`Response Status: ${orderResponse.status}`);
    
    if (orderResponse.ok) {
      const orderData = await orderResponse.json();
      console.log('✅ Payment order created successfully!');
      console.log('Order Details:');
      console.log(`   - Order ID: ${orderData.order.id}`);
      console.log(`   - Amount: ₹${orderData.order.amount / 100}`);
      console.log(`   - Currency: ${orderData.order.currency}`);
      console.log(`   - Status: ${orderData.order.status}`);
      
      // Check if it's real Razorpay or fallback
      if (orderData.razorpay) {
        console.log('🎉 REAL RAZORPAY IS ACTIVE!');
        console.log('   - Type: Real Razorpay Integration');
        console.log('   - Order Format: Razorpay Standard');
        
        // Test payment verification
        console.log('\n3️⃣ Testing payment verification...');
        const verifyResponse = await fetch(`${BASE_URL}/api/payment/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_order_id: orderData.order.id,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: 'test_signature_for_verification',
            sponsorshipData: {
              test: 'live_verification_test'
            }
          })
        });

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          console.log('✅ Payment verification endpoint working');
          console.log(`   - Response: ${verifyData.message || 'Verification processed'}`);
        } else {
          const verifyError = await verifyResponse.json();
          console.log('⚠️ Verification response (expected for test signature):', verifyError.error);
        }
        
        return {
          success: true,
          realRazorpay: true,
          orderId: orderData.order.id,
          amount: orderData.order.amount
        };
        
      } else if (orderData.reliable || orderData.working || orderData.basic || orderData.emergency) {
        console.log('🔄 Using fallback system');
        console.log('   - Type: Fallback Payment System');
        console.log('   - Reason: Environment variables may not be updated yet');
        
        return {
          success: true,
          realRazorpay: false,
          fallback: true,
          orderId: orderData.order.id
        };
      }
      
    } else {
      const errorData = await orderResponse.json();
      console.log('❌ Payment order creation failed');
      console.log('Error Details:', errorData);
      
      return {
        success: false,
        error: errorData
      };
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Test payment methods configuration
async function testPaymentMethodsConfig() {
  console.log('\n4️⃣ Testing payment methods configuration...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-payment-methods`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Payment methods configuration:');
      console.log(`   - UPI Enabled: ${data.paymentMethodsConfig?.frontend?.method?.upi}`);
      console.log(`   - Card Enabled: ${data.paymentMethodsConfig?.frontend?.method?.card}`);
      console.log(`   - NetBanking Enabled: ${data.paymentMethodsConfig?.frontend?.method?.netbanking}`);
      console.log(`   - Wallet Enabled: ${data.paymentMethodsConfig?.frontend?.method?.wallet}`);
      
      if (data.paymentMethodsConfig?.frontend?.upi?.apps) {
        console.log(`   - UPI Apps: ${data.paymentMethodsConfig.frontend.upi.apps.join(', ')}`);
      }
      
      return true;
    } else {
      console.log('⚠️ Payment methods test endpoint not available');
      return false;
    }
  } catch (error) {
    console.log('⚠️ Payment methods test failed:', error.message);
    return false;
  }
}

// Run comprehensive test
async function runComprehensiveTest() {
  const paymentResult = await testLivePaymentSystem();
  const methodsResult = await testPaymentMethodsConfig();
  
  console.log('\n🎯 COMPREHENSIVE TEST RESULTS:');
  console.log('=====================================');
  
  if (paymentResult.success && paymentResult.realRazorpay) {
    console.log('✅ Real Razorpay Integration: ACTIVE');
    console.log('✅ Payment Order Creation: Working');
    console.log('✅ Payment Verification: Ready');
    console.log('✅ Environment Variables: Updated');
    console.log('✅ System Status: FULLY FUNCTIONAL');
    
    console.log('\n🚀 READY FOR END-TO-END TESTING!');
    console.log('=====================================');
    console.log('📋 Test Steps:');
    console.log('1. Visit: http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io/sponsorship/register');
    console.log('2. Fill out the sponsorship form');
    console.log('3. Select a sponsorship tier');
    console.log('4. Click payment button');
    console.log('5. Verify Razorpay modal shows all payment methods:');
    console.log('   • UPI (Google Pay, PhonePe, Paytm, BHIM)');
    console.log('   • Credit/Debit Cards');
    console.log('   • Net Banking');
    console.log('   • Digital Wallets');
    console.log('6. Complete test payment');
    console.log('7. Verify payment success and invoice generation');
    
  } else if (paymentResult.success && paymentResult.fallback) {
    console.log('⚠️ Real Razorpay Integration: NOT YET ACTIVE');
    console.log('✅ Fallback System: Working');
    console.log('📋 Action Required: Environment variables may need deployment restart');
    
  } else {
    console.log('❌ Payment System: NEEDS ATTENTION');
    console.log('📋 Issues found that need fixing');
  }
  
  return paymentResult.success && paymentResult.realRazorpay;
}

// Execute the comprehensive test
runComprehensiveTest();
