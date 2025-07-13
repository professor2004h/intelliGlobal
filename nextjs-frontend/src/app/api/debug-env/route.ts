import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    // Get environment variables (safe ones only)
    const envStatus = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV || 'not set',
      port: process.env.PORT || 'not set',
      hostname: process.env.HOSTNAME || 'not set',
      sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'not set',
      sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'not set',
      sanityApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'not set',
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'set' : 'not set',
      razorpaySecret: process.env.RAZORPAY_SECRET_KEY ? 'set' : 'not set',
      sanityToken: process.env.SANITY_API_TOKEN ? 'set' : 'not set',
      smtpHost: process.env.SMTP_HOST || 'not set',
      smtpPort: process.env.SMTP_PORT || 'not set',
      smtpUser: process.env.SMTP_USER || 'not set',
      smtpPass: process.env.SMTP_PASS ? 'set (length: ' + process.env.SMTP_PASS.length + ')' : 'not set',
      fromEmail: process.env.FROM_EMAIL || 'not set',
      buildInfo: 'Docker rebuild v2 - timestamp added',
      containerInfo: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
      }
    };

    return NextResponse.json(envStatus, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}
