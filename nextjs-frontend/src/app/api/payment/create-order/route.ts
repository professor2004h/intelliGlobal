import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Initialize Razorpay with proper configuration
let razorpay: Razorpay | null = null;

if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET_KEY) {
  razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('💳 Payment order creation request received');

    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    console.log('📋 Request data:', { amount, currency, receipt });

    // Validate required fields
    if (!amount || amount <= 0) {
      console.log('❌ Invalid amount:', amount);
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    // Check if Razorpay is properly configured
    if (!razorpay) {
      console.error('❌ Razorpay not initialized - missing credentials');
      return NextResponse.json(
        {
          error: 'Payment service is not configured. Please contact support.',
          details: 'Razorpay credentials not found in environment variables'
        },
        { status: 503 }
      );
    }

    // Convert amount to smallest currency unit (paise for INR)
    const amountInSmallestUnit = Math.round(amount * 100);

    console.log('💳 Creating Razorpay order with enhanced UPI support...');

    // Create Razorpay order with comprehensive payment method support
    const order = await razorpay.orders.create({
      amount: amountInSmallestUnit,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        ...notes,
        // Enhanced UPI configuration
        upi_enabled: 'true',
        upi_test_mode: 'true',
        test_upi_id: 'success@razorpay',
        // Payment methods configuration
        payment_methods: 'upi,card,netbanking,wallet,emi',
        // UPI specific settings
        upi_flows: 'collect,intent,qr',
        upi_apps: 'gpay,phonepe,paytm,bhim',
        // Card configuration
        card_types: 'credit,debit',
        international_cards: 'enabled',
        // Environment settings
        environment: process.env.NODE_ENV || 'development',
        currency_used: currency
      }
    });

    console.log('✅ Razorpay order created successfully:', {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status
      }
    });

    // Original Razorpay code (commented out temporarily)
    /*
    // Check if Razorpay is properly configured
    if (!razorpay) {
      console.error('❌ Razorpay not initialized - missing credentials');
      return NextResponse.json(
        {
          error: 'Payment service is not configured. Please contact support.',
          details: 'Razorpay credentials not found in environment variables'
        },
        { status: 503 }
      );
    }
    */

    /* Original Razorpay implementation - commented out temporarily
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
    */
  } catch (error) {
    console.error('❌ Error creating payment order:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      description: (error as any)?.description,
      source: (error as any)?.source,
      step: (error as any)?.step,
      reason: (error as any)?.reason
    });

    return NextResponse.json(
      {
        error: 'Failed to create payment order',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}
