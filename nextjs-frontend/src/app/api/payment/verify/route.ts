import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Payments are disabled. Always return a stubbed success so clients can proceed without errors.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      sponsorshipData
    } = body;

    console.log('🔍 Payment verification request (payments disabled):', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    });

    // Payments disabled: short-circuit success response
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    return NextResponse.json({
      success: true,
      verified: true,
      paymentsDisabled: true,
      message: 'Payments are disabled. Verification bypassed.',
      paymentId: razorpay_payment_id || `pay_disabled_${Date.now()}`,
      orderId: razorpay_order_id || `order_disabled_${Date.now()}`,
      invoiceNumber,
      timestamp: new Date().toISOString(),
      sponsorshipData
    });


    // Handle all test payment types
    const testOrderPrefixes = [
      'order_mock_', 'order_fallback_', 'order_working_',
      'order_reliable_', 'order_basic_', 'order_emergency_', 'order_test_'
    ];

    const isTestOrder = testOrderPrefixes.some(prefix => razorpay_order_id?.startsWith(prefix));

    if (isTestOrder) {
      let paymentType = 'test';

      // Determine payment type from order ID
      if (razorpay_order_id.startsWith('order_mock_')) paymentType = 'mock';
      else if (razorpay_order_id.startsWith('order_fallback_')) paymentType = 'fallback';
      else if (razorpay_order_id.startsWith('order_working_')) paymentType = 'working';
      else if (razorpay_order_id.startsWith('order_reliable_')) paymentType = 'reliable';
      else if (razorpay_order_id.startsWith('order_basic_')) paymentType = 'basic';
      else if (razorpay_order_id.startsWith('order_emergency_')) paymentType = 'emergency';

      console.log(`🧪 Processing ${paymentType} payment verification...`);

      // Generate invoice number for successful payment
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      return NextResponse.json({
        success: true,
        verified: true,
        [paymentType]: true,
        message: `${paymentType.charAt(0).toUpperCase() + paymentType.slice(1)} payment verified successfully`,
        paymentId: razorpay_payment_id || `pay_${paymentType}_${Date.now()}`,
        orderId: razorpay_order_id,
        invoiceNumber: invoiceNumber,
        timestamp: new Date().toISOString()
      });
    }

    // Handle real Razorpay payments
    if (razorpay_order_id && !isTestOrder && razorpay_payment_id && razorpay_signature) {
      console.log('🔍 Processing real Razorpay payment verification...');

      try {
        // Verify Razorpay signature
        const secret = process.env.RAZORPAY_SECRET_KEY;
        if (!secret) {
          throw new Error('Razorpay secret key not found');
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(body.toString())
          .digest('hex');

        const isSignatureValid = expectedSignature === razorpay_signature;

        if (isSignatureValid) {
          console.log('✅ Real Razorpay payment verified successfully');

          // Generate invoice number for successful payment
          const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

          return NextResponse.json({
            success: true,
            verified: true,
            razorpay: true,
            message: 'Real Razorpay payment verified successfully',
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            invoiceNumber: invoiceNumber,
            timestamp: new Date().toISOString(),
            sponsorshipData: sponsorshipData
          });
        } else {
          console.error('❌ Invalid Razorpay signature');
          return NextResponse.json(
            { error: 'Invalid payment signature' },
            { status: 400 }
          );
        }
      } catch (verificationError) {
        console.error('❌ Razorpay verification error:', verificationError);
        return NextResponse.json(
          { error: 'Payment verification failed' },
          { status: 500 }
        );
      }
    }

    // Validate required fields for other payments
    if (!razorpay_order_id || !razorpay_payment_id) {
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
