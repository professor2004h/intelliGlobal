import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      sponsorshipData 
    } = body;

    console.log('🔍 Test payment verification request:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      hasSignature: !!razorpay_signature
    });

    // Handle test payments
    if (razorpay_order_id?.startsWith('order_test_') || 
        razorpay_order_id?.startsWith('order_working_') ||
        razorpay_order_id?.startsWith('order_mock_') ||
        razorpay_order_id?.startsWith('order_fallback_')) {
      
      let paymentType = 'test';
      if (razorpay_order_id.startsWith('order_working_')) paymentType = 'working';
      if (razorpay_order_id.startsWith('order_mock_')) paymentType = 'mock';
      if (razorpay_order_id.startsWith('order_fallback_')) paymentType = 'fallback';
      
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
        timestamp: new Date().toISOString(),
        sponsorshipData: sponsorshipData
      });
    }

    // For real Razorpay payments (when implemented)
    return NextResponse.json(
      { error: 'Real Razorpay verification not implemented yet' },
      { status: 501 }
    );

  } catch (error) {
    console.error('❌ Error verifying test payment:', error);
    
    return NextResponse.json(
      { 
        error: 'Payment verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    message: 'Test payment verification endpoint is working',
    timestamp: new Date().toISOString(),
    status: 'active'
  });
}
