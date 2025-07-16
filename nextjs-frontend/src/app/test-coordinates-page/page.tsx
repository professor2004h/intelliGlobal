'use client';

import React, { useState, useEffect } from 'react';
import { 
  dmsStringToDecimal, 
  parseDMSString, 
  processLocationCoordinates,
  validateCoordinates 
} from '@/app/utils/coordinateUtils';

export default function TestCoordinatesPage() {
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
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

      return {
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
    });

    setTestResults(results);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Coordinate Conversion Testing
        </h1>

        <div className="space-y-6">
          {testResults.map((result, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {result.name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">📍 Input (DMS)</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><strong>Latitude:</strong> {result.latitudeDMS}</p>
                    <p><strong>Longitude:</strong> {result.longitudeDMS}</p>
                  </div>
                </div>

                {/* Output */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">🔄 Output (Decimal)</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><strong>Latitude:</strong> {result.latDecimal?.toFixed(6) || 'Failed'}</p>
                    <p><strong>Longitude:</strong> {result.lonDecimal?.toFixed(6) || 'Failed'}</p>
                  </div>
                </div>

                {/* Expected */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">✅ Expected</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><strong>Latitude:</strong> {result.expectedLat.toFixed(6)}</p>
                    <p><strong>Longitude:</strong> {result.expectedLon.toFixed(6)}</p>
                  </div>
                </div>

                {/* Accuracy */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">📊 Accuracy</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p><strong>Lat Error:</strong> {result.latAccuracy?.toFixed(6) || 'N/A'}</p>
                    <p><strong>Lon Error:</strong> {result.lonAccuracy?.toFixed(6) || 'N/A'}</p>
                    <p className={`font-semibold ${result.isAccurate ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isAccurate ? '✅ Accurate' : '❌ Inaccurate'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 p-3 rounded-lg">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  result.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.isValid ? '✅ Valid Coordinates' : '❌ Invalid Coordinates'}
                </div>
              </div>

              {/* Debug Info */}
              <details className="mt-4">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  🔍 Debug Information
                </summary>
                <div className="mt-2 bg-gray-100 p-3 rounded text-sm">
                  <pre>{JSON.stringify({
                    parsedDMS: { lat: result.latDMS, lon: result.lonDMS },
                    processedCoords: result.processedCoords,
                    validation: result.isValid
                  }, null, 2)}</pre>
                </div>
              </details>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            📋 How to Use This Test
          </h2>
          <ul className="text-blue-700 space-y-1">
            <li>• Check if DMS coordinates are being parsed correctly</li>
            <li>• Verify decimal conversion accuracy</li>
            <li>• Ensure coordinates are within valid ranges</li>
            <li>• Compare with expected values for known landmarks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
