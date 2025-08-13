import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      paymentsDisabled: true,
      message: 'Payment methods test disabled on this deployment.'
    });
  } catch (error) {
    console.error('❌ Payment methods test failed (payments disabled):', error);
    return NextResponse.json({
      success: true,
      paymentsDisabled: true,
      message: 'Payment methods test disabled'
    });
  }
}
