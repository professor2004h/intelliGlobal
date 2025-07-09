'use client';

import { useState, useEffect } from 'react';

interface HeroData {
  primaryButton?: {
    text: string;
    url: string;
  };
  secondaryButton?: {
    text: string;
    url: string;
  };
}

export default function TestHeroButtonsPage() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeroData() {
      try {
        console.log('🔍 Fetching hero data...');
        const response = await fetch('/api/hero-section');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('✅ Hero data fetched:', data);
        setHeroData(data);
      } catch (err) {
        console.error('❌ Error fetching hero data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchHeroData();
  }, []);

  const testButtonClick = (buttonType: string, url?: string) => {
    console.log(`🔗 Testing ${buttonType} button click:`, url);
    if (url) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        console.log('🌐 Opening external URL in new tab');
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        console.log('🏠 Navigating to internal URL');
        window.location.href = url;
      }
    } else {
      console.log('❌ No URL provided for button');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hero section data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-bold text-lg mb-2">Error Loading Hero Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hero Section Button Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Hero Section Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(heroData, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Button Tests</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Primary Button</h3>
              <p className="text-sm text-gray-600 mb-2">
                Text: {heroData?.primaryButton?.text || 'Not set'}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                URL: {heroData?.primaryButton?.url || 'Not set'}
              </p>
              <button
                onClick={() => testButtonClick('Primary', heroData?.primaryButton?.url)}
                className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition-colors"
              >
                Test Primary Button
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Secondary Button</h3>
              <p className="text-sm text-gray-600 mb-2">
                Text: {heroData?.secondaryButton?.text || 'Not set'}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                URL: {heroData?.secondaryButton?.url || 'Not set'}
              </p>
              <button
                onClick={() => testButtonClick('Secondary', heroData?.secondaryButton?.url)}
                className="border-2 border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-gray-50 transition-colors"
              >
                Test Secondary Button
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
