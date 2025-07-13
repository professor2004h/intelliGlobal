import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    console.log('🔧 Simple Razorpay Test...');
    
    // Test with direct Razorpay API call using fetch
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_SECRET_KEY;
    
    if (!keyId || !keySecret) {
      return NextResponse.json({
        error: 'Razorpay credentials not found',
        keyId: keyId ? 'SET' : 'NOT SET',
        keySecret: keySecret ? 'SET' : 'NOT SET'
      });
    }

    // Create basic auth header
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    // Test order data
    const orderData = {
      amount: 10000, // ₹100 in paise
      currency: 'INR',
      receipt: `test_${Date.now()}`,
      notes: {
        test: 'direct_api_test'
      }
    };

    console.log('📋 Making direct API call to Razorpay...');
    console.log('Order data:', orderData);

    // Make direct API call to Razorpay
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const responseText = await response.text();
    console.log('📡 Razorpay API Response Status:', response.status);
    console.log('📡 Razorpay API Response:', responseText);

    if (response.ok) {
      const orderResult = JSON.parse(responseText);
      return NextResponse.json({
        success: true,
        message: 'Direct API call successful',
        order: orderResult,
        credentials: {
          keyId: keyId.substring(0, 8) + '...',
          keySecretLength: keySecret.length
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
        error: 'Direct API call failed',
        status: response.status,
        errorData,
        credentials: {
          keyId: keyId.substring(0, 8) + '...',
          keySecretLength: keySecret.length
        }
      });
    }

  } catch (error) {
    console.error('❌ Simple Razorpay test failed:', error);
    
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}
