/**
 * Migration script to update existing sponsorship tiers with multi-currency pricing
 * This script converts the old single 'price' field to the new 'pricing' object with multiple currencies
 */

const { createClient } = require('@sanity/client');

// Sanity client configuration
const client = createClient({
  projectId: 'your-project-id', // Replace with your actual project ID
  dataset: 'production', // or your dataset name
  useCdn: false,
  token: 'your-write-token', // Replace with your write token
  apiVersion: '2023-05-03',
});

// Exchange rates (approximate - you may want to use real-time rates)
const EXCHANGE_RATES = {
  USD_TO_EUR: 0.85,
  USD_TO_GBP: 0.73,
  USD_TO_INR: 83.0,
};

async function migrateSponsorshipTiers() {
  try {
    console.log('🚀 Starting sponsorship tiers migration...');

    // Fetch all sponsorship tiers with the old price field
    const query = `*[_type == "sponsorshipTiers" && defined(price)] {
      _id,
      _rev,
      name,
      price,
      pricing
    }`;

    const tiers = await client.fetch(query);
    console.log(`📊 Found ${tiers.length} sponsorship tiers to migrate`);

    if (tiers.length === 0) {
      console.log('✅ No tiers found with old price field. Migration may already be complete.');
      return;
    }

    // Process each tier
    for (const tier of tiers) {
      console.log(`\n🔄 Processing tier: ${tier.name}`);
      
      // Skip if already has pricing object
      if (tier.pricing && tier.pricing.usd) {
        console.log(`⏭️  Tier "${tier.name}" already has multi-currency pricing. Skipping.`);
        continue;
      }

      const usdPrice = tier.price;
      
      // Calculate prices in other currencies
      const pricing = {
        usd: usdPrice,
        eur: Math.round(usdPrice * EXCHANGE_RATES.USD_TO_EUR),
        gbp: Math.round(usdPrice * EXCHANGE_RATES.USD_TO_GBP),
        inr: Math.round(usdPrice * EXCHANGE_RATES.USD_TO_INR),
      };

      console.log(`💰 Converting $${usdPrice} USD to:`, pricing);

      // Update the tier with new pricing structure
      try {
        await client
          .patch(tier._id)
          .set({ pricing })
          .unset(['price']) // Remove the old price field
          .commit();

        console.log(`✅ Successfully updated tier: ${tier.name}`);
      } catch (error) {
        console.error(`❌ Error updating tier ${tier.name}:`, error);
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Verify the changes in your Sanity Studio');
    console.log('2. Test the frontend currency switching functionality');
    console.log('3. Update any remaining references to the old price field');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Sample data for testing (if no existing tiers)
async function createSampleTiers() {
  console.log('🔧 Creating sample sponsorship tiers with multi-currency pricing...');

  const sampleTiers = [
    {
      _type: 'sponsorshipTiers',
      name: 'Platinum Sponsor',
      slug: { _type: 'slug', current: 'platinum-sponsor' },
      pricing: {
        usd: 25000,
        eur: 21250,
        gbp: 18250,
        inr: 2075000,
      },
      order: 1,
      featured: true,
      active: true,
      description: 'Premium sponsorship package with maximum visibility and exclusive benefits.',
      benefits: [
        { benefit: 'Prime exhibition booth (20x20 ft)', highlighted: true },
        { benefit: '45-minute keynote speaking slot', highlighted: true },
        { benefit: 'Logo on all marketing materials', highlighted: false },
        { benefit: 'Full-page advertisement in program', highlighted: false },
        { benefit: '10 complimentary registrations', highlighted: false },
      ],
    },
    {
      _type: 'sponsorshipTiers',
      name: 'Gold Sponsor',
      slug: { _type: 'slug', current: 'gold-sponsor' },
      pricing: {
        usd: 15000,
        eur: 12750,
        gbp: 10950,
        inr: 1245000,
      },
      order: 2,
      featured: false,
      active: true,
      description: 'Excellent visibility package with premium benefits.',
      benefits: [
        { benefit: 'Exhibition booth (15x15 ft)', highlighted: true },
        { benefit: '30-minute presentation slot', highlighted: true },
        { benefit: 'Logo on website and materials', highlighted: false },
        { benefit: 'Half-page advertisement', highlighted: false },
        { benefit: '6 complimentary registrations', highlighted: false },
      ],
    },
    {
      _type: 'sponsorshipTiers',
      name: 'Silver Sponsor',
      slug: { _type: 'slug', current: 'silver-sponsor' },
      pricing: {
        usd: 8000,
        eur: 6800,
        gbp: 5840,
        inr: 664000,
      },
      order: 3,
      featured: false,
      active: true,
      description: 'Great value sponsorship with solid benefits.',
      benefits: [
        { benefit: 'Exhibition booth (10x10 ft)', highlighted: true },
        { benefit: 'Logo on website', highlighted: false },
        { benefit: 'Quarter-page advertisement', highlighted: false },
        { benefit: '4 complimentary registrations', highlighted: false },
      ],
    },
  ];

  for (const tier of sampleTiers) {
    try {
      await client.create(tier);
      console.log(`✅ Created sample tier: ${tier.name}`);
    } catch (error) {
      console.error(`❌ Error creating tier ${tier.name}:`, error);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--create-samples')) {
    await createSampleTiers();
  } else {
    await migrateSponsorshipTiers();
  }
}

// Run the migration
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { migrateSponsorshipTiers, createSampleTiers };
