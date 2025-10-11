const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');

const PROJECT_ID = '80vqb77v';
const DESIRED_HOSTNAME = 'intelli-vizax';

// Try to get the auth token from Sanity CLI config
function getSanityAuthToken() {
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const configPath = `${homeDir}/.config/sanity/config.json`;
    
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config.authToken || config.token;
    }
  } catch (error) {
    console.log('⚠️  Could not read Sanity auth token from config');
  }
  return null;
}

// Function to set studio hostname via Sanity API
function setStudioHostname(hostname) {
  return new Promise((resolve, reject) => {
    const token = getSanityAuthToken();
    
    if (!token) {
      console.log('❌ No auth token found. Please run: npx sanity login');
      reject(new Error('No auth token'));
      return;
    }

    const data = JSON.stringify({
      studioHost: hostname
    });

    const options = {
      hostname: 'api.sanity.io',
      port: 443,
      path: `/v2021-06-07/projects/${PROJECT_ID}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Studio hostname set successfully!');
          resolve(responseData);
        } else {
          console.log(`❌ Failed to set hostname. Status: ${res.statusCode}`);
          console.log('Response:', responseData);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Error setting hostname:', error.message);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Main execution
async function main() {
  console.log('🚀 Sanity Studio Deployment Script');
  console.log('=====================================\n');
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log(`Desired Hostname: ${DESIRED_HOSTNAME}`);
  console.log(`Studio URL: https://${DESIRED_HOSTNAME}.sanity.studio\n`);

  try {
    // Step 1: Try to set the hostname
    console.log('📝 Step 1: Setting studio hostname...');
    try {
      await setStudioHostname(DESIRED_HOSTNAME);
    } catch (error) {
      console.log('⚠️  Could not set hostname via API (this is normal if already set)');
      console.log('   Proceeding with deployment...\n');
    }

    // Step 2: Build the studio
    console.log('🔨 Step 2: Building Sanity Studio...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build complete!\n');

    // Step 3: Deploy
    console.log('🚀 Step 3: Deploying to Sanity hosting...');
    console.log('   If prompted for hostname, enter: ' + DESIRED_HOSTNAME + '\n');
    
    try {
      execSync('npm run deploy', { stdio: 'inherit' });
      console.log('\n✅ Deployment successful!');
      console.log(`\n🎉 Your studio is available at: https://${DESIRED_HOSTNAME}.sanity.studio`);
    } catch (deployError) {
      console.log('\n⚠️  Deployment encountered an issue.');
      console.log('\n📋 Manual deployment steps:');
      console.log('1. Run: npx sanity deploy');
      console.log(`2. When prompted, enter hostname: ${DESIRED_HOSTNAME}`);
      console.log('3. Or try alternative hostnames:');
      console.log('   - intelli-vizax-studio');
      console.log('   - vizax-intelli');
      console.log('   - intelliglobal-vizax');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

