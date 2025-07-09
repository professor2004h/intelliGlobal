'use client';

import { useEffect, useState } from 'react';
import { getAllConferences, getSponsorshipTiers } from '../getSponsorshipData';
import type { ConferenceEvent, SponsorshipTier } from '../getSponsorshipData';

export default function TestConferenceData() {
  const [conferences, setConferences] = useState<ConferenceEvent[]>([]);
  const [tiers, setTiers] = useState<SponsorshipTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('🔍 TEST: Starting data fetch...');

        // Test conferences first
        console.log('🔍 TEST: Fetching conferences...');
        const conferencesData = await getAllConferences();
        console.log('📅 TEST: Conferences result:', conferencesData);
        console.log('📅 TEST: Conferences type:', typeof conferencesData);
        console.log('📅 TEST: Conferences is array?', Array.isArray(conferencesData));
        console.log('📅 TEST: Conferences length:', conferencesData?.length);

        // Test tiers
        console.log('🔍 TEST: Fetching tiers...');
        const tiersData = await getSponsorshipTiers();
        console.log('📊 TEST: Tiers result:', tiersData);
        console.log('📊 TEST: Tiers length:', tiersData?.length);

        setConferences(conferencesData || []);
        setTiers(tiersData || []);
        setLoading(false);
      } catch (err) {
        console.error('❌ TEST: Error:', err);
        console.error('❌ TEST: Error stack:', err instanceof Error ? err.stack : 'No stack');
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Conference Data Test</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Conference Data Test</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Conference Data Test</h1>
        
        {/* Conferences Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Conferences ({conferences.length})</h2>
          {conferences.length > 0 ? (
            <div className="space-y-4">
              {conferences.map((conference) => (
                <div key={conference._id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-lg">{conference.title}</h3>
                  <p className="text-gray-600">ID: {conference._id}</p>
                  <p className="text-gray-600">Date: {new Date(conference.date).toLocaleDateString()}</p>
                  <p className="text-gray-600">Location: {conference.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No conferences found
            </div>
          )}
        </div>

        {/* Sponsorship Tiers Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Sponsorship Tiers ({tiers.length})</h2>
          {tiers.length > 0 ? (
            <div className="space-y-4">
              {tiers.map((tier) => (
                <div key={tier._id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-lg">{tier.name}</h3>
                  <p className="text-gray-600">ID: {tier._id}</p>
                  <p className="text-gray-600">Price: ${tier.price}</p>
                  <p className="text-gray-600">Description: {tier.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No sponsorship tiers found
            </div>
          )}
        </div>

        {/* Test Dropdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test Conference Dropdown</h2>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg">
            <option value="">Choose a conference...</option>
            {conferences.map((conference) => (
              <option key={conference._id} value={conference._id}>
                {conference.title} - {new Date(conference.date).toLocaleDateString()} - {conference.location}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
