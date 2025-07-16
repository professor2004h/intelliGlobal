import { NextRequest, NextResponse } from 'next/server';
import { 
  dmsStringToDecimal, 
  parseDMSString, 
  processLocationCoordinates,
  validateCoordinates 
} from '@/app/utils/coordinateUtils';

export async function GET(request: NextRequest) {
  console.log('🧪 Testing coordinate conversion API');

  // Test coordinates from your example
  const testCases = [
    {
      name: 'Your Example Coordinates',
      latitudeDMS: "18° 58' 3.59\" N",
      longitudeDMS: "72° 48' 20.99\" E",
      expectedLat: 18.967664,
      expectedLon: 72.805831
    },
    {
      name: 'Gateway of India, Mumbai',
      latitudeDMS: "18° 55' 18\" N",
      longitudeDMS: "72° 50' 6\" E",
      expectedLat: 18.9217,
      expectedLon: 72.8350
    },
    {
      name: 'Taj Mahal, Agra',
      latitudeDMS: "27° 10' 30\" N",
      longitudeDMS: "78° 2' 32\" E",
      expectedLat: 27.175,
      expectedLon: 78.042
    }
  ];

  const results = testCases.map(testCase => {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log(`Input: ${testCase.latitudeDMS}, ${testCase.longitudeDMS}`);

    // Test DMS parsing
    const latDMS = parseDMSString(testCase.latitudeDMS);
    const lonDMS = parseDMSString(testCase.longitudeDMS);

    // Test conversion to decimal
    const latDecimal = dmsStringToDecimal(testCase.latitudeDMS);
    const lonDecimal = dmsStringToDecimal(testCase.longitudeDMS);

    // Test with location object (as it would come from Sanity)
    const testLocation = {
      coordinateFormat: 'dms',
      latitudeDMS: testCase.latitudeDMS,
      longitudeDMS: testCase.longitudeDMS,
      title: testCase.name
    };

    const processedCoords = processLocationCoordinates(testLocation);

    // Calculate accuracy
    const latAccuracy = latDecimal ? Math.abs(latDecimal - testCase.expectedLat) : null;
    const lonAccuracy = lonDecimal ? Math.abs(lonDecimal - testCase.expectedLon) : null;

    const result = {
      ...testCase,
      latDMS,
      lonDMS,
      latDecimal,
      lonDecimal,
      processedCoords,
      latAccuracy,
      lonAccuracy,
      isValid: latDecimal !== null && lonDecimal !== null && 
               validateCoordinates(latDecimal, lonDecimal),
      isAccurate: latAccuracy !== null && lonAccuracy !== null && 
                 latAccuracy < 0.01 && lonAccuracy < 0.01
    };

    console.log(`✅ Result for ${testCase.name}:`, result);
    return result;
  });

  // Test with a sample Sanity location format
  const sampleSanityLocation = {
    _id: 'test-location',
    title: 'Test Mumbai Location',
    address: 'Mumbai, Maharashtra, India',
    coordinateFormat: 'dms',
    latitudeDMS: "18° 58' 3.59\" N",
    longitudeDMS: "72° 48' 20.99\" E",
    isActive: true
  };

  console.log('\n📦 Testing Sanity location processing:');
  const sanityProcessed = processLocationCoordinates(sampleSanityLocation);
  console.log('Sanity processed result:', sanityProcessed);

  return NextResponse.json({
    success: true,
    message: 'Coordinate conversion test completed',
    testResults: results,
    sanityTest: {
      input: sampleSanityLocation,
      output: sanityProcessed
    },
    summary: {
      totalTests: results.length,
      validResults: results.filter(r => r.isValid).length,
      accurateResults: results.filter(r => r.isAccurate).length
    }
  });
}
