#!/usr/bin/env node

/**
 * EcoTube YouTube Converter - Render Deployment Script
 * This script automates the deployment process to Render.com
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🚀 EcoTube YouTube Converter - Render Deployment');
console.log('================================================');

// Configuration
const config = {
  repository: 'https://github.com/gitchking/EcoTube-FreeYoutubeMP3Downloader.git',
  serviceName: 'ecotube-youtube-converter',
  region: 'ohio', // Options: ohio, oregon, singapore, frankfurt
  plan: 'free',
  environment: {
    NODE_ENV: 'production',
    SESSION_SECRET: generateSecretKey(),
    PORT: '5000'
  }
};

function generateSecretKey() {
  return require('crypto').randomBytes(32).toString('hex');
}

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

async function main() {
  try {
    logStep('📋', 'Deployment Configuration:');
    console.log(`   Repository: ${config.repository}`);
    console.log(`   Service Name: ${config.serviceName}`);
    console.log(`   Region: ${config.region}`);
    console.log(`   Plan: ${config.plan}`);
    
    logStep('🔍', 'Verifying project structure...');
    
    // Check essential files
    const requiredFiles = [
      'package.json',
      'server/index.ts',
      'client/src/App.tsx',
      'render.yaml'
    ];
    
    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        logSuccess(`Found ${file}`);
      } else {
        logError(`Missing ${file}`);
        throw new Error(`Required file missing: ${file}`);
      }
    }
    
    logStep('📦', 'Checking build configuration...');
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (packageJson.scripts.build && packageJson.scripts.start) {
      logSuccess('Build and start scripts configured');
    } else {
      throw new Error('Missing build or start scripts in package.json');
    }
    
    logStep('🌐', 'Repository is ready for deployment!');
    logInfo('Since you\'ve already pushed to GitHub, deployment is ready.');
    
    logStep('🎯', 'Next Steps for Manual Deployment:');
    console.log(`
📌 DEPLOYMENT INSTRUCTIONS:

1. 🌐 Go to: https://render.com
2. 🔐 Sign up/Login with GitHub
3. ➕ Click "New" → "Web Service"
4. 🔗 Connect GitHub repository: ${config.repository}
5. ⚙️  Configure settings:
   
   📋 Service Details:
   • Name: ${config.serviceName}
   • Region: ${config.region}
   • Branch: main
   • Runtime: Node
   • Plan: ${config.plan.toUpperCase()}
   
   🔨 Build & Deploy:
   • Build Command: npm run build
   • Start Command: npm start
   
   🔒 Environment Variables:
   • NODE_ENV=production
   • SESSION_SECRET=${config.environment.SESSION_SECRET}
   • PORT=5000
   
6. 🚀 Click "Create Web Service"
7. ⏱️  Wait 3-5 minutes for deployment
8. 🎉 Your app will be live at: https://${config.serviceName}.onrender.com

📚 Alternative: Infrastructure as Code
   Use the render.yaml file for automated deployment:
   1. Go to Render Dashboard
   2. Click "New" → "Blueprint" 
   3. Connect this repository
   4. Render will use render.yaml for configuration

🎊 Features Included:
   ✅ FFmpeg pre-installed
   ✅ yt-dlp available  
   ✅ Production-optimized
   ✅ Auto-SSL certificate
   ✅ Dark mode by default
   ✅ Mobile responsive
   ✅ Error handling & retries

💰 Cost: FREE (750 hours/month)
`);

    logStep('🎉', 'Deployment preparation complete!');
    logSuccess('Your YouTube converter is ready to deploy to Render!');
    
  } catch (error) {
    logError(`Deployment preparation failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the deployment script
main();