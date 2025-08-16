import { defineField, defineType } from 'sanity';

const testimonialsSection = defineType({
  name: 'testimonialsSection',
  title: 'Testimonials Section',
  type: 'document',
  fields: [
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'What Our Attendees Say',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'sectionSubtitle',
      title: 'Section Subtitle',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'isActive',
      title: 'Show Testimonials Section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        defineField({
          name: 'testimonial',
          title: 'Testimonial',
          type: 'object',
          fields: [
            defineField({
              name: 'customerImage',
              title: 'Customer Photo',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'customerName',
              title: 'Customer Name',
              type: 'string',
              validation: (Rule) => Rule.required().max(100),
            }),
            defineField({
              name: 'review',
              title: 'Review Text',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required().min(10).max(500),
            }),
            defineField({
              name: 'rating',
              title: 'Star Rating',
              type: 'number',
              validation: (Rule) => Rule.required().min(1).max(5).integer(),
              options: {
                list: [
                  { title: '⭐ 1 Star', value: 1 },
                  { title: '⭐⭐ 2 Stars', value: 2 },
                  { title: '⭐⭐⭐ 3 Stars', value: 3 },
                  { title: '⭐⭐⭐⭐ 4 Stars', value: 4 },
                  { title: '⭐⭐⭐⭐⭐ 5 Stars', value: 5 },
                ],
              },
            }),
            defineField({
              name: 'position',
              title: 'Job Title/Position',
              type: 'string',
              validation: (Rule) => Rule.max(100),
            }),
            defineField({
              name: 'company',
              title: 'Company Name',
              type: 'string',
              validation: (Rule) => Rule.max(100),
            }),
          ],
          preview: {
            select: {
              title: 'customerName',
              subtitle: 'company',
              media: 'customerImage',
              rating: 'rating',
            },
            prepare(selection) {
              const { title, subtitle, media, rating } = selection as any;
              const stars = '⭐'.repeat(rating || 0);
              return {
                title: title || 'Unnamed Customer',
                subtitle: `${stars} ${subtitle ? `- ${subtitle}` : ''}`,
                media,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1).max(20),
    }),
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      count: 'testimonials.length',
    },
    prepare(selection) {
      const { title, count } = selection as any;
      return {
        title: title || 'Testimonials Section',
        subtitle: `${count || 0} testimonial${(count || 0) === 1 ? '' : 's'}`,
      };
    },
  },
});

export default testimonialsSection;
