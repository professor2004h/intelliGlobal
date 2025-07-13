import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      sponsorshipData
    } = body;

    console.log('🔍 Payment verification request:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      hasSignature: !!razorpay_signature
    });

    // Handle mock and fallback payments
    if (razorpay_order_id?.startsWith('order_mock_') || razorpay_order_id?.startsWith('order_fallback_')) {
      const paymentType = razorpay_order_id.startsWith('order_mock_') ? 'mock' : 'fallback';
      console.log(`🧪 Processing ${paymentType} payment verification...`);

      return NextResponse.json({
        success: true,
        verified: true,
        [paymentType]: true,
        message: `${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)} payment verified successfully`,
        paymentId: razorpay_payment_id || `pay_${paymentType}_${Date.now()}`,
        orderId: razorpay_order_id
      });
    }

    // Validate required fields for real payments
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification data' },
        { status: 400 }
      );
    }

    // Verify payment signature
    const secret = process.env.RAZORPAY_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: 'Payment verification service is not configured' },
        { status: 503 }
      );
    }

    const body_string = razorpay_order_id + '|' + razorpay_payment_id;
    
    const expected_signature = crypto
      .createHmac('sha256', secret)
      .update(body_string)
      .digest('hex');

    const is_authentic = expected_signature === razorpay_signature;

    if (!is_authentic) {
      console.error('❌ Payment signature verification failed');
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    console.log('✅ Payment verified successfully:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Prepare payment confirmation data with UPI support
    const paymentConfirmation = {
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      invoiceNumber,
      timestamp: new Date().toISOString(),
      sponsorshipData,
      // Add UPI-specific confirmation data
      paymentMethod: sponsorshipData?.paymentMethod || 'unknown',
      upiTestMode: process.env.NEXT_PUBLIC_UPI_TEST_MODE === 'true',
      environment: process.env.NODE_ENV || 'development'
    };

    return NextResponse.json(paymentConfirmation);
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
