'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { BrandedSpinner, NavigationProgressBar, LoadingOverlay } from './NavigationLoader';

interface NavigationLoadingContextType {
  isLoading: boolean;
  showOverlay: boolean;
  hasTimedOut: boolean;
  progress: number;
  startLoading: () => void;
  stopLoading: () => void;
  resetTimeout: () => void;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType | undefined>(undefined);

interface NavigationLoadingProviderProps {
  children: React.ReactNode;
  threshold?: number;
  timeout?: number;
  enableProgressBar?: boolean;
  enableOverlay?: boolean;
}

export function NavigationLoadingProvider({
  children,
  threshold = 300,
  timeout = 10000,
  enableProgressBar = true,
  enableOverlay = true
}: NavigationLoadingProviderProps) {
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [progress, setProgress] = useState(0);

  // Stop loading on route change
  useEffect(() => {
    setIsLoading(false);
    setShowOverlay(false);
    setProgress(0);
  }, [pathname]);

  const startLoading = () => {
    setIsLoading(true);
    setHasTimedOut(false);
    setProgress(0);

    // Start progress animation
    if (enableProgressBar) {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 15, 90));
      }, 200);

      setTimeout(() => clearInterval(progressInterval), timeout);
    }

    // Show overlay after threshold
    if (enableOverlay) {
      setTimeout(() => {
        setShowOverlay(true);
      }, threshold);
    }

    // Set timeout
    setTimeout(() => {
      setHasTimedOut(true);
      setIsLoading(false);
      setShowOverlay(false);
    }, timeout);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setShowOverlay(false);
    setHasTimedOut(false);
    setProgress(100);

    // Reset progress after animation
    setTimeout(() => setProgress(0), 300);
  };

  const resetTimeout = () => {
    setHasTimedOut(false);
    setIsLoading(false);
    setShowOverlay(false);
    setProgress(0);
  };

  const contextValue: NavigationLoadingContextType = {
    isLoading,
    showOverlay,
    hasTimedOut,
    progress,
    startLoading,
    stopLoading,
    resetTimeout
  };

  return (
    <NavigationLoadingContext.Provider value={contextValue}>
      {children}
      
      {/* Global loading indicators */}
      {enableProgressBar && isLoading && <NavigationProgressBar />}
      
      {enableOverlay && (
        <LoadingOverlay 
          show={showOverlay} 
          onTimeout={() => setHasTimedOut(true)} 
        />
      )}
      
      {/* Timeout error state */}
      {hasTimedOut && (
        <div className="fixed inset-0 bg-red-50/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 border border-red-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Navigation Timeout
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                The page is taking longer than expected to load. Please check your connection and try again.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex-1"
                >
                  Reload Page
                </button>
                <button
                  onClick={contextValue.resetTimeout}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium transition-colors flex-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </NavigationLoadingContext.Provider>
  );
}

// Hook to use navigation loading context
export function useNavigationLoading() {
  const context = useContext(NavigationLoadingContext);
  if (context === undefined) {
    throw new Error('useNavigationLoading must be used within a NavigationLoadingProvider');
  }
  return context;
}

// Higher-order component for pages that need loading states
export function withNavigationLoading<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    showSpinner?: boolean;
    spinnerSize?: 'sm' | 'md' | 'lg';
    minLoadingTime?: number;
  }
) {
  return function NavigationLoadingWrapper(props: P) {
    const { isLoading } = useNavigationLoading();
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
      if (isLoading) {
        setShowLoading(true);
        
        // Minimum loading time to prevent flashing
        if (options?.minLoadingTime) {
          setTimeout(() => {
            if (!isLoading) setShowLoading(false);
          }, options.minLoadingTime);
        }
      } else {
        setShowLoading(false);
      }
    }, [isLoading]);

    if (showLoading && options?.showSpinner) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <BrandedSpinner size={options.spinnerSize || 'lg'} />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
