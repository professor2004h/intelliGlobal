'use client';

import { useEffect, useState, useCallback } from 'react';
// Removed old imports - now using real-time API endpoints
import SponsorRegistrationForm from './SponsorRegistrationForm';

// Define interfaces locally to avoid import issues
interface LocalSponsorshipTier {
  _id: string;
  name: string;
  slug: { current: string };
  pricing: {
    usd: number;
    eur: number;
    gbp: number;
    inr: number;
  };
  // Legacy field for backward compatibility
  price?: number;
  description?: string;
  benefits: Array<{ benefit: string; highlighted: boolean }>;
  color?: { hex: string };
  featured: boolean;
  active: boolean;
  order: number;
}

interface LocalConferenceEvent {
  _id: string;
  title: string;
  date: string;
  location: string;
  slug: { current: string };
  image?: { asset: { url: string } };
}

export default function SponsorRegistrationFormWrapper() {
  const [sponsorshipTiers, setSponsorshipTiers] = useState<LocalSponsorshipTier[]>([]);
  const [conferences, setConferences] = useState<LocalConferenceEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      console.log('🚀 CLIENT: Fetching sponsorship data...');
      setLoading(true);
      setError(null);

      // Fetch data using direct imports with proper error handling
      console.log('🔍 CLIENT: Starting data fetch...');

      let tiersData: LocalSponsorshipTier[] = [];
      let conferencesData: LocalConferenceEvent[] = [];

      // Fetch sponsorship tiers from real-time API endpoint
      try {
        const tiersResponse = await fetch('/api/sponsorship-tiers', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (tiersResponse.ok) {
          tiersData = await tiersResponse.json();
          console.log('✅ CLIENT: Sponsorship tiers fetched:', tiersData?.length || 0);
        } else {
          console.error('❌ CLIENT: Sponsorship tiers API returned:', tiersResponse.status);
        }
      } catch (error) {
        console.error('❌ CLIENT: Error fetching tiers:', error);
      }

      // Fetch conferences from real-time API endpoint
      try {
        const conferencesResponse = await fetch('/api/conferences', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (conferencesResponse.ok) {
          conferencesData = await conferencesResponse.json();
          console.log('✅ CLIENT: Conferences fetched:', conferencesData?.length || 0);
        } else {
          console.error('❌ CLIENT: Conferences API returned:', conferencesResponse.status);
        }
      } catch (error) {
        console.error('❌ CLIENT: Error fetching conferences:', error);
      }

      console.log('🔍 CLIENT: Data fetch completed');

      console.log('📊 CLIENT: Sponsorship tiers:', tiersData?.length || 0);
      console.log('📅 CLIENT: Conferences:', conferencesData?.length || 0);

      // Use fallback data if no data is available from Sanity
      const fallbackTiers: LocalSponsorshipTier[] = [
        {
          _id: 'platinum-elite',
          name: 'Platinum Elite Sponsor',
          slug: { current: 'platinum-elite' },
          price: 25000,
          description: 'Premium sponsorship package with maximum visibility and benefits',
          benefits: [
            { benefit: 'Prime exhibition booth (20x20 ft) in high-traffic area', highlighted: true },
            { benefit: '45-minute keynote speaking slot during main conference', highlighted: true },
            { benefit: 'Logo placement on all conference materials and website', highlighted: false },
            { benefit: 'Full attendee list with contact information', highlighted: false },
            { benefit: 'VIP networking dinner for 10 company representatives', highlighted: true },
            { benefit: 'Dedicated social media promotion campaign', highlighted: false }
          ],
          color: { hex: '#8B5CF6' },
          featured: true,
          active: true,
          order: 1
        },
        {
          _id: 'gold-premier',
          name: 'Gold Premier Sponsor',
          slug: { current: 'gold-premier' },
          price: 15000,
          description: 'Comprehensive sponsorship with excellent visibility and networking opportunities',
          benefits: [
            { benefit: 'Premium exhibition booth (15x15 ft)', highlighted: true },
            { benefit: '30-minute presentation slot', highlighted: true },
            { benefit: 'Logo on conference website and select materials', highlighted: false },
            { benefit: 'Access to attendee networking app', highlighted: false },
            { benefit: 'Welcome reception sponsorship opportunity', highlighted: true },
            { benefit: 'Social media mentions throughout event', highlighted: false }
          ],
          color: { hex: '#F59E0B' },
          featured: true,
          active: true,
          order: 2
        },
        {
          _id: 'silver-professional',
          name: 'Silver Professional Sponsor',
          slug: { current: 'silver-professional' },
          price: 8500,
          description: 'Professional sponsorship package with solid brand exposure',
          benefits: [
            { benefit: 'Standard exhibition booth (10x10 ft)', highlighted: true },
            { benefit: '15-minute lightning talk opportunity', highlighted: true },
            { benefit: 'Logo on conference website', highlighted: false },
            { benefit: 'Access to networking sessions', highlighted: false },
            { benefit: 'Conference swag bag inclusion', highlighted: false },
            { benefit: 'Digital attendee directory access', highlighted: false }
          ],
          color: { hex: '#6B7280' },
          featured: false,
          active: true,
          order: 3
        },
        {
          _id: 'bronze-startup',
          name: 'Bronze Startup Sponsor',
          slug: { current: 'bronze-startup' },
          price: 3500,
          description: 'Entry-level sponsorship perfect for startups and smaller companies',
          benefits: [
            { benefit: 'Shared exhibition space (6x6 ft)', highlighted: true },
            { benefit: 'Company listing in conference program', highlighted: false },
            { benefit: 'Access to networking coffee breaks', highlighted: false },
            { benefit: 'Digital marketing materials distribution', highlighted: false },
            { benefit: 'Conference recording access', highlighted: false }
          ],
          color: { hex: '#CD7F32' },
          featured: false,
          active: true,
          order: 4
        }
      ];

      const fallbackConferences: LocalConferenceEvent[] = [
        {
          _id: 'ai-ml-summit-2024',
          title: 'Global AI & Machine Learning Summit 2024',
          date: '2024-09-15T09:00:00.000Z',
          location: 'San Francisco, CA, USA',
          slug: { current: 'ai-ml-summit-2024' }
        },
        {
          _id: 'blockchain-fintech-2024',
          title: 'International Blockchain & Fintech Conference 2024',
          date: '2024-10-22T09:00:00.000Z',
          location: 'New York, NY, USA',
          slug: { current: 'blockchain-fintech-2024' }
        },
        {
          _id: 'digital-transformation-2024',
          title: 'Digital Transformation & Cloud Computing Expo 2024',
          date: '2024-11-18T09:00:00.000Z',
          location: 'London, UK',
          slug: { current: 'digital-transformation-2024' }
        },
        {
          _id: 'cybersecurity-summit-2024',
          title: 'Cybersecurity & Data Privacy Summit 2024',
          date: '2024-12-05T09:00:00.000Z',
          location: 'Singapore',
          slug: { current: 'cybersecurity-summit-2024' }
        },
        {
          _id: 'healthcare-innovation-2025',
          title: 'Healthcare Innovation & Digital Health Conference 2025',
          date: '2025-01-20T09:00:00.000Z',
          location: 'Boston, MA, USA',
          slug: { current: 'healthcare-innovation-2025' }
        }
      ];

      // Use live data first, fallback if necessary
      const hasRealTiers = tiersData?.length > 0;
      if (hasRealTiers) {
        console.log('🎯 CLIENT: Using live sponsorship tiers');
        const convertedTiers = tiersData.map((tier, index) => ({
          ...tier,
          slug: tier.slug || { current: tier._id },
          order: tier.order || index + 1,
          featured: tier.featured || false,
          active: tier.active !== false,
          pricing: tier.pricing || {
            usd: tier.price || 1000,
            eur: Math.round((tier.price || 1000) * 0.85),
            gbp: Math.round((tier.price || 1000) * 0.75),
            inr: Math.round((tier.price || 1000) * 83)
          },
          benefits: tier.benefits?.map(b => ({
            benefit: typeof b === 'string' ? b : b.benefit,
            highlighted: typeof b === 'object' && 'highlighted' in b ? b.highlighted : false
          })) || []
        }));
        setSponsorshipTiers(convertedTiers);
        console.log('✅ CLIENT: Sponsorship tiers loaded:', convertedTiers.map(t => t.name));
      } else {
        console.warn('⚠️ CLIENT: Using fallback sponsorship tiers');
        setSponsorshipTiers(fallbackTiers);
      }
      // Use live conference data first
      const hasRealConferences = conferencesData?.length > 0;
      if (hasRealConferences) {
        console.log('🎯 CLIENT: Using live conferences');
        const convertedConferences = conferencesData.map(conf => ({
          ...conf,
          slug: conf.slug || { current: conf._id }
        }));
        setConferences(convertedConferences);
        console.log('✅ CLIENT: Conferences loaded:', convertedConferences.map(c => c.title));
      } else {
        console.warn('⚠️ CLIENT: Using fallback conferences');
        setConferences(fallbackConferences);
      }

      // Final status report
      console.log('🎯 CLIENT: Data loading completed');
      console.log('   - Sponsorship Tiers:', hasRealTiers ? 'Loaded successfully' : 'Using fallback data');
      console.log('   - Conferences:', hasRealConferences ? 'Loaded successfully' : 'Using fallback data');

    } catch (err) {
      console.error('❌ CLIENT: Error fetching data:', err);
      setError('Failed to load sponsorship data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh function for manual refresh
  const refreshData = useCallback(async () => {
    console.log('🔄 CLIENT: Manual refresh triggered...');
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Initial data fetch with small delay to ensure client-side rendering
    const timer = setTimeout(() => {
      fetchData().catch(err => {
        console.error('❌ CLIENT: Initial fetch failed:', err);
        setError('Failed to load initial data. Please refresh the page.');
        setLoading(false);
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [fetchData]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏰ CLIENT: Auto-refresh triggered...');
      fetchData();
    }, 30000); // 30-second refresh

    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Loading sponsor registration form...</p>
          <p className="text-sm text-gray-500">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Form</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              refreshData();
            }}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors mr-4"
          >
            Retry
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <SponsorRegistrationForm
      sponsorshipTiers={sponsorshipTiers}
      conferences={conferences}
    />
  );
}
