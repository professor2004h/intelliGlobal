@echo off
echo Checking Intelli Global Conferences Development Status...
echo.

echo Checking if Next.js Frontend is running on port 3000...
netstat -an | findstr ":3000" >nul
if %errorlevel%==0 (
    echo ✓ Frontend is running at http://localhost:3000
) else (
    echo ✗ Frontend is NOT running
    echo   To start: cd nextjs-frontend && npm run dev
)

echo.
echo Checking if Sanity Backend is running on port 3333...
netstat -an | findstr ":3333" >nul
if %errorlevel%==0 (
    echo ✓ Sanity Studio is running at http://localhost:3333
) else (
    echo ✗ Sanity Studio is NOT running
    echo   To start: cd SanityBackend && npm run dev
)

echo.
echo Testing Frontend Connection...
curl -s -o nul -w "%%{http_code}" http://localhost:3000 > temp_status.txt
set /p status=<temp_status.txt
del temp_status.txt

if "%status%"=="200" (
    echo ✓ Frontend is responding correctly
) else (
    echo ✗ Frontend connection failed (Status: %status%)
)

echo.
echo Current Status Summary:
echo ========================
echo Frontend URL: http://localhost:3000
echo Sanity Studio URL: http://localhost:3333
echo.
echo If both services are running, you can:
echo 1. Visit http://localhost:3000 to see the website
echo 2. Visit http://localhost:3333 to manage content in Sanity Studio
echo 3. Upload your logo in Sanity Studio under "Site Settings"
echo.
pause
