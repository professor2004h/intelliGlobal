import { NextRequest, NextResponse } from 'next/server';

// Payments are disabled in this deployment. Provide minimal stubs so the app logic can proceed.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({} as any));
  const amount = typeof body?.amount === 'number' ? body.amount : 0;
  return NextResponse.json({
    success: true,
    paymentsDisabled: true,
    order: {
      id: `order_disabled_${Date.now()}`,
      amount: Math.max(0, Math.round(amount * 100)),
      currency: body?.currency || 'INR',
      receipt: body?.receipt || `disabled_receipt_${Date.now()}`,
      status: 'created',
    },
    message: 'Payments are disabled.'
  });
}

export async function GET() {
  return NextResponse.json({ paymentsDisabled: true, message: 'Payments API disabled' });
}

export const dynamic = 'force-dynamic';


/* Payments code disabled below to ensure clean deploys on Coolify */

/*
export async function POST(request: NextRequest) {
  console.log('💳 Payment order creation request received');

  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      // Create a basic working order even if parsing fails
      const basicOrder = {
        id: `order_basic_${Date.now()}`,
        amount: 9900, // Default ₹99
        currency: 'INR',
        receipt: `basic_receipt_${Date.now()}`,
        status: 'created',
        created_at: Math.floor(Date.now() / 1000),
        notes: {
          payment_type: 'basic_fallback',
          upi_enabled: 'true',
          test_mode: 'true'
        }
      };

      return NextResponse.json({
        success: true,
        order: basicOrder,
        basic: true,
        message: 'Basic payment order created (parsing error fallback)'
      });
    }

    const { amount, currency = 'INR', receipt, notes } = body;

    console.log('📋 Request data:', { amount, currency, receipt });

    // Validate and sanitize amount
    let validAmount = 99; // Default amount
    if (amount && typeof amount === 'number' && amount > 0) {
      validAmount = amount;
    }

    // Try real Razorpay first - reinitialize if needed to ensure fresh credentials
    let currentRazorpay = razorpay;
    if (!currentRazorpay) {
      console.log('🔄 Razorpay not initialized, attempting fresh initialization...');
      currentRazorpay = initializeRazorpay();
    }

    if (currentRazorpay) {
      try {
        console.log('💳 Creating real Razorpay order...');

        const amountInPaise = Math.round(validAmount * 100);

        const razorpayOrder = await currentRazorpay.orders.create({
          amount: amountInPaise,
          currency: currency,
          receipt: receipt || `rzp_receipt_${Date.now()}`,
          notes: {
            ...notes,
            payment_type: 'real_razorpay',
            upi_enabled: 'true',
            test_mode: 'true',
            // Enhanced UPI settings for frontend
            upi_flows_enabled: 'collect,intent,qr',
            upi_apps_supported: 'gpay,phonepe,paytm,bhim',
            payment_methods_enabled: 'upi,card,netbanking,wallet,emi',
            original_amount: validAmount,
            // UPI specific settings
            upi_flows: 'collect,intent,qr',
            upi_apps: 'gpay,phonepe,paytm,bhim',
            // Card configuration
            card_types: 'credit,debit',
            international_cards: 'enabled',
            // Environment settings
            environment: process.env.NODE_ENV || 'development'
          }
        });

        console.log('✅ Real Razorpay order created successfully:', {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          status: razorpayOrder.status
        });

        return NextResponse.json({
          success: true,
          order: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            receipt: razorpayOrder.receipt,
            status: razorpayOrder.status
          },
          razorpay: true,
          message: 'Real Razorpay payment order created successfully'
        });

      } catch (razorpayError) {
        console.error('❌ Real Razorpay failed, using fallback:', razorpayError);

        // Log detailed error for debugging
        if (razorpayError && typeof razorpayError === 'object') {
          const error = razorpayError as any;
          console.error('Razorpay Error Details:', {
            message: error.message,
            code: error.code,
            description: error.description,
            source: error.source,
            step: error.step,
            reason: error.reason
          });
        }

        // Continue to fallback system below
      }
    }

    // Fallback system if Razorpay fails or is not available
    console.log('🔄 Creating reliable fallback payment order...');

    const reliableOrder = {
      id: `order_reliable_${Date.now()}`,
      amount: Math.round(validAmount * 100), // Convert to smallest unit
      currency: currency,
      receipt: receipt || `reliable_receipt_${Date.now()}`,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
      notes: {
        ...notes,
        payment_type: 'reliable_fallback',
        upi_enabled: 'true',
        test_mode: 'true',
        // Enhanced UPI settings for frontend
        upi_flows_enabled: 'collect,intent,qr',
        upi_apps_supported: 'gpay,phonepe,paytm,bhim',
        payment_methods_enabled: 'upi,card,netbanking,wallet',
        original_amount: validAmount
      }
    };

    console.log('✅ Reliable fallback payment order created:', reliableOrder);

    return NextResponse.json({
      success: true,
      order: reliableOrder,
      reliable: true,
      message: 'Payment order created successfully with reliable fallback system'
    });

    // Original Razorpay code (temporarily disabled)
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

    /* Razorpay code temporarily disabled for testing
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
    */

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

    // Always return a working order - never fail
    console.log('🔄 Creating emergency fallback payment order...');

    const emergencyOrder = {
      id: `order_emergency_${Date.now()}`,
      amount: 9900, // Default ₹99
      currency: 'INR',
      receipt: `emergency_receipt_${Date.now()}`,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
      notes: {
        payment_type: 'emergency_fallback',
        upi_enabled: 'true',
        test_mode: 'true',
        error_recovery: 'true',
        original_error: error instanceof Error ? error.message : 'Unknown error'
      }
    };

    console.log('✅ Emergency payment order created:', emergencyOrder);

    return NextResponse.json({
      success: true,
      order: emergencyOrder,
*/
/*
      emergency: true,
      message: 'Payment order created with emergency fallback system'
    });
  }
*/

