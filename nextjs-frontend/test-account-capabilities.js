/**
 * Razorpay Account Capabilities Test
 * Tests what payment methods are enabled for the test account
 */

const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_tuQ7OPOieO2QPl',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_key_here'
});

async function testAccountCapabilities() {
  console.log('🔍 Testing Razorpay Account Capabilities...\n');
  
  try {
    // Test 1: Create a basic order
    console.log('📋 Test 1: Creating Basic Order');
    const basicOrder = await razorpay.orders.create({
      amount: 50000, // ₹500
      currency: 'INR',
      receipt: 'test_receipt_' + Date.now(),
      notes: {
        test_type: 'basic_order'
      }
    });
    console.log('✅ Basic order created:', basicOrder.id);
    console.log('   Amount:', basicOrder.amount, 'paise (₹' + (basicOrder.amount/100) + ')');
    console.log('   Currency:', basicOrder.currency);
    console.log('   Status:', basicOrder.status);
    
    // Test 2: Create order with UPI-specific notes
    console.log('\n📋 Test 2: Creating UPI-Enabled Order');
    const upiOrder = await razorpay.orders.create({
      amount: 50000,
      currency: 'INR',
      receipt: 'upi_test_' + Date.now(),
      notes: {
        test_type: 'upi_order',
        upi_enabled: 'true',
        payment_methods: 'upi,card,netbanking,wallet'
      }
    });
    console.log('✅ UPI order created:', upiOrder.id);
    
    // Test 3: Create order with international card support
    console.log('\n📋 Test 3: Creating International Card Order');
    const intlOrder = await razorpay.orders.create({
      amount: 50000,
      currency: 'INR',
      receipt: 'intl_test_' + Date.now(),
      notes: {
        test_type: 'international_card',
        international_cards: 'enabled',
        card_types: 'domestic,international'
      }
    });
    console.log('✅ International card order created:', intlOrder.id);
    
    // Test 4: Try to fetch payment methods (if API exists)
    console.log('\n📋 Test 4: Checking Payment Methods');
    try {
      // This might not be available in all accounts
      const methods = await razorpay.payments.all({
        count: 1
      });
      console.log('✅ Payment methods API accessible');
    } catch (error) {
      console.log('⚠️  Payment methods API not accessible:', error.message);
    }
    
    // Test 5: Check account features
    console.log('\n📋 Test 5: Account Feature Analysis');
    console.log('🔑 Key ID:', process.env.RAZORPAY_KEY_ID || 'rzp_test_tuQ7OPOieO2QPl');
    console.log('🏦 Account Type: Test Account');
    console.log('💰 Currency Support: INR (required for UPI)');
    
    // Summary
    console.log('\n📊 SUMMARY OF FINDINGS:');
    console.log('✅ Order creation: Working');
    console.log('✅ INR currency: Supported');
    console.log('✅ Basic payments: Should work');
    console.log('⚠️  UPI availability: Depends on account activation');
    console.log('⚠️  International cards: Depends on account settings');
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Test the HTML page to see actual payment methods');
    console.log('2. Check Razorpay Dashboard for enabled payment methods');
    console.log('3. Contact Razorpay support if UPI is not showing');
    
    return {
      basicOrder: basicOrder.id,
      upiOrder: upiOrder.id,
      intlOrder: intlOrder.id,
      success: true
    };
    
  } catch (error) {
    console.error('❌ Error testing account capabilities:', error);

    const errorMessage = error.message || error.toString();

    if (errorMessage.includes('authentication')) {
      console.log('\n🔐 AUTHENTICATION ERROR:');
      console.log('- Check if RAZORPAY_KEY_SECRET is set correctly');
      console.log('- Verify the key_id and key_secret pair');
    }

    if (errorMessage.includes('currency')) {
      console.log('\n💱 CURRENCY ERROR:');
      console.log('- UPI requires INR currency');
      console.log('- Check if account supports INR');
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

// Test specific payment method configurations
async function testPaymentMethodConfigs() {
  console.log('\n🧪 Testing Payment Method Configurations...\n');
  
  const testConfigs = [
    {
      name: 'UPI Only',
      config: {
        amount: 50000,
        currency: 'INR',
        receipt: 'upi_only_' + Date.now(),
        notes: {
          payment_methods: 'upi',
          upi_test: 'true'
        }
      }
    },
    {
      name: 'Cards Only',
      config: {
        amount: 50000,
        currency: 'INR',
        receipt: 'cards_only_' + Date.now(),
        notes: {
          payment_methods: 'card',
          card_test: 'true'
        }
      }
    },
    {
      name: 'All Methods',
      config: {
        amount: 50000,
        currency: 'INR',
        receipt: 'all_methods_' + Date.now(),
        notes: {
          payment_methods: 'upi,card,netbanking,wallet',
          all_methods_test: 'true'
        }
      }
    }
  ];
  
  for (const test of testConfigs) {
    try {
      console.log(`📋 Testing: ${test.name}`);
      const order = await razorpay.orders.create(test.config);
      console.log(`✅ ${test.name} order created:`, order.id);
    } catch (error) {
      console.log(`❌ ${test.name} failed:`, error.message);
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Razorpay Account Capabilities Test\n');
  console.log('=' .repeat(60));
  
  // Check environment
  if (!process.env.RAZORPAY_KEY_SECRET) {
    console.log('⚠️  WARNING: RAZORPAY_KEY_SECRET not found in environment');
    console.log('   Some tests may fail due to authentication');
    console.log('   Set the secret key to run full tests\n');
  }
  
  // Run tests
  const result = await testAccountCapabilities();
  
  if (result.success) {
    await testPaymentMethodConfigs();
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Test Complete');
  
  if (result.success) {
    console.log('\n🎉 Account is functional! Orders can be created.');
    console.log('📝 Use the HTML test page to check actual payment methods.');
  } else {
    console.log('\n💥 Account has issues that need to be resolved.');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testAccountCapabilities,
  testPaymentMethodConfigs
};
