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


/* Legacy payment code disabled for clean deployment */

