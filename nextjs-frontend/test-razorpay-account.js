// Test script to verify Razorpay account capabilities
const fetch = require('node-fetch');

const RAZORPAY_KEY_ID = 'rzp_test_tuQ7OPOieO2QPl';
const RAZORPAY_KEY_SECRET = 'YOUR_SECRET_KEY'; // This would need to be set

async function testRazorpayAccount() {
    console.log('🔍 Testing Razorpay Account Capabilities...\n');
    
    // Test 1: Check if we can create an order
    console.log('📋 Test 1: Creating a test order...');
    try {
        const orderResponse = await fetch('http://localhost:3000/api/payment/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: 8217, // ₹82.17
                currency: 'INR',
                receipt: 'test_receipt_' + Date.now(),
                notes: {
                    test: 'upi_capability_check'
                }
            })
        });
        
        const orderData = await orderResponse.json();
        console.log('✅ Order creation result:', orderData);
        
        if (orderData.success) {
            console.log('   📊 Order Details:');
            console.log('   - Order ID:', orderData.order.id);
            console.log('   - Amount:', orderData.order.amount);
            console.log('   - Currency:', orderData.order.currency);
        }
    } catch (error) {
        console.error('❌ Order creation failed:', error.message);
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Test 2: Check Razorpay key format
    console.log('🔑 Test 2: Analyzing Razorpay Key...');
    console.log('   Key ID:', RAZORPAY_KEY_ID);
    console.log('   Key Format:', RAZORPAY_KEY_ID.startsWith('rzp_test_') ? '✅ Test Key' : '❌ Invalid Format');
    console.log('   Key Length:', RAZORPAY_KEY_ID.length, 'characters');
    
    console.log('\n' + '='.repeat(60));
    
    // Test 3: Environment check
    console.log('🌍 Test 3: Environment Configuration...');
    console.log('   Node.js Version:', process.version);
    console.log('   Environment:', process.env.NODE_ENV || 'development');
    
    // Test 4: Check if server is running
    console.log('\n🚀 Test 4: Server Connectivity...');
    try {
        const serverResponse = await fetch('http://localhost:3000/api/conferences');
        const serverData = await serverResponse.json();
        console.log('✅ Server is running and responding');
        console.log('   Conferences available:', serverData.conferences?.length || 0);
    } catch (error) {
        console.error('❌ Server connectivity issue:', error.message);
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Test 5: UPI Configuration Analysis
    console.log('📱 Test 5: UPI Configuration Analysis...');
    
    const upiTestConfigs = [
        {
            name: 'Simple UPI',
            config: {
                method: {
                    upi: true,
                    card: true
                }
            }
        },
        {
            name: 'UPI with flows',
            config: {
                method: {
                    upi: {
                        flow: ['collect', 'intent', 'qr']
                    },
                    card: true
                }
            }
        },
        {
            name: 'UPI Blocks',
            config: {
                config: {
                    display: {
                        blocks: {
                            utpay: {
                                name: 'UPI Payment',
                                instruments: [{ method: 'upi' }]
                            }
                        }
                    }
                }
            }
        }
    ];
    
    upiTestConfigs.forEach((testConfig, index) => {
        console.log(`   ${index + 1}. ${testConfig.name}:`);
        console.log('      Configuration:', JSON.stringify(testConfig.config, null, 6));
    });
    
    console.log('\n' + '='.repeat(60));
    
    // Test 6: Known Issues and Solutions
    console.log('🔧 Test 6: Known Issues and Solutions...');
    console.log('   Common UPI Issues:');
    console.log('   1. ❌ UPI not enabled in Razorpay dashboard');
    console.log('   2. ❌ Test account limitations');
    console.log('   3. ❌ Currency must be INR for UPI');
    console.log('   4. ❌ Amount restrictions (min/max limits)');
    console.log('   5. ❌ Configuration syntax errors');
    
    console.log('\n   Potential Solutions:');
    console.log('   1. ✅ Check Razorpay Dashboard → Account Settings → Payment Methods');
    console.log('   2. ✅ Ensure currency is INR');
    console.log('   3. ✅ Use minimal configuration first');
    console.log('   4. ✅ Test with different amounts');
    console.log('   5. ✅ Contact Razorpay support for test account UPI enablement');
    
    console.log('\n' + '='.repeat(60));
    
    // Test 7: Recommendations
    console.log('💡 Test 7: Recommendations...');
    console.log('   Next Steps:');
    console.log('   1. 🔍 Check browser console for Razorpay errors');
    console.log('   2. 🧪 Test with the debug HTML page');
    console.log('   3. 📞 Contact Razorpay support about UPI in test mode');
    console.log('   4. 🔄 Try creating a new test account');
    console.log('   5. 📱 Test on mobile device (UPI works better on mobile)');
    
    console.log('\n🎯 CONCLUSION:');
    console.log('   If UPI still doesn\'t show up after these tests,');
    console.log('   the issue is likely that this specific Razorpay test');
    console.log('   account doesn\'t have UPI enabled. This is common');
    console.log('   with older test accounts or accounts in certain regions.');
    
    console.log('\n✅ Testing completed!');
}

// Run the test
if (require.main === module) {
    testRazorpayAccount().catch(console.error);
}

module.exports = { testRazorpayAccount };
