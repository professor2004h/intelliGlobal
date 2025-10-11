# 🚀 Intelli-Vizax Sanity Studio - Quick Reference

## 📍 Studio Access

### Production Studio
**URL:** https://intelli-vizax.sanity.studio/

### Local Development
```bash
cd SanityBackend
npm run dev
```
**URL:** http://localhost:3333/

### Management Console
**URL:** https://www.sanity.io/manage/project/80vqb77v

---

## 🔧 Common Commands

### Development
```bash
cd SanityBackend
npm run dev          # Start development server
npm run build        # Build for production
npm run deploy       # Deploy to Sanity hosting
```

### Windows Batch Scripts
```bash
deploy.bat           # Build and deploy (Windows)
start-server.bat     # Start local server (Windows)
```

---

## 📊 Project Configuration

| Setting | Value |
|---------|-------|
| **Project ID** | 80vqb77v |
| **Dataset** | production |
| **Studio Hostname** | intelli-vizax |
| **App ID** | rjzxyvu2ny8ddn5f5nfcpml9 |
| **Studio Title** | Intelli-Vizax |
| **Package Name** | intelli-vizax |

---

## 📁 Key Files

### Configuration Files
- `sanity.config.ts` - Main studio configuration
- `sanity.cli.ts` - CLI and deployment settings
- `package.json` - Dependencies and scripts
- `deskStructure.js` - Custom desk organization

### Schema Files (in `schemaTypes/`)
- `conferenceEvent.ts` - Conference events
- `sponsorshipTiers.ts` - Sponsorship packages
- `paymentTransaction.ts` - Payment records
- `siteSettings.ts` - Global site settings
- `heroSection.ts` - Hero sections
- `testimonialsSection.ts` - Testimonials
- `galleryPage.ts` - Gallery pages
- And more...

---

## 🔄 Deployment Process

### Quick Deploy
```bash
cd SanityBackend
npm run deploy
```

### Full Deploy (with build)
```bash
cd SanityBackend
npm run build
npm run deploy
```

### Manual Deploy (if needed)
```bash
cd SanityBackend
npx sanity deploy
# Enter hostname when prompted: intelli-vizax
```

---

## 🌐 Frontend Integration

The Next.js frontend is configured to connect to this Sanity project:

**File:** `nextjs-frontend/src/app/sanity/client.ts`

```typescript
const projectId = "80vqb77v";
const dataset = "production";
const apiVersion = "2023-05-03";
```

---

## 🔐 Authentication

### Login to Sanity CLI
```bash
npx sanity login
```

### Check Current User
```bash
npx sanity whoami
```

### Logout
```bash
npx sanity logout
```

---

## 📦 Content Types

The studio manages the following content types:

1. **Conference Events** - Event details, dates, locations
2. **Past Conferences** - Historical conference data
3. **Sponsorship Tiers** - Sponsorship packages and pricing
4. **Payment Transactions** - Payment records
5. **Sponsor Registrations** - Sponsor sign-ups
6. **Hero Sections** - Homepage hero content
7. **Testimonials** - Customer testimonials
8. **Gallery Pages** - Image galleries
9. **Site Settings** - Global configuration
10. **Custom Content Sections** - Flexible content blocks

---

## 🛠️ Troubleshooting

### Studio Not Loading
1. Check if you're logged in: `npx sanity whoami`
2. Verify project ID in `sanity.config.ts`
3. Clear browser cache and reload

### Build Errors
```bash
# Reinstall dependencies
cd SanityBackend
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
npm run build
```

### Deploy Errors
```bash
# Check project info
npx sanity projects list

# Verify hostname
npx sanity deploy --help
```

### CORS Errors
Check CORS configuration in `sanity.config.ts`:
```typescript
cors: {
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    // Add your production domain here
  ],
  credentials: true,
}
```

---

## 📝 Making Schema Changes

1. Edit schema files in `schemaTypes/`
2. Import new schemas in `schemaTypes/index.ts`
3. Test locally: `npm run dev`
4. Deploy changes: `npm run deploy`

Example:
```typescript
// schemaTypes/newSchema.ts
export default {
  name: 'newType',
  title: 'New Type',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    }
  ]
}

// schemaTypes/index.ts
import newSchema from './newSchema'
export const schemaTypes = [newSchema, /* other schemas */]
```

---

## 🔍 Useful Sanity CLI Commands

```bash
# List all projects
npx sanity projects list

# Check project info
npx sanity projects info

# List datasets
npx sanity dataset list

# Export dataset
npx sanity dataset export production backup.tar.gz

# Import dataset
npx sanity dataset import backup.tar.gz production

# List deployed schemas
npx sanity schema list

# Validate schema
npx sanity schema validate
```

---

## 📊 Monitoring & Analytics

### Check Studio Usage
Visit: https://www.sanity.io/manage/project/80vqb77v/usage

### View API Logs
Visit: https://www.sanity.io/manage/project/80vqb77v/api

### Monitor Performance
Visit: https://www.sanity.io/manage/project/80vqb77v/insights

---

## 🔗 Important Links

- **Live Studio:** https://intelli-vizax.sanity.studio/
- **Project Management:** https://www.sanity.io/manage/project/80vqb77v
- **Sanity Documentation:** https://www.sanity.io/docs
- **Sanity Community:** https://snty.link/community
- **GitHub Issues:** https://github.com/sanity-io/sanity/issues

---

## 📞 Support

### Sanity Support
- **Documentation:** https://www.sanity.io/docs
- **Community Slack:** https://snty.link/community
- **GitHub:** https://github.com/sanity-io/sanity

### Project-Specific
- Check `SANITY_DEPLOYMENT_SUCCESS.md` for deployment details
- Review schema files in `schemaTypes/` for content structure
- See `sanity.config.ts` for configuration options

---

## ✅ Quick Checklist

Before deploying:
- [ ] Test locally with `npm run dev`
- [ ] Validate schema changes
- [ ] Build successfully with `npm run build`
- [ ] Check for TypeScript errors
- [ ] Review CORS settings
- [ ] Commit changes to git

After deploying:
- [ ] Verify studio loads at https://intelli-vizax.sanity.studio/
- [ ] Test content creation/editing
- [ ] Check frontend integration
- [ ] Verify API responses
- [ ] Monitor for errors

---

**Last Updated:** October 11, 2025  
**Studio Version:** Sanity 4.10.2  
**Status:** ✅ Deployed and Active

