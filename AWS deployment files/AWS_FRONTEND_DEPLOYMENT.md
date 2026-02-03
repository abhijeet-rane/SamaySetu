# Deploy React Frontend on AWS Amplify

## Overview

AWS Amplify provides:
- ✅ **Free hosting** for static sites (1000 build minutes/month, 15GB storage)
- ✅ **Auto-deployment** from GitHub on every push
- ✅ **HTTPS** with free SSL certificate
- ✅ **CDN** for fast global delivery
- ✅ **Custom domain** support (optional)

**Total time:** 15-20 minutes

---

## Prerequisites

- ✅ Backend deployed and working at: `http://samaysetu-alb-1476674973.ap-south-1.elb.amazonaws.com`
- ✅ Frontend code in GitHub repository
- ✅ AWS account with Amplify access

---

## Part 1: Update Frontend Configuration (5 min)

### Step 1: Update Environment Variables

Update `Frontend/.env.production`:

```env
VITE_API_BASE_URL=http://samaysetu-alb-1476674973.ap-south-1.elb.amazonaws.com
```

### Step 2: Verify Build Configuration

Check `Frontend/package.json` has build script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### Step 3: Test Build Locally

```bash
cd Frontend
npm install
npm run build
```

Verify `Frontend/dist` folder is created with your built files.

### Step 4: Commit and Push

```bash
git add Frontend/.env.production
git commit -m "Update frontend API URL for production"
git push origin main
```

---

## Part 2: Deploy on AWS Amplify (10 min)

### Step 1: Open AWS Amplify Console

1. Go to **AWS Console** → Search for **"Amplify"**
2. Click **"Get Started"** under "Amplify Hosting"
3. Or click **"New app"** → **"Host web app"**

### Step 2: Connect Repository

1. **Select repository service:** GitHub
2. Click **"Continue"**
3. **Authorize AWS Amplify** to access your GitHub (if first time)
4. **Select repository:** Choose your `samaysetu` repository
5. **Select branch:** `main`
6. Click **"Next"**

### Step 3: Configure Build Settings

**App name:** `samaysetu-frontend`

**Build and test settings:** Amplify will auto-detect your framework. Update the configuration:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd Frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: Frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - Frontend/node_modules/**/*
```

**Important settings:**
- **Base directory:** Leave empty (or set to `Frontend` if Amplify asks)
- **Build command:** `npm run build`
- **Output directory:** `dist`

### Step 3.5: Add Environment Variables (IMPORTANT!)

Before clicking "Next", scroll down to **"Advanced settings"** and expand it.

**Add environment variable:**
- **Key:** `VITE_API_BASE_URL`
- **Value:** `http://samaysetu-alb-1476674973.ap-south-1.elb.amazonaws.com`

Click **"Add variable"** if you need to add more environment variables.

**Why this is needed:** Vite uses environment variables prefixed with `VITE_` at build time. Amplify needs to know this value during the build process.

Click **"Next"**

### Step 4: Review and Deploy

1. Review all settings
2. Click **"Save and deploy"**

**Amplify will now:**
- Provision resources (1-2 min)
- Build your app (3-5 min)
- Deploy to CDN (1-2 min)

**Total deployment time:** 5-8 minutes

### Step 5: Get Your Frontend URL

Once deployment completes:
1. You'll see a URL like: `https://main.d1a2b3c4d5e6f7.amplifyapp.com`
2. Click on it to open your deployed frontend
3. **Copy this URL** - this is your production frontend URL

---

## Alternative: Set Environment Variables After Deployment

If you already deployed without setting the environment variable:

1. **Amplify Console** → Your app → **"Environment variables"** (left sidebar)
2. Click **"Manage variables"**
3. Add variable:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `http://samaysetu-alb-1476674973.ap-south-1.elb.amazonaws.com`
4. Click **"Save"**
5. Go to **"Deployments"** → Click **"Redeploy this version"**

---

## Part 3: Configure CORS on Backend (5 min)

Your backend needs to allow requests from the Amplify URL.

### Step 1: Update Backend CORS Configuration

Update `Backend/src/main/java/com/College/timetable/Configuration/SecurityConfig.java`:

Find the `corsConfigurationSource()` method and update:

```java
private UrlBasedCorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration conf = new CorsConfiguration();
    
    // Add your Amplify URL
    conf.setAllowedOriginPatterns(List.of(
        "*",  // For development
        "https://*.amplifyapp.com",  // For Amplify deployments
        "https://your-custom-domain.com"  // If you add custom domain later
    ));
    
    conf.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
    conf.setAllowedHeaders(List.of("*"));
    conf.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/**", conf);
    return src;
}
```

