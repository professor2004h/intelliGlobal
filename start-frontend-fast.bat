@echo off
echo 🚀 Starting Frontend with Maximum Speed...
echo ========================================

cd nextjs-frontend

echo 🔧 Killing any existing processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a 2>nul

echo 📦 Checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)

echo ⚡ Starting development server...
echo 🌐 Server will be available at: http://localhost:3000
echo 💳 Payment testing: Navigate to sponsorship registration
echo 🧪 UPI Test ID: success@razorpay
echo.
echo ⏳ Please wait for server to start (usually 10-30 seconds)...
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

call npm run dev
