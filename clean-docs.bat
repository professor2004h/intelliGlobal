@echo off
echo 🗑️ Cleaning Documentation Files...
echo ===================================

echo ⚠️  WARNING: This will delete all .md documentation files
echo    (except README.md files which are standard)
echo.
echo Files to be deleted:
dir *.md /b | findstr /v "README"
echo.
set /p confirm="Are you sure? (y/N): "

if /i "%confirm%"=="y" (
    echo.
    echo 🗑️ Deleting documentation files...
    
    REM Delete all .md files except README.md
    for %%f in (*.md) do (
        if /i not "%%f"=="README.md" (
            echo Deleting: %%f
            del "%%f"
        )
    )
    
    echo.
    echo ✅ Documentation files cleaned!
    echo ✅ Your code will continue to run normally
    echo.
) else (
    echo.
    echo ❌ Operation cancelled
    echo.
)

pause
