// Utility functions for coordinate conversion and validation

export interface DMSCoordinate {
  degrees: number;
  minutes: number;
  seconds: number;
  direction: 'N' | 'S' | 'E' | 'W';
}

export interface DecimalCoordinate {
  latitude: number;
  longitude: number;
}

/**
 * Convert DMS (Degrees Minutes Seconds) to Decimal Degrees
 * @param dms - DMS coordinate object
 * @returns Decimal degree value
 */
export function dmsToDecimal(dms: DMSCoordinate): number {
  const { degrees, minutes, seconds, direction } = dms;
  
  // Convert to decimal
  let decimal = degrees + (minutes / 60) + (seconds / 3600);
  
  // Apply direction (negative for South and West)
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }
  
  return decimal;
}

/**
 * Parse DMS string format to DMS object
 * @param dmsString - String in format "18° 58' 3.59" N"
 * @returns DMS coordinate object or null if invalid
 */
export function parseDMSString(dmsString: string): DMSCoordinate | null {
  if (!dmsString) {
    console.log('❌ parseDMSString: Empty input string');
    return null;
  }

  console.log('🔍 parseDMSString: Input:', dmsString);

  // More flexible pattern to handle various formats and quote characters
  // Matches: 18° 58' 3.59" N or 18°58'3.59"N or similar variations
  // Handles both straight quotes (') and curly quotes (') and (")
  const dmsPattern = /^(\d{1,3})°\s*(\d{1,2})['′]\s*(\d{1,2}(?:\.\d+)?)["″]?\s*([NSEW])$/i;
  const match = dmsString.trim().match(dmsPattern);

  console.log('🔍 parseDMSString: Regex match:', match);

  if (!match) {
    console.log('❌ parseDMSString: No regex match for:', dmsString);
    return null;
  }

  const degrees = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const seconds = parseFloat(match[3]);
  const direction = match[4].toUpperCase() as 'N' | 'S' | 'E' | 'W';

  console.log('🔍 parseDMSString: Parsed values:', { degrees, minutes, seconds, direction });

  // Validate ranges
  if (degrees > 180 || minutes >= 60 || seconds >= 60) {
    console.log('❌ parseDMSString: Invalid ranges:', { degrees, minutes, seconds });
    return null;
  }
  if ((direction === 'N' || direction === 'S') && degrees > 90) {
    console.log('❌ parseDMSString: Invalid latitude degrees:', degrees);
    return null;
  }

  const result = { degrees, minutes, seconds, direction };
  console.log('✅ parseDMSString: Success:', result);
  return result;
}

/**
 * Convert DMS string to decimal degrees
 * @param dmsString - String in format "18° 58' 3.59" N"
 * @returns Decimal degree value or null if invalid
 */
export function dmsStringToDecimal(dmsString: string): number | null {
  console.log('🔄 dmsStringToDecimal: Converting:', dmsString);

  const dms = parseDMSString(dmsString);
  if (!dms) {
    console.log('❌ dmsStringToDecimal: Failed to parse DMS');
    return null;
  }

  const decimal = dmsToDecimal(dms);
  console.log('✅ dmsStringToDecimal: Result:', decimal);
  return decimal;
}

/**
 * Convert decimal degrees to DMS
 * @param decimal - Decimal degree value
 * @param isLatitude - Whether this is latitude (true) or longitude (false)
 * @returns DMS coordinate object
 */
export function decimalToDMS(decimal: number, isLatitude: boolean): DMSCoordinate {
  const isNegative = decimal < 0;
  const absDecimal = Math.abs(decimal);
  
  const degrees = Math.floor(absDecimal);
  const minutesFloat = (absDecimal - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  
  let direction: 'N' | 'S' | 'E' | 'W';
  if (isLatitude) {
    direction = isNegative ? 'S' : 'N';
  } else {
    direction = isNegative ? 'W' : 'E';
  }
  
  return {
    degrees,
    minutes,
    seconds: Math.round(seconds * 100) / 100, // Round to 2 decimal places
    direction
  };
}

/**
 * Format DMS coordinate as string
 * @param dms - DMS coordinate object
 * @returns Formatted string like "18° 58' 3.59" N"
 */
export function formatDMSString(dms: DMSCoordinate): string {
  const { degrees, minutes, seconds, direction } = dms;
  return `${degrees}° ${minutes}' ${seconds.toFixed(2)}" ${direction}`;
}

/**
 * Validate coordinate bounds
 * @param latitude - Latitude in decimal degrees
 * @param longitude - Longitude in decimal degrees
 * @returns True if coordinates are valid
 */
export function validateCoordinates(latitude: number, longitude: number): boolean {
  return (
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
}

/**
 * Process location data from Sanity to get decimal coordinates
 * @param location - Location object from Sanity
 * @returns Decimal coordinates or null if invalid
 */
export function processLocationCoordinates(location: any): DecimalCoordinate | null {
  console.log('📦 processLocationCoordinates: Processing location:', location.title || 'Unknown');
  console.log('📦 processLocationCoordinates: Coordinate format:', location.coordinateFormat);

  let latitude: number | null = null;
  let longitude: number | null = null;

  // Check if coordinates are in DMS format
  if (location.coordinateFormat === 'dms') {
    console.log('📦 processLocationCoordinates: Using DMS format');
    console.log('📦 processLocationCoordinates: DMS Latitude:', location.latitudeDMS);
    console.log('📦 processLocationCoordinates: DMS Longitude:', location.longitudeDMS);

    if (location.latitudeDMS) {
      latitude = dmsStringToDecimal(location.latitudeDMS);
      console.log('📦 processLocationCoordinates: Converted latitude:', latitude);
    }
    if (location.longitudeDMS) {
      longitude = dmsStringToDecimal(location.longitudeDMS);
      console.log('📦 processLocationCoordinates: Converted longitude:', longitude);
    }
  } else {
    // Use decimal format
    console.log('📦 processLocationCoordinates: Using decimal format');
    console.log('📦 processLocationCoordinates: Decimal Latitude:', location.latitude);
    console.log('📦 processLocationCoordinates: Decimal Longitude:', location.longitude);

    latitude = location.latitude;
    longitude = location.longitude;
  }

  // Validate coordinates
  if (latitude === null || longitude === null) {
    console.log('❌ processLocationCoordinates: Missing coordinates');
    return null;
  }

  if (!validateCoordinates(latitude, longitude)) {
    console.log('❌ processLocationCoordinates: Invalid coordinate ranges');
    return null;
  }

  const result = { latitude, longitude };
  console.log('✅ processLocationCoordinates: Final result:', result);
  return result;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
