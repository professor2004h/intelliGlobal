import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { sendVIPPaymentConfirmation } from '../../../services/vipEmailService';

/**
 * VIP Payment Processing API
 * Handles PayPal payment completion, Sanity storage, and email confirmation
 */

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '99kpz7t0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 VIP Payment Processing API called');

    const body = await request.json();
    const {
      clientData,
      paymentData,
      conferenceData
    } = body;

    // Validate required parameters
    if (!clientData || !paymentData || !conferenceData) {
      console.error('❌ Missing required parameters');
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters',
          required: ['clientData', 'paymentData', 'conferenceData']
        },
        { status: 400 }
      );
    }

    console.log('📋 Processing VIP payment for:', clientData.email);

    // Create registration document in Sanity
    const registrationDoc = {
      _type: 'specialRegistration',
      clientName: `${clientData.firstName} ${clientData.lastName}`.trim() || clientData.email,
      title: clientData.title,
      firstName: clientData.firstName,
      lastName: clientData.lastName,
      email: clientData.email,
      phoneNumber: clientData.phoneNumber,
      country: clientData.country || '',
      postalAddress: clientData.postalAddress || '',
      conferenceSelected: {
        _type: 'reference',
        _ref: conferenceData.conferenceId,
      },
      paymentAmount: parseFloat(paymentData.amount),
      currency: paymentData.currency || 'USD',
      paypalTransactionId: paymentData.transactionId,
      paypalOrderId: paymentData.orderId,
      paymentStatus: 'completed',
      registrationDate: new Date().toISOString(),
      paymentDate: new Date().toISOString(),
      emailSent: false,
    };

    console.log('💾 Saving registration to Sanity...');
    const savedDoc = await sanityClient.create(registrationDoc);
    console.log('✅ Registration saved with ID:', savedDoc._id);

    // Send confirmation email
    console.log('📧 Sending confirmation email...');
    const emailData = {
      clientName: registrationDoc.clientName,
      title: clientData.title,
      firstName: clientData.firstName,
      lastName: clientData.lastName,
      email: clientData.email,
      phoneNumber: clientData.phoneNumber,
      country: clientData.country,
      postalAddress: clientData.postalAddress,
      conferenceName: conferenceData.conferenceName,
      paymentAmount: parseFloat(paymentData.amount),
      currency: paymentData.currency || 'USD',
      paypalTransactionId: paymentData.transactionId,
      paypalOrderId: paymentData.orderId,
      paymentDate: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }),
    };

    const emailSent = await sendVIPPaymentConfirmation(emailData);

    // Update Sanity document with email status
    if (emailSent) {
      await sanityClient
        .patch(savedDoc._id)
        .set({
          emailSent: true,
          emailSentDate: new Date().toISOString(),
        })
        .commit();
      console.log('✅ Email sent and status updated');
    } else {
      console.warn('⚠️ Email sending failed, but registration was saved');
    }

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      registrationId: savedDoc._id,
      emailSent,
      data: {
        clientName: registrationDoc.clientName,
        email: clientData.email,
        phoneNumber: clientData.phoneNumber,
        conferenceName: conferenceData.conferenceName,
        amount: paymentData.amount,
        currency: paymentData.currency,
        transactionId: paymentData.transactionId,
        orderId: paymentData.orderId,
      }
    });

  } catch (error: any) {
    console.error('❌ Error processing VIP payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process payment',
        details: error.message
      },
      { status: 500 }
    );
  }
}

