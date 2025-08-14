import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'shippingPolicy',
  title: 'Shipping Policy',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      description: 'Main title for the shipping policy page',
      validation: (Rule) => Rule.required().min(10).max(100),
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'string',
      description: 'Subtitle or brief description for the shipping policy page',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      description: 'Brief introduction to the shipping policy',
      rows: 4,
    }),
    defineField({
      name: 'shippingMethods',
      title: 'Shipping Methods',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Available Shipping Methods',
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'method',
                  title: 'Shipping Method',
                  type: 'string',
                  description: 'e.g., Standard Shipping, Express Shipping, etc.',
                }),
                defineField({
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 3,
                }),
                defineField({
                  name: 'deliveryTime',
                  title: 'Delivery Time',
                  type: 'string',
                  description: 'e.g., 3-5 business days',
                }),
                defineField({
                  name: 'cost',
                  title: 'Cost',
                  type: 'string',
                  description: 'Shipping cost information',
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'processingTime',
      title: 'Processing Time',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Order Processing Time',
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 4,
          description: 'Information about order processing times',
        }),
      ],
    }),
    defineField({
      name: 'shippingRestrictions',
      title: 'Shipping Restrictions',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Shipping Restrictions',
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 4,
          description: 'Information about shipping restrictions and limitations',
        }),
      ],
    }),
    defineField({
      name: 'internationalShipping',
      title: 'International Shipping',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'International Shipping',
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 4,
          description: 'Information about international shipping policies',
        }),
      ],
    }),
    defineField({
      name: 'trackingInformation',
      title: 'Tracking Information',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Order Tracking',
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 4,
          description: 'Information about order tracking and delivery updates',
        }),
      ],
    }),
    defineField({
      name: 'damagedOrLostPackages',
      title: 'Damaged or Lost Packages',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Damaged or Lost Packages',
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 4,
          description: 'Policy for handling damaged or lost packages',
        }),
      ],
    }),
    defineField({
      name: 'contactInformation',
      title: 'Contact Information',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Contact Us',
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 3,
          description: 'Contact information for shipping-related inquiries',
        }),
      ],
    }),
    defineField({
      name: 'importantNotes',
      title: 'Important Notes',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
      description: 'Additional important notes about shipping policy',
    }),
    defineField({
      name: 'effectiveDate',
      title: 'Effective Date',
      type: 'date',
      description: 'Date when this shipping policy becomes effective',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      description: 'Date and time when this policy was last updated',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isActive',
      title: 'Is Active',
      type: 'boolean',
      description: 'Toggle to activate/deactivate this shipping policy',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'pageTitle',
      effectiveDate: 'effectiveDate',
      isActive: 'isActive',
    },
    prepare(selection) {
      const {title, effectiveDate, isActive} = selection
      return {
        title: title || 'Shipping Policy',
        subtitle: `${isActive ? '✅ Active' : '❌ Inactive'} | Effective: ${effectiveDate || 'Not set'}`,
      }
    },
  },
})
