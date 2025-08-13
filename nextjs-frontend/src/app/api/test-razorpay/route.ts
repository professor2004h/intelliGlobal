import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    paymentsDisabled: true,
    message: 'Razorpay tests disabled on this deployment'
  });
}
