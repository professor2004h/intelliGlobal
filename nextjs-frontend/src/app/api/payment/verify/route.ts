import { NextRequest, NextResponse } from 'next/server';

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

  } catch (error) {
    console.error('❌ Payment verification error (payments disabled):', error);
    return NextResponse.json({
      success: true,
      verified: true,
      paymentsDisabled: true,
      message: 'Payments disabled - verification bypassed',
      error: 'handled'
    });
  }
}
