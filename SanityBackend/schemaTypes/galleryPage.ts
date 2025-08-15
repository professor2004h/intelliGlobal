import { defineField, defineType } from 'sanity';

const galleryPage = defineType({
  name: 'galleryPage',
  title: 'Gallery Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroBackgroundImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'heroOverlayOpacity',
      title: 'Hero Overlay Opacity (%)',
      description: 'Black overlay transparency, 0 (transparent) - 100 (solid black)'
      ,type: 'number',
      initialValue: 50,
      validation: (Rule) => Rule.min(0).max(100).integer(),
      options: {
        list: [0,10,20,30,40,50,60,70,80,90,100].map(v => ({ title: `${v}%`, value: v }))
      }
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        defineField({
          name: 'galleryImageItem',
          title: 'Gallery Image Item',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.max(160),
            }),
            defineField({
              name: 'caption',
              title: 'Caption (optional)',
              type: 'string',
              validation: (Rule) => Rule.max(200),
            }),
            defineField({
              name: 'tags',
              title: 'Tags (optional)',
              type: 'array',
              of: [{ type: 'string' }],
              options: { layout: 'tags' }
            })
          ]
        })
      ],
      validation: (Rule) => Rule.min(0),
    })
  ],
  preview: {
    select: {
      title: 'heroTitle',
      media: 'heroBackgroundImage',
      count: 'galleryImages.length'
    },
    prepare(selection) {
      const { title, media, count } = selection as any;
      return {
        title: title || 'Gallery Page',
        subtitle: `${count || 0} image${(count || 0) === 1 ? '' : 's'}`,
        media
      };
    }
  }
});

export default galleryPage;

