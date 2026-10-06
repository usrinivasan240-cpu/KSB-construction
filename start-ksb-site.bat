@echo off
title KSB Constructions - Local Server
cd /d "D:\sri project for aasihk\construction"

echo ============================================
echo  KSB CONSTRUCTIONS - local server
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not in PATH.
  echo Please install Node.js LTS from https://nodejs.org/ then double-click this file again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [1/2] Installing dependencies (first run only)...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed. Check your internet connection.
    pause
    exit /b 1
  )
)

if not exist ".next" (
  echo [2/2] Building production site (first run only)...
  call npm run build
  if errorlevel 1 (
    echo [ERROR] Build failed. See the messages above.
    pause
    exit /b 1
  )
)

echo.
echo  Site is live at:  http://localhost:3000
echo  Press Ctrl+C to stop the server.
echo.
start "" "http://localhost:3000"
call npm run start
pause
