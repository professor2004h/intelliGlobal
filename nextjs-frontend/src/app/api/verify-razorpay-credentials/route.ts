import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  return NextResponse.json({ paymentsDisabled: true, message: 'Razorpay disabled' });
}
  try {
    console.log('🔐 Verifying Razorpay credentials...');
    
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET_KEY;
    
    if (!keyId || !keySecret) {
      return NextResponse.json({
        error: 'Razorpay credentials not found',
        keyId: keyId ? 'SET' : 'NOT SET',
        keySecret: keySecret ? 'SET' : 'NOT SET'
      });
    }

    // Test credentials with a simple API call
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    console.log('🧪 Testing credentials with Razorpay API...');
    console.log('Key ID:', keyId.substring(0, 8) + '...');
    console.log('Key Secret Length:', keySecret.length);

    // Try to fetch account details or make a simple API call
    const response = await fetch('https://api.razorpay.com/v1/payments?count=1', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    console.log('📡 Razorpay API Response Status:', response.status);
    console.log('📡 Razorpay API Response:', responseText.substring(0, 200) + '...');

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Razorpay credentials are valid',
        status: response.status,
        credentials: {
          keyId: keyId.substring(0, 8) + '...',
          keySecretLength: keySecret.length,
          environment: keyId.includes('test') ? 'test' : 'live'
        },
        apiTest: {
          endpoint: 'payments',
          status: response.status,
          success: true
        }
      });
    } else {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }

      return NextResponse.json({
        success: false,
        error: 'Razorpay credentials are invalid or account has issues',
        status: response.status,
        errorData,
        credentials: {
          keyId: keyId.substring(0, 8) + '...',
          keySecretLength: keySecret.length,
          environment: keyId.includes('test') ? 'test' : 'live'
        },
        troubleshooting: {
          401: 'Invalid API credentials - check key ID and secret',
          403: 'Account not activated or insufficient permissions',
          429: 'Rate limit exceeded',
          500: 'Razorpay server error'
        }
      });
    }

  } catch (error) {
    console.error('❌ Credential verification failed:', error);
    
    return NextResponse.json({
      error: 'Credential verification failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}
