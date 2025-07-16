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
      name: 'coordinateFormat',
      title: 'Coordinate Input Format',
      type: 'string',
      description: 'Choose how you want to input coordinates',
      options: {
        list: [
          {title: 'Decimal Degrees (e.g., 18.967664, 72.805832)', value: 'decimal'},
          {title: 'Degrees Minutes Seconds (e.g., 18° 58\' 3.59" N)', value: 'dms'}
        ]
      },
      initialValue: 'dms',
    }),
    defineField({
      name: 'latitudeDMS',
      title: 'Latitude (DMS Format)',
      type: 'string',
      description: 'Enter latitude in Degrees Minutes Seconds format (e.g., 18° 58\' 3.59" N)',
      placeholder: '18° 58\' 3.59" N',
      hidden: ({document}) => document?.coordinateFormat !== 'dms',
      validation: Rule => Rule.custom((value, context) => {
        if (context.document?.coordinateFormat === 'dms' && value) {
          // Validate DMS format: DD° MM' SS.SS" [N|S]
          const dmsPattern = /^(\d{1,3})°\s*(\d{1,2})'\s*(\d{1,2}(?:\.\d+)?)"?\s*([NS])$/i;
          if (!dmsPattern.test(value)) {
            return 'Please use format: 18° 58\' 3.59" N (degrees° minutes\' seconds" N/S)';
          }

          const match = value.match(dmsPattern);
          if (match) {
            const degrees = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            const seconds = parseFloat(match[3]);

            if (degrees > 90) return 'Degrees cannot exceed 90';
            if (minutes >= 60) return 'Minutes must be less than 60';
            if (seconds >= 60) return 'Seconds must be less than 60';
          }
        }
        return true;
      }),
    }),
    defineField({
      name: 'longitudeDMS',
      title: 'Longitude (DMS Format)',
      type: 'string',
      description: 'Enter longitude in Degrees Minutes Seconds format (e.g., 72° 48\' 20.99" E)',
      placeholder: '72° 48\' 20.99" E',
      hidden: ({document}) => document?.coordinateFormat !== 'dms',
      validation: Rule => Rule.custom((value, context) => {
        if (context.document?.coordinateFormat === 'dms' && value) {
          // Validate DMS format: DDD° MM' SS.SS" [E|W]
          const dmsPattern = /^(\d{1,3})°\s*(\d{1,2})'\s*(\d{1,2}(?:\.\d+)?)"?\s*([EW])$/i;
          if (!dmsPattern.test(value)) {
            return 'Please use format: 72° 48\' 20.99" E (degrees° minutes\' seconds" E/W)';
          }

          const match = value.match(dmsPattern);
          if (match) {
            const degrees = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            const seconds = parseFloat(match[3]);

            if (degrees > 180) return 'Degrees cannot exceed 180';
            if (minutes >= 60) return 'Minutes must be less than 60';
            if (seconds >= 60) return 'Seconds must be less than 60';
          }
        }
        return true;
      }),
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude (Decimal Degrees)',
      type: 'number',
      description: 'Latitude coordinate in decimal format (e.g., 18.967664)',
      placeholder: '18.967664',
      hidden: ({document}) => document?.coordinateFormat !== 'decimal',
      validation: Rule =>
        Rule.min(-90)
          .max(90)
          .precision(6)
          .error('Latitude must be between -90 and 90 degrees'),
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude (Decimal Degrees)',
      type: 'number',
      description: 'Longitude coordinate in decimal format (e.g., 72.805832)',
      placeholder: '72.805832',
      hidden: ({document}) => document?.coordinateFormat !== 'decimal',
      validation: Rule =>
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
