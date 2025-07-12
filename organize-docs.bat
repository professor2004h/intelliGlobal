@echo off
echo 📁 Organizing Documentation Files...
echo =====================================

REM Create docs directory if it doesn't exist
if not exist "docs" mkdir docs
if not exist "docs\implementation" mkdir docs\implementation
if not exist "docs\fixes" mkdir docs\fixes
if not exist "docs\guides" mkdir docs\guides

echo 📋 Moving implementation docs...
move "*_COMPLETE.md" docs\implementation\ 2>nul
move "*_IMPLEMENTATION*.md" docs\implementation\ 2>nul
move "*_INTEGRATION*.md" docs\implementation\ 2>nul

echo 🔧 Moving fix documentation...
move "*_FIX*.md" docs\fixes\ 2>nul
move "*_FIXED*.md" docs\fixes\ 2>nul
move "*_ERRORS*.md" docs\fixes\ 2>nul

echo 📖 Moving guides and setup docs...
move "*_GUIDE*.md" docs\guides\ 2>nul
move "*_SETUP*.md" docs\guides\ 2>nul
move "*_INSTRUCTIONS*.md" docs\guides\ 2>nul
move "WEBHOOK_*.md" docs\guides\ 2>nul

echo ✅ Documentation organized!
echo.
echo 📁 Structure:
echo   docs\
echo   ├── implementation\  (feature implementations)
echo   ├── fixes\          (bug fixes and solutions)
echo   └── guides\         (setup and usage guides)
echo.
pause
