@echo off
echo 🚀 YouTube Converter - Deployment Helper
echo ========================================

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - YouTube Converter ready for deployment"
)

REM Check if remote exists
git remote | findstr origin >nul
if errorlevel 1 (
    echo 🔗 Please add your GitHub repository as origin:
    echo    git remote add origin https://github.com/yourusername/youtube-converter.git
    echo.
    set /p repo_url="Enter your GitHub repository URL: "
    git remote add origin "!repo_url!"
)

REM Build test
echo 🔨 Testing build process...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix errors before deploying.
    pause
    exit /b 1
) else (
    echo ✅ Build successful!
)

REM Push to GitHub
echo 📤 Pushing to GitHub...
git add .
git commit -m "Deploy ready - %date% %time%" || echo No changes to commit
git push origin main

echo.
echo ✅ Your code is now on GitHub!
echo.
echo 🌟 Next steps:
echo 1. Go to https://railway.app
echo 2. Sign up with GitHub
echo 3. Create new project from your GitHub repo
echo 4. Set environment variables:
echo    - NODE_ENV=production
echo    - DATABASE_URL=your_neon_database_url
echo    - SESSION_SECRET=your_secret_key
echo.
echo 🎉 Your YouTube converter will be live in ~3 minutes!
pause