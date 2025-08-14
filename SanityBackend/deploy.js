const { spawn } = require('child_process');

console.log('🚀 Starting Sanity Studio deployment...');

async function deploy() {
  try {
    // Build the studio first
    console.log('📦 Building Sanity Studio...');
    await runCommand('npx', ['sanity', 'build']);

    // Deploy with hostname
    console.log('🌐 Deploying to intelliglobalconferences.sanity.studio...');
    const deployProcess = spawn('npx', ['sanity', 'deploy'], { stdio: ['pipe', 'inherit', 'inherit'] });

    // Send the hostname when prompted
    setTimeout(() => {
      deployProcess.stdin.write('intelliglobalconferences\n');
    }, 2000);

    await new Promise((resolve, reject) => {
      deployProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Deploy process exited with code ${code}`));
        }
      });
    });

    console.log('✅ Deployment completed successfully!');
    console.log('🔗 Studio URL: https://intelliglobalconferences.sanity.studio');

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit' });
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

deploy();
