'use client';

import { useState, useEffect } from 'react';
import { getSiteSettings, type SiteSettings } from '../getSiteSettings';

export default function TestJournalPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
        console.log('Site Settings:', settings);
        console.log('Journal Settings:', settings?.journal);
        console.log('Show Journal:', settings?.journal?.showJournal);
        console.log('Journal URL:', (settings as any)?.journal?.journalUrl);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading site settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Journal Functionality Test</h1>
          <p className="text-lg text-gray-600">
            This page helps debug the Journal functionality implementation.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Site Settings Debug</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Settings Available:</label>
              <p className="mt-1 text-sm text-gray-900">
                {siteSettings ? '✅ Yes' : '❌ No'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Journal Settings Object:</label>
              <pre className="mt-1 text-sm text-gray-900 bg-gray-100 p-2 rounded">
                {JSON.stringify(siteSettings?.journal, null, 2)}
              </pre>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Show Journal Value:</label>
              <p className="mt-1 text-sm text-gray-900">
                {siteSettings?.journal?.showJournal === true ? '✅ True (Journal should be visible)' :
                 siteSettings?.journal?.showJournal === false ? '❌ False (Journal should be hidden)' :
                 '⚠️ Undefined (Field not set in Sanity)'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Journal URL:</label>
              <p className="mt-1 text-sm text-gray-900">
                {siteSettings?.journal?.journalUrl ?
                  <a href={(siteSettings as any).journal.journalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {(siteSettings as any).journal.journalUrl}
                  </a> :
                  '⚠️ No URL set (will use default /journal page)'
                }
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Open in New Tab:</label>
              <p className="mt-1 text-sm text-gray-900">
                {siteSettings?.journal?.openInNewTab === true ? '✅ Yes (opens in new tab)' :
                 siteSettings?.journal?.openInNewTab === false ? '❌ No (opens in same tab)' :
                 '⚠️ Default (opens in new tab)'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Expected Behavior:</label>
              <div className="mt-1 text-sm text-gray-900">
                <p>• Header Navigation: {siteSettings?.journal?.showJournal ? '✅ Journal link should appear' : '❌ Journal link should be hidden'}</p>
                <p>• Homepage Section: {siteSettings?.journal?.showJournal ? '✅ Journal section should appear' : '❌ Journal section should be hidden'}</p>
                <p>• Link Target: {siteSettings?.journal?.journalUrl ? `External URL: ${(siteSettings as any).journal.journalUrl}` : 'Default /journal page'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">How to Configure Journal</h2>
          <div className="space-y-2 text-sm text-blue-800">
            <p>1. Open Sanity Studio: <a href="http://localhost:3333" target="_blank" rel="noopener noreferrer" className="underline font-medium">http://localhost:3333</a></p>
            <p>2. Navigate to "Site Settings" in the sidebar</p>
            <p>3. Look for "Journal Settings" section</p>
            <p>4. Toggle "Show Journal Button" ON to enable Journal functionality</p>
            <p>5. Enter the external website URL in "Journal Website URL" field</p>
            <p>6. Choose whether to "Open in New Tab" (recommended for external links)</p>
            <p>7. Save the document</p>
            <p>8. Refresh this page to see the updated values</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Test Links</h2>
          <div className="space-y-2">
            <p><a href="/" className="text-green-700 underline font-medium">← Back to Homepage</a></p>
            <p><a href="/journal" className="text-green-700 underline font-medium">→ Visit Journal Page</a></p>
            <p><a href="http://localhost:3333" target="_blank" rel="noopener noreferrer" className="text-green-700 underline font-medium">→ Open Sanity Studio</a></p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}
