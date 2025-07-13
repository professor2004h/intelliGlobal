import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('💳 Test payment order creation request received');
    
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

    // Create a guaranteed working payment order
    console.log('🧪 Creating test payment order...');
    
    const testOrder = {
      id: `order_test_${Date.now()}`,
      amount: Math.round(amount * 100), // Convert to smallest unit
      currency: currency,
      receipt: receipt || `test_receipt_${Date.now()}`,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
      notes: {
        ...notes,
        payment_type: 'test_order',
        upi_enabled: 'true',
        test_mode: 'true',
        // Enhanced UPI settings for frontend
        upi_flows_enabled: 'collect,intent,qr',
        upi_apps_supported: 'gpay,phonepe,paytm,bhim',
        payment_methods_enabled: 'upi,card,netbanking,wallet'
      }
    };

    console.log('✅ Test payment order created:', testOrder);

    return NextResponse.json({
      success: true,
      order: testOrder,
      test: true,
      message: 'Test payment order created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating test payment order:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create test payment order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    message: 'Test payment order endpoint is working',
    timestamp: new Date().toISOString(),
    status: 'active'
  });
}
