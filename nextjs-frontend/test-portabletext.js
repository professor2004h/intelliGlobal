// Test Portable Text imports
console.log('Testing Portable Text imports...');

try {
  const { PortableText } = require('@portabletext/react');
  console.log('✅ @portabletext/react imported successfully');
  console.log('PortableText component:', typeof PortableText);
} catch (error) {
  console.error('❌ Error importing @portabletext/react:', error.message);
}

try {
  const { PortableTextBlock } = require('@portabletext/types');
  console.log('✅ @portabletext/types imported successfully');
  console.log('PortableTextBlock type:', typeof PortableTextBlock);
} catch (error) {
  console.error('❌ Error importing @portabletext/types:', error.message);
}

console.log('Test completed.');
