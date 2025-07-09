const fs = require('fs');
const path = require('path');

// Simple CSS validation to check for unclosed braces
function validateCSS(cssContent) {
  let braceCount = 0;
  let lineNumber = 1;
  const errors = [];
  
  for (let i = 0; i < cssContent.length; i++) {
    const char = cssContent[i];
    
    if (char === '\n') {
      lineNumber++;
    } else if (char === '{') {
      braceCount++;
    } else if (char === '}') {
      braceCount--;
      if (braceCount < 0) {
        errors.push(`Extra closing brace at line ${lineNumber}`);
        braceCount = 0; // Reset to continue checking
      }
    }
  }
  
  if (braceCount > 0) {
    errors.push(`${braceCount} unclosed brace(s) found`);
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    braceCount: braceCount
  };
}

try {
  const cssPath = path.join(__dirname, 'nextjs-frontend', 'src', 'app', 'globals.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  console.log('🔍 Validating CSS file...');
  console.log(`📄 File: ${cssPath}`);
  console.log(`📏 Size: ${cssContent.length} characters`);
  
  const validation = validateCSS(cssContent);
  
  if (validation.isValid) {
    console.log('✅ CSS validation passed - no syntax errors found');
  } else {
    console.log('❌ CSS validation failed:');
    validation.errors.forEach(error => {
      console.log(`   - ${error}`);
    });
  }
  
  console.log(`🔢 Final brace count: ${validation.braceCount}`);
  
} catch (error) {
  console.error('❌ Error reading CSS file:', error.message);
}
