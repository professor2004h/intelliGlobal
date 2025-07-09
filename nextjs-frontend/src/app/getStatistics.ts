// lib/getStatistics.ts

import { client } from './sanity/client';

export interface StatisticItem {
  value: string;
  label: string;
  order?: number;
}

export interface StatisticsData {
  _id: string;
  title: string;
  statistics: {
    conferencesCompleted: string;
    registrations: string;
    expertSpeakers: string;
    yearsExperience: string;
  };
  layout: {
    mobileColumns: number;
    tabletColumns: number;
    desktopColumns: number;
  };
  visibility: {
    showOnHomepage: boolean;
    showOnAboutPage: boolean;
  };
}

export async function getStatisticsContent(): Promise<StatisticsData | null> {
  try {
    const query = `*[_type == "statistics" && visibility.showOnHomepage == true][0]{
      _id,
      title,
      statistics,
      layout,
      visibility
    }`;

    const statistics = await client.fetch(query, {}, {
      next: { revalidate: 5 } // 5-second revalidation for real-time updates
    });

    return statistics;
  } catch (error) {
    console.error('Error fetching statistics content:', error);
    return null;
  }
}

export async function getAboutPageStatistics(): Promise<StatisticsData | null> {
  try {
    const query = `*[_type == "statistics" && visibility.showOnAboutPage == true][0]{
      _id,
      title,
      statistics,
      layout,
      visibility
    }`;

    const statistics = await client.fetch(query, {}, {
      next: { revalidate: 5 } // 5-second revalidation for real-time updates
    });

    return statistics;
  } catch (error) {
    console.error('Error fetching about page statistics content:', error);
    return null;
  }
}

// Helper function to get default statistics if no CMS data is available
export function getDefaultStatistics(): StatisticsData {
  return {
    _id: 'default',
    title: 'Our Impact',
    statistics: {
      conferencesCompleted: '500+',
      registrations: '10K+',
      expertSpeakers: '1K+',
      yearsExperience: '15+',
    },
    layout: {
      mobileColumns: 2,
      tabletColumns: 2,
      desktopColumns: 4,
    },
    visibility: {
      showOnHomepage: true,
      showOnAboutPage: false,
    },
  };
}
