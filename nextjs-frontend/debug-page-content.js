// Debug what's actually in the page content
const http = require('http');

console.log('🔍 Debugging page content...');

const req = http.request('http://localhost:3001/sponsorship/register', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('📄 Full page content analysis:');
    console.log('=' .repeat(50));
    
    // Look for error messages
    if (data.includes('Error')) {
      console.log('🚨 ERRORS FOUND:');
      const errorMatches = data.match(/Error[^<]*/g);
      if (errorMatches) {
        errorMatches.forEach(error => console.log(`  - ${error}`));
      }
    }
    
    // Look for webpack issues
    if (data.includes('webpack')) {
      console.log('🚨 WEBPACK ISSUES:');
      const webpackMatches = data.match(/webpack[^<]*/g);
      if (webpackMatches) {
        webpackMatches.forEach(issue => console.log(`  - ${issue}`));
      }
    }
    
    // Look for form elements
    console.log('\n📝 FORM ANALYSIS:');
    console.log(`Contains <form>: ${data.includes('<form')}`);
    console.log(`Contains </form>: ${data.includes('</form>')}`);
    console.log(`Contains input: ${data.includes('<input')}`);
    console.log(`Contains button: ${data.includes('<button')}`);
    console.log(`Contains select: ${data.includes('<select')}`);
    
    // Look for specific content
    console.log('\n🎯 CONTENT ANALYSIS:');
    console.log(`Contains "Sponsor Registration": ${data.includes('Sponsor Registration')}`);
    console.log(`Contains "sponsor": ${data.includes('sponsor')}`);
    console.log(`Contains "Conference Selection": ${data.includes('Conference Selection')}`);
    console.log(`Contains "Company Details": ${data.includes('Company Details')}`);
    
    // Look for Next.js specific content
    console.log('\n⚛️ NEXT.JS ANALYSIS:');
    console.log(`Contains _next: ${data.includes('_next')}`);
    console.log(`Contains __next: ${data.includes('__next')}`);
    console.log(`Contains hydration: ${data.includes('hydration')}`);
    
    // Show first 1000 characters of body content
    const bodyMatch = data.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    if (bodyMatch) {
      console.log('\n📖 BODY CONTENT (first 1000 chars):');
      console.log('-'.repeat(50));
      console.log(bodyMatch[1].substring(0, 1000));
      console.log('-'.repeat(50));
    }
    
    // Look for specific error patterns
    const errorPatterns = [
      'Event handlers cannot be passed to Client Component props',
      'Module not found',
      'TypeError',
      'ReferenceError',
      'SyntaxError',
      'Hydration failed',
      'Text content does not match'
    ];
    
    console.log('\n🔍 ERROR PATTERN SEARCH:');
    errorPatterns.forEach(pattern => {
      const found = data.includes(pattern);
      console.log(`${found ? '❌' : '✅'} ${pattern}: ${found ? 'FOUND' : 'Not found'}`);
    });
  });
});

req.on('error', (err) => {
  console.log(`❌ Request failed: ${err.message}`);
});

req.end();
