#!/usr/bin/env node

/**
 * EcoTube YouTube Converter - Direct Render Deployment
 * This script directly deploys to Render using their Blueprint system
 */

import { execSync } from 'child_process';
import https from 'https';
import fs from 'fs';

console.log('🚀 EcoTube YouTube Converter - Direct Render Deployment');
console.log('=====================================================');

const config = {
  repository: 'https://github.com/gitchking/EcoTube-FreeYoutubeMP3Downloader.git',
  serviceName: 'ecotube-youtube-converter',
  region: 'ohio',
  plan: 'free'
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

async function deployViaRenderDashboard() {
  logStep('🌐', 'Deploying via Render Dashboard...');
  
  // Step 1: Open Render Blueprint page
  const blueprintUrl = `https://dashboard.render.com/blueprints/new?repo=${encodeURIComponent(config.repository)}`;
  
  logInfo('Opening Render Blueprint deployment page...');
  
  try {
    if (process.platform === 'win32') {
      execSync(`start "" "${blueprintUrl}"`);
    } else if (process.platform === 'darwin') {
      execSync(`open "${blueprintUrl}"`);
    } else {
      execSync(`xdg-open "${blueprintUrl}"`);
    }
    logSuccess('Render Blueprint page opened');
  } catch (error) {
    logInfo(`Please manually open: ${blueprintUrl}`);
  }

  // Step 2: Display exact instructions
  logStep('📋', 'Complete These Steps in Render Dashboard:');
  
  console.log(`
🎯 EXACT DEPLOYMENT STEPS:

1. 🔐 **Login to Render** (if not already logged in)
   • Use GitHub authentication

2. 🔗 **Repository Connection**
   • Repository should be pre-filled: ${config.repository}
   • If not, paste: gitchking/EcoTube-FreeYoutubeMP3Downloader
   • Click "Connect"

3. 📄 **Blueprint Detection** 
   • Render will detect your render.yaml file
   • You'll see "Blueprint Found" message
   • All configuration will be auto-loaded

4. ⚙️  **Verify Configuration** (should be auto-filled):
   ✅ Service Name: ecotube-youtube-converter
   ✅ Region: ohio  
   ✅ Plan: Free
   ✅ Build Command: npm ci && npm run build
   ✅ Start Command: npm start
   ✅ Environment Variables: NODE_ENV, SESSION_SECRET, PORT

5. 🚀 **Deploy**
   • Click "Apply" button
   • Deployment will start immediately
   • Wait 3-5 minutes for completion

6. 🎉 **Live URL**
   • Your app will be available at:
   • https://ecotube-youtube-converter.onrender.com

⚠️  **If Blueprint Fails**: Create Manual Service
   1. Go to: https://dashboard.render.com
   2. Click "New" → "Web Service"  
   3. Connect: gitchking/EcoTube-FreeYoutubeMP3Downloader
   4. Use these settings:
      • Name: ecotube-youtube-converter
      • Build: npm ci && npm run build  
      • Start: npm start
      • Add environment variables manually
`);

  return true;
}

async function verifyDeployment() {
  logStep('🔍', 'Deployment Verification Steps:');
  
  console.log(`
🎯 **How to Verify Your Deployment:**

1. ⏱️  **Wait for Build** (3-5 minutes)
   • Build logs will show in Render dashboard
   • Look for "Deploy successful" message

2. 🌐 **Test Your Service**
   • URL: https://ecotube-youtube-converter.onrender.com
   • Should show your YouTube converter interface

3. 🎵 **Test Conversion**
   • Paste a YouTube URL
   • Try converting a short video
   • Download should work

4. 📊 **Monitor Service**  
   • Dashboard: https://dashboard.render.com/web/${config.serviceName}
   • Check logs, metrics, and deployment status

🔥 **Expected Features:**
✅ YouTube URL input form
✅ MP3 conversion functionality  
✅ Download capability
✅ Dark mode interface
✅ Mobile responsive design
✅ Error handling

💡 **Troubleshooting:**
• If build fails: Check build logs in dashboard
• If service won't start: Verify start command
• If conversion fails: Check FFmpeg/yt-dlp installation logs
`);
}

async function main() {
  try {
    logStep('📋', 'Direct Deployment Configuration:');
    console.log(`   Repository: ${config.repository}`);
    console.log(`   Service Name: ${config.serviceName}`);
    console.log(`   Region: ${config.region}`);
    console.log(`   Plan: ${config.plan}`);
    
    // Deploy via dashboard
    await deployViaRenderDashboard();
    
    // Show verification steps
    await verifyDeployment();
    
    logStep('🎉', 'Deployment Instructions Complete!');
    logSuccess('Follow the steps above to complete your deployment');
    logInfo('Your YouTube Converter will be live in 3-5 minutes!');
    
  } catch (error) {
    logError(`Deployment setup failed: ${error.message}`);
    
    console.log(`
🔧 **Manual Deployment Fallback:**
1. Go to: https://dashboard.render.com
2. New → Web Service
3. Connect: ${config.repository}
4. Configure as shown above
`);
    
    process.exit(1);
  }
}

main();