// Comprehensive verification of both ports
console.log('🔍 COMPREHENSIVE PORT VERIFICATION');
console.log('='.repeat(50));

async function verifyPort(port) {
  console.log(`\n📋 TESTING PORT ${port}`);
  console.log('-'.repeat(30));
  
  try {
    // Test APIs
    console.log('🔗 Testing APIs...');
    const [conferencesResponse, tiersResponse] = await Promise.all([
      fetch(`http://localhost:${port}/api/conferences`),
      fetch(`http://localhost:${port}/api/sponsorship-tiers`)
    ]);
    
    const conferences = await conferencesResponse.json();
    const tiers = await tiersResponse.json();
    
    console.log(`✅ Conferences API Status: ${conferencesResponse.status}`);
    console.log(`📊 Conference Count: ${conferences.length}`);
    console.log(`🔍 Conference Titles: ${conferences.map(c => `"${c.title}"`).join(', ')}`);
    
    console.log(`✅ Tiers API Status: ${tiersResponse.status}`);
    console.log(`📊 Tier Count: ${tiers.length}`);
    console.log(`🔍 Tier Names: ${tiers.map(t => `"${t.name} - $${t.price}"`).join(', ')}`);
    
    // Test frontend page
    console.log('🌐 Testing Frontend Page...');
    const pageResponse = await fetch(`http://localhost:${port}/sponsorship/register`);
    console.log(`✅ Page Status: ${pageResponse.status}`);
    
    // Verify expected data
    const expectedConferences = ['hello', 'Research Publication ', 'Hi'];
    const expectedTiers = ['Gold'];
    
    const hasCorrectConferences = expectedConferences.every(title => 
      conferences.some(c => c.title.trim() === title.trim())
    );
    const hasCorrectTiers = expectedTiers.every(name => 
      tiers.some(t => t.name === name)
    );
    
    console.log(`🎯 Real Conference Data: ${hasCorrectConferences ? '✅ CORRECT' : '❌ INCORRECT'}`);
    console.log(`🎯 Real Tier Data: ${hasCorrectTiers ? '✅ CORRECT' : '❌ INCORRECT'}`);
    
    return {
      port,
      apisWorking: conferencesResponse.status === 200 && tiersResponse.status === 200,
      pageWorking: pageResponse.status === 200,
      hasRealData: hasCorrectConferences && hasCorrectTiers,
      conferences: conferences.map(c => c.title),
      tiers: tiers.map(t => `${t.name} - $${t.price}`)
    };
    
  } catch (error) {
    console.error(`❌ Error testing port ${port}:`, error.message);
    return {
      port,
      apisWorking: false,
      pageWorking: false,
      hasRealData: false,
      error: error.message
    };
  }
}

async function runVerification() {
  const results = await Promise.all([
    verifyPort(3000),
    verifyPort(3002)
  ]);
  
  console.log('\n🎉 FINAL VERIFICATION RESULTS');
  console.log('='.repeat(50));
  
  results.forEach(result => {
    console.log(`\n📍 PORT ${result.port}:`);
    console.log(`   APIs Working: ${result.apisWorking ? '✅' : '❌'}`);
    console.log(`   Page Working: ${result.pageWorking ? '✅' : '❌'}`);
    console.log(`   Real CMS Data: ${result.hasRealData ? '✅' : '❌'}`);
    
    if (result.conferences) {
      console.log(`   Conferences: ${result.conferences.join(', ')}`);
    }
    if (result.tiers) {
      console.log(`   Tiers: ${result.tiers.join(', ')}`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  const allWorking = results.every(r => r.apisWorking && r.pageWorking && r.hasRealData);
  
  console.log(`\n🏆 OVERALL STATUS: ${allWorking ? '✅ ALL PORTS WORKING WITH REAL CMS DATA' : '❌ ISSUES DETECTED'}`);
  
  if (allWorking) {
    console.log('🎊 SUCCESS: Both ports now display real Sanity CMS data instead of fallback placeholders!');
  }
}

runVerification();
