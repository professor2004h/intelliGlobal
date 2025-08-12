import { NextRequest, NextResponse } from 'next/server';
import { generateInvoicePDF } from '../../../utils/invoiceGenerator';
import { sendEmail, verifyEmailConnection } from '../../../lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      paymentData,
      sponsorshipData,
      invoiceNumber,
      customerEmail 
    } = body;

    // Validate required fields
    if (!paymentData || !sponsorshipData || !invoiceNumber || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required invoice data' },
        { status: 400 }
      );
    }

    console.log('📧 Generating invoice for:', customerEmail);

    // Generate PDF invoice
    const invoicePDF = await generateInvoicePDF({
      invoiceNumber,
      paymentData,
      sponsorshipData,
      customerEmail,
    });

    // Prepare email content
    const emailSubject = `Invoice ${invoiceNumber} - Sponsorship Registration Confirmed ✅`;
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sponsorship Registration Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Intelli Global Conferences</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 18px; font-weight: normal; opacity: 0.9;">Sponsorship Registration Confirmed ✅</h2>
          </div>

          <!-- Main Content -->
          <div style="padding: 30px 20px; background-color: white;">
            <h3 style="color: #1f2937; margin-top: 0;">Dear ${sponsorshipData.contactPerson},</h3>

            <p style="color: #374151; line-height: 1.6; font-size: 16px;">
              Thank you for your sponsorship registration! We're thrilled to have <strong style="color: #1e40af;">${sponsorshipData.companyName}</strong> as a sponsor for our upcoming conference.
            </p>

            <!-- Registration Details Card -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #1e40af;">
              <h4 style="color: #1e40af; margin-top: 0; font-size: 18px;">📋 Registration Details</h4>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Conference:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${sponsorshipData.conferenceName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Sponsorship Tier:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${sponsorshipData.tierName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Amount Paid:</td>
                  <td style="padding: 8px 0; color: #059669; font-weight: bold; font-size: 18px;">$${sponsorshipData.amount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Payment ID:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-family: monospace; font-size: 14px;">${paymentData.paymentId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Invoice Number:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-family: monospace; font-size: 14px;">${invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Registration ID:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-family: monospace; font-size: 14px;">${sponsorshipData.registrationId}</td>
                </tr>
              </table>
            </div>

            <p style="color: #374151; line-height: 1.6;">
              📎 Please find your detailed invoice attached to this email. Keep this for your records and tax purposes.
            </p>

            <!-- Next Steps -->
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 12px; margin: 25px 0;">
              <h4 style="color: #1e40af; margin-top: 0; font-size: 16px;">🚀 What Happens Next?</h4>
              <ul style="color: #1e40af; line-height: 1.8; padding-left: 20px;">
                <li>Our team will contact you within <strong>2-3 business days</strong> to discuss sponsorship benefits</li>
                <li>You'll receive detailed sponsorship package information and guidelines</li>
                <li>Logo and marketing material requirements will be shared separately</li>
                <li>Conference agenda and networking opportunities will be provided</li>
              </ul>
            </div>

            <!-- Contact Information -->
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
              <h4 style="color: #1f2937; margin-top: 0;">📞 Need Help?</h4>
              <p style="color: #6b7280; margin: 10px 0;">
                If you have any questions, please don't hesitate to contact us:
              </p>
              <p style="margin: 10px 0;">
                <a href="mailto:intelliglobalconferences@gmail.com" style="color: #1e40af; text-decoration: none; font-weight: 600;">
                  📧 intelliglobalconferences@gmail.com
                </a>
              </p>
            </div>

            <p style="color: #374151; line-height: 1.6; font-size: 16px; text-align: center; margin: 30px 0;">
              <strong>Thank you for your support! 🙏</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong style="color: #1f2937;">Intelli Global Conferences Team</strong><br>
              <span style="color: #9ca3af;">Professional Conference Management & Networking</span>
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
              This email was sent regarding your sponsorship registration. Please keep this email for your records.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Verify SMTP connection
    const connectionOK = await verifyEmailConnection();
    if (!connectionOK) {
      return NextResponse.json({ error: 'SMTP connection failed. Check SMTP_HOST/PORT/USER/PASS envs.' }, { status: 500 });
    }

    // Send email through centralized email service
    const sent = await sendEmail({
      from: `"Intelli Global Conferences" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: emailSubject,
      html: emailHTML,
      attachments: [
        {
          filename: `Invoice_${invoiceNumber}.pdf`,
          content: invoicePDF,
          contentType: 'application/pdf',
        },
      ],
    });

    if (!sent) {
      return NextResponse.json({ error: 'Failed to send invoice email' }, { status: 500 });
    }

    console.log('✅ Invoice email sent successfully to:', customerEmail);

    return NextResponse.json({
      success: true,
      message: 'Invoice generated and sent successfully',
      invoiceNumber,
    });
  } catch (error) {
    console.error('❌ Error sending invoice:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send invoice',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
