# 🚀 Deploy YouTube Converter to Render (FREE)

## Quick Deploy Guide - Git + Render

### 📋 **What You'll Get:**
- ✅ **FREE Hosting**: 750 hours/month (plenty for personal use)
- ✅ **Custom Domain**: yourapp.onrender.com + option for custom domain
- ✅ **Auto-Deploy**: Every git push triggers deployment
- ✅ **FFmpeg Included**: No setup needed for video conversion
- ✅ **PostgreSQL Database**: Free 90-day database included

---

## 🚀 **Step-by-Step Deployment**

### **Step 1: Push to GitHub** 
```bash
# Add all files to git
git add .

# Commit changes
git commit -m "Ready for Render deployment"

# Push to GitHub (create repo first if needed)
git push origin main
```

### **Step 2: Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### **Step 3: Create Web Service**
1. **Dashboard** → **New** → **Web Service**
2. **Connect** your GitHub repository
3. **Select** your YouTube converter repository
4. **Configure** deployment:

   **Service Details:**
   - **Name**: `youtube-converter` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Runtime**: `Node`

   **Build & Deploy:**
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `18` (auto-detected)

### **Step 4: Add Environment Variables**
In Render dashboard → **Environment** tab:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your_super_secret_random_string_here
```

### **Step 5: Add Database (Optional but Recommended)**
1. **Dashboard** → **New** → **PostgreSQL**
2. **Free Tier** → **Create Database**
3. **Copy** the Internal Database URL
4. **Paste** it as `DATABASE_URL` in your web service environment variables

---

## 🎉 **Deploy & Go Live!**

1. Click **Create Web Service**
2. Render will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build your app (`npm run build`)
   - Start the server (`npm start`)
   - Provide FFmpeg and yt-dlp automatically

3. **Your app will be live** at: `https://your-service-name.onrender.com`

**Deploy Time**: ~3-5 minutes ⏱️

---

## 🔧 **Environment Setup Summary**

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Enables production mode |
| `DATABASE_URL` | `postgresql://...` | Database connection |
| `SESSION_SECRET` | Random string | Session security |

---

## ✨ **Render Free Tier Benefits**

- **750 execution hours/month** (≈ 31 days of 24/7 usage)
- **Auto-sleep after 15 minutes** of inactivity (wakes instantly)
- **512MB RAM** (sufficient for video conversion)
- **FFmpeg pre-installed**
- **yt-dlp available** via pip
- **PostgreSQL database** (90 days free, then $7/month)
- **SSL certificate** included
- **Custom domains** supported

---

## 🔄 **Auto-Deploy Workflow**

After initial setup:
1. Make changes to your code
2. `git add . && git commit -m "Update"`
3. `git push origin main`
4. **Render automatically deploys** in ~2-3 minutes
5. Your live app updates automatically! 🎊

---

## 🛠️ **Troubleshooting**

### **Common Issues:**

**Build Fails:**
- Check Node.js version (should be 18+)
- Verify `package.json` scripts
- Check build logs in Render dashboard

**App Won't Start:**
- Ensure `npm start` command works locally
- Check environment variables are set
- Review application logs

**FFmpeg/yt-dlp Not Found:**
- These are pre-installed on Render
- No additional setup needed
- Check deployment logs for errors

**Database Connection:**
- Verify `DATABASE_URL` format
- Ensure database is running
- Check connection string permissions

### **Need Help?**
- Render Docs: [render.com/docs](https://render.com/docs)
- Render Community: [community.render.com](https://community.render.com)

---

## 💰 **Cost Breakdown**

**Free Tier (Perfect for personal projects):**
- Web Service: FREE (750 hours/month)
- Database: FREE (first 90 days)
- SSL & Custom Domain: FREE

**After Free Database Expires:**
- Web Service: Still FREE
- Database: $7/month (optional - you can use external DB)

**Total: $0/month** for the first 90 days! 🎉

---

## 🎯 **Why Render for YouTube Converter?**

✅ **Zero Configuration**: FFmpeg and yt-dlp work out of the box  
✅ **Reliable**: No cold starts, consistent performance  
✅ **Simple**: Git-based deployment, no Docker knowledge needed  
✅ **Scalable**: Easy to upgrade when your app grows  
✅ **Secure**: HTTPS, environment variables, isolated containers  

**Your YouTube converter will be production-ready in minutes!** 🚀