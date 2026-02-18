@echo off
echo ========================================
echo Starting LagSkillArena Frontend
echo ========================================
echo.

cd frontend

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting development server...
echo Frontend will be available at: http://localhost:5173
echo.
call npm run dev
