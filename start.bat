@echo off
echo Starting Billboard...

:: Start backend
start "Billboard Backend" cmd /k "cd backend && uv run uvicorn main:app --reload"

:: Wait for backend to be ready
timeout /t 3 /nobreak > nul

:: Start frontend
start "Billboard Frontend" cmd /k "cd frontend && npm run dev"

:: Wait for frontend to be ready
timeout /t 2 /nobreak > nul

:: Open browser
start http://localhost:5173

echo Billboard is running!
echo Close the terminal windows to stop the servers.