// Test Phone Number Validation
console.log('🧪 Testing Phone Number Validation...');
console.log('=====================================');

// Test phone number regex pattern
const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;

const testCases = [
  // Valid phone numbers
  { phone: '+1234567890', expected: true, description: 'International format with +' },
  { phone: '1234567890', expected: true, description: 'Basic 10 digits' },
  { phone: '+44 20 4571 8752', expected: true, description: 'UK format with spaces' },
  { phone: '(555) 123-4567', expected: true, description: 'US format with parentheses and dash' },
  { phone: '555-123-4567', expected: true, description: 'US format with dashes' },
  { phone: '555 123 4567', expected: true, description: 'US format with spaces' },
  
  // Invalid phone numbers
  { phone: '123', expected: false, description: 'Too short (less than 7 digits)' },
  { phone: '12345678901234567890123', expected: false, description: 'Too long (more than 20 characters)' },
  { phone: 'abc123def', expected: false, description: 'Contains letters' },
  { phone: '123@456#789', expected: false, description: 'Contains special characters' },
  { phone: '', expected: false, description: 'Empty string' },
  { phone: '   ', expected: false, description: 'Only spaces' },
];

console.log('\n📋 Test Results:');
console.log('================');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = phoneRegex.test(testCase.phone.trim());
  const status = result === testCase.expected ? '✅ PASS' : '❌ FAIL';
  
  console.log(`${index + 1}. ${status} - ${testCase.description}`);
  console.log(`   Input: "${testCase.phone}"`);
  console.log(`   Expected: ${testCase.expected}, Got: ${result}`);
  console.log('');
  
  if (result === testCase.expected) {
    passed++;
  } else {
    failed++;
  }
});

console.log('📊 Summary:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Phone validation is working correctly.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the regex pattern.');
}

// Test form validation function
console.log('\n🔍 Testing Form Validation Logic...');
console.log('===================================');

function validatePhoneNumber(phone) {
  if (!phone || !phone.trim()) {
    return 'Phone number is required';
  }
  
  if (!phoneRegex.test(phone.trim())) {
    return 'Please enter a valid phone number';
  }
  
  return null; // No error
}

const formTestCases = [
  { phone: '+1234567890', expectedError: null },
  { phone: '', expectedError: 'Phone number is required' },
  { phone: '   ', expectedError: 'Phone number is required' },
  { phone: 'invalid', expectedError: 'Please enter a valid phone number' },
  { phone: '555-123-4567', expectedError: null },
];

formTestCases.forEach((testCase, index) => {
  const error = validatePhoneNumber(testCase.phone);
  const status = error === testCase.expectedError ? '✅ PASS' : '❌ FAIL';
  
  console.log(`${index + 1}. ${status} - Input: "${testCase.phone}"`);
  console.log(`   Expected Error: ${testCase.expectedError || 'None'}`);
  console.log(`   Actual Error: ${error || 'None'}`);
  console.log('');
});

console.log('✅ Phone number validation testing complete!');
