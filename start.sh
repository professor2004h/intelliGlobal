#!/bin/sh

echo "🚀 Starting Event Website..."
echo "📊 Environment: $NODE_ENV"
echo "🌐 Port: $PORT"
echo "🏠 Hostname: $HOSTNAME"

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found!"
    echo "📁 Current directory contents:"
    ls -la
    exit 1
fi

echo "✅ server.js found, starting application..."

# Start the Next.js server
exec node server.js
