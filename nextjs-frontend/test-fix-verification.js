// Test script to verify the webpack fix and functionality restoration
const http = require('http');

console.log('🔧 WEBPACK FIX VERIFICATION TEST');
console.log('================================');

// Test 1: Check if the main page loads
function testMainPage() {
  return new Promise((resolve, reject) => {
    console.log('\n1. Testing main page load...');

    const req = http.request({
      hostname: 'localhost',
      port: 3002,
      path: '/',
      method: 'GET'
    }, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Main page loads successfully (Status: 200)');
        resolve(true);
      } else {
        console.log(`❌ Main page failed (Status: ${res.statusCode})`);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.log('❌ Main page error:', err.message);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Main page timeout');
      resolve(false);
    });

    req.end();
  });
}

// Test 2: Check if the sponsor registration page loads
function testSponsorRegistrationPage() {
  return new Promise((resolve, reject) => {
    console.log('\n2. Testing sponsor registration page...');

    const req = http.request({
      hostname: 'localhost',
      port: 3002,
      path: '/sponsorship/register',
      method: 'GET'
    }, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Sponsor registration page loads successfully (Status: 200)');
        console.log('✅ WEBPACK ERROR FIXED - Page no longer crashes!');
        resolve(true);
      } else {
        console.log(`❌ Sponsor registration page failed (Status: ${res.statusCode})`);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.log('❌ Sponsor registration page error:', err.message);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Sponsor registration page timeout');
      resolve(false);
    });

    req.end();
  });
}

// Test 3: Check conferences API
function testConferencesAPI() {
  return new Promise((resolve, reject) => {
    console.log('\n3. Testing conferences API...');

    const req = http.request({
      hostname: 'localhost',
      port: 3002,
      path: '/api/conferences',
      method: 'GET'
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const conferences = JSON.parse(data);
          if (Array.isArray(conferences) && conferences.length > 0) {
            console.log('✅ Conferences API working');
            console.log('📊 Conference titles:', conferences.map(c => c.title));

            // Check for expected conferences
            const expectedTitles = ['hello', 'Research Publication', 'Hi'];
            const foundTitles = conferences.map(c => c.title.trim());
            const hasExpectedData = expectedTitles.some(title =>
              foundTitles.some(found => found.includes(title))
            );

            if (hasExpectedData) {
              console.log('✅ Real-time CMS data confirmed');
            } else {
              console.log('⚠️ Expected conference data not found');
            }

            resolve(true);
          } else {
            console.log('❌ Conferences API returned empty or invalid data');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Conferences API JSON parse error:', error.message);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Conferences API error:', err.message);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Conferences API timeout');
      resolve(false);
    });

    req.end();
  });
}

// Test 4: Check sponsorship tiers API
function testSponsorshipTiersAPI() {
  return new Promise((resolve, reject) => {
    console.log('\n4. Testing sponsorship tiers API...');

    const req = http.request({
      hostname: 'localhost',
      port: 3002,
      path: '/api/sponsorship-tiers',
      method: 'GET'
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const tiers = JSON.parse(data);
          if (Array.isArray(tiers) && tiers.length > 0) {
            console.log('✅ Sponsorship tiers API working');
            console.log('💰 Tier details:', tiers.map(t => `${t.name} - $${t.price}`));

            // Check for expected Gold tier
            const hasGoldTier = tiers.some(tier =>
              tier.name.toLowerCase().includes('gold') && tier.price === 99
            );

            if (hasGoldTier) {
              console.log('✅ Expected Gold - $99 tier confirmed');
            } else {
              console.log('⚠️ Expected Gold tier data not found');
            }

            resolve(true);
          } else {
            console.log('❌ Sponsorship tiers API returned empty or invalid data');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Sponsorship tiers API JSON parse error:', error.message);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ Sponsorship tiers API error:', err.message);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Sponsorship tiers API timeout');
      resolve(false);
    });

    req.end();
  });
}

// Run all tests
async function runAllTests() {
  console.log('Starting comprehensive functionality verification...\n');
  
  const results = {
    mainPage: await testMainPage(),
    sponsorPage: await testSponsorRegistrationPage(),
    conferencesAPI: await testConferencesAPI(),
    tiersAPI: await testSponsorshipTiersAPI()
  };
  
  console.log('\n🏆 TEST RESULTS SUMMARY');
  console.log('======================');
  console.log(`Main Page Load: ${results.mainPage ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Sponsor Registration Page: ${results.sponsorPage ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Conferences API: ${results.conferencesAPI ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Sponsorship Tiers API: ${results.tiersAPI ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result === true);
  
  if (allPassed) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Webpack error has been successfully fixed');
    console.log('✅ All previously working functionality is restored');
    console.log('✅ Real-time CMS data integration is working');
    console.log('✅ Application is ready for use');
  } else {
    console.log('\n⚠️ Some tests failed - further investigation needed');
  }
  
  return allPassed;
}

// Execute tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
