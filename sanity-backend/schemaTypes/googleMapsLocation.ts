import { defineField, defineType } from 'sanity'
import { MapPinIcon } from '@sanity/icons'

export default defineType({
  name: 'googleMapsLocation',
  title: 'Conference Location (Google Maps)',
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
      description: 'Complete address for Google Maps geocoding and display',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'placeId',
      title: 'Google Places ID (Optional)',
      type: 'string',
      description: 'Google Places ID for more accurate location (e.g., ChIJdd4hrwug2EcRmSrV3Vo6llI)',
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude (Optional)',
      type: 'number',
      description: 'Latitude coordinate - will be auto-generated from address if not provided',
      validation: (Rule) => 
        Rule.min(-90)
          .max(90)
          .precision(6)
          .error('Latitude must be between -90 and 90 degrees'),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude (Optional)',
      type: 'number',
      description: 'Longitude coordinate - will be auto-generated from address if not provided',
      validation: (Rule) => 
        Rule.min(-180)
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
    defineField({
      name: 'markerColor',
      title: 'Marker Color',
      type: 'string',
      description: 'Custom marker color (hex code)',
      options: {
        list: [
          { title: 'Orange (Default)', value: '#f97316' },
          { title: 'Red', value: '#ef4444' },
          { title: 'Blue', value: '#3b82f6' },
          { title: 'Green', value: '#10b981' },
          { title: 'Purple', value: '#8b5cf6' },
          { title: 'Custom', value: '' },
        ],
      },
      initialValue: '#f97316',
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
