import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({ paymentsDisabled: true, message: 'Razorpay tests disabled' });
  } catch (error) {
    console.error('❌ Razorpay test failed (payments disabled):', error);
    return NextResponse.json({ paymentsDisabled: true, message: 'Razorpay tests disabled' });
  }
}
