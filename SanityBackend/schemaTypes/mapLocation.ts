// schemaTypes/mapLocation.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'mapLocation',
  title: 'Map Location',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Location Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Conference Venue', value: 'venue'},
          {title: 'Hotel', value: 'hotel'},
          {title: 'Restaurant', value: 'restaurant'},
          {title: 'Other', value: 'other'}
        ]
      }
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true
    })
  ]
})
