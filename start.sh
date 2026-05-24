#!/bin/bash

echo "Starting Billboard..."

# Start backend
cd backend
uv run uvicorn main:app --reload &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo "Waiting for backend..."
sleep 3

# Start frontend
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Open browser
sleep 2
open http://localhost:5173

echo "Billboard is running!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both servers."

# Keep script running and kill both on exit
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait