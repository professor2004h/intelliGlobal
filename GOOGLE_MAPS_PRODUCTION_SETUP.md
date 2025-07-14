# Google Maps Production Setup Guide

## 🚨 Removing "For Development Purposes Only" Watermark

The "For development purposes only" watermark appears when:
1. No valid API key is provided
2. Billing is not enabled on your Google Cloud account
3. The API key doesn't have proper permissions
4. You're using a restricted API key on an unauthorized domain

## ✅ Step-by-Step Solution

### 1. Enable Billing in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **Billing** → **Link a billing account**
4. Add a valid payment method (credit card)
5. Enable billing for your project

> **Note**: Google provides $200 monthly credit which covers ~28,500 map loads for most websites.

### 2. Enable Required APIs

In Google Cloud Console, go to **APIs & Services** → **Library** and enable:
- ✅ Maps JavaScript API
- ✅ Places API (if using place search)
- ✅ Geocoding API (if geocoding addresses)

### 3. Configure API Key Properly

#### Create/Update API Key:
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key

#### Set API Key Restrictions (Recommended):
1. Click on your API key to edit
2. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your domains:
     ```
     https://yourdomain.com/*
     https://www.yourdomain.com/*
     http://localhost:3000/*  (for development)
     ```

3. Under **API restrictions**:
   - Select **Restrict key**
   - Choose: Maps JavaScript API, Places API, Geocoding API

### 4. Update Environment Variables

Update your `.env.local` file:

```bash
# Google Maps API Key (REQUIRED for production)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token
```

### 5. Verify Setup

1. Deploy your application
2. Check that the map loads without watermarks
3. Test on mobile devices
4. Monitor usage in Google Cloud Console

## 🔧 Environment Configuration

### Development Environment
```bash
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_development_key
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=development
```

### Production Environment
```bash
# .env.production
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_production_key
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## 💰 Cost Management

### Free Tier Limits
- **$200 monthly credit** from Google
- Covers approximately **28,500 map loads** per month
- Perfect for most small to medium websites

### Optimization Tips
1. **Cache map data** when possible
2. **Use static coordinates** instead of geocoding when you have them
3. **Implement lazy loading** for maps
4. **Monitor usage** in Google Cloud Console
5. **Set billing alerts** to avoid unexpected charges

## 🛠️ Troubleshooting

### Common Issues

#### 1. Map shows gray area
**Solution**: Check API key and billing status

#### 2. "This page can't load Google Maps correctly"
**Solution**: Verify API key restrictions and domain settings

#### 3. Geocoding not working
**Solution**: Enable Geocoding API and check quotas

#### 4. Mobile touch issues
**Solution**: Ensure `gestureHandling: 'cooperative'` is set

### Debug Checklist
- [ ] Billing enabled in Google Cloud
- [ ] Required APIs enabled
- [ ] API key properly configured
- [ ] Domain restrictions set correctly
- [ ] Environment variables loaded
- [ ] No console errors in browser

## 📱 Mobile Optimization Features

The enhanced map component includes:
- ✅ Responsive sizing (400px mobile, 500px+ desktop)
- ✅ Touch-friendly controls
- ✅ Cooperative gesture handling
- ✅ Mobile-optimized info windows
- ✅ Alternative list view for small screens
- ✅ Proper zoom controls

## 🎨 Customization Options

### Marker Colors
Available in Sanity CMS:
- Red, Blue, Green, Yellow, Purple, Orange
- Custom colors via hex codes

### Location Categories
- Office (🏢)
- Conference Center (🏛️)
- Event Venue (🎪)
- Partner Location (🤝)
- Other (📍)

## 📊 Monitoring & Analytics

### Google Cloud Console
1. Monitor API usage
2. Set up billing alerts
3. Track performance metrics
4. Review error logs

### Recommended Alerts
- Set billing alert at $50 (25% of free credit)
- Monitor daily API calls
- Track error rates

## 🚀 Deployment Checklist

Before going live:
- [ ] Production API key configured
- [ ] Billing enabled
- [ ] Domain restrictions set
- [ ] Environment variables updated
- [ ] Map tested on mobile devices
- [ ] Sanity CMS locations added
- [ ] Performance tested
- [ ] Monitoring set up

## 📞 Support

If you continue to see the development watermark after following this guide:
1. Wait 5-10 minutes for changes to propagate
2. Clear browser cache
3. Check Google Cloud Console for any error messages
4. Verify all APIs are enabled and billing is active
5. Test with a fresh incognito/private browser window
