#!/usr/bin/env node

/**
 * SMTP Email System Test Script
 * 
 * This script tests the EventNext SMTP email notification system
 * to ensure emails are being sent correctly to administrators.
 */

const { sendContactFormNotification, sendSponsorshipNotification, verifyEmailConnection } = require('./src/app/lib/emailService');

// Test data for contact form
const testContactFormData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1-555-123-4567',
  subject: 'Test Contact Form Submission',
  message: 'This is a test message to verify that the contact form email notification system is working correctly. Please ignore this test email.'
};

// Test data for sponsorship notification
const testSponsorshipData = {
  registrationId: 'REG-TEST-' + Date.now(),
  companyName: 'Test Company Inc.',
  contactPerson: 'Jane Smith',
  email: 'jane.smith@testcompany.com',
  phone: '+1-555-987-6543',
  website: 'https://www.testcompany.com',
  companyAddress: '123 Business St, Suite 100, Business City, BC 12345, USA',
  conferenceName: 'International AI Conference 2024',
  tierName: 'Gold Sponsor',
  amount: 5000,
  paymentId: 'pay_test_' + Date.now(),
  paymentStatus: 'completed',
  specialRequests: 'Please provide a booth near the main entrance for maximum visibility.',
  marketingMaterials: true,
  logoPlacement: true,
  speakingOpportunity: false,
  submittedAt: new Date().toISOString(),
};

async function testEmailSystem() {
  console.log('🧪 Starting SMTP Email System Test...\n');

  try {
    // Test 1: Verify SMTP connection
    console.log('📡 Test 1: Verifying SMTP connection...');
    const connectionVerified = await verifyEmailConnection();
    
    if (connectionVerified) {
      console.log('✅ SMTP connection verified successfully\n');
    } else {
      console.log('❌ SMTP connection failed\n');
      console.log('⚠️  Please check your SMTP configuration in .env.local:');
      console.log('   - SMTP_HOST');
      console.log('   - SMTP_PORT');
      console.log('   - SMTP_USER');
      console.log('   - SMTP_PASS');
      console.log('   - SMTP_SECURE\n');
      return;
    }

    // Test 2: Send contact form notification
    console.log('📧 Test 2: Sending contact form notification...');
    const contactEmailSent = await sendContactFormNotification(
      testContactFormData,
      'intelliglobalconferences@gmail.com'
    );
    
    if (contactEmailSent) {
      console.log('✅ Contact form notification sent successfully');
    } else {
      console.log('❌ Failed to send contact form notification');
    }
    console.log('');

    // Test 3: Send sponsorship notification
    console.log('💼 Test 3: Sending sponsorship notification...');
    const sponsorshipEmailSent = await sendSponsorshipNotification(
      testSponsorshipData,
      'intelliglobalconferences@gmail.com'
    );
    
    if (sponsorshipEmailSent) {
      console.log('✅ Sponsorship notification sent successfully');
    } else {
      console.log('❌ Failed to send sponsorship notification');
    }
    console.log('');

    // Test Results Summary
    console.log('📊 Test Results Summary:');
    console.log('========================');
    console.log(`SMTP Connection: ${connectionVerified ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Contact Form Email: ${contactEmailSent ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Sponsorship Email: ${sponsorshipEmailSent ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');

    const allTestsPassed = connectionVerified && contactEmailSent && sponsorshipEmailSent;
    
    if (allTestsPassed) {
      console.log('🎉 All tests passed! SMTP email system is working correctly.');
      console.log('📬 Check your email inbox (intelliglobalconferences@gmail.com) for the test emails.');
    } else {
      console.log('⚠️  Some tests failed. Please check the error messages above and verify your SMTP configuration.');
    }

  } catch (error) {
    console.error('❌ Error during email system test:', error);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Verify SMTP credentials in .env.local file');
    console.log('2. Check if Gmail App Password is correctly configured');
    console.log('3. Ensure SMTP_HOST and SMTP_PORT are correct');
    console.log('4. Verify network connectivity');
  }
}

// Environment check
function checkEnvironment() {
  console.log('🔍 Checking environment configuration...\n');
  
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missingVars = [];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    } else {
      console.log(`✅ ${varName}: ${varName === 'SMTP_PASS' ? '***configured***' : process.env[varName]}`);
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`\n❌ Missing environment variables: ${missingVars.join(', ')}`);
    console.log('Please configure these in your .env.local file before running the test.\n');
    return false;
  }
  
  console.log('\n✅ All required environment variables are configured.\n');
  return true;
}

// Main execution
async function main() {
  console.log('EventNext SMTP Email System Test');
  console.log('================================\n');
  
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  if (!checkEnvironment()) {
    process.exit(1);
  }
  
  await testEmailSystem();
}

// Run the test
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testEmailSystem,
  checkEnvironment,
  testContactFormData,
  testSponsorshipData
};
