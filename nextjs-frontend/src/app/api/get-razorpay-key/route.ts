import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    console.log('🔑 Frontend requesting Razorpay key...');
    
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    
    console.log('Backend key check:', {
      keyExists: !!keyId,
      keyValue: keyId || 'NOT_SET',
      keyLength: keyId ? keyId.length : 0
    });
    
    if (!keyId) {
      console.error('❌ Razorpay key not found in backend environment');
      return NextResponse.json({
        success: false,
        error: 'Razorpay key not configured'
      }, { status: 500 });
    }
    
    if (!keyId.startsWith('rzp_')) {
      console.error('❌ Invalid Razorpay key format in backend');
      return NextResponse.json({
        success: false,
        error: 'Invalid Razorpay key format'
      }, { status: 500 });
    }
    
    console.log('✅ Providing Razorpay key to frontend');
    
    return NextResponse.json({
      success: true,
      keyId: keyId,
      environment: keyId.includes('test') ? 'test' : 'live',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error providing Razorpay key:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve Razorpay key',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
