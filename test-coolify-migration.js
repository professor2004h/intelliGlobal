// Test script for Coolify migration from Vercel
const COOLIFY_URL = 'http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io';

async function testCoolifyMigration() {
  console.log('🔄 COOLIFY MIGRATION TEST');
  console.log('========================\n');
  console.log(`🎯 Target URL: ${COOLIFY_URL}`);
  console.log(`🌐 IP Address: 31.97.203.190\n`);

  // Test 1: Basic connectivity
  console.log('1️⃣ Testing basic connectivity...');
  try {
    const response = await fetch(COOLIFY_URL);
    if (response.ok) {
      console.log('✅ Coolify server is accessible');
      console.log(`   Status: ${response.status} ${response.statusText}`);
    } else {
      console.log(`❌ Server responded with: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    console.log('   This is expected if deployment is not complete yet');
  }

  // Test 2: Health check endpoint
  console.log('\n2️⃣ Testing health check endpoint...');
  try {
    const healthResponse = await fetch(`${COOLIFY_URL}/api/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check passed');
      console.log('   Health data:', JSON.stringify(healthData, null, 2));
    } else {
      console.log(`❌ Health check failed: ${healthResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Health check error: ${error.message}`);
  }

  // Test 3: Environment variables check
  console.log('\n3️⃣ Testing environment variables...');
  try {
    const envResponse = await fetch(`${COOLIFY_URL}/api/debug-env`);
    if (envResponse.ok) {
      const envData = await envResponse.json();
      console.log('✅ Environment endpoint accessible');
      
      // Check critical variables
      const criticalVars = [
        'nodeEnv',
        'sanityProjectId', 
        'sanityDataset',
        'sanityApiVersion'
      ];
      
      criticalVars.forEach(varName => {
        const value = envData[varName];
        if (value && value !== 'not set') {
          console.log(`   ✅ ${varName}: ${value}`);
        } else {
          console.log(`   ❌ ${varName}: ${value || 'missing'}`);
        }
      });
    } else {
      console.log(`❌ Environment check failed: ${envResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Environment check error: ${error.message}`);
  }

  // Test 4: API endpoints
  console.log('\n4️⃣ Testing API endpoints...');
  const endpoints = [
    '/api/conferences',
    '/api/sponsorship-tiers',
    '/api/site-settings'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${COOLIFY_URL}${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ ${endpoint}: ${Array.isArray(data) ? data.length : 'OK'} items`);
      } else {
        console.log(`   ❌ ${endpoint}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint}: ${error.message}`);
    }
  }

  // Test 5: Sanity integration
  console.log('\n5️⃣ Testing Sanity integration...');
  try {
    const sanityResponse = await fetch(`${COOLIFY_URL}/api/conferences`);
    if (sanityResponse.ok) {
      const conferences = await sanityResponse.json();
      if (conferences && conferences.length > 0) {
        console.log('✅ Sanity integration working');
        console.log(`   Found ${conferences.length} conferences`);
        console.log(`   Latest: "${conferences[0]?.title || 'Unknown'}"`);
      } else {
        console.log('⚠️  Sanity connected but no data found');
      }
    } else {
      console.log(`❌ Sanity integration failed: ${sanityResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Sanity integration error: ${error.message}`);
  }

  console.log('\n📋 MIGRATION CHECKLIST:');
  console.log('========================');
  console.log('□ Update DNS records (A records to 31.97.203.190)');
  console.log('□ Set environment variables in Coolify dashboard');
  console.log('□ Deploy application to Coolify');
  console.log('□ Test all endpoints and functionality');
  console.log('□ Update any hardcoded Vercel URLs in code');
  console.log('□ Monitor logs for any deployment issues');
  
  console.log('\n🔗 USEFUL LINKS:');
  console.log('================');
  console.log(`Coolify App: ${COOLIFY_URL}`);
  console.log(`Health Check: ${COOLIFY_URL}/api/health`);
  console.log(`Environment: ${COOLIFY_URL}/api/debug-env`);
  console.log(`Sanity Studio: https://intelliglobalconferences.sanity.studio/`);
}

// Run the test
if (require.main === module) {
  testCoolifyMigration().catch(console.error);
}

module.exports = { testCoolifyMigration, COOLIFY_URL };
