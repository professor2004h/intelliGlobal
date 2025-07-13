import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailConnection } from '../../lib/emailService';

export async function GET(_request: NextRequest) {
  try {
    console.log('🔧 Testing SMTP Configuration...');
    
    // Check environment variables
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'not set',
      port: process.env.SMTP_PORT || 'not set',
      user: process.env.SMTP_USER || 'not set',
      pass: process.env.SMTP_PASS ? 'set (length: ' + process.env.SMTP_PASS.replace(/\s/g, '').length + ')' : 'not set',
      passRaw: process.env.SMTP_PASS ? process.env.SMTP_PASS.substring(0, 4) + '****' : 'not set',
      fromEmail: process.env.FROM_EMAIL || 'not set'
    };

    console.log('📧 SMTP Config:', smtpConfig);

    // Test SMTP connection
    const connectionTest = await verifyEmailConnection();

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      smtpConfig,
      connectionTest: connectionTest ? 'SUCCESS' : 'FAILED',
      status: connectionTest ? 'SMTP connection working' : 'SMTP connection failed',
      troubleshooting: {
        envVarsSet: {
          SMTP_HOST: !!process.env.SMTP_HOST,
          SMTP_PORT: !!process.env.SMTP_PORT,
          SMTP_USER: !!process.env.SMTP_USER,
          SMTP_PASS: !!process.env.SMTP_PASS,
          FROM_EMAIL: !!process.env.FROM_EMAIL
        },
        recommendations: connectionTest ? 
          ['SMTP is working correctly'] : 
          [
            'Check if environment variables are set in Coolify',
            'Verify Gmail App Password is correct (16 chars, no spaces)',
            'Ensure 2-factor authentication is enabled on Gmail',
            'Try restarting the container in Coolify'
          ]
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ SMTP test failed:', error);
    
    return NextResponse.json({
      error: 'SMTP test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, {
      status: 500
    });
  }
}
