# How to Update Your Deployed App on Vercel

## Quick Update Guide

Since you've already deployed your app to Vercel, updating it is very simple! Vercel automatically redeploys whenever you push changes to your GitHub repository.

## Step-by-Step Update Process

### 1. **Commit Your Changes**

First, make sure all your changes are committed to Git:

```bash
git add .
git commit -m "Fix deployment issues and update search functionality"
```

### 2. **Push to GitHub**

Push your changes to the main branch:

```bash
git push origin main
```

### 3. **Automatic Deployment**

That's it! Vercel will automatically:

- Detect the push to your repository
- Start a new build
- Deploy the updated version

You can watch the deployment progress at: https://vercel.com/dashboard

### 4. **Monitor the Deployment**

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project (Ecrito)
3. You'll see the deployment status:
   - 🟡 **Building** - Currently building your app
   - ✅ **Ready** - Successfully deployed
   - ❌ **Error** - Build failed (check logs)

### 5. **Check the Live Site**

Once deployment is complete (usually 1-2 minutes), visit your live URL to see the changes.

---

## What We Fixed

### ✅ Dependency Conflicts Resolved

We added the `overrides` section to `package.json` to fix the React 19 peer dependency issue:

```json
"overrides": {
  "react-joyride": {
    "react": "$react",
    "react-dom": "$react-dom"
  },
  "react-floater": {
    "react": "$react",
    "react-dom": "$react-dom"
  }
}
```

This ensures that `npm install` succeeds on Vercel's build servers.

### ✅ Search Functionality Restored

The search page should now work properly. The search actions have been restored and will:

- Search blogs by title, content, and excerpt
- Filter by authors and tags
- Display trending topics when search is empty
- Show beautiful empty states

---

## Troubleshooting Deployment Issues

### If Build Fails

1. **Check the Build Logs**:

   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the failed deployment
   - Click "View Build Logs"

2. **Common Issues**:
   - **Missing Environment Variables**: Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set
   - **TypeScript Errors**: Fix any type errors shown in logs
   - **Dependency Issues**: Check if all packages installed correctly

### If Site Loads But Features Don't Work

1. **Check Environment Variables**:

   - Go to Project Settings → Environment Variables
   - Verify all required variables are set
   - After adding/changing variables, trigger a redeploy

2. **Check Browser Console**:
   - Open your deployed site
   - Press F12 to open Developer Tools
   - Check Console tab for errors

### Force a Redeploy

If you need to redeploy without making code changes:

**Option 1: Via Dashboard**

1. Go to Vercel Dashboard → Your Project
2. Click on the latest deployment
3. Click the "..." menu → "Redeploy"

**Option 2: Via CLI**

```bash
npx vercel --prod
```

---

## Manual Deployment (Alternative Method)

If you prefer to deploy manually instead of automatic GitHub integration:

```bash
# Install Vercel CLI globally (one time only)
npm install -g vercel

# Deploy to production
vercel --prod
```

---

## Checking Deployment Status

### Via Dashboard

- URL: https://vercel.com/dashboard
- Shows all deployments with status
- Click any deployment to see logs

### Via CLI

```bash
# List recent deployments
vercel ls

# Check specific deployment
vercel inspect [deployment-url]
```

---

## Environment Variables

Make sure these are set in Vercel:

1. Go to: Project Settings → Environment Variables
2. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon key

**Important**: After adding/changing environment variables, you must redeploy for changes to take effect.

---

## Deployment Checklist

Before pushing to production:

- [ ] All changes committed to Git
- [ ] `npm run build` succeeds locally
- [ ] Environment variables set in Vercel
- [ ] Database migrations applied (if any)
- [ ] Tested locally with `npm run dev`

After deployment:

- [ ] Check deployment status in Vercel Dashboard
- [ ] Visit live site and test key features
- [ ] Check browser console for errors
- [ ] Test authentication (login/signup)
- [ ] Test search functionality
- [ ] Test creating/editing blogs

---

## Quick Commands Reference

```bash
# Commit and push changes
git add .
git commit -m "Your commit message"
git push origin main

# Manual deployment
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

---

## Need Help?

If you encounter issues:

1. **Check Build Logs**: Most issues are visible in the build logs
2. **Verify Environment Variables**: Missing env vars cause many issues
3. **Test Locally First**: Run `npm run build` locally to catch errors early
4. **Check Supabase Connection**: Verify your Supabase credentials are correct

---

## Summary

**To update your deployed app:**

1. Make your changes locally
2. Commit: `git add . && git commit -m "message"`
3. Push: `git push origin main`
4. Wait 1-2 minutes for automatic deployment
5. Check your live site!

That's it! Vercel handles everything else automatically. 🚀
