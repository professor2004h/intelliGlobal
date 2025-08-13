import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      paymentsDisabled: true,
      message: 'Payment methods test disabled on this deployment.'
    });

    // Legacy code kept for reference (removed)
    // Check environment variables
    // Initialize Razorpay
    // Create test order etc.
    const testOrderData = {
      amount: 10000, // ₹100 in paise
      currency: 'INR',
      receipt: `test_methods_${Date.now()}`,
      notes: {
        test: 'payment_methods_test',
        upi_enabled: 'true',
        upi_test_mode: 'true',
        test_upi_id: 'success@razorpay',
        payment_methods: 'upi,card,netbanking,wallet,emi',
        upi_flows: 'collect,intent,qr',
        upi_apps: 'gpay,phonepe,paytm,bhim',
        card_types: 'credit,debit',
        international_cards: 'enabled',
        environment: process.env.NODE_ENV || 'development'
      }
    };

    console.log('📋 Creating test order with payment methods...');
    const testOrder = await razorpay.orders.create(testOrderData);

    // Test payment methods configuration
    const paymentMethodsConfig = {
      frontend: {
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: false,
          paylater: false
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'All Payment Methods',
                instruments: [
                  { method: 'upi' },
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' }
                ]
              }
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        upi: {
          flow: ['collect', 'intent', 'qr'],
          apps: ['gpay', 'phonepe', 'paytm', 'bhim', 'mobikwik', 'freecharge']
        }
      },
      backend: testOrderData.notes
    };

    // Check account capabilities (if available)
    let accountInfo = null;
    try {
      // Note: This might not be available in test mode
      accountInfo = {
        message: 'Account info not available in test mode',
        testMode: true
      };
    } catch (error) {
      accountInfo = {
        error: 'Could not fetch account info',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      credentials: {
        keyId: keyId.substring(0, 8) + '...',
        keySecretLength: keySecret.length,
        environment: process.env.NODE_ENV
      },
      testOrder: {
        id: testOrder.id,
        amount: testOrder.amount,
        currency: testOrder.currency,
        status: testOrder.status,
        notes: testOrder.notes
      },
      paymentMethodsConfig,
      accountInfo,
      recommendations: [
        'UPI payments work best in INR currency',
        'Test UPI ID: success@razorpay',
        'For production, ensure account is activated for UPI',
        'Check Razorpay dashboard for payment method settings',
        'Verify account has necessary permissions for all payment methods'
      ],
      troubleshooting: {
        upiNotVisible: [
          'Check if account is activated for UPI in Razorpay dashboard',
          'Ensure currency is set to INR',
          'Verify test mode UPI settings',
          'Check browser console for JavaScript errors'
        ],
        limitedMethods: [
          'Check account activation status',
          'Verify payment method permissions in dashboard',
          'Ensure proper configuration in frontend code',
          'Check for any account restrictions'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Payment methods test failed:', error);
    
    return NextResponse.json({
      error: 'Payment methods test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      details: {
        code: (error as any)?.code,
        description: (error as any)?.description,
        source: (error as any)?.source
      },
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}
