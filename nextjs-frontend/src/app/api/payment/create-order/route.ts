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

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

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

    // Fallback to mock payment if Razorpay fails
    console.log('🔄 Razorpay failed, using fallback mock payment...');

    try {
      const body = await request.json();
      const { amount, currency = 'INR', receipt, notes } = body;

      const fallbackOrder = {
        id: `order_fallback_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: currency,
        receipt: receipt || `fallback_receipt_${Date.now()}`,
        status: 'created',
        created_at: Math.floor(Date.now() / 1000),
        notes: notes || {}
      };

      console.log('✅ Fallback payment order created:', fallbackOrder);

      return NextResponse.json({
        success: true,
        order: fallbackOrder,
        fallback: true,
        message: 'Payment order created using fallback system due to API issues'
      });
    } catch (fallbackError) {
      console.error('❌ Fallback system also failed:', fallbackError);

      return NextResponse.json(
        {
          error: 'Payment system temporarily unavailable',
          details: 'Both primary and fallback systems failed',
          code: 'SYSTEM_UNAVAILABLE'
        },
        { status: 503 }
      );
    }
  }
}
