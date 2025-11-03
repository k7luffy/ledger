#!/bin/bash

# Start development environment for Personal Ledger

echo "🚀 Starting Personal Ledger Development Environment..."
echo ""

# Check if ports are available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 3000 is already in use. Please stop the process using this port."
    exit 1
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 3001 is already in use. Please stop the process using this port."
    exit 1
fi

echo "✅ Ports 3000 and 3001 are available"
echo ""

# Start JSON Server in background
echo "🔧 Starting JSON Server (Backend API) on port 3001..."
npx json-server --config json-server.json --watch db.json &
JSON_SERVER_PID=$!

# Wait for JSON Server to start
sleep 3

# Check if JSON Server is running
if curl -s http://localhost:3001/transactions > /dev/null; then
    echo "✅ JSON Server started successfully"
else
    echo "❌ Failed to start JSON Server"
    kill $JSON_SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🌐 Starting React Development Server on port 3000..."
echo ""

# Start React dev server
npm run dev

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $JSON_SERVER_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT

# Wait for React dev server
wait
