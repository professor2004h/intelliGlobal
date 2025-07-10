import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    // Convert amount to smallest currency unit (paise for INR, cents for USD)
    const amountInSmallestUnit = currency === 'INR'
      ? Math.round(amount * 100) // Convert to paise for INR
      : Math.round(amount * 100); // Convert to cents for USD

    // Create Razorpay order with UPI test support
    const order = await razorpay.orders.create({
      amount: amountInSmallestUnit,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        ...notes,
        // Payment method configuration
        upi_test_enabled: 'true',
        test_upi_id: 'success@razorpay',
        payment_methods: 'upi,card,netbanking,wallet',
        environment: process.env.NODE_ENV || 'development',
        currency_used: currency,
        // Card configuration
        international_cards: 'enabled',
        card_types: 'domestic,international',
        // UPI configuration
        upi_flows: 'collect,intent,qr'
      },
    });

    console.log('💳 Payment order created:', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    });
  } catch (error) {
    console.error('❌ Error creating payment order:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create payment order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
