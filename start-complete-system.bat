@echo off
echo ========================================
echo   EventNextApp Complete System Startup
echo ========================================
echo.

echo 1. Testing Sanity Connection...
node test-sanity-connection.js
echo.

echo 2. Installing dependencies...
echo Installing Sanity Backend dependencies...
cd SanityBackend
call npm install
cd ..

echo Installing Frontend dependencies...
cd nextjs-frontend
call npm install
cd ..
echo.

echo 3. Starting services...
echo.
echo Starting Sanity Studio (Backend) on port 3333...
echo You can access it at: http://localhost:3333
start cmd /k "cd SanityBackend && npm run dev -- --port 3333"

echo.
echo Waiting 5 seconds for Sanity Studio to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Next.js Frontend on port 3000...
echo You can access it at: http://localhost:3000
start cmd /k "cd nextjs-frontend && npm run dev"

echo.
echo ========================================
echo   System Startup Complete!
echo ========================================
echo.
echo Services running:
echo - Sanity Studio: http://localhost:3333
echo - Frontend App:  http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul
