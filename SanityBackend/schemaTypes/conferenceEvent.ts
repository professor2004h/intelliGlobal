import { defineField, defineType } from 'sanity'

export const conferenceEvent = defineType({
  name: 'conferenceEvent',
  title: 'Conference Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Event Poster',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email (Optional)',
      type: 'string',
      validation: (Rule) =>
        Rule.email().error('Must be a valid email address'),
    }),
    defineField({
      name: 'registerNowUrl',
      title: 'Register Now Button URL',
      type: 'url',
      description: 'URL for the "Register Now" button - accepts any valid URL format',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }).error('Must be a valid URL (http:// or https://)'),
    }),
    defineField({
      name: 'submitAbstractUrl',
      title: 'Submit Abstract Button URL',
      type: 'url',
      description: 'URL for the "Submit Abstract" button - accepts any valid URL format',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }).error('Must be a valid URL (http:// or https://)'),
    }),
  ],
})
