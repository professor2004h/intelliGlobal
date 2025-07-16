const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3333;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`
🚀 Sanity Studio server running at http://localhost:${PORT}
📁 Serving files from: ${path.join(__dirname, 'dist')}
  `);
});
