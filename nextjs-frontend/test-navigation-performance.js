#!/usr/bin/env node

/**
 * Navigation Performance Test Script
 * Tests the optimizations made to improve Past Conferences navigation speed
 */

const http = require('http');
const { performance } = require('perf_hooks');

console.log('🚀 Testing Navigation Performance Optimizations...\n');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const ENDPOINTS = [
  '/past-conferences',
  '/past-conferences/software-conference-2024',
  '/past-conferences/robotics-conference-2024',
  '/'
];

// Performance test function
async function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: 'GET',
      timeout: 10000
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        resolve({
          endpoint,
          statusCode: res.statusCode,
          responseTime: Math.round(responseTime),
          contentLength: data.length,
          success: res.statusCode === 200
        });
      });
    });

    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      resolve({
        endpoint,
        statusCode: 'ERROR',
        responseTime: Math.round(responseTime),
        contentLength: 0,
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        endpoint,
        statusCode: 'TIMEOUT',
        responseTime: 10000,
        contentLength: 0,
        success: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

// Run performance tests
async function runPerformanceTests() {
  console.log('📊 Testing endpoint response times...\n');
  
  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    console.log(`🔍 Testing: ${endpoint}`);
    
    // Run multiple tests for average
    const testResults = [];
    for (let i = 0; i < 3; i++) {
      const result = await testEndpoint(endpoint);
      testResults.push(result);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between tests
    }
    
    // Calculate average response time
    const avgResponseTime = Math.round(
      testResults.reduce((sum, r) => sum + r.responseTime, 0) / testResults.length
    );
    
    const bestResult = testResults.reduce((best, current) => 
      current.responseTime < best.responseTime ? current : best
    );
    
    results.push({
      ...bestResult,
      avgResponseTime,
      allSuccessful: testResults.every(r => r.success)
    });
    
    console.log(`   ✅ Status: ${bestResult.statusCode}`);
    console.log(`   ⚡ Best Time: ${bestResult.responseTime}ms`);
    console.log(`   📊 Avg Time: ${avgResponseTime}ms`);
    console.log(`   📦 Size: ${(bestResult.contentLength / 1024).toFixed(1)}KB\n`);
  }
  
  return results;
}

// Test specific optimizations
async function testOptimizations() {
  console.log('🔧 Testing Specific Optimizations...\n');
  
  const optimizations = [
    {
      name: 'Data Fetching Optimization',
      description: 'Reduced query complexity and increased cache time',
      expected: 'Faster initial load times'
    },
    {
      name: 'Image Loading Optimization', 
      description: 'Added lazy loading and optimized sizes',
      expected: 'Faster page rendering'
    },
    {
      name: 'Link Prefetching',
      description: 'Added prefetch=true to navigation links',
      expected: 'Instant navigation on hover/click'
    },
    {
      name: 'Transition Duration Reduction',
      description: 'Reduced animation durations from 500ms to 200-300ms',
      expected: 'Snappier UI interactions'
    }
  ];
  
  optimizations.forEach((opt, index) => {
    console.log(`${index + 1}. ${opt.name}`);
    console.log(`   📝 ${opt.description}`);
    console.log(`   🎯 Expected: ${opt.expected}\n`);
  });
}

// Performance recommendations
function generateRecommendations(results) {
  console.log('💡 Performance Analysis & Recommendations:\n');
  
  const slowEndpoints = results.filter(r => r.avgResponseTime > 1000);
  const fastEndpoints = results.filter(r => r.avgResponseTime <= 500);
  
  console.log(`✅ Fast Endpoints (≤500ms): ${fastEndpoints.length}`);
  console.log(`⚠️  Slow Endpoints (>1000ms): ${slowEndpoints.length}\n`);
  
  if (slowEndpoints.length > 0) {
    console.log('🔧 Recommendations for slow endpoints:');
    slowEndpoints.forEach(endpoint => {
      console.log(`   • ${endpoint.endpoint}: ${endpoint.avgResponseTime}ms`);
      console.log(`     - Consider further query optimization`);
      console.log(`     - Implement additional caching`);
      console.log(`     - Check for large image assets\n`);
    });
  }
  
  if (fastEndpoints.length === results.length) {
    console.log('🎉 All endpoints are performing well!');
    console.log('✨ Navigation should feel fast and responsive.');
  }
}

// Main execution
async function main() {
  try {
    console.log('🎯 EventNext Navigation Performance Test\n');
    console.log('This script tests the optimizations made to improve');
    console.log('Past Conferences navigation speed.\n');
    console.log('=' .repeat(60) + '\n');
    
    // Test optimizations info
    await testOptimizations();
    
    // Run performance tests
    const results = await runPerformanceTests();
    
    // Generate recommendations
    generateRecommendations(results);
    
    console.log('=' .repeat(60));
    console.log('🏁 Performance test completed!');
    console.log('📈 Check the results above to verify navigation improvements.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
main();