### Step 2: Commit and Push

```bash
git add Backend/src/main/java/com/College/timetable/Configuration/SecurityConfig.java
git commit -m "Update CORS for Amplify frontend"
git push origin main
```

GitHub Actions will automatically deploy the updated backend (5-8 minutes).

---

## Part 4: Test Your Deployment

### Step 1: Open Your Frontend

Visit your Amplify URL: `https://main.xxxxxx.amplifyapp.com`

### Step 2: Test Features

1. **Login page** should load
2. **Try to login** with test credentials
3. **Check browser console** for any errors
4. **Test API calls** - they should work

### Step 3: Check Network Tab

1. Open browser DevTools → Network tab
2. Try logging in
3. Verify API calls go to: `http://samaysetu-alb-1476674973.ap-south-1.elb.amazonaws.com`
4. Check for CORS errors (should be none)

---

## Part 5: Enable HTTPS for Backend (Optional but Recommended)

Your frontend is HTTPS but backend is HTTP. Browsers may block mixed content.

### Quick Fix: Use AWS Certificate Manager + ALB

1. **Get a domain name** (from Route 53, GoDaddy, etc.)
2. **Request SSL certificate** in AWS Certificate Manager
3. **Add HTTPS listener** to your Application Load Balancer
4. **Update frontend** to use `https://your-backend-domain.com`

**For now, you can:**
- Use HTTP backend (works but shows warnings)
- Or follow the HTTPS setup guide later

---

## Part 6: Automatic Deployments

### How It Works

Every time you push to `main` branch:
1. **Frontend:** Amplify automatically rebuilds and deploys (3-5 min)
2. **Backend:** GitHub Actions rebuilds and deploys to EC2 (5-8 min)

### Test Automatic Deployment

1. Make a small change to frontend (e.g., update a text)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin main
   ```
3. Watch Amplify Console for build progress
4. Once complete, refresh your Amplify URL to see changes

---

## Troubleshooting

### Issue 1: Build Fails on Amplify

**Error:** "npm: command not found" or "node: command not found"

**Fix:** Update build settings to specify Node version:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 18
        - cd Frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: Frontend/dist
    files:
      - '**/*'
```

### Issue 2: API Calls Fail (CORS Error)

**Error:** "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Fix:** 
1. Verify backend CORS configuration includes your Amplify URL
2. Redeploy backend
3. Clear browser cache and try again

### Issue 3: Environment Variables Not Working

**Error:** API calls go to wrong URL

**Fix:** 
1. Check `Frontend/.env.production` has correct URL
2. Rebuild: `npm run build` locally to verify
3. Commit and push to trigger Amplify rebuild

### Issue 4: 404 on Page Refresh

**Error:** Refreshing any page except home shows 404

**Fix:** Add redirect rules in Amplify:

1. Amplify Console → Your app → **"Rewrites and redirects"**
2. Click **"Edit"**
3. Add rule:
   - Source: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`
   - Target: `/index.html`
   - Type: `200 (Rewrite)`
4. Save

---

## Cost Estimate

### AWS Amplify (Frontend)
- **Free tier:** 1000 build minutes/month, 15GB storage, 15GB bandwidth
- **After free tier:** ~$0.01 per build minute, $0.023/GB storage
- **Estimated:** $0-5/month (well within free tier for small projects)

### Total Monthly Cost
- **Backend (EC2 + ALB):** ~$15-20/month (free tier: $0 for 12 months)
- **Frontend (Amplify):** $0-5/month
- **Database (Supabase):** $0 (free tier)
- **Total:** $15-25/month (or $0 during AWS free tier)

---

## Summary

✅ **Frontend deployed** on AWS Amplify with HTTPS  
✅ **Backend deployed** on AWS EC2 with Auto Scaling  
✅ **Auto-deployment** configured for both  
✅ **Load balancing** and health checks working  
✅ **Database** connected via Supabase  

### Your Production URLs:
- **Frontend:** `https://main.xxxxxx.amplifyapp.com`
- **Backend:** `http://samaysetu-alb-1476674973.ap-south-1.elb.amazonaws.com`

### Next Steps:
1. ✅ Test all features on production
2. ✅ Set up custom domain (optional)
3. ✅ Enable HTTPS for backend (recommended)
4. ✅ Set up monitoring and alerts
5. ✅ Configure backup strategy

---

## Need Help?

- **Amplify build logs:** Amplify Console → Your app → Build history → Click on build
- **Backend logs:** EC2 → Instances → Connect → `sudo journalctl -u samaysetu -n 100`
- **Load balancer health:** EC2 → Target Groups → samaysetu-tg → Targets tab

**Your deployment is complete!** 🎉
