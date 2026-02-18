@echo off
echo ========================================
echo LagSkillArena - Quick Start
echo ========================================
echo.

REM Check if password is configured
findstr /C:"<db_password>" backend\.env >nul
if %errorlevel% == 0 (
    echo [ERROR] MongoDB password not configured!
    echo.
    echo Please edit backend\.env and replace ^<db_password^> with your actual password
    echo See SETUP_INSTRUCTIONS.md for help
    echo.
    pause
    exit /b 1
)

echo [1/4] Testing MongoDB connection...
cd backend
call venv\Scripts\activate
python test_connection.py
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Connection test failed!
    echo Check SETUP_INSTRUCTIONS.md for troubleshooting
    pause
    exit /b 1
)

echo.
echo [2/4] Starting backend...
start "LagSkillArena Backend" cmd /k "cd /d %CD% && venv\Scripts\activate && python start.py"

echo.
echo [3/4] Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Starting frontend...
cd ..\frontend
start "LagSkillArena Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Application Starting!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Login with:
echo   Email: admin@lagskill.com
echo   Password: Admin@123
echo.
echo Press any key to close this window...
pause >nul
