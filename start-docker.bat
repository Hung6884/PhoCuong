@echo off
echo ====================================
echo   PHO CUONG - Docker Production
echo ====================================
echo.

REM Build frontend first
echo [1/2] Building React frontend...
cd frontend
call npm install
call npm run build
cd ..

REM Run all with docker-compose
echo [2/2] Starting all services...
docker-compose up --build -d

echo.
echo ====================================
echo   Production mode started!
echo   App: http://localhost:8080
echo ====================================
pause
