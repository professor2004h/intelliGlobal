'use client';

import React, { useState } from 'react';
import DetailedConferenceDisplay from '../components/DetailedConferenceDisplay';

export default function ConferenceDetailsPage() {
  const [showTechOnly, setShowTechOnly] = useState(false);
  const [viewLimit, setViewLimit] = useState<number | undefined>(undefined);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Control Panel */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Conference Explorer</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Live Data from Sanity CMS
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Technology Filter Toggle */}
              <div className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTechOnly}
                    onChange={(e) => setShowTechOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showTechOnly ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showTechOnly ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    🤖 Technology Focus
                  </span>
                </label>
              </div>

              {/* Limit Selector */}
              <div className="flex items-center space-x-2">
                <label htmlFor="limit-select" className="text-sm font-medium text-gray-700">
                  Show:
                </label>
                <select
                  id="limit-select"
                  value={viewLimit || 'all'}
                  onChange={(e) => setViewLimit(e.target.value === 'all' ? undefined : parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Conferences</option>
                  <option value="5">First 5</option>
                  <option value="10">First 10</option>
                  <option value="20">First 20</option>
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <span>🔄</span>
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Filter Info */}
          <div className="mt-3 text-sm text-gray-600">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-1">
                <span>🔍</span>
                <span>
                  Searching for: <strong>robotics, AI, technology, hello, hi</strong> and related keywords
                </span>
              </div>
              {showTechOnly && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <span>🎯</span>
                  <span>Showing technology-focused conferences only</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conference Display */}
      <DetailedConferenceDisplay 
        showTechOnly={showTechOnly} 
        limit={viewLimit}
      />

      {/* Footer Info */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <h3 className="text-lg font-semibold mb-2">About This Data</h3>
            <p className="text-sm max-w-3xl mx-auto leading-relaxed">
              This page displays real-time conference data from our Sanity CMS backend. 
              Conferences are automatically prioritized based on technology-related keywords including 
              robotics, AI, machine learning, automation, and other tech themes. 
              The data includes comprehensive details such as speakers, topics, highlights, and contact information.
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <span>🔄</span>
                <span>Real-time updates</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>🎯</span>
                <span>Smart filtering</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>📊</span>
                <span>Comprehensive data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
