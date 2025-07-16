// schemaTypes/mapLocation.ts
import {defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons'

export default defineType({
  name: 'mapLocation',
  title: 'Map Locations',
  type: 'document',
  icon: PinIcon,
  description: 'Manage locations that will appear on the Google Maps on your homepage',
  fields: [
    defineField({
      name: 'title',
      title: 'Location Name',
      type: 'string',
      description: 'Name of the location (e.g., "London Office", "New York Conference Center")',
      validation: Rule => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'category',
      title: 'Location Category',
      type: 'string',
      description: 'Type of location for better organization and display',
      options: {
        list: [
          {title: 'Office', value: 'office'},
          {title: 'Conference Center', value: 'conference'},
          {title: 'Event Venue', value: 'venue'},
          {title: 'Partner Location', value: 'partner'},
          {title: 'Hotel', value: 'hotel'},
          {title: 'Restaurant', value: 'restaurant'},
          {title: 'Other', value: 'other'}
        ]
      },
      initialValue: 'office',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'address',
      title: 'Full Address',
      type: 'text',
      description: 'Complete address for Google Maps geocoding and display (e.g., "123 Main St, New York, NY 10001, USA")',
      rows: 3,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      description: 'Latitude coordinate in decimal degrees (e.g., 18.967664)',
      placeholder: '18.967664',
      validation: Rule =>
        Rule.required()
          .min(-90)
          .max(90)
          .precision(6)
          .error('Latitude is required and must be between -90 and 90 degrees'),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      description: 'Longitude coordinate in decimal degrees (e.g., 72.805832)',
      placeholder: '72.805832',
      validation: Rule =>
        Rule.required()
          .min(-180)
          .max(180)
          .precision(6)
          .error('Longitude is required and must be between -180 and 180 degrees'),
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
      description: 'Toggle to show/hide this location on the homepage map',
      initialValue: true,
    }),
    defineField({
      name: 'priority',
      title: 'Display Priority',
      type: 'number',
      description: 'Higher numbers appear first (0-100, default: 50)',
      initialValue: 50,
      validation: Rule => Rule.min(0).max(100),
    }),
    defineField({
      name: 'markerColor',
      title: 'Marker Color',
      type: 'string',
      description: 'Color of the marker on the map',
      options: {
        list: [
          {title: 'Orange (Default)', value: 'orange'},
          {title: 'Blue', value: 'blue'},
          {title: 'Red', value: 'red'},
          {title: 'Green', value: 'green'},
          {title: 'Purple', value: 'purple'},
          {title: 'Yellow', value: 'yellow'},
        ]
      },
      initialValue: 'orange',
    })
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      address: 'address',
      isActive: 'isActive',
      priority: 'priority'
    },
    prepare({title, category, address, isActive, priority}) {
      const status = isActive ? '🟢' : '🔴';
      const categoryIcon = category === 'office' ? '🏢' :
                          category === 'conference' ? '🏛️' :
                          category === 'venue' ? '🎪' :
                          category === 'partner' ? '🤝' :
                          category === 'hotel' ? '🏨' :
                          category === 'restaurant' ? '🍽️' : '📍';

      return {
        title: `${status} ${categoryIcon} ${title}`,
        subtitle: `${address?.substring(0, 50)}${address?.length > 50 ? '...' : ''} | Priority: ${priority || 50}`,
      };
    },
  },
  orderings: [
    {
      title: 'Priority (High to Low)',
      name: 'priorityDesc',
      by: [
        {field: 'priority', direction: 'desc'},
        {field: 'title', direction: 'asc'}
      ]
    },
    {
      title: 'Name A-Z',
      name: 'nameAsc',
      by: [
        {field: 'title', direction: 'asc'}
      ]
    },
    {
      title: 'Category',
      name: 'category',
      by: [
        {field: 'category', direction: 'asc'},
        {field: 'title', direction: 'asc'}
      ]
    }
  ]
})
