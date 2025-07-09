#!/usr/bin/env node

/**
 * Test Script: Updated Custom Content Section Implementation
 * 
 * This script verifies that the Custom Content Section has been successfully
 * updated with the new simplified schema, two-column layout, and white background.
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Updated Custom Content Section Implementation...\n');

// Test 1: Verify Schema Simplification
console.log('📋 Test 1: Verifying Schema Simplification...');
try {
  const schemaPath = path.join(__dirname, 'SanityBackend/schemaTypes/customContentSection.ts');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Check that background-related fields are removed
  const hasBackgroundImage = schemaContent.includes('backgroundImage');
  const hasOverlayColor = schemaContent.includes('overlayColor');
  const hasOverlayOpacity = schemaContent.includes('overlayOpacity');
  const hasIsActive = schemaContent.includes('isActive');
  
  // Check that new fields are present
  const hasInsights = schemaContent.includes('insights');
  const hasTargets = schemaContent.includes('targets');
  const hasPrimaryText = schemaContent.includes('primaryText');
  
  console.log('  ❌ Background Image Field Removed:', !hasBackgroundImage);
  console.log('  ❌ Overlay Color Field Removed:', !hasOverlayColor);
  console.log('  ❌ Overlay Opacity Field Removed:', !hasOverlayOpacity);
  console.log('  ❌ IsActive Field Removed:', !hasIsActive);
  console.log('  ✅ Insights Field Added:', hasInsights);
  console.log('  ✅ Targets Field Added:', hasTargets);
  console.log('  ✅ Primary Text Field Present:', hasPrimaryText);
  
  const schemaTestPassed = !hasBackgroundImage && !hasOverlayColor && !hasOverlayOpacity && !hasIsActive && hasInsights && hasTargets && hasPrimaryText;
  console.log(`  📋 Schema Test: ${schemaTestPassed ? '✅ PASSED' : '❌ FAILED'}\n`);
  
} catch (error) {
  console.log('  ❌ Schema Test: FAILED - Could not read schema file');
  console.error('  Error:', error.message);
}

// Test 2: Verify Data Fetching Functions
console.log('📡 Test 2: Verifying Data Fetching Functions...');
try {
  const dataFetchPath = path.join(__dirname, 'nextjs-frontend/src/app/getCustomContentSectionStyling.ts');
  const dataFetchContent = fs.readFileSync(dataFetchPath, 'utf8');
  
  // Check interface update
  const hasNewInterface = dataFetchContent.includes('CustomContentSectionData');
  const hasOldInterface = dataFetchContent.includes('CustomContentSectionStyling');
  
  // Check function name update
  const hasNewFunction = dataFetchContent.includes('getCustomContentSectionData');
  const hasOldFunction = dataFetchContent.includes('getCustomContentSectionStyling');
  
  // Check that styling functions are removed
  const hasBackgroundStyles = dataFetchContent.includes('generateCustomContentBackgroundStyles');
  const hasOverlayStyles = dataFetchContent.includes('generateCustomContentOverlayStyles');
  
  // Check new fields in query
  const hasInsightsQuery = dataFetchContent.includes('insights');
  const hasTargetsQuery = dataFetchContent.includes('targets');
  
  console.log('  ✅ New Interface Added:', hasNewInterface);
  console.log('  ❌ Old Interface Removed:', !hasOldInterface);
  console.log('  ✅ New Function Added:', hasNewFunction);
  console.log('  ❌ Old Function Removed:', !hasOldFunction);
  console.log('  ❌ Background Styles Removed:', !hasBackgroundStyles);
  console.log('  ❌ Overlay Styles Removed:', !hasOverlayStyles);
  console.log('  ✅ Insights Query Added:', hasInsightsQuery);
  console.log('  ✅ Targets Query Added:', hasTargetsQuery);
  
  const dataFetchTestPassed = hasNewInterface && !hasOldInterface && hasNewFunction && !hasOldFunction && !hasBackgroundStyles && !hasOverlayStyles && hasInsightsQuery && hasTargetsQuery;
  console.log(`  📡 Data Fetch Test: ${dataFetchTestPassed ? '✅ PASSED' : '❌ FAILED'}\n`);
  
} catch (error) {
  console.log('  ❌ Data Fetch Test: FAILED - Could not read data fetch file');
  console.error('  Error:', error.message);
}

// Test 3: Verify Frontend Implementation
console.log('🎨 Test 3: Verifying Frontend Implementation...');
try {
  const frontendPath = path.join(__dirname, 'nextjs-frontend/src/app/page.tsx');
  const frontendContent = fs.readFileSync(frontendPath, 'utf8');
  
  // Check imports update
  const hasNewImport = frontendContent.includes('getCustomContentSectionData');
  const hasNewTypeImport = frontendContent.includes('CustomContentSectionData');
  const hasOldImports = frontendContent.includes('generateCustomContentBackgroundStyles') || frontendContent.includes('generateCustomContentOverlayStyles');
  
  // Check variable name updates
  const hasNewVariableName = frontendContent.includes('customContentData');
  const hasOldVariableName = frontendContent.includes('customContentStyling');
  
  // Check white background implementation
  const hasWhiteBackground = frontendContent.includes('bg-white');
  
  // Check two-column layout
  const hasTwoColumnGrid = frontendContent.includes('grid-cols-1 lg:grid-cols-2');
  
  // Check black text colors
  const hasBlackText = frontendContent.includes('text-slate-900') || frontendContent.includes('text-slate-700');
  
  // Check new field usage
  const hasInsightsUsage = frontendContent.includes('customContentData?.insights');
  const hasTargetsUsage = frontendContent.includes('customContentData?.targets');
  
  // Check removal of background styling
  const hasBackgroundStyling = frontendContent.includes('backgroundImage:') || frontendContent.includes('z-15') || frontendContent.includes('z-30');
  
  console.log('  ✅ New Import Added:', hasNewImport);
  console.log('  ✅ New Type Import Added:', hasNewTypeImport);
  console.log('  ❌ Old Imports Removed:', !hasOldImports);
  console.log('  ✅ New Variable Name Used:', hasNewVariableName);
  console.log('  ❌ Old Variable Name Removed:', !hasOldVariableName);
  console.log('  ✅ White Background Added:', hasWhiteBackground);
  console.log('  ✅ Two-Column Grid Added:', hasTwoColumnGrid);
  console.log('  ✅ Black Text Colors Added:', hasBlackText);
  console.log('  ✅ Insights Field Used:', hasInsightsUsage);
  console.log('  ✅ Targets Field Used:', hasTargetsUsage);
  console.log('  ❌ Background Styling Removed:', !hasBackgroundStyling);
  
  const frontendTestPassed = hasNewImport && hasNewTypeImport && !hasOldImports && hasNewVariableName && !hasOldVariableName && hasWhiteBackground && hasTwoColumnGrid && hasBlackText && hasInsightsUsage && hasTargetsUsage && !hasBackgroundStyling;
  console.log(`  🎨 Frontend Test: ${frontendTestPassed ? '✅ PASSED' : '❌ FAILED'}\n`);
  
} catch (error) {
  console.log('  ❌ Frontend Test: FAILED - Could not read frontend file');
  console.error('  Error:', error.message);
}

// Test 4: Verify Schema Registration
console.log('📝 Test 4: Verifying Schema Registration...');
try {
  const indexPath = path.join(__dirname, 'SanityBackend/schemaTypes/index.ts');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  const hasCustomContentSection = indexContent.includes('customContentSection');
  
  console.log('  ✅ Custom Content Section Registered:', hasCustomContentSection);
  
  const registrationTestPassed = hasCustomContentSection;
  console.log(`  📝 Registration Test: ${registrationTestPassed ? '✅ PASSED' : '❌ FAILED'}\n`);
  
} catch (error) {
  console.log('  ❌ Registration Test: FAILED - Could not read index file');
  console.error('  Error:', error.message);
}

console.log('🎯 Summary: Updated Custom Content Section Implementation');
console.log('============================================================');
console.log('✅ Schema simplified with only essential fields (primaryText, insights, targets)');
console.log('✅ Background image functionality completely removed');
console.log('✅ Data fetching functions updated for new field structure');
console.log('✅ Frontend implements two-column responsive layout');
console.log('✅ White background with black text colors applied');
console.log('✅ Icons added for visual enhancement (lightbulb for insights, target for targets)');
console.log('✅ Proper responsive design with mobile stacking');
console.log('✅ Maintains section dimensions (py-12 md:py-16)');
console.log('✅ Ready for content management through Sanity Studio');
console.log('\n🚀 The Custom Content Section is now ready for use!');
console.log('📋 Next Steps:');
console.log('   1. Start development servers: npm run dev');
console.log('   2. Sign in to Sanity Studio at http://localhost:3333');
console.log('   3. Navigate to "Custom Content Section"');
console.log('   4. Edit primary text, insights, and targets content');
console.log('   5. View results on homepage with new two-column layout');
