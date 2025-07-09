import { defineField, defineType } from 'sanity';

export const pastConference = defineType({
  name: 'pastConference',
  title: 'Past Conference',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Conference Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
      description: 'The title of the past conference event',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly version of the title',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Conference',
      type: 'boolean',
      description: 'Mark this conference as featured to display on the home page',
      initialValue: false,
    }),
    defineField({
      name: 'date',
      title: 'Conference Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      description: 'When the conference took place',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date (Optional)',
      type: 'datetime',
      description: 'End date for multi-day conferences',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
      description: 'Where the conference was held',
    }),
    defineField({
      name: 'description',
      title: 'Conference Description',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
      description: 'Detailed description of the conference content and objectives',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(300),
      description: 'Brief summary for preview cards (max 300 characters)',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Conference Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      description: 'Primary image representing the conference',
    }),
    defineField({
      name: 'gallery',
      title: 'Conference Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for the image',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(20),
      description: 'Additional images from the conference (max 20 images)',
    }),
    defineField({
      name: 'attendeeCount',
      title: 'Number of Attendees',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(100000),
      description: 'Total number of people who attended the conference',
    }),
    defineField({
      name: 'keySpeakers',
      title: 'Key Speakers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Speaker Name',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Professional Title',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'organization',
              title: 'Organization',
              type: 'string',
            },
            {
              name: 'bio',
              title: 'Short Bio',
              type: 'text',
              rows: 3,
            },
            {
              name: 'photo',
              title: 'Speaker Photo',
              type: 'image',
              options: { hotspot: true },
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'title',
              media: 'photo',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(20),
      description: 'Notable speakers who presented at the conference',
    }),
    defineField({
      name: 'highlights',
      title: 'Conference Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(10),
      description: 'Key achievements, outcomes, or memorable moments (max 10 items)',
    }),
    defineField({
      name: 'topics',
      title: 'Main Topics Covered',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.max(15),
      description: 'Primary subjects and themes discussed (max 15 topics)',
    }),
    defineField({
      name: 'outcomes',
      title: 'Conference Outcomes',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Results, conclusions, or follow-up actions from the conference',
    }),
    defineField({
      name: 'testimonials',
      title: 'Attendee Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'quote',
              title: 'Testimonial Quote',
              type: 'text',
              validation: (Rule: any) => Rule.required().max(500),
            },
            {
              name: 'author',
              title: 'Author Name',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'authorTitle',
              title: 'Author Title/Organization',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'author',
              subtitle: 'authorTitle',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(10),
      description: 'Feedback and testimonials from conference attendees',
    }),
    // SEO Fields
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule: any) => Rule.max(60),
          description: 'SEO title for search engines (max 60 characters)',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule: any) => Rule.max(160),
          description: 'SEO description for search engines (max 160 characters)',
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          validation: (Rule: any) => Rule.max(10),
          description: 'SEO keywords (max 10)',
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      location: 'location',
      featured: 'featured',
      media: 'mainImage',
    },
    prepare({ title, date, location, featured, media }: any) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date';
      const featuredText = featured ? ' ⭐' : '';
      
      return {
        title: `${title}${featuredText}`,
        subtitle: `${formattedDate} • ${location}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Date (Newest First)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Date (Oldest First)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'date', direction: 'desc' },
      ],
    },
  ],
});

export default pastConference;
