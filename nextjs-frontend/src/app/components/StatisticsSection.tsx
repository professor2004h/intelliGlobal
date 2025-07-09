'use client';

import React, { useEffect, useRef, useState } from 'react';
import { StatisticsData } from '../getStatistics';

interface StatisticsSectionProps {
  data: StatisticsData;
  className?: string;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ data, className = '' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getGridCols = () => {
    const { mobileColumns, tabletColumns, desktopColumns } = data.layout;

    // Use explicit class names for better Tailwind compatibility
    let mobileClass = 'grid-cols-1';
    let tabletClass = 'md:grid-cols-2';
    let desktopClass = 'lg:grid-cols-4';

    if (mobileColumns === 2) mobileClass = 'grid-cols-2';
    if (tabletColumns === 4) tabletClass = 'md:grid-cols-4';
    if (desktopColumns === 2) desktopClass = 'lg:grid-cols-2';
    if (desktopColumns === 3) desktopClass = 'lg:grid-cols-3';

    return `${mobileClass} ${tabletClass} ${desktopClass}`;
  };

  return (
    <section
      ref={sectionRef}
      className={`statistics-section relative overflow-hidden rounded-2xl p-4 sm:p-6 md:p-8 lg:p-8 text-white w-full lg:w-full xl:w-full mx-0 lg:mx-8 xl:mx-12 ${className}`}
    >
      {/* Fixed Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-800" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500 rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500 rounded-full translate-x-12 translate-y-12"></div>
      </div>

      <div className="relative z-10">
        {/* Title */}
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2">{data.title}</h3>
        </div>

        {/* Statistics Grid */}
        <div className={`grid ${getGridCols()} gap-2 sm:gap-3 lg:gap-4`}>
          {[
            { value: data.statistics.conferencesCompleted, label: 'Conferences Completed' },
            { value: data.statistics.registrations, label: 'Registrations' },
            { value: data.statistics.expertSpeakers, label: 'Expert Speakers' },
            { value: data.statistics.yearsExperience, label: 'Years Experience' },
          ].map((stat, index) => (
            <div
              key={`${stat.label}-${index}`}
              className={`text-center p-3 sm:p-4 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm stats-item min-h-[100px] sm:min-h-[110px] md:min-h-[120px] flex flex-col justify-center ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{
                animationDelay: `${index * 200}ms`
              }}
            >
              {/* Value */}
              <div className="text-lg sm:text-xl md:text-xl font-bold mb-1 sm:mb-2 md:mb-2 text-orange-400 leading-none">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-blue-100 text-xs sm:text-xs md:text-sm leading-tight break-words hyphens-auto">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
