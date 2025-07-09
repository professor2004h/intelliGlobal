/**
 * Test script to verify the sponsor registration page loads without webpack module errors
 */

const puppeteer = require('puppeteer');

async function testSponsorRegistrationPage() {
  console.log('🚀 Starting sponsor registration page test...');
  
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set up console logging to catch errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
        console.log('❌ Console Error:', msg.text());
      } else if (msg.type() === 'log') {
        console.log('📝 Console Log:', msg.text());
      }
    });
    
    // Set up error handling
    page.on('pageerror', error => {
      errors.push(error.message);
      console.log('❌ Page Error:', error.message);
    });
    
    // Navigate to sponsor registration page
    console.log('🌐 Navigating to http://localhost:3002/sponsorship/register...');
    const response = await page.goto('http://localhost:3002/sponsorship/register', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    console.log('📊 Response status:', response.status());
    
    // Wait for page to load
    await page.waitForTimeout(5000);
    
    // Check for webpack module errors
    const hasWebpackError = errors.some(error => 
      error.includes('webpack') || 
      error.includes('Cannot read properties of undefined (reading \'call\')') ||
      error.includes('Module not found')
    );
    
    // Check if page loaded successfully
    const pageTitle = await page.title();
    console.log('📄 Page title:', pageTitle);
    
    // Check if loading spinner is present (indicates client-side loading)
    const hasLoadingSpinner = await page.$('.animate-spin');
    console.log('⏳ Loading spinner present:', !!hasLoadingSpinner);
    
    // Wait for form to load
    await page.waitForTimeout(3000);
    
    // Check if form elements are present
    const formElements = await page.$$('form, input, select, button');
    console.log('📝 Form elements found:', formElements.length);
    
    // Take screenshot for verification
    await page.screenshot({ path: 'sponsor-registration-test.png', fullPage: true });
    console.log('📸 Screenshot saved as sponsor-registration-test.png');
    
    // Test results
    console.log('\n🔍 TEST RESULTS:');
    console.log('================');
    console.log('✅ Page loaded:', response.status() === 200);
    console.log('✅ No webpack errors:', !hasWebpackError);
    console.log('✅ Form elements present:', formElements.length > 0);
    console.log('✅ Total errors:', errors.length);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors found:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    } else {
      console.log('\n🎉 SUCCESS: No errors detected!');
    }
    
    return {
      success: response.status() === 200 && !hasWebpackError,
      errors: errors,
      formElementsCount: formElements.length
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return {
      success: false,
      errors: [error.message],
      formElementsCount: 0
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
if (require.main === module) {
  testSponsorRegistrationPage()
    .then(result => {
      console.log('\n📊 Final Result:', result.success ? '✅ PASSED' : '❌ FAILED');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = testSponsorRegistrationPage;
