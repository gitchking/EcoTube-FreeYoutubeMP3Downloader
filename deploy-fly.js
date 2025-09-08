#!/usr/bin/env node

/**
 * EASIEST FLY.IO DEPLOYMENT - Full Server Environment
 * Perfect for YouTube conversion with FFmpeg + yt-dlp
 */

import { execSync } from 'child_process';

console.log('🚀 EASIEST FLY.IO DEPLOYMENT');
console.log('============================');

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

async function checkFlyCLI() {
  try {
    execSync('flyctl version', { encoding: 'utf8', stdio: 'pipe' });
    logSuccess('Fly CLI is installed');
    return true;
  } catch (error) {
    logError('Fly CLI not installed');
    return false;
  }
}

async function installFlyCLI() {
  logStep('📦', 'Installing Fly CLI...');
  
  try {
    if (process.platform === 'win32') {
      logInfo('Installing Fly CLI via PowerShell...');
      execSync('powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"', { stdio: 'inherit' });
    } else if (process.platform === 'darwin') {
      execSync('curl -L https://fly.io/install.sh | sh', { stdio: 'inherit' });
    } else {
      execSync('curl -L https://fly.io/install.sh | sh', { stdio: 'inherit' });
    }
    
    logSuccess('Fly CLI installed successfully');
    return true;
  } catch (error) {
    logError('Failed to install Fly CLI automatically');
    logInfo('Please install manually: https://fly.io/docs/hands-on/install-flyctl/');
    return false;
  }
}

async function pushToGitHub() {
  logStep('📤', 'Pushing code to GitHub...');
  
  try {
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Add Fly.io configuration for deployment"', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    logSuccess('Code pushed to GitHub');
  } catch (error) {
    logInfo('No changes to commit or already up to date');
  }
}

async function displayDeploymentInstructions() {
  logStep('🎯', 'FLY.IO DEPLOYMENT INSTRUCTIONS:');
  
  console.log(`
🚀 **FLY.IO - PERFECT FOR YOUR YOUTUBE CONVERTER**

✨ **Why Fly.io is IDEAL:**
   ✅ Full Docker containers (NOT serverless)
   ✅ FFmpeg + yt-dlp support
   ✅ File processing capabilities
   ✅ Global edge locations
   ✅ Generous free tier
   ✅ Easy CLI deployment

═══════════════════════════════════════════════════════════

🎯 **DEPLOYMENT STEPS:**

1. 🔐 **Login to Fly.io**
   Run: flyctl auth login
   • Opens browser for GitHub login
   • Authorizes CLI access

2. 🚀 **Deploy Your App**
   Run: flyctl launch
   • Detects your Dockerfile automatically
   • Uses your fly.toml configuration
   • Builds and deploys in one command

3. ✅ **Verify Deployment**
   Run: flyctl open
   • Opens your live app in browser
   • Test YouTube conversion functionality

═══════════════════════════════════════════════════════════

📋 **EXACT COMMANDS TO RUN:**

# Step 1: Login
flyctl auth login

# Step 2: Deploy (from your project directory)
flyctl launch --name ${config.appName}

# Step 3: Open your live app
flyctl open

═══════════════════════════════════════════════════════════

🔥 **YOUR DEPLOYMENT INCLUDES:**

✅ **Full Server Environment:**
   • Node.js 18 runtime
   • FFmpeg for audio processing
   • yt-dlp for YouTube downloads
   • Alpine Linux container

✅ **Production Features:**
   • HTTPS SSL certificate
   • Global CDN
   • Auto-scaling
   • Health checks
   • Logging & monitoring

✅ **Free Tier Benefits:**
   • 160GB data transfer/month
   • 3 shared-cpu-1x VMs
   • Automatic sleep when inactive
   • Perfect for personal projects

═══════════════════════════════════════════════════════════

🎉 **EXPECTED RESULT:**

🌐 **Live URL**: https://${config.appName}.fly.dev
📱 **Full Features**:
   ✅ YouTube URL input form
   ✅ MP3 conversion with FFmpeg
   ✅ File download functionality
   ✅ Dark mode interface
   ✅ Mobile responsive design
   ✅ Error handling & retries

⚡ **Performance**: Edge deployment worldwide
💰 **Cost**: FREE tier (very generous limits)
🔒 **Security**: Automatic HTTPS

═══════════════════════════════════════════════════════════

💡 **TROUBLESHOOTING:**

If build fails:
• Check Dockerfile syntax
• Verify package.json scripts
• Run: flyctl logs

If app won't start:
• Check environment variables
• Verify PORT=8080 binding
• Run: flyctl status

🚨 **NEXT STEPS:**
1. Install Fly CLI (if not installed)
2. Run: flyctl auth login
3. Run: flyctl launch --name ${config.appName}
4. Test your live YouTube converter!
`);
}

async function main() {
  try {
    logStep('📊', 'Fly.io Deployment Configuration:');
    console.log(`   App Name: ${config.appName}`);
    console.log(`   Repository: ${config.repository}`);
    console.log(`   Platform: Fly.io (Full Server)`);
    
    // Check if Fly CLI is installed
    const cliInstalled = await checkFlyCLI();
    if (!cliInstalled) {
      const installed = await installFlyCLI();
      if (!installed) {
        logError('Please install Fly CLI manually and try again');
        return;
      }
    }
    
    // Push code to GitHub
    await pushToGitHub();
    
    // Display deployment instructions
    await displayDeploymentInstructions();
    
    logStep('🎉', 'FLY.IO DEPLOYMENT READY!');
    logSuccess('Run the commands above to deploy your YouTube converter');
    logInfo('Your app will be live with full server capabilities!');
    
  } catch (error) {
    logError(`Deployment setup failed: ${error.message}`);
    console.log(`\nManual setup: https://fly.io/docs/hands-on/launch-app/`);
    process.exit(1);
  }
}

main();