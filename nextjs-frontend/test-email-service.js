/**
 * Test Email Service
 * Tests the VIP email service to verify SMTP configuration
 */

require('dotenv').config({ path: './.env.local' });

async function testEmailService() {
  // Dynamic import for nodemailer (ES module)
  const nodemailerModule = await import('nodemailer');
  const nodemailer = nodemailerModule.default;

  console.log('🧪 Testing VIP Email Service...\n');

  // Display configuration
  console.log('📋 Email Configuration:');
  console.log('  Host:', process.env.SMTP_HOST);
  console.log('  Port:', process.env.SMTP_PORT);
  console.log('  Secure:', process.env.SMTP_SECURE);
  console.log('  User:', process.env.SMTP_USER);
  console.log('  From:', process.env.EMAIL_FROM);
  console.log('  From Name:', process.env.EMAIL_FROM_NAME);
  console.log('');

  // Create transporter
  console.log('🔧 Creating email transporter...');
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true' || true,
    auth: {
      user: process.env.SMTP_USER || 'contactus@intelliglobalconferences.com',
      pass: process.env.SMTP_PASS || 'October@2025',
    },
  });

  // Verify connection
  console.log('🔍 Verifying SMTP connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.error('Full error:', error);
    return;
  }

  // Send test email
  console.log('📧 Sending test email to professor2004h@gmail.com...');
  
  const testEmailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🧪 Email Service Test</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">VIP Payment System Email Configuration</p>
    </div>

    <!-- Success Message -->
    <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin: 20px;">
      <p style="margin: 0; color: #155724; font-size: 16px;">
        <strong>✅ Email Service is Working!</strong>
      </p>
      <p style="margin: 10px 0 0 0; color: #155724; font-size: 14px;">
        This test email confirms that the SMTP configuration is correct and emails can be sent successfully.
      </p>
    </div>

    <!-- Test Details -->
    <div style="padding: 20px;">
      <h2 style="color: #333333; font-size: 20px; margin-top: 0;">Test Details</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">SMTP Host:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${process.env.SMTP_HOST}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">SMTP Port:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${process.env.SMTP_PORT}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">From Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${process.env.EMAIL_FROM}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #666666; font-size: 14px;">Test Date:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px; font-weight: bold;">${new Date().toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <!-- Next Steps -->
    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px;">
      <h3 style="margin: 0 0 10px 0; color: #856404; font-size: 16px;">📝 Next Steps</h3>
      <p style="margin: 0; color: #856404; font-size: 14px;">
        If you received this email, the VIP Payment System email service is configured correctly and ready to send payment confirmation emails.
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
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to: 'professor2004h@gmail.com',
    subject: '🧪 VIP Payment System - Email Service Test',
    html: testEmailHTML,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Email sent to: professor2004h@gmail.com');
    console.log('');
    console.log('🎉 SUCCESS! Check your inbox at professor2004h@gmail.com');
    console.log('');
    console.log('✅ Email service is working correctly!');
    console.log('✅ VIP Payment System is ready to send confirmation emails!');
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testEmailService().catch(console.error);

