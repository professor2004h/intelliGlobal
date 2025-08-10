import { defineField, defineType } from 'sanity'

const cancellationPolicy = defineType({
  name: 'cancellationPolicy',
  title: 'Cancellation Policy',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string', validation: Rule => Rule.required(), initialValue: 'Cancellation Policy' }),
    defineField({ name: 'subtitle', title: 'Page Subtitle', type: 'string' }),
    defineField({ name: 'introduction', title: 'Introduction', type: 'array', of: [{ type: 'block' }] }),

    defineField({
      name: 'nameChangePolicy',
      title: 'Name Change Policy',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string', initialValue: 'Name Changes' },
        { name: 'content', title: 'Policy Content', type: 'array', of: [{ type: 'block' }] },
        { name: 'deadline', title: 'Deadline (days before conference)', type: 'number' },
      ],
    }),

    defineField({
      name: 'refundPolicy',
      title: 'Refund Policy',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string', initialValue: 'Refund Policy' },
        { name: 'generalPolicy', title: 'General Refund Policy', type: 'array', of: [{ type: 'block' }] },
        {
          name: 'refundTiers',
          title: 'Refund Tiers',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              { name: 'daysBeforeConference', title: 'Days Before Conference', type: 'number' },
              { name: 'refundPercentage', title: 'Refund Percentage', type: 'number' },
              { name: 'description', title: 'Description', type: 'string' },
            ],
          }],
        },
        { name: 'additionalTerms', title: 'Additional Terms', type: 'array', of: [{ type: 'block' }] },
      ],
    }),

    defineField({
      name: 'naturalDisasterPolicy',
      title: 'Natural Disaster Policy',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string', initialValue: 'Natural Disasters' },
        { name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] },
        { name: 'organizerRights', title: 'Organizer Rights', type: 'array', of: [{ type: 'block' }] },
        { name: 'liabilityDisclaimer', title: 'Liability Disclaimer', type: 'array', of: [{ type: 'block' }] },
      ],
    }),

    defineField({
      name: 'postponementPolicy',
      title: 'Postponement Policy',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string', initialValue: 'Postponement' },
        { name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] },
        { name: 'creditValidityPeriod', title: 'Credit Validity Period (months)', type: 'number' },
      ],
    }),

    defineField({
      name: 'transferPolicy',
      title: 'Transfer Policy',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string', initialValue: 'Transfers' },
        { name: 'personTransfer', title: 'Person Transfer', type: 'array', of: [{ type: 'block' }] },
        { name: 'conferenceTransfer', title: 'Conference Transfer', type: 'array', of: [{ type: 'block' }] },
        { name: 'transferDeadline', title: 'Transfer Deadline (days before conference)', type: 'number' },
        { name: 'transferLimitations', title: 'Transfer Limitations', type: 'array', of: [{ type: 'block' }] },
      ],
    }),

    defineField({
      name: 'visaPolicy',
      title: 'Visa Policy',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string', initialValue: 'Visa Policy' },
        { name: 'generalAdvice', title: 'General Advice', type: 'array', of: [{ type: 'block' }] },
        { name: 'failedVisaPolicy', title: 'Failed Visa Applications', type: 'array', of: [{ type: 'block' }] },
      ],
    }),

    defineField({
      name: 'contactInformation',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'title', title: 'Section Title', type: 'string', initialValue: 'Contact Information' },
        { name: 'primaryEmail', title: 'Primary Email', type: 'string' },
        { name: 'phone', title: 'Phone', type: 'string' },
        { name: 'instructions', title: 'Instructions', type: 'array', of: [{ type: 'block' }] },
      ],
    }),

    defineField({
      name: 'importantNotes',
      title: 'Important Notes',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }] },
          { name: 'priority', title: 'Priority', type: 'string', options: { list: ['high', 'medium', 'low'] } },
        ],
      }],
    }),

    defineField({ name: 'isActive', title: 'Is Active', type: 'boolean', initialValue: true }),
    defineField({ name: 'effectiveDate', title: 'Effective Date', type: 'date' }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text' }),
  ],
})

export default cancellationPolicy

