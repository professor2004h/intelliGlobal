import { defineField, defineType } from 'sanity';

const testimonialsSection = defineType({
  name: 'testimonialsSection',
  title: 'Testimonials Section',
  type: 'document',
  description: 'Controls the testimonials shown on the home page',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'For internal reference only',
      initialValue: 'Homepage Testimonials',
      validation: (Rule) => Rule.required(),
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
              title: 'Customer Image',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'customerName',
              title: 'Customer Name',
              type: 'string',
              validation: (Rule) => Rule.required().max(100),
            }),
            defineField({
              name: 'position',
              title: 'Position / Title',
              type: 'string',
            }),
            defineField({
              name: 'company',
              title: 'Company',
              type: 'string',
            }),
            defineField({
              name: 'review',
              title: 'Review',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required().max(500),
            }),
            defineField({
              name: 'rating',
              title: 'Rating (1-5)',
              type: 'number',
              validation: (Rule) => Rule.required().min(1).max(5),
            }),
          ],
          preview: {
            select: {
              title: 'customerName',
              subtitle: 'company',
              media: 'customerImage',
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Testimonials Section' };
    },
  },
});

export default testimonialsSection;

