#!/usr/bin/env node

/**
 * UPI Integration Test Script
 * Tests all UPI-related dependencies and configurations
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 UPI Integration Test Suite');
console.log('============================\n');

// Test 1: Check Razorpay Package Installation
console.log('1️⃣ Testing Razorpay Package Installation...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const razorpayVersion = packageJson.dependencies?.razorpay;
  
  if (razorpayVersion) {
    console.log(`✅ Razorpay package found: ${razorpayVersion}`);
  } else {
    console.log('❌ Razorpay package not found in dependencies');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
  process.exit(1);
}

// Test 2: Check Environment Variables
console.log('\n2️⃣ Testing Environment Variables...');
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const requiredVars = [
    'RAZORPAY_KEY_ID',
    'RAZORPAY_SECRET_KEY',
    'NEXT_PUBLIC_RAZORPAY_KEY_ID',
    'NEXT_PUBLIC_UPI_TEST_MODE',
    'NEXT_PUBLIC_UPI_TEST_ID'
  ];
  
  let allVarsPresent = true;
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} found`);
    } else {
      console.log(`❌ ${varName} missing`);
      allVarsPresent = false;
    }
  });
  
  if (!allVarsPresent) {
    console.log('❌ Some required environment variables are missing');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Error reading .env.local:', error.message);
  process.exit(1);
}

// Test 3: Check UPI Configuration in Code
console.log('\n3️⃣ Testing UPI Configuration in Code...');
try {
  const formPath = 'src/app/sponsorship/register/SponsorRegistrationForm.tsx';
  const formContent = fs.readFileSync(formPath, 'utf8');
  
  const upiChecks = [
    { pattern: /method:\s*{/, description: 'Payment method configuration' },
    { pattern: /upi:\s*true/, description: 'UPI enabled' },
    { pattern: /card:\s*true/, description: 'Card enabled' },
    { pattern: /netbanking:\s*true/, description: 'Net banking enabled' },
    { pattern: /wallet:\s*true/, description: 'Wallet enabled' },
    { pattern: /currency.*INR/, description: 'INR currency support' }
  ];
  
  let allChecksPass = true;
  upiChecks.forEach(check => {
    if (check.pattern.test(formContent)) {
      console.log(`✅ ${check.description} found`);
    } else {
      console.log(`❌ ${check.description} missing`);
      allChecksPass = false;
    }
  });
  
  if (!allChecksPass) {
    console.log('❌ Some UPI configurations are missing in the form');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Error reading form file:', error.message);
  process.exit(1);
}

// Test 4: Check API Configuration
console.log('\n4️⃣ Testing API Configuration...');
try {
  const apiPath = 'src/app/api/payment/create-order/route.ts';
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  
  const apiChecks = [
    { pattern: /currency\s*=\s*['"]INR['"]/, description: 'Default INR currency' },
    { pattern: /upi_test_enabled/, description: 'UPI test mode enabled' },
    { pattern: /test_upi_id/, description: 'Test UPI ID configured' },
    { pattern: /payment_methods.*upi/, description: 'UPI in payment methods' },
    { pattern: /upi_flows/, description: 'UPI flows configured' }
  ];
  
  let allApiChecksPass = true;
  apiChecks.forEach(check => {
    if (check.pattern.test(apiContent)) {
      console.log(`✅ ${check.description} found`);
    } else {
      console.log(`❌ ${check.description} missing`);
      allApiChecksPass = false;
    }
  });
  
  if (!allApiChecksPass) {
    console.log('❌ Some API configurations are missing');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Error reading API file:', error.message);
  process.exit(1);
}

// Test 5: Check Razorpay Script Loading
console.log('\n5️⃣ Testing Razorpay Script Loading Configuration...');
try {
  const formPath = 'src/app/sponsorship/register/SponsorRegistrationForm.tsx';
  const formContent = fs.readFileSync(formPath, 'utf8');
  
  const scriptChecks = [
    { pattern: /checkout\.razorpay\.com\/v1\/checkout\.js/, description: 'Razorpay script URL' },
    { pattern: /window\.Razorpay/, description: 'Razorpay window object check' },
    { pattern: /razorpayLoaded/, description: 'Razorpay loaded state management' }
  ];
  
  let allScriptChecksPass = true;
  scriptChecks.forEach(check => {
    if (check.pattern.test(formContent)) {
      console.log(`✅ ${check.description} found`);
    } else {
      console.log(`❌ ${check.description} missing`);
      allScriptChecksPass = false;
    }
  });
  
  if (!allScriptChecksPass) {
    console.log('❌ Some script loading configurations are missing');
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Error checking script loading:', error.message);
  process.exit(1);
}

console.log('\n🎉 All UPI Integration Tests Passed!');
console.log('=====================================');
console.log('✅ Razorpay package installed');
console.log('✅ Environment variables configured');
console.log('✅ UPI method enabled in frontend');
console.log('✅ API configured for UPI support');
console.log('✅ Razorpay script loading configured');
console.log('\n📋 Next Steps:');
console.log('1. Fill out the sponsorship form');
console.log('2. Click "Pay with Stripe" button');
console.log('3. UPI options should now appear in the Razorpay modal');
console.log('4. Test with UPI ID: success@razorpay (for successful test payments)');
console.log('\n🔧 If UPI options still don\'t appear, it may be due to:');
console.log('- Razorpay test account limitations');
console.log('- Geographic restrictions');
console.log('- Account-level UPI settings in Razorpay dashboard');
