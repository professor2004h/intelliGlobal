const { schemaTypes } = require('./schemaTypes/index.ts');

console.log('🔍 Validating Sanity Schema...');

try {
  // Check if all schema types are properly defined
  console.log(`📋 Found ${schemaTypes.length} schema types:`);
  
  schemaTypes.forEach((schema, index) => {
    console.log(`${index + 1}. ${schema.name} (${schema.type})`);
    
    // Check for duplicate field names
    if (schema.fields) {
      const fieldNames = schema.fields.map(field => field.name);
      const duplicates = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
      
      if (duplicates.length > 0) {
        console.error(`❌ DUPLICATE FIELDS in ${schema.name}:`, duplicates);
      } else {
        console.log(`✅ No duplicate fields in ${schema.name}`);
      }
    }
  });
  
  // Check specifically for sponsorRegistration schema
  const sponsorRegistration = schemaTypes.find(schema => schema.name === 'sponsorRegistration');
  if (sponsorRegistration) {
    console.log('\n🎯 Checking sponsorRegistration schema:');
    console.log(`- Fields count: ${sponsorRegistration.fields.length}`);
    
    const customAmountFields = sponsorRegistration.fields.filter(field => field.name === 'customAmount');
    console.log(`- customAmount fields: ${customAmountFields.length}`);
    
    if (customAmountFields.length > 1) {
      console.error('❌ DUPLICATE customAmount fields found!');
    } else {
      console.log('✅ No duplicate customAmount fields');
    }
  }
  
  console.log('\n✅ Schema validation completed successfully!');
  
} catch (error) {
  console.error('❌ Schema validation failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
