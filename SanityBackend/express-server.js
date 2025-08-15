const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3333;

// Serve static files from the dist directory with proper MIME types
app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'text/javascript');
    }
  }
}));

// Handle SPA routing - serve index.html for all routes (but not for .mjs files)
app.get('*', (req, res) => {
  if (req.path.endsWith('.mjs')) {
    return res.status(404).send('Module not found');
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`
🚀 Sanity Studio server running at http://localhost:${PORT}
📁 Serving files from: ${path.join(__dirname, 'dist')}
  `);
});
