import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function GET(_request: NextRequest) {
  try {
    console.log('🔧 Testing Razorpay Configuration...');
    
    // Check environment variables
    const razorpayConfig = {
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'not set',
      secretKey: process.env.RAZORPAY_SECRET_KEY ? 'set (length: ' + process.env.RAZORPAY_SECRET_KEY.length + ')' : 'not set',
      nodeEnv: process.env.NODE_ENV || 'not set'
    };

    console.log('💳 Razorpay Config:', razorpayConfig);

    // Test Razorpay initialization
    let razorpayInstance = null;
    let initializationError = null;

    try {
      if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET_KEY) {
        razorpayInstance = new Razorpay({
          key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_SECRET_KEY,
        });
        console.log('✅ Razorpay instance created successfully');
      } else {
        initializationError = 'Missing Razorpay credentials';
      }
    } catch (error) {
      initializationError = error instanceof Error ? error.message : 'Unknown initialization error';
      console.error('❌ Razorpay initialization failed:', error);
    }

    // Test order creation
    let orderCreationTest = null;
    if (razorpayInstance) {
      try {
        console.log('🧪 Attempting to create test order...');
        const orderData = {
          amount: 10000, // ₹100 in paise
          currency: 'INR',
          receipt: `test_receipt_${Date.now()}`,
          notes: {
            test: 'razorpay_connection_test'
          }
        };
        console.log('📋 Order data:', orderData);

        const testOrder = await razorpayInstance.orders.create(orderData);

        orderCreationTest = {
          success: true,
          orderId: testOrder.id,
          amount: testOrder.amount,
          currency: testOrder.currency
        };
        console.log('✅ Test order created successfully:', testOrder.id);
      } catch (error) {
        // Enhanced error logging: log everything
        let errorDetails = {};
        if (error && typeof error === 'object') {
          errorDetails = { ...error };
        }
        errorDetails.message = error instanceof Error ? error.message : JSON.stringify(error);
        errorDetails.stack = error instanceof Error ? error.stack : undefined;

        orderCreationTest = {
          success: false,
          error: errorDetails.message,
          errorDetails
        };
        console.error('❌ Test order creation failed:', error);
        console.error('❌ Detailed error info:', errorDetails);
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      razorpayConfig,
      initialization: {
        success: !!razorpayInstance,
        error: initializationError
      },
      orderCreationTest,
      troubleshooting: {
        envVarsSet: {
          NEXT_PUBLIC_RAZORPAY_KEY_ID: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          RAZORPAY_SECRET_KEY: !!process.env.RAZORPAY_SECRET_KEY
        },
        recommendations: !razorpayInstance ? 
          [
            'Check if NEXT_PUBLIC_RAZORPAY_KEY_ID is set in Coolify',
            'Check if RAZORPAY_SECRET_KEY is set in Coolify',
            'Verify Razorpay credentials are correct',
            'Ensure environment variables are applied after deployment'
          ] : 
          orderCreationTest?.success ? 
            ['Razorpay is working correctly'] :
            [
              'Razorpay initialization works but order creation fails',
              'Check Razorpay account status',
              'Verify API permissions',
              'Check network connectivity'
            ]
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ Razorpay test failed:', error);
    
    return NextResponse.json({
      error: 'Razorpay test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}
