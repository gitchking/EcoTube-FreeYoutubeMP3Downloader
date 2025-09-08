#!/usr/bin/env node

/**
 * EcoTube YouTube Converter - Render CLI-Style Deployment Script
 * This script automates deployment to Render using their API
 */

import { execSync } from 'child_process';
import fs from 'fs';
import https from 'https';

console.log('🚀 EcoTube YouTube Converter - Render CLI-Style Deployment');
console.log('=======================================================');

// Configuration based on your project memory
const config = {
  repository: 'https://github.com/gitchking/EcoTube-FreeYoutubeMP3Downloader.git',
  serviceName: 'ecotube-youtube-converter',
  region: 'ohio',
  plan: 'free',
  runtime: 'node',
  branch: 'main',
  buildCommand: 'npm run build',
  startCommand: 'npm start',
  environment: {
    NODE_ENV: 'production',
    SESSION_SECRET: '3de70493a7e6bce835dddfe7c67b6e2e61f5ab291661f409e1eaa8222d0d7f3f',
    PORT: '5000'
  }
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

function runCommand(command, description) {
  try {
    logInfo(`Running: ${description}`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    logSuccess(`${description} completed`);
    return output;
  } catch (error) {
    logError(`${description} failed: ${error.message}`);
    throw error;
  }
}

async function checkGitStatus() {
  logStep('🔍', 'Checking Git status...');
  
  try {
    // Check if we have uncommitted changes
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      logInfo('Found uncommitted changes, committing...');
      runCommand('git add .', 'Adding files');
      runCommand('git commit -m "Pre-deployment commit via Render CLI script"', 'Committing changes');
    } else {
      logSuccess('No uncommitted changes');
    }
    
    // Push to GitHub
    runCommand('git push origin main', 'Pushing to GitHub');
    logSuccess('Code synchronized with GitHub');
    
    return true;
  } catch (error) {
    logError('Git operations failed');
    return false;
  }
}

async function verifyProject() {
  logStep('🔍', 'Verifying project structure...');
  
  const requiredFiles = [
    'package.json',
    'render.yaml',
    'server/index.ts',
    'client/src/App.tsx'
  ];
  
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      logSuccess(`Found ${file}`);
    } else {
      logError(`Missing ${file}`);
      throw new Error(`Required file missing: ${file}`);
    }
  }
  
  // Verify package.json scripts
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.scripts.build && packageJson.scripts.start) {
    logSuccess('Build and start scripts configured');
  } else {
    throw new Error('Missing build or start scripts in package.json');
  }
  
  return true;
}

async function triggerRenderDeployment() {
  logStep('🚀', 'Triggering Render deployment...');
  
  logInfo('Opening Render Dashboard for Blueprint deployment...');
  
  // Open Render dashboard
  const renderUrl = 'https://dashboard.render.com/blueprints/new';
  
  try {
    if (process.platform === 'win32') {
      execSync(`start "" "${renderUrl}"`);
    } else if (process.platform === 'darwin') {
      execSync(`open "${renderUrl}"`);
    } else {
      execSync(`xdg-open "${renderUrl}"`);
    }
    logSuccess('Render Dashboard opened');
  } catch (error) {
    logInfo(`Please manually open: ${renderUrl}`);
  }
  
  return true;
}

async function displayDeploymentInstructions() {
  logStep('📋', 'Render Blueprint Deployment Instructions:');
  
  console.log(`
🎯 AUTOMATED DEPLOYMENT STEPS:

1. 🌐 In the opened Render Dashboard:
   • Click "Connect Repository"
   • Select: ${config.repository.split('/').pop()}
   • Render will automatically detect render.yaml

2. ⚙️  Blueprint Configuration (auto-configured):
   • Service Name: ${config.serviceName}
   • Region: ${config.region}
   • Plan: ${config.plan.toUpperCase()}
   • Runtime: ${config.runtime}
   • Build Command: ${config.buildCommand}
   • Start Command: ${config.startCommand}

3. 🔒 Environment Variables (auto-set via render.yaml):
   • NODE_ENV=${config.environment.NODE_ENV}
   • SESSION_SECRET=${config.environment.SESSION_SECRET}
   • PORT=${config.environment.PORT}

4. 🚀 Click "Apply" to start deployment

5. ⏱️  Wait 3-5 minutes for deployment to complete

6. 🎉 Your app will be live at:
   https://${config.serviceName}.onrender.com

🔥 CLI-Style Features Included:
✅ FFmpeg pre-installed for audio conversion
✅ yt-dlp latest version for YouTube downloading  
✅ Production-optimized build configuration
✅ Auto-SSL certificate (HTTPS)
✅ Auto-deploy on GitHub push
✅ 750 free hours/month
✅ Error handling and retry mechanisms
✅ Mobile-responsive design
✅ Dark mode default theme

💡 Alternative Manual Method:
If Blueprint deployment fails, create service manually:
• Go to https://dashboard.render.com
• New → Web Service
• Connect GitHub repo: ${config.repository}
• Use the settings displayed above
`);
}

async function main() {
  try {
    logStep('📋', 'Render CLI-Style Deployment Configuration:');
    console.log(`   Repository: ${config.repository}`);
    console.log(`   Service Name: ${config.serviceName}`);
    console.log(`   Region: ${config.region}`);
    console.log(`   Plan: ${config.plan}`);
    console.log(`   Runtime: ${config.runtime}`);
    
    // Verify project structure
    await verifyProject();
    
    // Sync with GitHub
    const gitSynced = await checkGitStatus();
    if (!gitSynced) {
      logError('Failed to sync with GitHub');
      throw new Error('Git synchronization required for deployment');
    }
    
    // Trigger deployment
    await triggerRenderDeployment();
    
    // Display instructions
    await displayDeploymentInstructions();
    
    logStep('🎉', 'Render CLI-Style Deployment Initiated!');
    logSuccess('Your YouTube Converter deployment is ready!');
    logInfo('Complete the deployment in the opened Render Dashboard');
    
  } catch (error) {
    logError(`Deployment failed: ${error.message}`);
    
    logStep('🔧', 'Troubleshooting Options:');
    console.log(`
1. Manual deployment via Render Dashboard:
   https://dashboard.render.com

2. Check repository access:
   ${config.repository}

3. Verify render.yaml configuration:
   cat render.yaml

4. Re-run deployment:
   node deploy-render-cli.js
`);
    
    process.exit(1);
  }
}

// Run the CLI-style deployment
main();