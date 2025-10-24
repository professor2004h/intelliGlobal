import { NextRequest, NextResponse } from 'next/server';
import { testSanityConnection } from '../../sanity/client';

export async function GET(_request: NextRequest) {
  try {
    console.warn('🏥 Health check initiated...');
    
    // Test Sanity connection
    const sanityConnected = await testSanityConnection();
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Prepare health status
    const healthStatus = {
      status: sanityConnected ? 'healthy' : 'unhealthy',
      timestamp,
      services: {
        sanity: {
          status: sanityConnected ? 'connected' : 'disconnected',
          projectId: '99kpz7t0',
          dataset: 'production',
          apiVersion: '2023-05-03'
        },
        frontend: {
          status: 'running',
          environment: process.env.NODE_ENV || 'unknown'
        }
      },
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
    
    console.warn('🏥 Health check completed:', healthStatus.status);
    
    return NextResponse.json(healthStatus, {
      status: sanityConnected ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        sanity: { status: 'error' },
        frontend: { status: 'error' }
      }
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}
