const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3333;

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/test') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Server Test</title>
      </head>
      <body>
        <h1>🚀 Server is working!</h1>
        <p>Time: ${new Date().toISOString()}</p>
        <p>Port: ${port}</p>
      </body>
      </html>
    `);
    return;
  }
  
  // Serve index.html for all other requests
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 - File not found</h1><p>dist/index.html does not exist</p>');
  }
});

server.listen(port, () => {
  console.log(`🚀 Test server running at http://localhost:${port}`);
  console.log(`📁 Test URL: http://localhost:${port}/test`);
  console.log(`📁 Dist path: ${path.join(__dirname, 'dist')}`);
  console.log(`📁 Test HTML: http://localhost:${port}/test.html`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
