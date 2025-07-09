// /schemas/statistics.ts

export default {
  name: 'statistics',
  title: 'Statistics Section',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Main title for the statistics section',
      validation: (Rule: any) => Rule.required(),
      initialValue: 'Our Impact',
    },
    {
      name: 'statistics',
      title: 'Statistics Values',
      type: 'object',
      description: 'Edit the values for each statistic (labels are fixed)',
      fields: [
        {
          name: 'conferencesCompleted',
          title: 'Conferences Completed',
          type: 'string',
          description: 'Enter the value (e.g., "500+", "1000+", etc.)',
          validation: (Rule: any) => Rule.required(),
          initialValue: '500+',
        },
        {
          name: 'registrations',
          title: 'Registrations',
          type: 'string',
          description: 'Enter the value (e.g., "10K+", "25K+", etc.)',
          validation: (Rule: any) => Rule.required(),
          initialValue: '10K+',
        },
        {
          name: 'expertSpeakers',
          title: 'Expert Speakers',
          type: 'string',
          description: 'Enter the value (e.g., "1K+", "2K+", etc.)',
          validation: (Rule: any) => Rule.required(),
          initialValue: '1K+',
        },
        {
          name: 'yearsExperience',
          title: 'Years Experience',
          type: 'string',
          description: 'Enter the value (e.g., "15+", "20+", etc.)',
          validation: (Rule: any) => Rule.required(),
          initialValue: '15+',
        },
      ],
      initialValue: {
        conferencesCompleted: '500+',
        registrations: '10K+',
        expertSpeakers: '1K+',
        yearsExperience: '15+',
      },
    },
    {
      name: 'layout',
      title: 'Layout Settings',
      type: 'object',
      fields: [
        {
          name: 'mobileColumns',
          title: 'Mobile Columns',
          type: 'number',
          description: 'Number of columns on mobile devices',
          options: {
            list: [
              { title: '1 Column', value: 1 },
              { title: '2 Columns', value: 2 },
            ],
          },
          initialValue: 2,
        },
        {
          name: 'tabletColumns',
          title: 'Tablet Columns',
          type: 'number',
          description: 'Number of columns on tablet devices',
          options: {
            list: [
              { title: '2 Columns', value: 2 },
              { title: '4 Columns', value: 4 },
            ],
          },
          initialValue: 2,
        },
        {
          name: 'desktopColumns',
          title: 'Desktop Columns',
          type: 'number',
          description: 'Number of columns on desktop devices',
          options: {
            list: [
              { title: '4 Columns', value: 4 },
            ],
          },
          initialValue: 4,
        },
      ],
      initialValue: {
        mobileColumns: 2,
        tabletColumns: 2,
        desktopColumns: 4,
      },
    },
    {
      name: 'visibility',
      title: 'Visibility Settings',
      type: 'object',
      fields: [
        {
          name: 'showOnHomepage',
          title: 'Show on Homepage',
          type: 'boolean',
          description: 'Display this statistics section on the homepage',
          initialValue: true,
        },
        {
          name: 'showOnAboutPage',
          title: 'Show on About Page',
          type: 'boolean',
          description: 'Display this statistics section on the about page',
          initialValue: false,
        },
      ],
      initialValue: {
        showOnHomepage: true,
        showOnAboutPage: false,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      statisticsCount: 'statistics',
    },
    prepare({ title, statisticsCount }: any) {
      const count = statisticsCount ? statisticsCount.length : 0;
      return {
        title: title || 'Statistics Section',
        subtitle: `${count} statistic${count !== 1 ? 's' : ''}`,
      };
    },
  },
  initialValue: {
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
  },
};
