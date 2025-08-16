/**
 * Quick script to update the existing Gold tier with multi-currency pricing
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

async function updateGoldTier() {
  try {
    console.log('🔍 Finding Gold tier...');

    // Find the Gold tier
    const query = `*[_type == "sponsorshipTiers" && name == "Gold"][0] {
      _id,
      _rev,
      name,
      price,
      pricing
    }`;

    const goldTier = await client.fetch(query);

    if (!goldTier) {
      console.log('❌ Gold tier not found');
      return;
    }

    console.log('✅ Found Gold tier:', goldTier);

    // Check if it already has multi-currency pricing
    if (goldTier.pricing && goldTier.pricing.usd) {
      console.log('✅ Gold tier already has multi-currency pricing');
      return;
    }

    // Use existing price or default to 15000
    const usdPrice = goldTier.price || 15000;

    // Calculate prices in other currencies
    const pricing = {
      usd: usdPrice,
      eur: Math.round(usdPrice * 0.85), // 15000 * 0.85 = 12750
      gbp: Math.round(usdPrice * 0.73), // 15000 * 0.73 = 10950
      inr: Math.round(usdPrice * 83),   // 15000 * 83 = 1245000
    };

    console.log('💰 Setting multi-currency pricing:', pricing);

    // Update the tier
    await client
      .patch(goldTier._id)
      .set({ pricing })
      .commit();

    console.log('✅ Successfully updated Gold tier with multi-currency pricing!');
    console.log('🎉 You can now test the currency selector on the sponsorship page');

  } catch (error) {
    console.error('❌ Error updating Gold tier:', error);
  }
}

// Run the update
updateGoldTier();