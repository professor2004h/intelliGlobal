'use client';

import { useState, useEffect } from 'react';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'error';
  timestamp: string;
  services: {
    sanity: {
      status: 'connected' | 'disconnected' | 'error';
      projectId?: string;
      dataset?: string;
    };
    frontend: {
      status: 'running' | 'error';
    };
  };
}

export default function ConnectionStatus() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/health', {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      setHealthStatus(data);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          sanity: { status: 'error' },
          frontend: { status: 'error' }
        }
      });
    }
  };

  useEffect(() => {
    // Initial health check
    checkHealth();
    
    // Set up periodic health checks (every 30 seconds)
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'running':
        return 'text-green-600 bg-green-100';
      case 'unhealthy':
      case 'disconnected':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'running':
        return '✅';
      case 'unhealthy':
      case 'disconnected':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`mb-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          healthStatus ? getStatusColor(healthStatus.status) : 'text-gray-600 bg-gray-100'
        }`}
        title="Connection Status"
      >
        {healthStatus ? getStatusIcon(healthStatus.status) : '❓'} Status
      </button>

      {/* Status Panel */}
      {isVisible && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {healthStatus && (
            <div className="space-y-3">
              {/* Overall Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Overall:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(healthStatus.status)}`}>
                  {getStatusIcon(healthStatus.status)} {healthStatus.status}
                </span>
              </div>

              {/* Sanity Backend */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Sanity Backend:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(healthStatus.services.sanity.status)}`}>
                  {getStatusIcon(healthStatus.services.sanity.status)} {healthStatus.services.sanity.status}
                </span>
              </div>

              {/* Frontend */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Frontend:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(healthStatus.services.frontend.status)}`}>
                  {getStatusIcon(healthStatus.services.frontend.status)} {healthStatus.services.frontend.status}
                </span>
              </div>

              {/* Last Checked */}
              {lastChecked && (
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={checkHealth}
                className="w-full mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
              >
                Refresh Status
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
