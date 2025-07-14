import { defineField, defineType } from 'sanity'
import { MapPinIcon } from '@sanity/icons'

export default defineType({
  name: 'mapLocation',
  title: 'Map Location',
  type: 'document',
  icon: MapPinIcon,
  description: 'Standalone map locations - independent from conference events',
  fields: [
    defineField({
      name: 'title',
      title: 'Location Name',
      type: 'string',
      description: 'Name of the location (e.g., "London Office", "New York Headquarters", "Conference Center")',
      validation: (Rule: any) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'category',
      title: 'Location Category',
      type: 'string',
      description: 'Type of location for better organization',
      options: {
        list: [
          { title: 'Office', value: 'office' },
          { title: 'Conference Center', value: 'conference' },
          { title: 'Event Venue', value: 'venue' },
          { title: 'Partner Location', value: 'partner' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'office',
    }),
    defineField({
      name: 'address',
      title: 'Full Address',
      type: 'text',
      description: 'Complete address for Google Maps geocoding and display',
      rows: 3,
      validation: (Rule: any) => Rule.required(),
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
      validation: (Rule: any) =>
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
      validation: (Rule: any) =>
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
      name: 'markerColor',
      title: 'Marker Color',
      type: 'string',
      description: 'Custom color for the map marker',
      options: {
        list: [
          { title: 'Red (Default)', value: 'red' },
          { title: 'Blue', value: 'blue' },
          { title: 'Green', value: 'green' },
          { title: 'Yellow', value: 'yellow' },
          { title: 'Purple', value: 'purple' },
          { title: 'Orange', value: 'orange' },
        ],
      },
      initialValue: 'red',
    }),
    defineField({
      name: 'priority',
      title: 'Display Priority',
      type: 'number',
      description: 'Higher numbers appear first in lists (1-100)',
      validation: (Rule: any) => Rule.min(1).max(100),
      initialValue: 50,
    }),


  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'address',
      isActive: 'isActive',
    },
    prepare(selection: any) {
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
      title: 'Priority (High to Low)',
      name: 'priorityDesc',
      by: [{ field: 'priority', direction: 'desc' }],
    },
    {
      title: 'Location Name',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],
})
