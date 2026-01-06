@echo off
echo ========================================
echo Business Diary - Setup Script
echo ========================================
echo.

REM Check Python
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found!
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check 'Add Python to PATH' during installation
    set PYTHON_MISSING=1
) else (
    echo [OK] Python found
)

echo.

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS (Long Term Support) version
    set NODE_MISSING=1
) else (
    echo [OK] Node.js found
)

echo.

REM If prerequisites missing, exit
if defined PYTHON_MISSING (
    echo ========================================
    echo Please install Python and restart your terminal
    echo ========================================
    pause
    exit /b 1
)

if defined NODE_MISSING (
    echo ========================================
    echo Please install Node.js and restart your terminal
    echo ========================================
    pause
    exit /b 1
)

REM Install Backend Dependencies
echo ========================================
echo Installing Backend Dependencies...
echo ========================================
cd backend
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed
cd ..

echo.

REM Install Frontend Dependencies
echo ========================================
echo Installing Frontend Dependencies...
echo ========================================
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Start Backend (Terminal 1):
echo    cd backend
echo    python app.py
echo.
echo 2. Start Frontend (Terminal 2):
echo    cd frontend
echo    npm start
echo.
echo Default Login:
echo    Email: ********@businessdiary.com
echo    Password: ******
echo.
pause
