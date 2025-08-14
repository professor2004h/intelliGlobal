'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DetailedConferenceEvent } from '../getSponsorshipData';

interface DetailedConferenceDisplayProps {
  showTechOnly?: boolean;
  limit?: number;
}

export default function DetailedConferenceDisplay({ 
  showTechOnly = false, 
  limit 
}: DetailedConferenceDisplayProps) {
  const [conferences, setConferences] = useState<(DetailedConferenceEvent & { isTechnologyRelated?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching detailed conferences from API...');
        
        const response = await fetch('/api/detailed-conferences');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📊 Received conference data:', data);
        
        let filteredData = data;
        
        // Filter for technology-related conferences if requested
        if (showTechOnly) {
          filteredData = data.filter((conf: any) => conf.isTechnologyRelated);
        }
        
        // Apply limit if specified
        if (limit) {
          filteredData = filteredData.slice(0, limit);
        }
        
        setConferences(filteredData);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching conferences:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch conferences');
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, [showTechOnly, limit]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading conference details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg border border-red-200">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Conferences</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (conferences.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-gray-50 p-8 rounded-lg border border-gray-200">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Conferences Found</h2>
          <p className="text-gray-600">
            {showTechOnly 
              ? 'No technology-related conferences are currently available.' 
              : 'No conferences are currently available.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {showTechOnly ? '🤖 Technology Conferences' : '📅 All Conferences'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {showTechOnly 
              ? 'Discover cutting-edge technology conferences featuring robotics, AI, and innovation.'
              : 'Explore our comprehensive collection of professional conferences and events.'}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Found {conferences.length} conference{conferences.length !== 1 ? 's' : ''}
            {showTechOnly && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Technology Focus
              </span>
            )}
          </div>
        </div>

        {/* Conferences Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {conferences.map((conference) => (
            <div
              key={conference._id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 ${
                conference.isTechnologyRelated 
                  ? 'border-blue-200 hover:border-blue-400' 
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {/* Conference Image */}
              {conference.image?.asset?.url && (
                <div className="relative h-48 overflow-hidden">
                  {conference.conferenceImageUrl ? (
                    <a
                      href={conference.conferenceImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <Image
                        src={conference.image.asset.url}
                        alt={conference.title}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </a>
                  ) : (
                    <Image
                      src={conference.image.asset.url}
                      alt={conference.title}
                      width={600}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  {conference.isTechnologyRelated && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      🤖 Tech Conference
                    </div>
                  )}
                </div>
              )}

              {/* Conference Content */}
              <div className="p-6">
                {/* Title and Basic Info */}
                <div className="mb-4">
                  {conference.conferenceImageUrl ? (
                    <a
                      href={conference.conferenceImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl font-bold text-gray-900 hover:text-blue-600 mb-2 transition-colors duration-200 cursor-pointer block"
                    >
                      {conference.title}
                    </a>
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {conference.title}
                    </h2>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <span className="mr-1">📅</span>
                      {formatDate(conference.date)}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">📍</span>
                      {conference.location}
                    </div>
                    {conference.attendeeCount && (
                      <div className="flex items-center">
                        <span className="mr-1">👥</span>
                        {conference.attendeeCount.toLocaleString()} attendees
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  {conference.email && (
                    <div className="flex flex-wrap gap-4 text-sm text-blue-600 mb-3">
                      <a href={`mailto:${conference.email}`} className="hover:underline flex items-center">
                        <span className="mr-1">📧</span>
                        {conference.email}
                      </a>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    {conference.registerNowUrl ? (
                      <a
                        href={conference.registerNowUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                      >
                        Register Now
                      </a>
                    ) : (
                      <button
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl opacity-50 cursor-not-allowed"
                        disabled
                      >
                        Register Now
                      </button>
                    )}

                    {conference.submitAbstractUrl ? (
                      <a
                        href={conference.submitAbstractUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 border-2 border-slate-300 text-slate-700 px-4 py-3 rounded-lg font-semibold text-center hover:border-orange-500 hover:text-orange-600 transition-all duration-300"
                      >
                        Submit Abstract
                      </a>
                    ) : (
                      <button
                        className="flex-1 border-2 border-slate-300 text-slate-700 px-4 py-3 rounded-lg font-semibold hover:border-orange-500 hover:text-orange-600 transition-all duration-300 opacity-50 cursor-not-allowed"
                        disabled
                      >
                        Submit Abstract
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                {(conference.description || conference.shortDescription) && (
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed line-clamp-3">
                      {conference.shortDescription || conference.description}
                    </p>
                  </div>
                )}

                {/* Topics */}
                {conference.topics && conference.topics.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">🏷️ Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {conference.topics.slice(0, 6).map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                      {conference.topics.length > 6 && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                          +{conference.topics.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Highlights */}
                {conference.highlights && conference.highlights.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">✨ Highlights:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {conference.highlights.slice(0, 3).map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-blue-500">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Speakers */}
                {conference.keySpeakers && conference.keySpeakers.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">🎤 Key Speakers:</h4>
                    <div className="space-y-2">
                      {conference.keySpeakers.slice(0, 2).map((speaker, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-gray-900">{speaker.name}</span>
                          {speaker.title && (
                            <span className="text-gray-600"> - {speaker.title}</span>
                          )}
                          {speaker.organization && (
                            <span className="text-gray-500"> at {speaker.organization}</span>
                          )}
                        </div>
                      ))}
                      {conference.keySpeakers.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{conference.keySpeakers.length - 2} more speakers
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-100">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    View Conference Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
