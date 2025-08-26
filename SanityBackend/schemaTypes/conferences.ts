import { defineField, defineType } from 'sanity';

const conferences = defineType({
  name: 'conferences',
  title: 'Conferences Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Hero Section Background Image',
      type: 'image',
      description: 'Upload a background image for the conferences page hero section. If no image is provided, the default gradient background will be used.',
      options: {
        hotspot: true,
        accept: '.png,.jpg,.jpeg,.webp',
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe the background image for accessibility',
          validation: (Rule) => Rule.max(100),
        }
      ],
    }),
  ],
});

export default conferences;
