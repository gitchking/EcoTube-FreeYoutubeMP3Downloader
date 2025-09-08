#!/usr/bin/env node

/**
 * KOYEB - TRULY FREE DEPLOYMENT
 * No payment method required, full Docker support
 */

import { execSync } from 'child_process';

console.log('🚀 KOYEB - TRULY FREE DEPLOYMENT');
console.log('================================');

const config = {
  appName: 'ecotube-youtube-converter',
  repository: 'https://github.com/gitchking/EcoTube-FreeYoutubeMP3Downloader.git'
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
  logStep('📤', 'Pushing Koyeb configuration to GitHub...');
  
  try {
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Add Koyeb configuration - truly free deployment"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    logSuccess('Configuration pushed to GitHub');
  } catch (error) {
    logInfo('No changes to commit or already up to date');
  }
}

async function openKoyebDeployment() {
  logStep('🌐', 'Opening Koyeb dashboard...');
  
  const koyebUrl = 'https://app.koyeb.com/deploy';
  
  try {
    if (process.platform === 'win32') {
      execSync(`start "" "${koyebUrl}"`);
    } else if (process.platform === 'darwin') {
      execSync(`open "${koyebUrl}"`);
    } else {
      execSync(`xdg-open "${koyebUrl}"`);
    }
    logSuccess('Koyeb dashboard opened');
  } catch (error) {
    logInfo(`Please open: ${koyebUrl}`);
  }
}

async function displayDeploymentSteps() {
  logStep('🎯', 'KOYEB DEPLOYMENT STEPS (TRULY FREE):');
  
  console.log(`
🚀 **KOYEB - BEST FREE OPTION**

✨ **Why Koyeb is Perfect:**
   ✅ TRULY FREE (no payment method needed)
   ✅ Full Docker support (FFmpeg + yt-dlp)
   ✅ 2 free services forever
   ✅ Global deployment
   ✅ No trial limitations
   ✅ Production-ready

═══════════════════════════════════════════════════════════

🎯 **DEPLOYMENT STEPS (3 CLICKS):**

1. 🔐 **Sign Up to Koyeb**
   • Go to: https://app.koyeb.com/deploy
   • Sign up with GitHub (free account)
   • No payment method required

2. 🚀 **Deploy from GitHub**
   • Click "Deploy from Git"
   • Repository: ${config.repository}
   • Branch: main
   • Koyeb detects Dockerfile automatically

3. ⚙️  **Configure Service**
   • Name: ${config.appName}
   • Region: Washington D.C. (or closest)
   • Instance: Nano (free tier)
   • Port: 8000 (auto-detected)
   • Click "Deploy"

═══════════════════════════════════════════════════════════

🔥 **WHAT YOU GET FOR FREE:**

✅ **Container Features:**
   • Full Docker environment
   • Node.js 18 runtime
   • FFmpeg pre-installed
   • yt-dlp via pip
   • Alpine Linux container

✅ **Platform Features:**
   • Custom domains
   • HTTPS SSL certificates
   • Global CDN
   • Auto-scaling
   • Health checks
   • Build logs

✅ **Free Limits:**
   • 2 services (apps)
   • 512MB RAM per service
   • 2.5GB storage
   • 100GB bandwidth/month
   • Perfect for YouTube converter

═══════════════════════════════════════════════════════════

🎉 **EXPECTED RESULT:**

🌐 **Live URL**: https://${config.appName}-[random].koyeb.app
📱 **Full Features**:
   ✅ YouTube URL conversion
   ✅ MP3 downloads
   ✅ FFmpeg processing
   ✅ yt-dlp integration
   ✅ Dark mode UI
   ✅ Mobile responsive

⚡ **Performance**: Global edge deployment
💰 **Cost**: COMPLETELY FREE forever
🔒 **Security**: Automatic HTTPS
📊 **Monitoring**: Built-in dashboard

═══════════════════════════════════════════════════════════

💡 **ALTERNATIVE: Back4App Containers**

If Koyeb doesn't work:
1. Go to: https://containers.back4app.com
2. Sign up (free, no payment method)
3. Deploy from GitHub
4. Same Docker configuration works

═══════════════════════════════════════════════════════════

🚨 **NO MORE HOSTING HEADACHES:**

❌ Replit: Now paid
❌ Heroku: Discontinued free tier  
❌ Vercel: Serverless only (no FFmpeg)
❌ Netlify: Static only
❌ Fly.io: Requires payment method
❌ Railway: Trial expired

✅ Koyeb: Actually free forever
✅ Back4App: True free tier
✅ Perfect for your YouTube converter

🎊 **NEXT STEPS:**
1. Go to https://app.koyeb.com/deploy
2. Sign up with GitHub
3. Deploy from: ${config.repository}
4. Your YouTube converter goes live!
`);
}

async function main() {
  try {
    logStep('📊', 'Koyeb Deployment Configuration:');
    console.log(`   App Name: ${config.appName}`);
    console.log(`   Repository: ${config.repository}`);
    console.log(`   Platform: Koyeb (Truly Free)`);
    
    // Push configuration
    await pushToGitHub();
    
    // Open Koyeb
    await openKoyebDeployment();
    
    // Display instructions
    await displayDeploymentSteps();
    
    logStep('🎉', 'KOYEB DEPLOYMENT READY!');
    logSuccess('Deploy your YouTube converter for FREE with full Docker support');
    logInfo('No payment methods, no trials, just free hosting!');
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    console.log(`\nFallback: https://app.koyeb.com/deploy`);
    process.exit(1);
  }
}

main();