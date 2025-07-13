# 🔧 Coolify Environment Variables Setup

## 🚨 CRITICAL: Set These Environment Variables in Coolify

### **Step 1: Access Coolify Dashboard**
1. Go to your Coolify dashboard
2. Navigate to your project
3. Click on "Environment Variables" tab

### **Step 2: Add Essential Variables**

**REQUIRED - Add these immediately:**
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_SANITY_PROJECT_ID=tq1qdk3m
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
```

### **Step 3: Optional Variables (for full functionality)**

**For Sanity CMS write access:**
```
SANITY_API_TOKEN=your_sanity_token_here
```

**For payment features:**
```
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET_KEY=your_razorpay_secret
```

**For email functionality:**
```
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
FROM_EMAIL=your_from_email
```

### **Step 4: Deployment Settings**

**In Coolify, ensure:**
- **Port**: 3000
- **Build Command**: `docker build -t event-website .`
- **Health Check**: `/api/health`
- **Restart Policy**: `unless-stopped`

### **Step 5: Verify Deployment**

After setting variables:
1. **Redeploy** the application
2. **Check logs** for startup messages
3. **Test health endpoint**: `your-url/api/health`
4. **Access main site**: `your-url/`

## 🔍 Troubleshooting

**If still getting Bad Gateway:**
1. Check Coolify deployment logs
2. Verify all environment variables are set
3. Ensure Docker container is starting
4. Check resource limits (CPU/Memory)

**Success indicators in logs:**
```
🚀 Starting Event Website...
📊 Environment: production
✅ server.js found, starting application...
🎯 Starting Next.js server...
```
