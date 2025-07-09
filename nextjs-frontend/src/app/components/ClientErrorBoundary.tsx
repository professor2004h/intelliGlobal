'use client';

import { useEffect, useState } from 'react';

interface ClientErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

export default function ClientErrorBoundary({ 
  children, 
  fallback,
  onError 
}: ClientErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Client error caught:', event.error);
      setError(event.error);
      setHasError(true);
      onError?.(event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      const error = new Error(event.reason?.message || 'Unhandled promise rejection');
      setError(error);
      setHasError(true);
      onError?.(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [onError]);

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-sm font-medium text-red-800">Something went wrong</h3>
        </div>
        <div className="mt-2">
          <p className="text-sm text-red-700">
            This component encountered an error. Please try refreshing the page.
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setError(null);
            }}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-3">
            <summary className="text-xs text-red-600 cursor-pointer">Error Details</summary>
            <pre className="mt-1 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
