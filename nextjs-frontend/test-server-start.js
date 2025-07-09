// Test if we can start the Next.js server
const { spawn } = require('child_process');

console.log('🚀 Starting Next.js development server...');

const nextProcess = spawn('npm', ['run', 'dev'], {
  cwd: process.cwd(),
  stdio: 'pipe',
  shell: true
});

let serverStarted = false;
let startupTimeout;

// Set a timeout for server startup
startupTimeout = setTimeout(() => {
  if (!serverStarted) {
    console.log('❌ Server startup timed out after 60 seconds');
    nextProcess.kill();
    process.exit(1);
  }
}, 60000);

nextProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('STDOUT:', output);
  
  // Check for successful startup
  if (output.includes('Ready') || output.includes('started server') || output.includes('Local:')) {
    console.log('✅ Server started successfully!');
    serverStarted = true;
    clearTimeout(startupTimeout);
    
    // Test the server
    setTimeout(() => {
      console.log('🧪 Testing server response...');
      const http = require('http');
      
      const req = http.request('http://localhost:3000', (res) => {
        console.log('✅ Server is responding! Status:', res.statusCode);
        nextProcess.kill();
        process.exit(0);
      });
      
      req.on('error', (err) => {
        console.log('❌ Server test failed:', err.message);
        nextProcess.kill();
        process.exit(1);
      });
      
      req.end();
    }, 2000);
  }
});

nextProcess.stderr.on('data', (data) => {
  const output = data.toString();
  console.log('STDERR:', output);
  
  // Check for compilation errors
  if (output.includes('Failed to compile') || output.includes('Type error')) {
    console.log('❌ Compilation failed');
    nextProcess.kill();
    process.exit(1);
  }
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  clearTimeout(startupTimeout);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Terminating Next.js process...');
  nextProcess.kill();
  process.exit(0);
});
