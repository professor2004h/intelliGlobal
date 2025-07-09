@echo off
echo Starting Intelli Global Conferences Development Environment...
echo.

echo Starting Sanity Backend...
start "Sanity Backend" cmd /k "cd SanityBackend && npm run dev"

echo Waiting 5 seconds for Sanity to start...
timeout /t 5 /nobreak > nul

echo Starting Next.js Frontend...
start "Next.js Frontend" cmd /k "cd nextjs-frontend && npm run dev"

echo.
echo Development servers are starting...
echo.
echo Sanity Studio will be available at: http://localhost:3333
echo Next.js Frontend will be available at: http://localhost:3000
echo.
echo Press any key to exit this script (servers will continue running)
pause > nul
