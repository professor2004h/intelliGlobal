import { defineField, defineType } from 'sanity'
import { MapPinIcon } from '@sanity/icons'

export default defineType({
  name: 'conferenceLocation',
  title: 'Conference Location',
  type: 'document',
  icon: MapPinIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Location Name',
      type: 'string',
      description: 'Name of the city or location (e.g., "London, UK" or "New York, USA")',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'address',
      title: 'Full Address',
      type: 'text',
      description: 'Complete address for display on the map popup',
      rows: 3,
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      description: 'Latitude coordinate in decimal degrees (e.g., 51.5074)',
      validation: (Rule) => 
        Rule.required()
          .min(-90)
          .max(90)
          .precision(6)
          .error('Latitude must be between -90 and 90 degrees'),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      description: 'Longitude coordinate in decimal degrees (e.g., -0.1278)',
      validation: (Rule) => 
        Rule.required()
          .min(-180)
          .max(180)
          .precision(6)
          .error('Longitude must be between -180 and 180 degrees'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Additional details about this location (optional)',
      rows: 4,
    }),
    defineField({
      name: 'isActive',
      title: 'Show on Map',
      type: 'boolean',
      description: 'Toggle to show/hide this location on the map',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which locations appear (lower numbers first)',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'address',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, subtitle, isActive } = selection
      return {
        title: title,
        subtitle: `${subtitle || 'No address'} ${isActive ? '✅' : '❌'}`,
        media: MapPinIcon,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Location Name',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
