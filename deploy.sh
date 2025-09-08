#!/bin/bash

# YouTube Converter - Quick Deployment Script
# This script helps you prepare and deploy your YouTube converter

echo "🚀 YouTube Converter - Deployment Helper"
echo "========================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - YouTube Converter ready for deployment"
fi

# Check if remote exists
if ! git remote | grep -q origin; then
    echo "🔗 Please add your GitHub repository as origin:"
    echo "   git remote add origin https://github.com/yourusername/youtube-converter.git"
    echo ""
    read -p "Enter your GitHub repository URL: " repo_url
    git remote add origin "$repo_url"
fi

# Build test
echo "🔨 Testing build process..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy ready - $(date)" || echo "No changes to commit"
git push origin main

echo ""
echo "✅ Your code is now on GitHub!"
echo ""
echo "🌟 Next steps:"
echo "1. Go to https://railway.app"
echo "2. Sign up with GitHub"
echo "3. Create new project from your GitHub repo"
echo "4. Set environment variables:"
echo "   - NODE_ENV=production"
echo "   - DATABASE_URL=your_neon_database_url"
echo "   - SESSION_SECRET=your_secret_key"
echo ""
echo "🎉 Your YouTube converter will be live in ~3 minutes!"