# Google Maps Integration Setup Guide

## 🗺️ Overview

This guide will help you set up Google Maps integration for displaying conference locations on your website.

## 📋 Prerequisites

- Google Cloud Platform account
- Credit card for Google Cloud (required for API access, but you get $200 free credits)
- Sanity CMS access

## 🔧 Step 1: Get Google Maps API Key

### 1.1 Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select an existing project
3. Give your project a name (e.g., "Conference Website Maps")

### 1.2 Enable Required APIs
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - **Maps JavaScript API** (required for map display)
   - **Places API** (optional, for better location data)
   - **Geocoding API** (optional, for address-to-coordinates conversion)

### 1.3 Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. Click "Restrict Key" to secure it

### 1.4 Restrict API Key (Recommended)
1. Under "Application restrictions":
   - Choose "HTTP referrers (web sites)"
   - Add your domains:
     - `http://localhost:3000/*` (for development)
     - `https://yourdomain.com/*` (for production)
     - `http://icoc04wo0c000ws4kkokgwgk.31.97.203.190.sslip.io/*` (for your current deployment)

2. Under "API restrictions":
   - Choose "Restrict key"
   - Select: Maps JavaScript API, Places API, Geocoding API

## 🔑 Step 2: Configure Environment Variables

### 2.1 Local Development
Add to `nextjs-frontend/.env.local`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 2.2 Production Deployment (Coolify)
Add the environment variable in your Coolify deployment:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## 📍 Step 3: Add Conference Locations

### 3.1 Using the Population Script
```bash
# Set your Sanity API token
set SANITY_API_TOKEN=your_sanity_token_here

# Run the population script
node populate-google-maps-locations.js
```

### 3.2 Manual Entry via Sanity Studio
1. Start Sanity Studio: `cd SanityBackend && npm run dev`
2. Visit http://localhost:3333
3. Look for "Conference Location (Google Maps)" in the content types
4. Click "Create" to add new locations

### 3.3 Required Fields
- **Location Name**: e.g., "London, UK"
- **Full Address**: Complete address for geocoding
- **Description**: Optional details about the location
- **Show on Map**: Toggle to display/hide
- **Display Order**: Number for sorting (lower = first)

### 3.4 Optional Fields
- **Google Places ID**: For more accurate location data
- **Latitude/Longitude**: Manual coordinates (auto-generated if not provided)
- **Marker Color**: Custom color for the map marker

## 🚀 Step 4: Test the Integration

### 4.1 Start Development Server
```bash
cd nextjs-frontend
npm run dev
```

### 4.2 Visit Your Website
- Go to http://localhost:3000
- Scroll down to the "Our Global Presence" section
- You should see an interactive Google Map with markers

### 4.3 Verify Functionality
- ✅ Map loads without errors
- ✅ Location markers appear
- ✅ Clicking markers shows info windows
- ✅ Map is responsive on mobile devices

## 🔍 Troubleshooting

### Common Issues

#### 1. "Google Maps JavaScript API error: RefererNotAllowedMapError"
**Solution**: Add your domain to the API key restrictions in Google Cloud Console

#### 2. Map shows gray area with "For development purposes only"
**Solution**: 
- Check if your API key is correct
- Ensure billing is enabled in Google Cloud
- Verify the Maps JavaScript API is enabled

#### 3. No markers appear on map
**Solution**:
- Check if locations are marked as "active" in Sanity
- Verify addresses are valid
- Check browser console for geocoding errors

#### 4. API quota exceeded
**Solution**:
- Check your Google Cloud usage
- Consider implementing request caching
- Optimize marker loading

### Debug Steps
1. Open browser developer tools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed API requests
4. Verify environment variables are loaded

## 💰 Pricing Information

### Google Maps Pricing (as of 2024)
- **Maps JavaScript API**: $7 per 1,000 requests
- **Places API**: $17 per 1,000 requests  
- **Geocoding API**: $5 per 1,000 requests

### Free Tier
- $200 monthly credit (covers ~28,500 map loads)
- Perfect for most small to medium websites

### Cost Optimization Tips
1. Implement map caching
2. Use static coordinates when possible
3. Limit API calls during development
4. Monitor usage in Google Cloud Console

## 🎨 Customization Options

### Map Styling
Edit `GoogleMapsLocations.tsx` to customize:
- Map theme/colors
- Marker icons and colors
- Info window content
- Zoom levels and bounds

### Marker Colors
Available in Sanity CMS:
- Orange (default)
- Red, Blue, Green, Purple
- Custom hex colors

### Mobile Optimization
The component includes:
- Responsive map sizing
- Touch-friendly controls
- Mobile location list fallback

## 📚 Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)

## 🆘 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review browser console errors
3. Verify API key configuration
4. Test with sample data first

The Google Maps integration provides a professional, interactive way to showcase your global conference presence!
