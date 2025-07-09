// Simple test to check if TypeScript compilation works
const { execSync } = require('child_process');

console.log('Testing TypeScript compilation...');

try {
  const result = execSync('npx tsc --noEmit --skipLibCheck', { 
    encoding: 'utf8',
    timeout: 30000,
    cwd: process.cwd()
  });
  console.log('✅ TypeScript compilation successful');
  console.log('Output:', result);
} catch (error) {
  console.log('❌ TypeScript compilation failed');
  console.log('Error:', error.message);
  console.log('Stdout:', error.stdout);
  console.log('Stderr:', error.stderr);
}
