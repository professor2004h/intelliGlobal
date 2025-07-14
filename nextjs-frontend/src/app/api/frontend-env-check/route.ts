import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    console.log('🔍 Frontend environment check requested...');
    
    // Check all environment variables
    const envCheck = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'set' : 'not set',
      razorpayKeyValue: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'NOT_SET',
      razorpayKeyLength: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.length : 0,
      allRazorpayEnvs: Object.keys(process.env).filter(key => key.includes('RAZORPAY')),
      allNextPublicEnvs: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
    };
    
    console.log('Environment check results:', envCheck);
    
    return NextResponse.json({
      success: true,
      environment: envCheck,
      message: 'Frontend environment check completed'
    });
    
  } catch (error) {
    console.error('❌ Frontend environment check failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Environment check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
