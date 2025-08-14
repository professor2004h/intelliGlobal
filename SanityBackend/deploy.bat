@echo off
echo 🚀 Starting Sanity Studio deployment...

echo 📦 Building Sanity Studio...
call npx sanity build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

echo 🌐 Deploying to intelliglobalconferences.sanity.studio...
echo intelliglobalconferences | call npx sanity deploy
if %errorlevel% neq 0 (
    echo ❌ Deploy failed
    exit /b 1
)

echo ✅ Deployment completed successfully!
echo 🔗 Studio URL: https://intelliglobalconferences.sanity.studio
pause
