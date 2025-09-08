# 🚀 YouTube Converter - FREE Deployment Guide

Your YouTube converter is now ready for deployment! I've prepared configurations for multiple free hosting platforms. Here are your options:

## 🌟 Recommended: Railway (FREE Tier)
**Best for:** Full-stack apps with binaries like FFmpeg
**Free tier:** 500 hours/month, $5 credit monthly

### Steps:
1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Connect your GitHub account

2. **Deploy from GitHub**
   - Push your code to GitHub repository
   - In Railway: "New Project" → "Deploy from GitHub repo"
   - Select your YouTube converter repository
   - Railway will auto-detect the configuration

3. **Set Environment Variables**
   In Railway dashboard → Variables tab:
   ```
   NODE_ENV=production
   DATABASE_URL=your_neon_database_url
   SESSION_SECRET=your_super_secret_key_here
   ```

4. **Database Setup (NeonDB - FREE)**
   - Go to [neon.tech](https://neon.tech)
   - Create free account and database
   - Copy connection string to `DATABASE_URL`

✅ **Auto-configured:** Dockerfile, FFmpeg, yt-dlp, production builds

---

## 🔥 Alternative: Render (FREE Tier)
**Free tier:** 750 hours/month, auto-sleep after 15min inactivity

### Steps:
1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - New → Web Service → Connect GitHub repo
   - Settings:
     - **Build Command:** `npm run build`
     - **Start Command:** `npm start`
     - **Environment:** Node

3. **Environment Variables**
   ```
   NODE_ENV=production
   DATABASE_URL=your_neon_database_url
   SESSION_SECRET=your_secret_key
   ```

---

## ⚡ Alternative: Vercel (FREE Tier)
**Best for:** Frontend + Serverless functions
**Note:** Limited for heavy processing like video conversion

### Steps:
1. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import from GitHub
   - Auto-deploys on git push

2. **Configure**
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

## 🗃️ Database Options (All FREE)

### Option 1: NeonDB (Recommended)
- Go to [neon.tech](https://neon.tech)
- Free tier: 0.5GB storage, autoscale to zero
- PostgreSQL compatible
- Copy connection string

### Option 2: Supabase
- Go to [supabase.com](https://supabase.com)
- Free tier: 500MB database
- PostgreSQL with additional features

### Option 3: PlanetScale
- Go to [planetscale.com](https://planetscale.com)
- Free tier: 1 database, 1GB storage
- MySQL compatible

---

## 📋 Pre-Deployment Checklist

✅ **Code Fixed for Production:**
- ✅ Server binds to `0.0.0.0` in production
- ✅ FFmpeg paths work on Linux
- ✅ Cross-platform environment variables
- ✅ Dockerfile includes FFmpeg and yt-dlp
- ✅ Production-ready build scripts

✅ **Files Ready:**
- ✅ `Dockerfile` - Production container setup
- ✅ `railway.toml` - Railway configuration
- ✅ `.dockerignore` - Optimized builds
- ✅ `.env.example` - Environment template

---

## 🚀 Quick Start (Railway - Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy ready"
   git push origin main
   ```

2. **Deploy to Railway:**
   - [railway.app](https://railway.app) → New Project → GitHub repo
   - Auto-deploys with Dockerfile

3. **Add Database:**
   - Railway → Add Database → PostgreSQL
   - Copy `DATABASE_URL` from Variables tab

4. **Set Variables:**
   ```
   NODE_ENV=production
   SESSION_SECRET=random_secret_key_here
   ```

5. **Your app is live!** 🎉

---

## 🔧 Troubleshooting

### Common Issues:
1. **Build Fails:** Check Node.js version (should be 18+)
2. **FFmpeg Missing:** Make sure Dockerfile includes FFmpeg installation
3. **Port Issues:** Railway automatically sets PORT environment variable
4. **Database Errors:** Verify DATABASE_URL format and permissions

### Support:
- Railway: [docs.railway.app](https://docs.railway.app)
- This project supports FFmpeg and yt-dlp out of the box

---

## 💰 Cost Breakdown

**Railway FREE Tier:**
- 500 execution hours/month
- $5 monthly credit
- Perfect for personal projects

**Total Monthly Cost: $0** (within free limits)

**Upgrade when needed:**
- Railway Pro: $20/month for more resources
- NeonDB Pro: $19/month for more storage

Your YouTube converter is production-ready! 🚀