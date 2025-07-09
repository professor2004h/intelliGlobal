#!/usr/bin/env node

/**
 * Test script for loading animations in EventNext application
 * Tests navigation performance and loading state functionality
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const TEST_ROUTES = [
  '/',
  '/past-conferences',
  '/conferences',
  '/about',
  '/contact',
  '/journal'
];

async function testLoadingAnimations() {
  console.log('🚀 Starting Loading Animation Tests...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false, // Set to true for CI/CD
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport for consistent testing
    await page.setViewport({ width: 1200, height: 800 });
    
    // Enable request interception to simulate slow network
    await page.setRequestInterception(true);
    
    const results = [];

    for (const route of TEST_ROUTES) {
      console.log(`📍 Testing route: ${route}`);
      
      const testResult = await testRoute(page, route);
      results.push(testResult);
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Test navigation between routes
    console.log('\n🔄 Testing Navigation Between Routes...');
    const navigationResults = await testNavigation(page);
    
    // Generate report
    generateReport(results, navigationResults);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function testRoute(page, route) {
  const url = `${BASE_URL}${route}`;
  const startTime = Date.now();
  
  try {
    // Navigate to route
    const response = await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 15000 
    });
    
    const loadTime = Date.now() - startTime;
    
    // Check for loading elements
    const hasLoadingSpinner = await page.$('.animate-spin') !== null;
    const hasProgressBar = await page.$('[class*="bg-orange"]') !== null;
    const hasSkeletonLoading = await page.$('.animate-pulse') !== null;
    
    // Check for branded loading elements
    const hasBrandedSpinner = await page.evaluate(() => {
      return document.querySelector('[aria-label="Loading"]') !== null ||
             document.textContent.includes('Loading EventNext');
    });
    
    // Check for shimmer effects
    const hasShimmerEffect = await page.$('.animate-shimmer') !== null;
    
    // Test loading threshold (300ms)
    const exceedsThreshold = loadTime > 300;
    
    console.log(`  ⏱️  Load time: ${loadTime}ms`);
    console.log(`  🎯 Exceeds threshold (300ms): ${exceedsThreshold ? '✅' : '❌'}`);
    console.log(`  🔄 Has loading spinner: ${hasLoadingSpinner ? '✅' : '❌'}`);
    console.log(`  📊 Has progress bar: ${hasProgressBar ? '✅' : '❌'}`);
    console.log(`  💀 Has skeleton loading: ${hasSkeletonLoading ? '✅' : '❌'}`);
    console.log(`  🎨 Has branded spinner: ${hasBrandedSpinner ? '✅' : '❌'}`);
    console.log(`  ✨ Has shimmer effect: ${hasShimmerEffect ? '✅' : '❌'}\n`);
    
    return {
      route,
      loadTime,
      exceedsThreshold,
      hasLoadingSpinner,
      hasProgressBar,
      hasSkeletonLoading,
      hasBrandedSpinner,
      hasShimmerEffect,
      status: response?.status() || 'unknown'
    };
    
  } catch (error) {
    console.log(`  ❌ Error loading ${route}: ${error.message}\n`);
    return {
      route,
      error: error.message,
      loadTime: Date.now() - startTime
    };
  }
}

async function testNavigation(page) {
  const navigationTests = [
    { from: '/', to: '/past-conferences', description: 'Homepage to Past Conferences' },
    { from: '/past-conferences', to: '/conferences', description: 'Past Conferences to Conferences' },
    { from: '/conferences', to: '/about', description: 'Conferences to About' },
    { from: '/about', to: '/', description: 'About to Homepage' }
  ];
  
  const results = [];
  
  for (const test of navigationTests) {
    console.log(`🔄 Testing: ${test.description}`);
    
    try {
      // Navigate to starting page
      await page.goto(`${BASE_URL}${test.from}`, { waitUntil: 'networkidle2' });
      
      const startTime = Date.now();
      
      // Click navigation link or simulate navigation
      const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle2' });
      
      // Try to find and click a navigation link
      const linkSelector = `a[href="${test.to}"]`;
      const linkExists = await page.$(linkSelector) !== null;
      
      if (linkExists) {
        await page.click(linkSelector);
        await navigationPromise;
      } else {
        // Fallback to direct navigation
        await page.goto(`${BASE_URL}${test.to}`, { waitUntil: 'networkidle2' });
      }
      
      const navigationTime = Date.now() - startTime;
      
      console.log(`  ⏱️  Navigation time: ${navigationTime}ms`);
      console.log(`  🎯 Exceeds threshold: ${navigationTime > 300 ? '✅' : '❌'}\n`);
      
      results.push({
        ...test,
        navigationTime,
        exceedsThreshold: navigationTime > 300,
        success: true
      });
      
    } catch (error) {
      console.log(`  ❌ Navigation failed: ${error.message}\n`);
      results.push({
        ...test,
        error: error.message,
        success: false
      });
    }
  }
  
  return results;
}

function generateReport(routeResults, navigationResults) {
  console.log('\n📊 LOADING ANIMATION TEST REPORT');
  console.log('=====================================\n');
  
  // Route loading summary
  console.log('🔍 ROUTE LOADING ANALYSIS:');
  routeResults.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.route}: ERROR - ${result.error}`);
    } else {
      const score = [
        result.hasLoadingSpinner,
        result.hasProgressBar,
        result.hasSkeletonLoading,
        result.hasBrandedSpinner,
        result.hasShimmerEffect
      ].filter(Boolean).length;
      
      console.log(`${score >= 3 ? '✅' : '⚠️'} ${result.route}: ${score}/5 loading features (${result.loadTime}ms)`);
    }
  });
  
  // Navigation summary
  console.log('\n🔄 NAVIGATION ANALYSIS:');
  navigationResults.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.description}: ERROR - ${result.error}`);
    } else {
      console.log(`${result.success ? '✅' : '❌'} ${result.description}: ${result.navigationTime}ms`);
    }
  });
  
  // Performance summary
  const avgLoadTime = routeResults
    .filter(r => !r.error)
    .reduce((sum, r) => sum + r.loadTime, 0) / routeResults.filter(r => !r.error).length;
  
  const slowRoutes = routeResults.filter(r => !r.error && r.loadTime > 300).length;
  
  console.log('\n📈 PERFORMANCE SUMMARY:');
  console.log(`Average load time: ${Math.round(avgLoadTime)}ms`);
  console.log(`Routes exceeding 300ms threshold: ${slowRoutes}/${routeResults.length}`);
  console.log(`Loading animations needed: ${slowRoutes > 0 ? '✅ YES' : '❌ NO'}`);
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (avgLoadTime > 300) {
    console.log('- ✅ Loading animations are beneficial for this application');
    console.log('- 🎯 Focus on routes with >300ms load times');
    console.log('- 🔄 Implement progressive loading for better UX');
  } else {
    console.log('- ⚡ Application loads quickly, minimal loading states needed');
    console.log('- 🎨 Consider subtle loading indicators for visual feedback');
  }
  
  console.log('\n🎉 Test completed successfully!');
}

// Run tests if script is executed directly
if (require.main === module) {
  testLoadingAnimations().catch(console.error);
}

module.exports = { testLoadingAnimations };
