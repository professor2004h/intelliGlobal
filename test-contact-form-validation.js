// Test Contact Form API with Phone Number Validation
console.log('🧪 Testing Contact Form API with Phone Validation...');
console.log('==================================================');

const testContactFormSubmission = async (formData, expectedStatus, description) => {
  try {
    console.log(`\n📝 Test: ${description}`);
    console.log('Form Data:', JSON.stringify(formData, null, 2));
    
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const result = await response.json();
    const status = response.status === expectedStatus ? '✅ PASS' : '❌ FAIL';
    
    console.log(`${status} - Expected Status: ${expectedStatus}, Got: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return response.status === expectedStatus;
  } catch (error) {
    console.log('❌ FAIL - Network Error:', error.message);
    return false;
  }
};

const runTests = async () => {
  console.log('🚀 Starting Contact Form API Tests...');
  
  const testCases = [
    // Valid submission
    {
      formData: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters.'
      },
      expectedStatus: 200,
      description: 'Valid form submission with all required fields'
    },
    
    // Missing phone number
    {
      formData: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters.'
      },
      expectedStatus: 400,
      description: 'Missing phone number (should fail)'
    },
    
    // Invalid phone number format
    {
      formData: {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phone: 'invalid-phone',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters.'
      },
      expectedStatus: 400,
      description: 'Invalid phone number format (should fail)'
    },
    
    // Valid phone with different format
    {
      formData: {
        name: 'Alice Brown',
        email: 'alice.brown@example.com',
        phone: '(555) 123-4567',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters.'
      },
      expectedStatus: 200,
      description: 'Valid phone number with US format'
    },
    
    // Valid international phone
    {
      formData: {
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        phone: '+44 20 4571 8752',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters.'
      },
      expectedStatus: 200,
      description: 'Valid international phone number'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    const result = await testContactFormSubmission(
      testCase.formData,
      testCase.expectedStatus,
      testCase.description
    );
    
    if (result) {
      passed++;
    } else {
      failed++;
    }
    
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Test Summary:');
  console.log('================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All API tests passed! Phone validation is working correctly in the contact form.');
  } else {
    console.log('\n⚠️  Some API tests failed. Please check the server logs.');
  }
};

// Check if server is running first
const checkServer = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    if (response.ok) {
      console.log('✅ Server is running, proceeding with tests...');
      await runTests();
    } else {
      console.log('❌ Server health check failed');
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start the development server first:');
    console.log('   cd nextjs-frontend && npm run dev');
    console.log('\nError:', error.message);
  }
};

checkServer();
