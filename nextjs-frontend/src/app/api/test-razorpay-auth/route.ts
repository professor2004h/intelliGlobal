import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function GET(_request: NextRequest) {
  try {
    console.log('🔐 Testing Razorpay Authentication...');
    
    // Check environment variables
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET_KEY;
    
    console.log('Environment variables check:', {
      keyIdExists: !!keyId,
      keyIdValue: keyId || 'NOT SET',
      keySecretExists: !!keySecret,
      keySecretLength: keySecret ? keySecret.length : 0,
      nodeEnv: process.env.NODE_ENV
    });

    if (!keyId || !keySecret) {
      return NextResponse.json({
        success: false,
        error: 'Razorpay credentials missing',
        details: {
          NEXT_PUBLIC_RAZORPAY_KEY_ID: keyId ? 'SET' : 'MISSING',
          RAZORPAY_SECRET_KEY: keySecret ? 'SET' : 'MISSING'
        },
        troubleshooting: [
          'Check if environment variables are set in Coolify',
          'Verify variable names are correct',
          'Ensure deployment has restarted after setting variables',
          'Check for any typos in variable names'
        ]
      });
    }

    // Validate credential format
    if (!keyId.startsWith('rzp_')) {
      return NextResponse.json({
        success: false,
        error: 'Invalid Razorpay Key ID format',
        details: {
          keyId: keyId.substring(0, 10) + '...',
          expectedFormat: 'rzp_test_... or rzp_live_...'
        }
      });
    }

    // Test Razorpay initialization
    let razorpayInstance;
    try {
      razorpayInstance = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      console.log('✅ Razorpay instance created successfully');
    } catch (initError) {
      console.error('❌ Razorpay initialization failed:', initError);
      return NextResponse.json({
        success: false,
        error: 'Razorpay initialization failed',
        details: initError instanceof Error ? initError.message : 'Unknown initialization error'
      });
    }

    // Test API connectivity with a simple order creation
    try {
      console.log('🧪 Testing order creation...');
      const testOrder = await razorpayInstance.orders.create({
        amount: 10000, // ₹100 in paise
        currency: 'INR',
        receipt: `auth_test_${Date.now()}`,
        notes: {
          test: 'authentication_verification',
          timestamp: new Date().toISOString()
        }
      });
      
      console.log('✅ Test order created successfully:', testOrder.id);
      
      return NextResponse.json({
        success: true,
        message: 'Razorpay authentication successful',
        credentials: {
          keyId: keyId.substring(0, 8) + '...',
          keySecretLength: keySecret.length,
          environment: keyId.includes('test') ? 'test' : 'live'
        },
        testOrder: {
          id: testOrder.id,
          amount: testOrder.amount,
          currency: testOrder.currency,
          status: testOrder.status
        },
        timestamp: new Date().toISOString()
      });

    } catch (apiError) {
      console.error('❌ Razorpay API test failed:', apiError);
      
      // Parse Razorpay API error
      let errorDetails = 'Unknown API error';
      let errorCode = 'UNKNOWN';
      
      if (apiError && typeof apiError === 'object') {
        const error = apiError as any;
        errorDetails = error.message || error.description || 'API request failed';
        errorCode = error.code || error.error?.code || 'API_ERROR';
      }
      
      return NextResponse.json({
        success: false,
        error: 'Razorpay API authentication failed',
        details: {
          message: errorDetails,
          code: errorCode,
          credentials: {
            keyId: keyId.substring(0, 8) + '...',
            keySecretLength: keySecret.length
          }
        },
        troubleshooting: [
          'Verify Razorpay account is activated',
          'Check if API keys have necessary permissions',
          'Ensure account is not suspended',
          'Verify test/live mode matches the keys'
        ]
      });
    }

  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    
    return NextResponse.json({
      error: 'Authentication test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}
