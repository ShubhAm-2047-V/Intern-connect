@echo off
echo ==========================================
echo   InternConnect - One Click Launcher
echo ==========================================

echo [1/2] Starting Backend Server...
start "InternConnect Backend" cmd /k "cd server && npm run dev"

echo [2/2] Opening Frontend...
rem Waiting a few seconds for backend to initialize...
timeout /t 3 /nobreak >nul
start http://localhost:5000

echo ==========================================
echo   App is running!
echo   Backend: http://localhost:5000
echo   Frontend: Opened in your browser
echo ==========================================
pause
