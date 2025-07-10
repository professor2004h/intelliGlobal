#!/usr/bin/env node

/**
 * Performance Diagnosis Script
 * Identifies performance bottlenecks in the Next.js application
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Performance Diagnosis Tool');
console.log('==============================\n');

// Test 1: Check Bundle Size Issues
console.log('1️⃣ Analyzing Bundle Size Issues...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  // Check for heavy dependencies
  const heavyDeps = [
    'moment', 'lodash', 'rxjs', 'framer-motion', 'html2canvas', 
    'jspdf', 'next-sanity', '@sanity/image-url', 'razorpay'
  ];
  
  console.log('📦 Heavy Dependencies Found:');
  heavyDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`   ⚠️  ${dep}: ${dependencies[dep]}`);
    }
  });
  
  // Count total dependencies
  const totalDeps = Object.keys(dependencies).length;
  console.log(`   📊 Total Dependencies: ${totalDeps}`);
  
  if (totalDeps > 30) {
    console.log('   ⚠️  High dependency count may impact bundle size');
  }
  
} catch (error) {
  console.log('❌ Error analyzing dependencies:', error.message);
}

// Test 2: Check for Performance Anti-patterns
console.log('\n2️⃣ Checking for Performance Anti-patterns...');
try {
  const files = [
    'src/app/page.tsx',
    'src/app/layout.tsx',
    'src/app/components/HeaderWrapper.tsx'
  ];
  
  files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      console.log(`\n   📄 Analyzing ${filePath}:`);
      
      // Check for blocking operations
      if (content.includes('await') && content.includes('Promise.all')) {
        console.log('   ✅ Using Promise.all for parallel operations');
      } else if (content.includes('await') && !content.includes('Promise.all')) {
        console.log('   ⚠️  Sequential await calls detected - consider Promise.all');
      }
      
      // Check for dynamic imports
      if (content.includes('dynamic(')) {
        console.log('   ✅ Dynamic imports found');
      }
      
      // Check for heavy synchronous operations
      if (content.includes('JSON.parse') || content.includes('JSON.stringify')) {
        console.log('   ⚠️  JSON operations detected - ensure they\'re not blocking');
      }
      
      // Check for console.log in production
      const consoleCount = (content.match(/console\.(log|warn|error)/g) || []).length;
      if (consoleCount > 5) {
        console.log(`   ⚠️  ${consoleCount} console statements - may impact performance`);
      }
      
      // Check for large inline styles or data
      if (content.length > 50000) {
        console.log(`   ⚠️  Large file size (${Math.round(content.length/1000)}KB) - consider splitting`);
      }
    }
  });
  
} catch (error) {
  console.log('❌ Error checking anti-patterns:', error.message);
}

// Test 3: Check Image Optimization
console.log('\n3️⃣ Checking Image Optimization...');
try {
  const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
  
  if (nextConfig.includes('images:')) {
    console.log('   ✅ Image optimization configured');
    
    if (nextConfig.includes('webp') || nextConfig.includes('avif')) {
      console.log('   ✅ Modern image formats enabled');
    } else {
      console.log('   ⚠️  Consider enabling WebP/AVIF formats');
    }
    
    if (nextConfig.includes('minimumCacheTTL')) {
      console.log('   ✅ Image caching configured');
    }
  } else {
    console.log('   ⚠️  Image optimization not configured');
  }
  
} catch (error) {
  console.log('❌ Error checking image optimization:', error.message);
}

// Test 4: Check Caching Strategy
console.log('\n4️⃣ Analyzing Caching Strategy...');
try {
  const files = [
    'src/app/getSiteSettings.ts',
    'src/app/lib/optimizedFetching.ts',
    'public/sw.js'
  ];
  
  files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`   📄 ${filePath}:`);
      
      if (content.includes('cache') || content.includes('Cache')) {
        console.log('     ✅ Caching implementation found');
      }
      
      if (content.includes('revalidate')) {
        console.log('     ✅ Cache revalidation configured');
      }
      
      if (content.includes('ttl') || content.includes('TTL')) {
        console.log('     ✅ TTL-based caching found');
      }
    } else {
      console.log(`   ❌ ${filePath} not found`);
    }
  });
  
} catch (error) {
  console.log('❌ Error checking caching:', error.message);
}

// Test 5: Check for Memory Leaks
console.log('\n5️⃣ Checking for Potential Memory Leaks...');
try {
  const componentFiles = [
    'src/app/components/PerformanceMonitor.tsx',
    'src/app/components/AutoRefresh.tsx',
    'src/app/components/ConnectionStatus.tsx'
  ];
  
  componentFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      console.log(`   📄 ${filePath}:`);
      
      if (content.includes('useEffect') && content.includes('return')) {
        console.log('     ✅ Cleanup functions found in useEffect');
      } else if (content.includes('useEffect')) {
        console.log('     ⚠️  useEffect without cleanup - potential memory leak');
      }
      
      if (content.includes('setInterval') || content.includes('setTimeout')) {
        if (content.includes('clearInterval') || content.includes('clearTimeout')) {
          console.log('     ✅ Timer cleanup found');
        } else {
          console.log('     ⚠️  Timers without cleanup - potential memory leak');
        }
      }
      
      if (content.includes('addEventListener')) {
        if (content.includes('removeEventListener')) {
          console.log('     ✅ Event listener cleanup found');
        } else {
          console.log('     ⚠️  Event listeners without cleanup - potential memory leak');
        }
      }
    }
  });
  
} catch (error) {
  console.log('❌ Error checking memory leaks:', error.message);
}

// Test 6: Check Build Configuration
console.log('\n6️⃣ Analyzing Build Configuration...');
try {
  const nextConfig = fs.readFileSync('next.config.ts', 'utf8');
  
  if (nextConfig.includes('webpack:')) {
    console.log('   ✅ Custom webpack configuration found');
  }
  
  if (nextConfig.includes('splitChunks')) {
    console.log('   ✅ Code splitting configured');
  }
  
  if (nextConfig.includes('compress: true')) {
    console.log('   ✅ Compression enabled');
  }
  
  if (nextConfig.includes('experimental:')) {
    console.log('   ✅ Experimental optimizations enabled');
  }
  
  if (nextConfig.includes('turbopack')) {
    console.log('   ✅ Turbopack configuration found');
  }
  
} catch (error) {
  console.log('❌ Error checking build config:', error.message);
}

console.log('\n📊 Performance Diagnosis Summary');
console.log('==================================');
console.log('✅ Bundle analysis completed');
console.log('✅ Anti-pattern check completed');
console.log('✅ Image optimization check completed');
console.log('✅ Caching strategy analyzed');
console.log('✅ Memory leak check completed');
console.log('✅ Build configuration analyzed');

console.log('\n💡 Recommendations:');
console.log('1. 🔍 Run `npm run build` to check actual bundle sizes');
console.log('2. 📊 Use Next.js Bundle Analyzer for detailed analysis');
console.log('3. 🧪 Test with production build for accurate performance');
console.log('4. 📱 Test on slower devices and networks');
console.log('5. 🔧 Consider lazy loading heavy components');

console.log('\n🚀 Next Steps:');
console.log('- If performance is still slow, the issue might be:');
console.log('  • Network latency to Sanity CMS');
console.log('  • Large images not properly optimized');
console.log('  • Too many API calls on page load');
console.log('  • Client-side JavaScript execution time');
console.log('  • Memory leaks from event listeners or timers');
