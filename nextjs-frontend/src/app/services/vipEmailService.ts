import nodemailer from 'nodemailer';

/**
 * VIP Email Service for Special Client Payments
 * Sends confirmation emails after successful PayPal payments
 */

interface VIPEmailData {
  clientName: string;
  title: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  country?: string;
  postalAddress?: string;
  conferenceName: string;
  paymentAmount: number;
  currency: string;
  paypalTransactionId: string;
  paypalOrderId: string;
  paymentDate: string;
}

/**
 * Get email configuration from environment variables
 */
function getEmailConfig() {
  return {
    host: process.env.SMTP_HOST || 'smtp.titan.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || 'contactus@intelliglobalconferences.com',
    pass: process.env.SMTP_PASS || 'October@2025',
    from: process.env.EMAIL_FROM || 'contactus@intelliglobalconferences.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Intelli Global Conferences'
  };
}

/**
 * Create nodemailer transporter
 */
function createTransporter() {
  const config = getEmailConfig();

  console.log('📧 Creating VIP email transporter with config:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.user,
    from: config.from
  });

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

/**
 * Generate HTML email template for VIP payment confirmation
 */
function generateVIPEmailHTML(data: VIPEmailData): string {
  const {
    clientName,
    title,
    email,
    phoneNumber,
    country,
    postalAddress,
    conferenceName,
    paymentAmount,
    currency,
    paypalTransactionId,
    paypalOrderId,
    paymentDate
  } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmation - Intelli Global Conferences</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Payment Confirmed! ✅</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Thank you for your payment</p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f0fdf4; border-bottom: 3px solid #22c55e;">
              <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
              <h2 style="color: #166534; margin: 0 0 10px 0; font-size: 24px;">Payment Successful!</h2>
              <p style="color: #15803d; margin: 0; font-size: 16px;">Your payment has been processed successfully</p>
            </td>
          </tr>

          <!-- Client Details -->
          <tr>
            <td style="padding: 30px;">
              <h3 style="color: #1e40af; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Client Information</h3>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #6b7280; font-size: 14px; width: 40%;">Name:</td>
                  <td style="color: #111827; font-size: 14px; font-weight: bold;">${title} ${clientName}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Email:</td>
                  <td style="color: #111827; font-size: 14px; font-weight: bold;">${email}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Phone:</td>
                  <td style="color: #111827; font-size: 14px; font-weight: bold;">${phoneNumber}</td>
                </tr>
                ${country ? `
                <tr>
                  <td style="color: #6b7280; font-size: 14px;">Country:</td>
                  <td style="color: #111827; font-size: 14px; font-weight: bold;">${country}</td>
                </tr>
                ` : ''}
                ${postalAddress ? `
                <tr>
                  <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Address:</td>
                  <td style="color: #111827; font-size: 14px; font-weight: bold;">${postalAddress}</td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Conference Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="color: #1e40af; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Conference Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #6b7280; font-size: 14px; width: 40%;">Conference:</td>
                  <td style="color: #111827; font-size: 14px; font-weight: bold;">${conferenceName}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Details -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h3 style="color: #1e40af; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Payment Details</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px;">
                <tr>
                  <td style="color: #6b7280; font-size: 14px; width: 40%; padding: 12px;">Amount Paid:</td>
                  <td style="color: #059669; font-size: 20px; font-weight: bold; padding: 12px;">${currency} ${paymentAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 12px;">Payment Method:</td>
                  <td style="color: #111827; font-size: 14px; font-weight: bold; padding: 12px;">PayPal</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 12px;">Transaction ID:</td>
                  <td style="color: #111827; font-size: 14px; font-weight: bold; font-family: monospace; padding: 12px;">${paypalTransactionId}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 12px;">Order ID:</td>
                  <td style="color: #111827; font-size: 14px; font-weight: bold; font-family: monospace; padding: 12px;">${paypalOrderId}</td>
                </tr>
                <tr>
                  <td style="color: #6b7280; font-size: 14px; padding: 12px;">Payment Date:</td>
                  <td style="color: #111827; font-size: 14px; font-weight: bold; padding: 12px;">${paymentDate}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 4px;">
                <h4 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">📋 What's Next?</h4>
                <ul style="color: #1e40af; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                  <li>You will receive further conference details via email</li>
                  <li>Keep this email for your records</li>
                  <li>If you have any questions, please contact us</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
                <strong>Intelli Global Conferences</strong>
              </p>
              <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                Email: contactus@intelliglobalconferences.com
              </p>
              <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Send VIP payment confirmation email
 */
export async function sendVIPPaymentConfirmation(emailData: VIPEmailData): Promise<boolean> {
  try {
    console.log('📧 Sending VIP payment confirmation email to:', emailData.email);

    const transporter = createTransporter();
    const config = getEmailConfig();

    const mailOptions = {
      from: `"${config.fromName}" <${config.from}>`,
      to: emailData.email,
      subject: `Payment Confirmation - ${emailData.conferenceName}`,
      html: generateVIPEmailHTML(emailData),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ VIP email sent successfully:', info.messageId);
    
    return true;
  } catch (error) {
    console.error('❌ Error sending VIP email:', error);
    return false;
  }
}

