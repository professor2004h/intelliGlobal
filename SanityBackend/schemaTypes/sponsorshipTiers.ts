import { defineField, defineType } from 'sanity';

const sponsorshipTiers = defineType({
  name: 'sponsorshipTiers',
  title: 'Sponsorship Tiers',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tier Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(50),
      description: 'Name of the sponsorship tier (e.g., Platinum Sponsor, Gold Sponsor)',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description: 'URL-friendly version of the tier name',
    }),
    defineField({
      name: 'pricing',
      title: 'Multi-Currency Pricing',
      type: 'object',
      description: 'Set prices for this sponsorship tier in different currencies',
      fields: [
        defineField({
          name: 'usd',
          title: 'Price (USD)',
          type: 'number',
          validation: (Rule) => Rule.required().min(0),
          description: 'Price in US Dollars',
        }),
        defineField({
          name: 'eur',
          title: 'Price (EUR)',
          type: 'number',
          validation: (Rule) => Rule.required().min(0),
          description: 'Price in Euros',
        }),
        defineField({
          name: 'gbp',
          title: 'Price (GBP)',
          type: 'number',
          validation: (Rule) => Rule.required().min(0),
          description: 'Price in British Pounds',
        }),
        defineField({
          name: 'inr',
          title: 'Price (INR)',
          type: 'number',
          validation: (Rule) => Rule.required().min(0),
          description: 'Price in Indian Rupees',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
      description: 'Order in which this tier should be displayed (1 = first)',
      initialValue: 1,
    }),
    defineField({
      name: 'featured',
      title: 'Featured Tier',
      type: 'boolean',
      description: 'Mark this tier as featured/recommended',
      initialValue: false,
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200),
      description: 'Brief description of this sponsorship tier',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'benefit',
              title: 'Benefit',
              type: 'string',
              validation: (Rule) => Rule.required().max(150),
            },
            {
              name: 'highlighted',
              title: 'Highlighted Benefit',
              type: 'boolean',
              description: 'Mark this benefit as highlighted/special',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'benefit',
              highlighted: 'highlighted',
            },
            prepare(selection) {
              const { title, highlighted } = selection;
              return {
                title: highlighted ? `⭐ ${title}` : title,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
      description: 'List of benefits included in this sponsorship tier',
    }),
    defineField({
      name: 'color',
      title: 'Theme Color',
      type: 'color',
      description: 'Color theme for this tier (used for styling)',
      options: {
        disableAlpha: true,
      },
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this tier is currently available for selection',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Price (High to Low)',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'Price (Low to High)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      pricing: 'pricing',
      order: 'order',
      featured: 'featured',
      active: 'active',
    },
    prepare(selection) {
      const { title, pricing, order, featured, active } = selection;
      const status = !active ? '🚫' : featured ? '⭐' : '';
      const priceDisplay = pricing?.usd ? `$${pricing.usd} USD` : 'No price set';
      return {
        title: `${status} ${title}`,
        subtitle: `${priceDisplay} - Order: ${order}`,
      };
    },
  },
});

export default sponsorshipTiers;
