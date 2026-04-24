@echo off
echo ====================================
echo   PHO CUONG - Development Setup
echo ====================================
echo.

REM Start MySQL with Docker
echo [1/3] Starting MySQL...
docker-compose up -d mysql
echo Waiting for MySQL to be ready...
timeout /t 15 /nobreak >nul

REM Start Go backend
echo [2/3] Starting Go Backend...
cd backend
if not exist go.sum (
    echo Downloading Go dependencies...
    go mod tidy
)
copy ..\\.env.example .env 2>nul
start "PhoCuong Backend" cmd /k "go run . && pause"
cd ..

REM Start React frontend
echo [3/3] Starting React Frontend...
cd frontend
if not exist node_modules (
    echo Installing npm packages... (this may take a few minutes)
    npm install
)
start "PhoCuong Frontend" cmd /k "npm run dev && pause"
cd ..

echo.
echo ====================================
echo   Services started!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8080
echo   API docs: http://localhost:8080/health
echo ====================================
echo.
echo Default accounts:
echo   Admin:    admin@phocuong.vn / admin123
echo   Staff:    staff@phocuong.vn / staff123
echo   Customer: customer@phocuong.vn / customer123
echo.
pause
