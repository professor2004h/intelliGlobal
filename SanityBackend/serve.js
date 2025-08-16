const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3333;
const distPath = path.join(__dirname, 'dist');

console.log('Starting Sanity Studio server...');
console.log('Dist path:', distPath);
console.log('Port:', port);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    // If file doesn't exist, serve index.html for SPA routing (but not for .mjs files)
    if (path.extname(req.url).toLowerCase() === '.mjs') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Module not found', 'utf-8');
      return;
    }
    filePath = path.join(distPath, 'index.html');
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  // Force .mjs files to be served as JavaScript modules
  const contentType = extname === '.mjs' ? 'text/javascript' : (mimeTypes[extname] || 'application/octet-stream');
  console.log(`File: ${filePath}, Extension: ${extname}, Content-Type: ${contentType}`);

  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.error('Error reading file:', error);
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`🚀 Sanity Studio server running at http://localhost:${port}`);
  console.log(`📁 Serving files from: ${distPath}`);
  console.log('✅ Server started successfully!');
});

server.on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${port} is already in use. Please try a different port.`);
  } else {
    console.log(`❌ Server error: ${err.message}`);
  }
});
