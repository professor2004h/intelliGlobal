const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');

const PROJECT_ID = '80vqb77v';
const STUDIO_HOSTNAME = 'intelli-vizax';

function getSanityAuthToken() {
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    const configPath = `${homeDir}/.config/sanity/config.json`;
    
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config.authToken || config.token;
    }
  } catch (error) {
    console.log('Could not read Sanity auth token');
  }
  return null;
}

async function deployStudio() {
  console.log('🚀 Manual Sanity Studio Deployment');
  console.log('===================================\n');
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log(`Studio Hostname: ${STUDIO_HOSTNAME}`);
  console.log(`Target URL: https://${STUDIO_HOSTNAME}.sanity.studio\n`);

  const token = getSanityAuthToken();
  if (!token) {
    console.error('❌ No auth token found. Please run: npx sanity login');
    process.exit(1);
  }

  // Check if dist folder exists
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.log('📦 Building studio first...');
    execSync('npm run build', { stdio: 'inherit' });
  }

  console.log('✅ Build folder found at:', distPath);
  console.log('\n📤 Uploading studio files...');

  // The Sanity deploy command uses a tarball upload
  // Let's try using the CLI with explicit parameters
  try {
    console.log('\nAttempting deployment via CLI...');
    
    // Set environment variable to force hostname
    process.env.SANITY_STUDIO_HOSTNAME = STUDIO_HOSTNAME;
    
    const deployCmd = `npx sanity deploy --no-build`;
    console.log(`Running: ${deployCmd}\n`);
    
    execSync(deployCmd, { 
      stdio: 'inherit',
      env: {
        ...process.env,
        SANITY_STUDIO_HOSTNAME: STUDIO_HOSTNAME
      }
    });
    
    console.log(`\n✅ Deployment successful!`);
    console.log(`🎉 Studio URL: https://${STUDIO_HOSTNAME}.sanity.studio`);
    
  } catch (error) {
    console.error('\n❌ Deployment failed');
    console.log('\n📋 Alternative: Deploy via Sanity Management');
    console.log('1. Visit: https://www.sanity.io/manage/project/' + PROJECT_ID);
    console.log('2. Go to "API" → "Studio"');
    console.log('3. Set hostname to: ' + STUDIO_HOSTNAME);
    console.log('4. Upload the dist folder manually');
    console.log('\nOr try these hostnames if "intelli-vizax" is taken:');
    console.log('- intelli-vizax-2025');
    console.log('- vizax-intelli');
    console.log('- intelliglobal-vizax');
  }
}

deployStudio();

