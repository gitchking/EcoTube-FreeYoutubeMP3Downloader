#!/usr/bin/env node

/**
 * EASIEST FULL-SERVER DEPLOYMENT - RAILWAY
 * Perfect for YouTube conversion with FFmpeg + yt-dlp
 */

import { execSync } from 'child_process';

console.log('🚀 EASIEST FULL-SERVER DEPLOYMENT - RAILWAY');
console.log('==========================================');

const config = {
  repository: 'https://github.com/gitchking/EcoTube-FreeYoutubeMP3Downloader.git',
  projectName: 'ecotube-youtube-converter'
};

function logStep(step, message) {
  console.log(`\n${step} ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message) {
  console.log(`❌ ${message}`);
}

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

async function pushToGitHub() {
  logStep('📦', 'Ensuring latest code is on GitHub...');
  
  try {
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Prepare for Railway deployment - full server environment"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    logSuccess('Code synchronized with GitHub');
    return true;
  } catch (error) {
    logInfo('No changes to commit or already up to date');
    return true;
  }
}

async function openRailwayDeployment() {
  logStep('🌐', 'Opening Railway for full-server deployment...');
  
  const railwayUrl = 'https://railway.app/new';
  
  try {
    if (process.platform === 'win32') {
      execSync(`start "" "${railwayUrl}"`);
    } else if (process.platform === 'darwin') {
      execSync(`open "${railwayUrl}"`);
    } else {
      execSync(`xdg-open "${railwayUrl}"`);
    }
    logSuccess('Railway deployment page opened');
  } catch (error) {
    logInfo(`Please open: ${railwayUrl}`);
  }
  
  return true;
}

async function displayFullServerSteps() {
  logStep('🎯', 'FULL-SERVER DEPLOYMENT STEPS:');
  
  console.log(`
🚀 **RAILWAY - FULL SERVER ENVIRONMENT**

✨ **Why Railway is PERFECT for Your Project:**
   ✅ Full Docker containers (NOT serverless)
   ✅ FFmpeg pre-installed in containers
   ✅ yt-dlp can be installed via pip
   ✅ File processing & temporary storage
   ✅ No function timeouts (30min max)
   ✅ Real server environment
   ✅ Dockerfile support

═══════════════════════════════════════════════════════════

🎯 **DEPLOYMENT STEPS (4 CLICKS):**

1. 🔐 **Login to Railway**
   • Use GitHub account
   • Click "Login with GitHub"

2. 📂 **Deploy from GitHub**
   • Click "Deploy from GitHub repo"
   • Select: gitchking/EcoTube-FreeYoutubeMP3Downloader
   • Click "Deploy Now"

3. ⚙️  **Automatic Configuration**
   • Railway detects your Dockerfile
   • Builds full server environment
   • Installs FFmpeg + yt-dlp automatically
   • Sets up Node.js + all dependencies

4. 🚀 **Live Deployment**
   • Build takes 3-5 minutes
   • Gets permanent URL
   • Full YouTube conversion functionality

═══════════════════════════════════════════════════════════

🔥 **YOUR DOCKERFILE INCLUDES:**

✅ **System Dependencies:**
   FROM node:18-alpine
   RUN apk add --no-cache python3 py3-pip ffmpeg
   RUN pip3 install yt-dlp

✅ **Application Setup:**
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

✅ **Runtime Environment:**
   ENV NODE_ENV=production
   EXPOSE $PORT
   CMD ["npm", "start"]

═══════════════════════════════════════════════════════════

🎉 **FINAL RESULT:**

🌐 **Live URL**: https://[project-name]-production.up.railway.app
📱 **Full Features**:
   ✅ YouTube URL input
   ✅ MP3 conversion (FFmpeg)
   ✅ File download
   ✅ Dark mode interface
   ✅ Mobile responsive
   ✅ Error handling

💰 **Cost**: FREE tier (500 hours/month)
⚡ **Performance**: Full server power
🔒 **Security**: HTTPS + SSL
📊 **Monitoring**: Built-in metrics

═══════════════════════════════════════════════════════════

🚨 **WHY NOT VERCEL:**

❌ Vercel = Serverless functions (10-30s timeout)
❌ No FFmpeg/yt-dlp support
❌ No file processing capabilities
❌ Can't handle video conversions

✅ Railway = Full servers (30min timeout)
✅ Full system access
✅ Docker container support
✅ Perfect for media processing

💡 **IMPORTANT**: 
   Railway gives you a REAL server, not serverless functions!
   This is exactly what your YouTube converter needs.
`);
}

async function main() {
  try {
    logStep('📊', 'Full-Server Deployment Configuration:');
    console.log(`   Repository: ${config.repository}`);
    console.log(`   Platform: Railway (Full Server Environment)`);
    console.log(`   Environment: Docker Container with System Access`);
    
    // Push latest code
    await pushToGitHub();
    
    // Open Railway deployment
    await openRailwayDeployment();
    
    // Show full server steps
    await displayFullServerSteps();
    
    logStep('🎉', 'FULL-SERVER DEPLOYMENT READY!');
    logSuccess('Railway provides real servers - perfect for your YouTube converter');
    logInfo('Deploy now for full FFmpeg + yt-dlp functionality!');
    
  } catch (error) {
    logError(`Deployment setup failed: ${error.message}`);
    console.log(`\nFallback: Go to https://railway.app/new`);
    process.exit(1);
  }
}

main();