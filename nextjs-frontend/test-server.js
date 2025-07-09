// Simple test to check if Next.js can start
const { spawn } = require('child_process');

console.log('🚀 Testing Next.js server startup...');

const nextProcess = spawn('npx', ['next', 'dev', '--port', '3001'], {
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (error) => {
  console.error('❌ Server startup error:', error);
});

nextProcess.on('exit', (code) => {
  console.log(`Server exited with code: ${code}`);
});

// Kill after 30 seconds for testing
setTimeout(() => {
  console.log('⏰ Killing test server...');
  nextProcess.kill();
}, 30000);
