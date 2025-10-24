const https = require('https');
const fs = require('fs');

const PROJECT_ID = '99kpz7t0';

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

function getProjectInfo() {
  return new Promise((resolve, reject) => {
    const token = getSanityAuthToken();
    
    if (!token) {
      reject(new Error('No auth token'));
      return;
    }

    const options = {
      hostname: 'api.sanity.io',
      port: 443,
      path: `/v2021-06-07/projects/${PROJECT_ID}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    console.log('Fetching project info for:', PROJECT_ID);
    const info = await getProjectInfo();
    console.log('\nProject Info:');
    console.log('=============');
    console.log('ID:', info.id);
    console.log('Name:', info.displayName);
    console.log('Organization:', info.organizationId);
    console.log('Studio Host:', info.studioHost || 'Not set');
    console.log('Metadata:', JSON.stringify(info.metadata || {}, null, 2));
    console.log('\nFull response:', JSON.stringify(info, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();

