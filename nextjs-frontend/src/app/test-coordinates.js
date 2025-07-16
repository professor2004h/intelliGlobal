// Test coordinate conversion with your example coordinates
const { dmsStringToDecimal, parseDMSString, processLocationCoordinates } = require('./utils/coordinateUtils.ts');

// Test coordinates from your example
const testLatitude = "18° 58' 3.59\" N";
const testLongitude = "72° 48' 20.99\" E";

console.log('🧪 TESTING COORDINATE CONVERSION');
console.log('================================');

console.log('\n📍 Input Coordinates:');
console.log('Latitude DMS:', testLatitude);
console.log('Longitude DMS:', testLongitude);

// Test DMS parsing
console.log('\n🔍 Testing DMS Parsing:');
const latDMS = parseDMSString(testLatitude);
const lonDMS = parseDMSString(testLongitude);

console.log('Parsed Latitude:', latDMS);
console.log('Parsed Longitude:', lonDMS);

// Test conversion to decimal
console.log('\n🔄 Testing Conversion to Decimal:');
const latDecimal = dmsStringToDecimal(testLatitude);
const lonDecimal = dmsStringToDecimal(testLongitude);

console.log('Latitude Decimal:', latDecimal);
console.log('Longitude Decimal:', lonDecimal);

// Test with location object (as it would come from Sanity)
console.log('\n📦 Testing Location Processing:');
const testLocation = {
  coordinateFormat: 'dms',
  latitudeDMS: testLatitude,
  longitudeDMS: testLongitude,
  title: 'Test Location'
};

const processedCoords = processLocationCoordinates(testLocation);
console.log('Processed Coordinates:', processedCoords);

// Expected results for Mumbai area (approximate)
console.log('\n✅ Expected Results (Mumbai area):');
console.log('Expected Latitude: ~18.967 (decimal degrees)');
console.log('Expected Longitude: ~72.805 (decimal degrees)');

// Test known landmark coordinates
console.log('\n🏛️ Testing Known Landmark (Gateway of India, Mumbai):');
const gatewayLat = "18° 55' 18\" N";
const gatewayLon = "72° 50' 6\" E";

const gatewayLatDecimal = dmsStringToDecimal(gatewayLat);
const gatewayLonDecimal = dmsStringToDecimal(gatewayLon);

console.log('Gateway of India DMS:', gatewayLat, gatewayLon);
console.log('Gateway of India Decimal:', gatewayLatDecimal, gatewayLonDecimal);
console.log('Expected: ~18.9217, ~72.8350');
