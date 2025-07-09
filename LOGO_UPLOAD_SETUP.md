# Logo Upload Feature Setup Guide

## Overview
This guide explains how to set up and use the logo upload feature in the Sanity CMS backend for the Intelli Global Conferences website.

## What's Been Added

### 1. Site Settings Schema (`/SanityBackend/schemaTypes/siteSettings.ts`)
A new schema has been created that includes:
- **Site Logo**: Upload field for the main website logo
- **Favicon**: Upload field for the site favicon
- **Site Name**: Text field for the website name
- **Contact Information**: Email, phone, WhatsApp, and address
- **Social Media Links**: LinkedIn, Facebook, Twitter, Instagram
- **SEO Settings**: Meta title, description, and keywords

### 2. Frontend Integration (`/nextjs-frontend/src/app/getSiteSettings.ts`)
- Function to fetch site settings from Sanity
- TypeScript interfaces for type safety
- Helper function to get image URLs from Sanity assets

### 3. Header Component Updates (`/nextjs-frontend/src/app/components/Header.tsx`)
- Dynamic logo display from uploaded image
- Fallback to default logo if no image is uploaded
- Dynamic contact information from site settings
- Dynamic social media links

## How to Use the Logo Upload Feature

### Step 1: Access Sanity Studio
1. Navigate to your Sanity Studio (usually at `http://localhost:3333`)
2. Log in with your Sanity credentials

### Step 2: Create Site Settings Document
1. In the Sanity Studio, look for "Site Settings" in the document types
2. Click "Create new Site Settings" if it doesn't exist
3. Fill in the following fields:

#### Required Fields:
- **Site Name**: Enter "Intelli Global Conferences" or your preferred name

#### Logo Upload:
- **Site Logo**: 
  - Click "Upload" or drag and drop your logo image
  - Recommended size: 200x60px (PNG, JPG, or SVG)
  - Add alternative text for accessibility
- **Favicon**: 
  - Upload a small icon (32x32px recommended)
  - Supports .ico, .png, .jpg, .jpeg, .gif, .svg formats

#### Contact Information:
- **Email**: intelliglobalconferences@gmail.com
- **Phone**: +44 20 4571 8752
- **WhatsApp**: +44 20 4571 8752
- **Address**: 7 Bell Yard, London, WC2A 2JR, United Kingdom

#### Social Media Links:
- **LinkedIn**: Your LinkedIn profile/page URL
- **Facebook**: Your Facebook page URL
- **Twitter**: Your Twitter profile URL
- **Instagram**: Your Instagram profile URL

#### SEO Settings:
- **Meta Title**: Page title for search engines (max 60 characters)
- **Meta Description**: Page description for search engines (max 160 characters)
- **Keywords**: Array of SEO keywords

### Step 3: Publish the Document
1. After filling in all the information, click "Publish"
2. The changes will be immediately available to the frontend

## Logo Requirements and Best Practices

### Logo Specifications:
- **Format**: PNG (recommended), JPG, or SVG
- **Size**: 200x60px (width x height) recommended
- **Background**: Transparent PNG for best results
- **File Size**: Keep under 500KB for optimal loading

### Design Guidelines:
- Ensure the logo is readable at small sizes
- Use high contrast colors
- Test the logo on both light and dark backgrounds
- Consider how it looks on mobile devices

## Troubleshooting

### Logo Not Displaying:
1. Check if the Site Settings document is published
2. Verify the image was uploaded successfully
3. Ensure the image URL is accessible
4. Check browser console for any errors

### Contact Information Not Updating:
1. Verify the Site Settings document is saved and published
2. Clear browser cache and refresh the page
3. Check if the frontend is fetching the latest data

### Mobile Responsiveness Issues:
1. Test on different screen sizes
2. Ensure images are optimized for mobile
3. Check that text is readable on small screens

## File Structure
```
EventNextApp-main/
├── SanityBackend/
│   └── schemaTypes/
│       ├── siteSettings.ts (NEW)
│       └── index.ts (UPDATED)
├── nextjs-frontend/
│   └── src/app/
│       ├── getSiteSettings.ts (NEW)
│       └── components/
│           └── Header.tsx (UPDATED)
└── LOGO_UPLOAD_SETUP.md (THIS FILE)
```

## Next Steps
1. Start the Sanity backend: `cd SanityBackend && npm run dev`
2. Start the Next.js frontend: `cd nextjs-frontend && npm run dev`
3. Access Sanity Studio and upload your logo
4. Test the website to ensure everything works correctly

## Support
If you encounter any issues:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure both backend and frontend servers are running
4. Contact the development team for assistance
