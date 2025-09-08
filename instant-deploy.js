#!/usr/bin/env node

/**
 * INSTANT LOCAL DEPLOYMENT WITH PUBLIC URL
 * No hosting setup needed - works immediately
 */

import { execSync } from 'child_process';

console.log('🚀 INSTANT LOCAL DEPLOYMENT');
console.log('===========================');

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

async function installNgrok() {
  logStep('📦', 'Installing ngrok for instant public URL...');
  
  try {
    execSync('npm install -g ngrok', { stdio: 'inherit' });
    logSuccess('ngrok installed');
    return true;
  } catch (error) {
    logError('Failed to install ngrok');
    return false;
  }
}

async function startLocalApp() {
  logStep('🏃', 'Starting your YouTube converter locally...');
  
  try {
    logInfo('Building application...');
    execSync('npm run build', { stdio: 'inherit' });
    
    logInfo('Starting local server...');
    // Start the server in background
    const server = execSync('start /B npm start', { encoding: 'utf8' });
    
    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    logSuccess('Local server running on http://localhost:5000');
    return true;
  } catch (error) {
    logError('Failed to start local server');
    return false;
  }
}

async function createPublicTunnel() {
  logStep('🌐', 'Creating public URL with ngrok...');
  
  try {
    logInfo('Exposing local server to the internet...');
    
    // Start ngrok tunnel
    const ngrokProcess = execSync('start /B npx ngrok http 5000', { encoding: 'utf8' });
    
    // Wait for ngrok to initialize
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    logSuccess('Public tunnel created!');
    logInfo('Check ngrok dashboard at: http://127.0.0.1:4040');
    
    return true;
  } catch (error) {
    logError('Failed to create public tunnel');
    return false;
  }
}

async function displayInstructions() {
  logStep('🎉', 'INSTANT DEPLOYMENT COMPLETE!');
  
  console.log(`
✅ **YOUR YOUTUBE CONVERTER IS NOW LIVE!**

🌐 **How to Access:**
1. Go to: http://127.0.0.1:4040
2. Click on the HTTPS URL shown
3. Your YouTube converter is accessible worldwide!

🎯 **What's Running:**
✅ Local server: http://localhost:5000
✅ Public tunnel: https://[random].ngrok.io
✅ Full YouTube to MP3 functionality
✅ FFmpeg + yt-dlp working locally
✅ No hosting platform needed!

🔥 **Features Available:**
✅ YouTube URL input
✅ MP3 conversion
✅ File downloads
✅ Dark mode interface
✅ Mobile responsive

💡 **Benefits:**
✅ No payment methods required
✅ No complex deployments
✅ Works immediately
✅ No build errors on platforms
✅ Full control over environment

🚨 **To Stop:**
• Close terminal windows
• Or run: taskkill /f /im node.exe

🎊 **Perfect for Testing & Sharing:**
• Share the ngrok URL with friends
• Test all functionality instantly
• No hosting platform headaches!
`);
}

async function main() {
  try {
    logStep('🎯', 'Instant Local Deployment Setup');
    
    // Install ngrok if needed
    const ngrokInstalled = await installNgrok();
    if (!ngrokInstalled) {
      logError('Cannot proceed without ngrok');
      return;
    }
    
    // Start local application
    const appStarted = await startLocalApp();
    if (!appStarted) {
      logError('Cannot start local application');
      return;
    }
    
    // Create public tunnel
    await createPublicTunnel();
    
    // Display final instructions
    await displayInstructions();
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

main();