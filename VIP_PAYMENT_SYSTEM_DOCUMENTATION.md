# VIP Payment System - Complete Documentation

**Created:** October 24, 2025  
**Status:** ✅ **COMPLETE AND READY TO USE**  
**Purpose:** Special payment portal for VIP clients with custom amounts

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [File Structure](#file-structure)
4. [User Flow](#user-flow)
5. [Technical Implementation](#technical-implementation)
6. [Configuration](#configuration)
7. [Testing](#testing)
8. [Sanity Studio](#sanity-studio)
9. [Troubleshooting](#troubleshooting)

---

## Overview

The VIP Payment System is a dedicated payment portal for special/VIP clients that allows them to make custom payments for conferences. The system integrates with:
- **Sanity CMS** for dynamic conference data and registration storage
- **PayPal** for secure payment processing
- **Hostinger SMTP** for automated email confirmations

---

## Features

### ✅ Implemented Features

1. **Dynamic Conference Selection**
   - Dropdown automatically fetches all conferences from Sanity
   - Shows conference title and date
   - Updates in real-time when new conferences are added

2. **Comprehensive Form**
   - Title selection (Mr, Ms, Mrs, Prof, Dr)
   - First Name and Last Name
   - Email Address (validated)
   - Phone Number
   - Country (optional)
   - Full Postal Address (optional)
   - Custom Payment Amount (required)

3. **Smart Form Validation**
   - Shows validation message when form is incomplete
   - PayPal button only appears when ALL required fields are filled
   - Real-time validation feedback

4. **PayPal Integration**
   - Official PayPal JavaScript SDK
   - Secure payment processing
   - Dynamic amount based on user input
   - Transaction ID and Order ID capture

5. **Automated Email Confirmation**
   - Professional HTML email template
   - Includes all client and payment details
   - Sent automatically after successful payment
   - Uses Hostinger SMTP

6. **Sanity Backend Storage**
   - New "Special Registrations" schema
   - Stores all client and payment data
   - Table view in Sanity Studio
   - Tracks email delivery status

7. **Thank You Page**
   - Displays all payment details
   - Shows transaction ID and order ID
   - Printable receipt
   - Return to home button

---

## File Structure

### Frontend Files

```
nextjs-frontend/src/app/
├── vip-payment/
│   ├── page.tsx                          # Main VIP payment form page
│   └── thank-you/
│       └── page.tsx                      # Thank you/confirmation page
├── api/
│   └── vip-payment/
│       ├── process/
│       │   └── route.ts                  # Payment processing API
│       └── conferences/
│           └── route.ts                  # Conference fetching API
└── services/
    └── vipEmailService.ts                # Email service for confirmations
```

### Backend Files (Sanity)

```
SanityBackend/
└── schemaTypes/
    ├── specialRegistration.ts            # VIP registration schema
    └── index.ts                          # Updated to include new schema
```

### Configuration Files

```
nextjs-frontend/
└── .env.local                            # Environment variables (updated)
```

---

## User Flow

### Step-by-Step Process

1. **User lands on VIP payment page** (`/vip-payment`)
   - Sees form with validation message
   - Conference dropdown loads dynamically

2. **User fills in form**
   - Selects conference from dropdown
   - Enters title, name, email, phone
   - Optionally adds country and address
   - Enters custom payment amount

3. **Form validation**
   - System checks all required fields
   - Validation message disappears when complete
   - PayPal button appears

4. **PayPal payment**
   - User clicks "Proceed to Pay"
   - PayPal SDK loads payment interface
   - User completes payment

5. **Backend processing**
   - Payment data sent to `/api/vip-payment/process`
   - Registration saved to Sanity
   - Confirmation email sent

6. **Thank you page** (`/vip-payment/thank-you`)
   - Shows all client information
   - Displays payment details
   - Shows transaction ID
   - Provides print option

---

## Technical Implementation

### 1. Sanity Schema (`specialRegistration.ts`)

**Fields:**
- `clientName` (string, required)
- `title` (string, required) - Mr/Ms/Mrs/Prof/Dr
- `firstName` (string)
- `lastName` (string)
- `email` (string, required, validated)
- `phoneNumber` (string, required)
- `country` (string)
- `postalAddress` (text)
- `conferenceSelected` (reference to conferenceEvent, required)
- `paymentAmount` (number, required)
- `currency` (string) - USD/EUR/GBP
- `paypalTransactionId` (string, read-only)
- `paypalOrderId` (string, read-only)
- `paymentStatus` (string) - pending/completed/failed/refunded
- `registrationDate` (datetime, required)
- `paymentDate` (datetime)
- `emailSent` (boolean)
- `emailSentDate` (datetime)
- `notes` (text) - Internal notes

**Preview Configuration:**
- Shows client name, email, phone, amount, status
- Displays conference name and transaction ID
- Formatted date display

**Orderings:**
- Registration Date (newest/oldest)
- Payment Amount (highest first)
- Client Name (A-Z)

### 2. VIP Payment Page (`vip-payment/page.tsx`)

**Key Features:**
- Dynamic conference fetching from API
- Real-time form validation
- Conditional PayPal button rendering
- PayPal SDK integration
- Payment processing and redirect

**State Management:**
```typescript
- conferences: Conference[]
- loading: boolean
- processing: boolean
- paypalLoaded: boolean
- formData: FormData
```

**Validation Logic:**
```typescript
isFormValid() {
  return title && firstName && lastName && 
         email && phoneNumber && conferenceId && 
         paymentAmount > 0
}
```

### 3. API Routes

#### `/api/vip-payment/conferences` (GET)
- Fetches all conferences from Sanity
- Returns conference ID, title, dates, location
- Sorted by start date (descending)

#### `/api/vip-payment/process` (POST)
- Receives client data, payment data, conference data
- Creates registration document in Sanity
- Sends confirmation email
- Updates email status
- Returns success/failure response

### 4. Email Service (`vipEmailService.ts`)

**Configuration:**
- SMTP Host: smtp.hostinger.com
- Port: 465 (SSL)
- From: contactus@intelliglobalconferences.com

**Email Template:**
- Professional HTML design
- Gradient header with success message
- Client information section
- Conference details section
- Payment details with transaction ID
- Next steps guidance
- Footer with contact information

### 5. Thank You Page (`vip-payment/thank-you/page.tsx`)

**Features:**
- Receives data via URL parameters
- Displays all client information
- Shows payment details
- Provides print functionality
- Return to home link

---

## Configuration

### Environment Variables

All credentials are stored in `nextjs-frontend/.env.local`:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=99kpz7t0
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=sk9AT29IvzRfmgY689QmLwq0DjIvPznQlIyXqLgsS3x1heb7HMZnYQvVzdvsOKaW96yBW6At143GLei8Ss9eXEe2DdxrS4Gop6KAP3tbTbGYXC8m2mq3D9UHRloFdDQbvEmF2ZKqkE9wd3NbD1q5an7vIqLzCpY80BkM0LfAYZBVLZg86cES

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AUmI5g_PA8vHr0HSeZq7PukrblnMLeOLQbW60lNHoJGLAqTg3JZjAeracZmAh1WSuuqmZnUIJxLdzGXc
PAYPAL_CLIENT_SECRET=EMzGihvUsifDMxblEl3j9CGXLbOACaFsC8ykdBwMv3gK8f_a5S7NulJ9sSqe4atrt2d_2bCo7TBZ6x01

# SMTP Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_USER=contactus@intelliglobalconferences.com
SMTP_PASS=October@2025
SMTP_PORT=465
SMTP_SECURE=true
EMAIL_FROM=contactus@intelliglobalconferences.com
EMAIL_FROM_NAME=Intelli Global Conferences
```

### Dependencies

**Installed Packages:**
```json
{
  "nodemailer": "^6.x.x",
  "@types/nodemailer": "^6.x.x",
  "@sanity/client": "^6.x.x"
}
```

---

## Testing

### Manual Testing Checklist

#### 1. Page Load
- [ ] Navigate to `/vip-payment`
- [ ] Verify page loads without errors
- [ ] Check that validation message is visible
- [ ] Confirm PayPal button is NOT visible initially

#### 2. Conference Dropdown
- [ ] Verify conferences load in dropdown
- [ ] Check that all conferences from Sanity appear
- [ ] Confirm conference selection updates form state

#### 3. Form Validation
- [ ] Fill in only some fields - PayPal button should NOT appear
- [ ] Fill in all required fields - validation message should disappear
- [ ] Verify PayPal button appears when form is complete

#### 4. PayPal Payment
- [ ] Click PayPal button
- [ ] Complete test payment
- [ ] Verify payment processes successfully

#### 5. Backend Processing
- [ ] Check Sanity Studio for new registration
- [ ] Verify all fields are populated correctly
- [ ] Confirm email sent status is updated

#### 6. Email Confirmation
- [ ] Check email inbox for confirmation
- [ ] Verify all details are correct
- [ ] Check email formatting

#### 7. Thank You Page
- [ ] Verify redirect to thank you page
- [ ] Check all data displays correctly
- [ ] Test print functionality
- [ ] Test return to home link

### Test Payment Data

Use PayPal Sandbox for testing:
- **Test Email:** Use PayPal sandbox buyer account
- **Test Amount:** Any amount (e.g., $50.00)
- **Test Conference:** Select any from dropdown

---

## Sanity Studio

### Accessing Special Registrations

1. **Open Sanity Studio:** http://localhost:3333/
2. **Navigate to:** "Special Registrations (VIP Clients)" in sidebar
3. **View registrations** in table format

### Table Columns

The Sanity Studio displays registrations with:
- Client Name
- Email
- Phone Number
- Conference
- Amount Paid
- Payment Status
- Transaction ID
- Registration Date

### Filtering and Sorting

Available sort options:
- Registration Date (Newest First) - Default
- Registration Date (Oldest First)
- Payment Amount (Highest First)
- Client Name (A-Z)

---

## Troubleshooting

### Common Issues

#### 1. PayPal Button Not Appearing
**Cause:** Form validation not passing
**Solution:** Ensure all required fields are filled

#### 2. Email Not Sending
**Cause:** SMTP configuration issue
**Solution:** Check environment variables in `.env.local`

#### 3. Conferences Not Loading
**Cause:** Sanity API connection issue
**Solution:** Verify Sanity credentials and project ID

#### 4. Payment Processing Fails
**Cause:** API route error
**Solution:** Check browser console and server logs

### Debug Steps

1. **Check Browser Console:**
   ```
   F12 → Console tab
   Look for errors or warnings
   ```

2. **Check Server Logs:**
   ```
   Terminal running `npm run dev`
   Look for API route errors
   ```

3. **Verify Environment Variables:**
   ```bash
   # In nextjs-frontend directory
   cat .env.local
   ```

4. **Test API Routes:**
   ```bash
   # Test conference fetching
   curl http://localhost:3000/api/vip-payment/conferences
   ```

---

## URLs

### Development URLs

- **VIP Payment Page:** http://localhost:3000/vip-payment
- **Thank You Page:** http://localhost:3000/vip-payment/thank-you
- **Sanity Studio:** http://localhost:3333/
- **API - Conferences:** http://localhost:3000/api/vip-payment/conferences
- **API - Process Payment:** http://localhost:3000/api/vip-payment/process (POST)

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **Environment Variables:** Never commit `.env.local` to version control
2. **API Tokens:** Keep Sanity API token secure
3. **PayPal Credentials:** Use sandbox for testing, production for live
4. **SMTP Password:** Rotate regularly
5. **Email Validation:** Always validate email addresses
6. **Amount Validation:** Ensure positive numbers only

---

## Future Enhancements

Potential improvements:
- [ ] Add currency selection (USD, EUR, GBP)
- [ ] Support multiple payment methods (Stripe, etc.)
- [ ] Add PDF receipt generation
- [ ] Implement admin notification emails
- [ ] Add payment refund functionality
- [ ] Create analytics dashboard
- [ ] Add multi-language support

---

## Support

For issues or questions:
- **Email:** contactus@intelliglobalconferences.com
- **Sanity Dashboard:** https://www.sanity.io/manage/project/99kpz7t0
- **PayPal Dashboard:** https://www.paypal.com/businessmanage/

---

**Documentation Version:** 1.0  
**Last Updated:** October 24, 2025  
**Status:** ✅ Production Ready

