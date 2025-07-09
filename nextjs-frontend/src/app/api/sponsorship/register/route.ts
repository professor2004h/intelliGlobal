import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { generateRegistrationId } from '../../../getSponsorshipData';

const client = createClient({
  projectId: 'tq1qdk3m',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN, // You'll need to add this to your environment variables
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'conferenceId',
      'sponsorshipTierId',
      'companyDetails.companyName',
      'contactPerson.firstName',
      'contactPerson.lastName',
      'contactPerson.email',
      'billingAddress.street',
      'billingAddress.city',
      'billingAddress.country',
    ];

    for (const field of requiredFields) {
      const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], body);
      if (!fieldValue) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate registration ID
    const registrationId = generateRegistrationId();

    // Prepare registration data for Sanity
    const registrationData = {
      _type: 'sponsorRegistration',
      registrationId,
      conference: {
        _type: 'reference',
        _ref: body.conferenceId,
      },
      sponsorshipTier: {
        _type: 'reference',
        _ref: body.sponsorshipTierId,
      },
      customAmount: body.customAmount || undefined,
      companyDetails: {
        companyName: body.companyDetails.companyName,
        industry: body.companyDetails.industry || undefined,
        website: body.companyDetails.website || undefined,
        description: body.companyDetails.description || undefined,
      },
      contactPerson: {
        firstName: body.contactPerson.firstName,
        lastName: body.contactPerson.lastName,
        title: body.contactPerson.title || undefined,
        email: body.contactPerson.email,
        phone: body.contactPerson.phone || undefined,
        alternateEmail: body.contactPerson.alternateEmail || undefined,
      },
      billingAddress: {
        street: body.billingAddress.street,
        city: body.billingAddress.city,
        state: body.billingAddress.state || undefined,
        postalCode: body.billingAddress.postalCode || undefined,
        country: body.billingAddress.country,
      },
      specialRequests: body.specialRequests || undefined,
      status: 'pending',
      submissionDate: new Date().toISOString(),
    };

    // Create registration in Sanity
    const result = await client.create(registrationData);

    return NextResponse.json({
      success: true,
      registrationId,
      sanityId: result._id,
    });

  } catch (error) {
    console.error('Error creating sponsor registration:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get('registrationId');

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      );
    }

    // Fetch registration from Sanity
    const query = `*[_type == "sponsorRegistration" && registrationId == $registrationId][0] {
      _id,
      registrationId,
      conference -> {
        _id,
        title,
        date,
        location
      },
      sponsorshipTier -> {
        _id,
        name,
        price
      },
      customAmount,
      companyDetails,
      contactPerson,
      billingAddress,
      specialRequests,
      status,
      submissionDate,
      paymentDetails
    }`;

    const registration = await client.fetch(query, { registrationId });

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      registration,
    });

  } catch (error) {
    console.error('Error fetching sponsor registration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registration' },
      { status: 500 }
    );
  }
}
