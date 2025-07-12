// Verify Phone Field Implementation
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Phone Number Field Implementation...');
console.log('=================================================');

// Check ContactForm.tsx
const contactFormPath = path.join(__dirname, 'nextjs-frontend/src/app/components/ContactForm.tsx');
const contactFormContent = fs.readFileSync(contactFormPath, 'utf8');

console.log('\n📋 ContactForm.tsx Analysis:');
console.log('============================');

// Check placeholder text
const placeholderMatch = contactFormContent.match(/placeholder="([^"]*phone[^"]*)"i/i);
if (placeholderMatch) {
  const placeholder = placeholderMatch[1];
  console.log(`✅ Placeholder found: "${placeholder}"`);
  
  if (placeholder.includes('*') || placeholder.toLowerCase().includes('required')) {
    console.log('✅ Phone field shows as REQUIRED');
  } else if (placeholder.toLowerCase().includes('optional')) {
    console.log('❌ Phone field still shows as OPTIONAL');
  } else {
    console.log('⚠️  Phone field placeholder is neutral');
  }
} else {
  console.log('❌ Phone placeholder not found');
}

// Check required attribute
const requiredMatch = contactFormContent.match(/type="tel"[\s\S]*?required/);
if (requiredMatch) {
  console.log('✅ Required attribute found on phone input');
} else {
  console.log('❌ Required attribute missing on phone input');
}

// Check validation logic
const phoneValidationMatch = contactFormContent.match(/if\s*\(\s*!formData\.phone\.trim\(\)\s*\)/);
if (phoneValidationMatch) {
  console.log('✅ Phone validation logic found');
} else {
  console.log('❌ Phone validation logic missing');
}

// Check API route
const apiRoutePath = path.join(__dirname, 'nextjs-frontend/src/app/api/contact/route.ts');
const apiRouteContent = fs.readFileSync(apiRoutePath, 'utf8');

console.log('\n📋 API Route Analysis:');
console.log('======================');

// Check server-side validation
const serverValidationMatch = apiRouteContent.match(/!phone/);
if (serverValidationMatch) {
  console.log('✅ Server-side phone validation found');
} else {
  console.log('❌ Server-side phone validation missing');
}

// Check phone regex validation
const phoneRegexMatch = apiRouteContent.match(/phoneRegex\.test\(phone/);
if (phoneRegexMatch) {
  console.log('✅ Phone format validation found');
} else {
  console.log('❌ Phone format validation missing');
}

console.log('\n📊 Implementation Status:');
console.log('=========================');

let score = 0;
let total = 5;

if (placeholderMatch && (placeholderMatch[1].includes('*') || placeholderMatch[1].toLowerCase().includes('required'))) {
  score++;
  console.log('✅ 1. Placeholder shows required');
} else {
  console.log('❌ 1. Placeholder does not show required');
}

if (requiredMatch) {
  score++;
  console.log('✅ 2. Required attribute present');
} else {
  console.log('❌ 2. Required attribute missing');
}

if (phoneValidationMatch) {
  score++;
  console.log('✅ 3. Client-side validation implemented');
} else {
  console.log('❌ 3. Client-side validation missing');
}

if (serverValidationMatch) {
  score++;
  console.log('✅ 4. Server-side validation implemented');
} else {
  console.log('❌ 4. Server-side validation missing');
}

if (phoneRegexMatch) {
  score++;
  console.log('✅ 5. Phone format validation implemented');
} else {
  console.log('❌ 5. Phone format validation missing');
}

console.log(`\n🎯 Implementation Score: ${score}/${total} (${((score/total)*100).toFixed(1)}%)`);

if (score === total) {
  console.log('🎉 PERFECT! All phone field requirements implemented correctly!');
  console.log('\n💡 If you still see "Optional" in browser:');
  console.log('   1. Clear browser cache (Ctrl+Shift+R)');
  console.log('   2. Restart development server');
  console.log('   3. Try incognito/private browsing mode');
} else {
  console.log('⚠️  Some requirements are missing. Check the analysis above.');
}

console.log('\n🔗 Test URLs:');
console.log('   Contact Form: http://localhost:3000/contact');
console.log('   Sponsorship Form: http://localhost:3000/sponsorship/register');

console.log('\n✅ Verification complete!');
