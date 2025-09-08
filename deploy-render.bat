@echo off
echo 🚀 YouTube Converter - Render Deployment Helper
echo ===============================================

echo 📁 Checking Git status...
git status

echo.
echo 🔨 Testing build process...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix errors before deploying.
    pause
    exit /b 1
) else (
    echo ✅ Build successful!
)

echo.
echo 📦 Adding files to Git...
git add .

echo 💾 Committing changes...
git commit -m "Deploy to Render - %date% %time%"

echo 📤 Pushing to GitHub...
git push origin main

echo.
echo ✅ Code pushed to GitHub successfully!
echo.
echo 🌟 Next Steps:
echo 1. Go to https://render.com
echo 2. Sign up/login with GitHub
echo 3. Create New Web Service
echo 4. Connect this GitHub repository
echo 5. Set build command: npm run build
echo 6. Set start command: npm start
echo 7. Add environment variables:
echo    NODE_ENV=production
echo    DATABASE_URL=your_database_url
echo    SESSION_SECRET=your_secret_key
echo.
echo 📖 Full guide: See RENDER_DEPLOY.md
echo.
echo 🎉 Your app will be live at: https://your-app-name.onrender.com
echo Deploy time: ~3-5 minutes after setup!
echo.
pause