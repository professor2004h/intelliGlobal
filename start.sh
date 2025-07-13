#!/bin/sh

echo "🚀 Starting Event Website..."
echo "📊 Environment: $NODE_ENV"
echo "🌐 Port: $PORT"
echo "🏠 Hostname: $HOSTNAME"
echo "👤 User: $(whoami)"
echo "📁 Working Directory: $(pwd)"

# Show environment variables
echo "🔧 Environment Variables:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "HOSTNAME: $HOSTNAME"
echo "NEXT_PUBLIC_SANITY_PROJECT_ID: $NEXT_PUBLIC_SANITY_PROJECT_ID"

# List current directory contents
echo "📂 Directory contents:"
ls -la

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found!"
    echo "🔍 Looking for Next.js files..."
    find . -name "*.js" -type f | head -10
    echo "🔍 Looking in .next directory..."
    ls -la .next/ 2>/dev/null || echo "No .next directory found"
    exit 1
fi

echo "✅ server.js found, starting application..."
echo "🔧 Node.js version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

# Show server.js content preview
echo "📄 Server.js preview:"
head -10 server.js

# Start the Next.js server with error handling
echo "🎯 Starting Next.js server on port $PORT..."
echo "🌐 Server will be available at http://$HOSTNAME:$PORT"

# Start with verbose logging
exec node server.js
