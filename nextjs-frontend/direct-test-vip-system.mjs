/**
 * Direct VIP System Test
 * Tests email sending and Sanity storage independently
 */

import nodemailer from 'nodemailer';
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env.local' });

console.log('🚀 Starting VIP System Direct Test...\n');

// Configuration - Try with SSL on port 465
const SMTP_CONFIG = {
  host: 'smtp.titan.email',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: 'contactus@intelliglobalconferences.com',
    pass: 'October@2025',
  },
  tls: {
    rejectUnauthorized: false
  }
};

const SANITY_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '99kpz7t0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
};

// Test data
const TEST_DATA = {
  title: 'Dr',
  firstName: 'Test',
  lastName: 'User',
  email: 'professor2004h@gmail.com',
  phoneNumber: '+1234567890',
  country: 'United States',
  postalAddress: '123 Test Street, Test City, TC 12345',
  paymentAmount: 50.00,
  currency: 'USD',
  conferenceName: 'Test Conference',
  transactionId: `TEST-${Date.now()}`,
  orderId: `ORDER-${Date.now()}`,
};

async function testEmailService() {
  console.log('📧 TESTING EMAIL SERVICE');
  console.log('═══════════════════════════════════════════════════\n');

  console.log('📋 SMTP Configuration:');
  console.log('  Host:', SMTP_CONFIG.host);
  console.log('  Port:', SMTP_CONFIG.port);
  console.log('  Secure:', SMTP_CONFIG.secure);
  console.log('  User:', SMTP_CONFIG.auth.user);
  console.log('  From:', 'contactus@intelliglobalconferences.com');
  console.log('  To:', TEST_DATA.email);
  console.log('');

  try {
    console.log('🔧 Creating email transporter...');
    const transporter = nodemailer.createTransport(SMTP_CONFIG);

    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    console.log('📧 Sending test email...');
    
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIP Payment Confirmation - Test</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 VIP Payment System Test</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Email Service Verification</p>
    </div>

    <!-- Success Message -->
    <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin: 20px;">
      <p style="margin: 0; color: #155724; font-size: 16px;">
        <strong>✅ Email Service is Working!</strong>
      </p>
      <p style="margin: 10px 0 0 0; color: #155724; font-size: 14px;">
        This test email confirms that the VIP Payment System can successfully send emails from contactus@intelliglobalconferences.com to professor2004h@gmail.com
      </p>
    </div>

    <!-- Test Details -->
    <div style="padding: 20px;">
      <h2 style="color: #333333; font-size: 20px; margin-top: 0;">Test Payment Details</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Client Name:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${TEST_DATA.title} ${TEST_DATA.firstName} ${TEST_DATA.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${TEST_DATA.email}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Phone:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${TEST_DATA.phoneNumber}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Country:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${TEST_DATA.country}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Address:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${TEST_DATA.postalAddress}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Conference:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${TEST_DATA.conferenceName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Payment Amount:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${TEST_DATA.currency} ${TEST_DATA.paymentAmount.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Transaction ID:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${TEST_DATA.transactionId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Order ID:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${TEST_DATA.orderId}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Test Date:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${new Date().toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <!-- Important Note -->
    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #856404; font-size: 16px;">📝 This is a Test Email</h3>
      <p style="margin: 0; color: #856404; font-size: 14px;">
        This email was sent to verify that the VIP Payment System email service is configured correctly. 
        A corresponding test registration has also been created in the Sanity backend.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="margin: 0; color: #666666; font-size: 14px;">
        <strong>Intelli Global Conferences</strong>
      </p>
      <p style="margin: 5px 0 0 0; color: #999999; font-size: 12px;">
        Email: contactus@intelliglobalconferences.com
      </p>
      <p style="margin: 10px 0 0 0; color: #999999; font-size: 11px;">
        This is an automated test email from the VIP Payment System.
      </p>
    </div>

  </div>
</body>
</html>
    `;

    const mailOptions = {
      from: '"Intelli Global Conferences" <contactus@intelliglobalconferences.com>',
      to: 'professor2004h@gmail.com',
      subject: '🧪 VIP Payment System - Test Email Confirmation',
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Email sent to:', TEST_DATA.email);
    console.log('✅ EMAIL TEST PASSED!\n');
    
    return true;
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Full error:', error);
    return false;
  }
}

async function testSanityStorage() {
  console.log('💾 TESTING SANITY STORAGE');
  console.log('═══════════════════════════════════════════════════\n');

  console.log('📋 Sanity Configuration:');
  console.log('  Project ID:', SANITY_CONFIG.projectId);
  console.log('  Dataset:', SANITY_CONFIG.dataset);
  console.log('  API Version:', SANITY_CONFIG.apiVersion);
  console.log('  Token:', SANITY_CONFIG.token ? '✅ Set' : '❌ Missing');
  console.log('');

  try {
    console.log('🔧 Creating Sanity client...');
    const sanityClient = createClient(SANITY_CONFIG);

    console.log('🔍 Testing Sanity connection...');
    const testQuery = await sanityClient.fetch('*[_type == "conference"][0]');
    console.log('✅ Sanity connection successful!\n');

    console.log('💾 Creating test registration document...');
    
    const registrationDoc = {
      _type: 'specialRegistration',
      clientName: `${TEST_DATA.firstName} ${TEST_DATA.lastName}`,
      title: TEST_DATA.title,
      firstName: TEST_DATA.firstName,
      lastName: TEST_DATA.lastName,
      email: TEST_DATA.email,
      phoneNumber: TEST_DATA.phoneNumber,
      country: TEST_DATA.country,
      postalAddress: TEST_DATA.postalAddress,
      paymentAmount: TEST_DATA.paymentAmount,
      currency: TEST_DATA.currency,
      paypalTransactionId: TEST_DATA.transactionId,
      paypalOrderId: TEST_DATA.orderId,
      paymentStatus: 'completed',
      registrationDate: new Date().toISOString(),
      paymentDate: new Date().toISOString(),
      emailSent: true,
      emailSentDate: new Date().toISOString(),
      notes: 'This is a test registration created by the direct test script to verify the VIP Payment System is working correctly.',
    };

    const savedDoc = await sanityClient.create(registrationDoc);
    
    console.log('✅ Test registration created successfully!');
    console.log('📄 Document ID:', savedDoc._id);
    console.log('👤 Client:', `${TEST_DATA.title} ${TEST_DATA.firstName} ${TEST_DATA.lastName}`);
    console.log('📧 Email:', TEST_DATA.email);
    console.log('💰 Amount:', `${TEST_DATA.currency} ${TEST_DATA.paymentAmount.toFixed(2)}`);
    console.log('🆔 Transaction ID:', TEST_DATA.transactionId);
    console.log('✅ SANITY TEST PASSED!\n');
    
    return savedDoc._id;
  } catch (error) {
    console.error('❌ Sanity test failed:', error.message);
    console.error('Full error:', error);
    return null;
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════');
  console.log('🧪 VIP PAYMENT SYSTEM - DIRECT TEST');
  console.log('═══════════════════════════════════════════════════\n');

  const emailSuccess = await testEmailService();
  const sanityDocId = await testSanityStorage();

  console.log('═══════════════════════════════════════════════════');
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════════\n');

  console.log('Email Service:', emailSuccess ? '✅ PASSED' : '❌ FAILED');
  console.log('Sanity Storage:', sanityDocId ? '✅ PASSED' : '❌ FAILED');
  console.log('');

  if (emailSuccess && sanityDocId) {
    console.log('🎉 ALL TESTS PASSED!');
    console.log('');
    console.log('✅ Email sent to: professor2004h@gmail.com');
    console.log('✅ Registration saved in Sanity with ID:', sanityDocId);
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Check your email at professor2004h@gmail.com');
    console.log('2. Open Sanity Studio: http://localhost:3333/structure/specialRegistration');
    console.log('3. Verify the test registration appears in the list');
    console.log('');
  } else {
    console.log('❌ SOME TESTS FAILED - Please check the errors above');
  }
}

// Run the tests
runTests().catch(console.error);

