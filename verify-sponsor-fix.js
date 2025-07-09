/**
 * Simple verification script to test sponsor registration page
 */

const http = require('http');

function testSponsorRegistrationEndpoint() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Testing sponsor registration endpoint...');
    
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/sponsorship/register',
      method: 'GET',
      timeout: 10000
    };
    
    const req = http.request(options, (res) => {
      console.log('📊 Response status:', res.statusCode);
      console.log('📋 Response headers:', res.headers);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const success = res.statusCode === 200;
        const hasContent = data.length > 0;
        const hasReactContent = data.includes('__NEXT_DATA__') || data.includes('react');
        
        console.log('✅ Status OK:', success);
        console.log('✅ Has content:', hasContent);
        console.log('✅ Has React content:', hasReactContent);
        console.log('📏 Content length:', data.length);
        
        // Check for specific error indicators in HTML
        const hasWebpackError = data.includes('webpack') && data.includes('Cannot read properties of undefined');
        const hasModuleError = data.includes('Module not found');
        const hasGeneralError = data.includes('TypeError') || data.includes('ReferenceError');
        const hasError = hasWebpackError || hasModuleError || hasGeneralError;

        console.log('❌ Has webpack error:', hasWebpackError);
        console.log('❌ Has module error:', hasModuleError);
        console.log('❌ Has general error:', hasGeneralError);
        console.log('❌ Has any error indicators:', hasError);

        // Log first 1000 chars if there are errors
        if (hasError) {
          console.log('\n📄 Content preview (first 1000 chars):');
          console.log(data.substring(0, 1000));
        }
        
        resolve({
          success: success && hasContent && !hasError,
          statusCode: res.statusCode,
          contentLength: data.length,
          hasReactContent,
          hasError
        });
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });
    
    req.on('timeout', () => {
      console.error('❌ Request timed out');
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function verifyFix() {
  try {
    console.log('🔍 Verifying sponsor registration fix...\n');
    
    const result = await testSponsorRegistrationEndpoint();
    
    console.log('\n📊 VERIFICATION RESULTS:');
    console.log('========================');
    console.log('Overall Success:', result.success ? '✅ PASSED' : '❌ FAILED');
    console.log('Status Code:', result.statusCode);
    console.log('Content Length:', result.contentLength);
    console.log('Has React Content:', result.hasReactContent ? '✅' : '❌');
    console.log('Has Error Indicators:', result.hasError ? '❌' : '✅');
    
    if (result.success) {
      console.log('\n🎉 SUCCESS: Sponsor registration page is working!');
      console.log('✅ The webpack module loading error has been resolved.');
      console.log('✅ Page loads successfully with HTTP 200 status.');
      console.log('✅ No error indicators detected in response.');
    } else {
      console.log('\n❌ FAILED: Issues detected with sponsor registration page.');
    }
    
    return result.success;
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    return false;
  }
}

// Run verification
if (require.main === module) {
  verifyFix()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(() => {
      process.exit(1);
    });
}

module.exports = verifyFix;
