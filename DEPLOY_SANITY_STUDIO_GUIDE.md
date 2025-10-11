# 🚀 Deploy Sanity Studio as "Intelli-Vizax" - Guide

**Project ID:** 80vqb77v  
**Desired Studio Name:** Intelli-Vizax  
**Issue:** Hostname "intelliglobalconferences" is already taken

---

## ✅ Code Changes Completed

### 1. **Updated Sanity Configuration**
File: `SanityBackend/sanity.config.ts`
```typescript
export default defineConfig({
  name: 'default',
  title: 'Intelli-Vizax',  // ✅ Updated from 'Eventapp'
  projectId: '80vqb77v',
  dataset: 'production',
  apiVersion: '2023-05-05',  // ✅ Updated
  // ... rest of config
})
```

### 2. **Updated Package.json**
File: `SanityBackend/package.json`
```json
{
  "name": "intelli-vizax",  // ✅ Updated from 'eventapp'
  "version": "1.0.0",
  // ... rest of package.json
}
```

### 3. **Build Completed**
```bash
✅ npm run build
✅ Build successful (5993ms)
```

---

## ⚠️ Deployment Issue

The automatic hostname "intelliglobalconferences" is already taken by another project.

**Error Message:**
```
✗ Studio hostname "intelliglobalconferences" is already taken
```

---

## 🔧 Solution: Manual Hostname Setup

You need to manually set the studio hostname through the Sanity management interface.

### **Option 1: Set Hostname via Sanity Management (Recommended)**

1. **Open Sanity Management:**
   ```bash
   npx sanity manage
   ```
   Or visit: https://www.sanity.io/manage/project/80vqb77v

2. **Navigate to Settings:**
   - Click on "Settings" in the left sidebar
   - Look for "Studio" or "Hosting" section

3. **Set Custom Hostname:**
   - Find the "Studio hostname" field
   - Enter one of these suggested hostnames:
     - `intelli-vizax`
     - `intelli-vizax-studio`
     - `intelliglobal-vizax`
     - `vizax-intelli`
     - `intelli-conferences-vizax`

4. **Save the hostname**

5. **Deploy the Studio:**
   ```bash
   cd SanityBackend
   npm run deploy
   ```

---

### **Option 2: Try Different Hostnames via CLI**

Since the CLI doesn't allow specifying hostname directly, we need to try different approaches:

**Try these commands in order:**

```bash
# Navigate to SanityBackend
cd SanityBackend

# Try deploy (it will prompt for hostname if needed)
npx sanity deploy

# If it asks for a hostname, try these in order:
# 1. intelli-vizax
# 2. intelli-vizax-studio  
# 3. vizax-studio
# 4. intelliglobal-vizax
# 5. intelli-conferences-2025
```

---

## 📋 Suggested Hostnames (in order of preference)

1. ✅ **intelli-vizax** → https://intelli-vizax.sanity.studio
2. ✅ **intelli-vizax-studio** → https://intelli-vizax-studio.sanity.studio
3. ✅ **vizax-intelli** → https://vizax-intelli.sanity.studio
4. ✅ **intelliglobal-vizax** → https://intelliglobal-vizax.sanity.studio
5. ✅ **intelli-conferences-vizax** → https://intelli-conferences-vizax.sanity.studio

---

## 🎯 After Successful Deployment

Once the hostname is set and deployment is successful, you will see:

```
✓ Deploying to https://[your-hostname].sanity.studio
✓ Deployment complete!
```

### **Access Your Studio:**
- **URL:** https://[your-hostname].sanity.studio
- **Local Dev:** http://localhost:3333/
- **Project Dashboard:** https://www.sanity.io/manage/project/80vqb77v

---

## 🔍 Verification Steps

After deployment:

1. **Visit the deployed URL:**
   ```
   https://[your-hostname].sanity.studio
   ```

2. **Verify the title:**
   - The studio should show "Intelli-Vizax" as the title
   - Not "Eventapp" (old name)

3. **Check content:**
   - All 112 documents should be visible
   - All 77 images should be accessible
   - Conference events should be editable

---

## 📝 Current Status

- ✅ **Code Updated:** Studio title changed to "Intelli-Vizax"
- ✅ **Package Updated:** Package name changed to "intelli-vizax"
- ✅ **Build Completed:** Studio built successfully
- ⏳ **Deployment Pending:** Waiting for hostname setup
- ⏳ **Hostname:** Needs to be set manually

---

## 🆘 Troubleshooting

### **If hostname is still taken:**
1. Try adding numbers: `intelli-vizax-2025`, `intelli-vizax-v2`
2. Try variations: `vizax-conferences`, `intelli-global-vizax`
3. Contact Sanity support to release the old hostname if you own it

### **If deployment fails:**
```bash
# Rebuild and try again
cd SanityBackend
npm run build
npm run deploy
```

### **If you need to change the title again:**
Edit `SanityBackend/sanity.config.ts` and change the `title` field.

---

## 📞 Next Steps

1. **Set the hostname** via Sanity management interface
2. **Deploy the studio** using `npm run deploy`
3. **Verify deployment** by visiting the studio URL
4. **Update documentation** with the final studio URL

---

**Last Updated:** October 11, 2025  
**Status:** Ready for deployment (pending hostname setup)

