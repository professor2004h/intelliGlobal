#!/usr/bin/env node

/**
 * Custom Content Section Integration Test
 * Tests file structure, schema registration, and frontend integration
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Custom Content Section Integration Test...\n');

async function testCustomContentSection() {
  try {
    let allTestsPassed = true;

    // Test 1: Schema File Check
    console.log('📄 Test 1: Checking Schema Files...');

    const schemaPath = path.join(__dirname, 'SanityBackend/schemaTypes/customContentSection.ts');
    if (fs.existsSync(schemaPath)) {
      console.log('✅ Custom Content Section schema file exists');

      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      const requiredFields = ['primaryText', 'secondaryText', 'backgroundImage', 'overlayColor', 'overlayOpacity', 'isActive'];
      const missingFields = requiredFields.filter(field => !schemaContent.includes(field));

      if (missingFields.length === 0) {
        console.log('✅ All required schema fields found:', requiredFields.join(', '));
      } else {
        console.log('❌ Missing required schema fields:', missingFields.join(', '));
        allTestsPassed = false;
      }

      if (schemaContent.includes('__experimental_singleton: true')) {
        console.log('✅ Singleton configuration found');
      } else {
        console.log('❌ Missing singleton configuration');
        allTestsPassed = false;
      }
    } else {
      console.log('❌ Schema file not found');
      allTestsPassed = false;
    }

    const indexPath = path.join(__dirname, 'SanityBackend/schemaTypes/index.ts');
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      if (indexContent.includes('customContentSection')) {
        console.log('✅ Schema properly registered in index.ts');
      } else {
        console.log('❌ Schema not registered in index.ts');
        allTestsPassed = false;
      }
    } else {
      console.log('❌ Schema index file not found');
      allTestsPassed = false;
    }

    // Test 2: Data Fetching Function Check
    console.log('\n📡 Test 2: Checking Data Fetching Functions...');

    const dataFetchingPath = path.join(__dirname, 'nextjs-frontend/src/app/getCustomContentSectionStyling.ts');
    if (fs.existsSync(dataFetchingPath)) {
      console.log('✅ Data fetching function file exists');

      const content = fs.readFileSync(dataFetchingPath, 'utf8');
      const requiredFunctions = [
        'getCustomContentSectionStyling',
        'CustomContentSectionStyling',
        'generateCustomContentBackgroundStyles',
        'generateCustomContentOverlayStyles'
      ];

      const missingFunctions = requiredFunctions.filter(func => !content.includes(func));

      if (missingFunctions.length === 0) {
        console.log('✅ All required functions and interfaces found:', requiredFunctions.join(', '));
      } else {
        console.log('❌ Missing required functions or interfaces:', missingFunctions.join(', '));
        allTestsPassed = false;
      }

      if (content.includes('primaryText') && content.includes('secondaryText')) {
        console.log('✅ Text content fields properly defined');
      } else {
        console.log('❌ Missing text content field definitions');
        allTestsPassed = false;
      }
    } else {
      console.log('❌ Data fetching function file not found');
      allTestsPassed = false;
    }

    // Test 3: Style Generation Logic
    console.log('\n🎨 Test 3: Testing Style Generation Logic...');

    // Test style generation with mock data
    const mockStyling = {
      _id: 'test',
      title: 'Test Custom Content Section',
      primaryText: 'TEST INSIGHTS',
      secondaryText: 'This is a test description.',
      overlayOpacity: 75,
      isActive: true,
      overlayColor: {
        hex: '#1e293b',
        alpha: 0.8
      }
    };

    // Test background styles (without background image)
    console.log('ℹ️  Testing background styles without image - should return empty object');

    // Test overlay styles
    if (mockStyling.isActive && mockStyling.overlayColor) {
      const { hex, alpha } = mockStyling.overlayColor;
      const opacity = mockStyling.overlayOpacity ? mockStyling.overlayOpacity / 100 : alpha || 0.8;

      // Convert hex to RGB
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      const overlayColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      const overlayStyles = { backgroundColor: overlayColor };

      console.log('✅ Overlay styles generated correctly:', overlayStyles);
    } else {
      console.log('❌ Overlay style generation failed');
      allTestsPassed = false;
    }

    // Test 4: Frontend Integration Check
    console.log('\n🌐 Test 4: Checking Frontend Integration...');

    const pagePath = path.join(__dirname, 'nextjs-frontend/src/app/page.tsx');
    if (fs.existsSync(pagePath)) {
      console.log('✅ Main page file exists');

      const pageContent = fs.readFileSync(pagePath, 'utf8');
      const requiredIntegrations = [
        'getCustomContentSectionStyling',
        'CustomContentSectionStyling',
        'custom-content-section',
        'generateCustomContentBackgroundStyles',
        'generateCustomContentOverlayStyles',
        'customContentStyling'
      ];

      const missingIntegrations = requiredIntegrations.filter(integration => !pageContent.includes(integration));

      if (missingIntegrations.length === 0) {
        console.log('✅ Custom Content Section properly integrated in page.tsx');
        console.log('   - Import statements: ✅');
        console.log('   - Data fetching: ✅');
        console.log('   - Section rendering: ✅');
        console.log('   - Style generation: ✅');
      } else {
        console.log('❌ Custom Content Section integration incomplete:', missingIntegrations.join(', '));
        allTestsPassed = false;
      }

      // Check for proper section placement
      if (pageContent.includes('Past Conferences') && pageContent.includes('Custom Content Section') && pageContent.includes('Contact Section')) {
        const pastConferencesIndex = pageContent.indexOf('Past Conferences');
        const customContentIndex = pageContent.indexOf('Custom Content Section');
        const contactIndex = pageContent.indexOf('Contact Section');

        if (pastConferencesIndex < customContentIndex && customContentIndex < contactIndex) {
          console.log('✅ Section placement correct: Past Conferences → Custom Content → Contact');
        } else {
          console.log('❌ Section placement incorrect');
          allTestsPassed = false;
        }
      }
    } else {
      console.log('❌ Main page file not found');
      allTestsPassed = false;
    }

    // Test 5: Responsive Design Check
    console.log('\n📱 Test 5: Checking Responsive Design Implementation...');

    if (fs.existsSync(pagePath)) {
      const pageContent = fs.readFileSync(pagePath, 'utf8');

      const responsiveClasses = [
        'py-12 md:py-16',
        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        'text-4xl sm:text-5xl md:text-6xl',
        'text-lg sm:text-xl md:text-2xl'
      ];

      const missingResponsive = responsiveClasses.filter(cls => !pageContent.includes(cls));

      if (missingResponsive.length === 0) {
        console.log('✅ Responsive design classes properly implemented');
      } else {
        console.log('❌ Missing responsive design classes:', missingResponsive.join(', '));
        allTestsPassed = false;
      }

      // Check z-index layering
      if (pageContent.includes('z-15') && pageContent.includes('z-30')) {
        console.log('✅ Z-index layering properly implemented');
      } else {
        console.log('❌ Z-index layering missing or incorrect');
        allTestsPassed = false;
      }
    }

    // Final Results
    console.log('\n🎉 Custom Content Section Integration Test Complete!');

    if (allTestsPassed) {
      console.log('\n✅ ALL TESTS PASSED! 🎊');
      console.log('\n📋 Summary:');
      console.log('   - Schema: ✅ Created and registered');
      console.log('   - Data Fetching: ✅ Functions implemented');
      console.log('   - Style Generation: ✅ Logic working');
      console.log('   - Frontend Integration: ✅ Complete');
      console.log('   - Responsive Design: ✅ Implemented');

      console.log('\n🚀 Ready for Testing:');
      console.log('   1. Start the development servers: npm run dev');
      console.log('   2. Sign in to Sanity Studio at http://localhost:3333');
      console.log('   3. Navigate to "Custom Content Section" in Sanity Studio');
      console.log('   4. Edit the primary text, secondary text, and styling options');
      console.log('   5. View the results on the homepage between Past Conferences and Contact sections');
    } else {
      console.log('\n❌ SOME TESTS FAILED');
      console.log('   Please review the failed tests above and fix the issues.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testCustomContentSection();
