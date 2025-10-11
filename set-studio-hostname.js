const { execSync } = require('child_process');

console.log('🚀 Setting Sanity Studio hostname to: intelli-vizax-studio\n');

try {
  // Try to deploy with the hostname
  const result = execSync('npx sanity deploy', {
    cwd: __dirname + '/SanityBackend',
    stdio: 'pipe',
    input: 'intelli-vizax-studio\n'
  });
  
  console.log(result.toString());
  console.log('\n✅ Deployment successful!');
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.stdout) console.log(error.stdout.toString());
  if (error.stderr) console.log(error.stderr.toString());
}

