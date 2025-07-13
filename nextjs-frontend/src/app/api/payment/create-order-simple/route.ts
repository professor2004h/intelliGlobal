import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('💳 Simple payment order creation request received');
    
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

    // Always create a working payment order for testing
    console.log('🧪 Creating simple test payment order...');
    
    const simpleOrder = {
      id: `order_simple_${Date.now()}`,
      amount: Math.round(amount * 100), // Convert to smallest unit
      currency: currency,
      receipt: receipt || `simple_receipt_${Date.now()}`,
      status: 'created',
      created_at: Math.floor(Date.now() / 1000),
      notes: {
        ...notes,
        payment_type: 'simple_test',
        upi_enabled: 'true',
        test_mode: 'true'
      }
    };

    console.log('✅ Simple payment order created:', simpleOrder);

    return NextResponse.json({
      success: true,
      order: simpleOrder,
      simple: true,
      message: 'Simple payment order created successfully'
    });

  } catch (error) {
    console.error('❌ Error creating simple payment order:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create simple payment order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
