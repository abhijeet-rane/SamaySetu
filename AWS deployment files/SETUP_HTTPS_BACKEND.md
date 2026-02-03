# Setup HTTPS for Backend using CloudFront

## Problem
Your frontend (HTTPS) cannot call your backend (HTTP) due to browser security (Mixed Content blocking).

## Solution
Use AWS CloudFront as an HTTPS proxy in front of your Application Load Balancer.

**Time:** 20 minutes  
**Cost:** Free (within AWS free tier)

---

## Step-by-Step Guide

### Step 1: Create CloudFront Distribution (10 min)

1. **Go to AWS Console → CloudFront**
2. Click **"Create distribution"**

#### Origin Settings:

**Origin domain:**
- Paste: `samaysetu-alb-1476674973.ap-south-1.elb.amazonaws.com`
- Do NOT select from dropdown, just paste it

**Protocol:**
- Select: `HTTP only`

**HTTP port:** `80`

**Name:** `samaysetu-backend-origin` (auto-filled)

#### Default cache behavior:

**Path pattern:** `Default (*)`

**Compress objects automatically:** `Yes`

**Viewer protocol policy:**
- Select: `Redirect HTTP to HTTPS` ✓

**Allowed HTTP methods:**
- Select: `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE` ✓

**Cache policy:**
- Select: `CachingDisabled` ✓
- (This is CRITICAL for API - we don't want to cache API responses)

**Origin request policy:**
- Select: `AllViewer` ✓
- (This forwards all headers, query strings, and cookies)

**Response headers policy:**
- Select: `SimpleCORS` ✓

#### Settings:

**Price class:**
- Select: `Use only North America and Europe` (cheaper)
- Or: `Use all edge locations` (faster globally)

**Alternate domain name (CNAME):** Leave empty for now

**Custom SSL certificate:** Leave as default (CloudFront certificate)

**Supported HTTP versions:** `HTTP/2` ✓

**Default root object:** Leave empty

**Standard logging:** Off (to save costs)

**IPv6:** On ✓

3. Click **"Create distribution"**

### Step 2: Wait for Deployment (5-10 min)

CloudFront will show status: **"Deploying"**

- Refresh the page every minute
- Wait until status changes to: **"Enabled"**
- This takes 5-10 minutes

### Step 3: Get CloudFront URL

Once deployed, you'll see:
- **Distribution domain name:** `d1a2b3c4d5e6f7.cloudfront.net`
- **Copy this URL** ✓

### Step 4: Test CloudFront

Open a new browser tab and test:

```
https://d1a2b3c4d5e6f7.cloudfront.net/actuator/health
```

**Expected response:**
```json
{"status":"UP"}
```

If you get this, CloudFront is working! ✓

### Step 5: Update Amplify Environment Variable

1. **Go to Amplify Console**
2. Select your app: `samaysetu-frontend`
3. Click **"Environment variables"** (left sidebar)
4. Click **"Manage variables"**
5. Find `VITE_API_BASE_URL`
6. Update value to: `https://d1a2b3c4d5e6f7.cloudfront.net` (use YOUR CloudFront URL)
7. Click **"Save"**

### Step 6: Redeploy Frontend

1. Still in Amplify Console
2. Click **"Deployments"** (left sidebar)
3. Find the latest deployment
4. Click **"Redeploy this version"**
5. Wait 3-5 minutes for rebuild

### Step 7: Update Backend CORS

Your backend needs to allow requests from CloudFront.

**Option A: Allow all origins (easiest for now):**

The current CORS config with `*` should work.

**Option B: Specific origins (more secure):**

Update `Backend/src/main/java/com/College/timetable/Configuration/SecurityConfig.java`:

```java
private UrlBasedCorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration conf = new CorsConfiguration();
    
    conf.setAllowedOriginPatterns(List.of(
        "*",  // Allows all origins
        "https://*.amplifyapp.com",
        "https://*.cloudfront.net"
    ));
    
    conf.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
    conf.setAllowedHeaders(List.of("*"));
    conf.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/**", conf);
    return src;
}
```

Commit and push if you made changes.

---

## Step 8: Test Your Application

1. **Open your Amplify URL:** `https://main.d1zrdw1tvru8th.amplifyapp.com`
2. **Go to login page**
3. **Open browser DevTools → Network tab**
4. **Try to login**
5. **Check the API calls:**
   - Should go to: `https://d1a2b3c4d5e6f7.cloudfront.net/auth/login`
   - Should return 200 OK (or 401 if credentials wrong)
   - **NO mixed content errors!** ✓

---

## Troubleshooting

### Issue 1: CloudFront returns 502 Bad Gateway

**Cause:** CloudFront can't reach your ALB

**Fix:**
1. Check ALB is running: EC2 → Load Balancers
2. Check target group has healthy instances
3. Wait a few more minutes for CloudFront to propagate

### Issue 2: CloudFront returns 504 Gateway Timeout

**Cause:** Backend is slow or not responding

**Fix:**
1. Test ALB directly: `http://samaysetu-alb-1476674973.ap-south-1.elb.amazonaws.com/actuator/health`
2. Check EC2 instances are healthy
3. Check application logs: `sudo journalctl -u samaysetu -n 100`

### Issue 3: CORS errors still appear

**Cause:** Backend CORS not configured for CloudFront

**Fix:**
1. Update backend CORS to allow `*.cloudfront.net`
2. Or use `*` to allow all origins (less secure but works)
3. Redeploy backend

### Issue 4: API calls still go to HTTP URL

**Cause:** Frontend not rebuilt with new environment variable

**Fix:**
1. Verify environment variable in Amplify is correct
2. Redeploy frontend
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard refresh (Ctrl+F5)

---

## Verify Everything Works

### Checklist:

- [ ] CloudFront distribution status: "Enabled"
- [ ] CloudFront URL works: `https://YOUR-CF-URL.cloudfront.net/actuator/health` returns `{"status":"UP"}`
- [ ] Amplify environment variable updated to CloudFront URL
- [ ] Frontend redeployed
- [ ] Login page loads without errors
- [ ] Can login successfully
- [ ] No mixed content errors in browser console
- [ ] API calls go to HTTPS CloudFront URL

---

## Architecture After Setup

```
User Browser (HTTPS)
    ↓
Amplify Frontend (HTTPS)
    ↓
CloudFront (HTTPS) ← You are here
    ↓
Application Load Balancer (HTTP)
    ↓
EC2 Instances (HTTP)
    ↓
Supabase Database (PostgreSQL)
```

**Benefits:**
- ✅ End-to-end HTTPS for users
- ✅ No mixed content errors
- ✅ CloudFront CDN caching (for static assets)
- ✅ DDoS protection
- ✅ Free SSL certificate
- ✅ Global edge locations

---

## Cost

**CloudFront Free Tier:**
- 1 TB data transfer out per month
- 10,000,000 HTTP/HTTPS requests per month
- Free for 12 months

**After free tier:**
- ~$0.085 per GB data transfer
- ~$0.0075 per 10,000 requests

**Estimated cost:** $0-5/month (well within free tier for small projects)

---

## Next Steps

Once everything works:

1. ✅ Test all features (login, CRUD operations, etc.)
2. ✅ Monitor CloudFront metrics
3. ✅ Consider adding custom domain
4. ✅ Set up CloudWatch alarms
5. ✅ Configure CloudFront caching for static assets (optional)

---

## Summary

You now have:
- ✅ Frontend on Amplify (HTTPS)
- ✅ Backend on EC2 with Auto Scaling
- ✅ CloudFront providing HTTPS for backend
- ✅ Load balancer distributing traffic
- ✅ Auto-deployment from GitHub
- ✅ Fully working production environment!

**Your production URLs:**
- **Frontend:** `https://main.d1zrdw1tvru8th.amplifyapp.com`
- **Backend (via CloudFront):** `https://YOUR-CF-URL.cloudfront.net`
- **Backend (direct ALB):** `http://samaysetu-alb-1476674973.ap-south-1.elb.amazonaws.com`

🎉 **Deployment Complete!**
