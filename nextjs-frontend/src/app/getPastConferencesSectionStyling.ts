import { client } from './sanity/client';

// Simplified TypeScript interface for Past Conferences Section Styling
export interface PastConferencesSectionStyling {
  _id: string;
  title: string;
  backgroundImage?: {
    url: string;
    alt?: string;
  };
  overlayColor?: {
    hex: string;
    alpha: number;
  };
  overlayOpacity: number;
  isActive: boolean;
}

// Default styling configuration
const getDefaultStyling = (): PastConferencesSectionStyling => ({
  _id: 'default',
  title: 'Default Past Conferences Section Styling',
  overlayOpacity: 80,
  isActive: false,
});

// Get Past Conferences Section Styling from Sanity CMS
export async function getPastConferencesSectionStyling(): Promise<PastConferencesSectionStyling> {
  try {
    console.log('🎨 Fetching Past Conferences Section Styling...');

    const query = `*[_type == "pastConferencesSection"][0]{
      _id,
      title,
      "backgroundImage": backgroundImage{
        "url": asset->url,
        alt
      },
      overlayColor,
      overlayOpacity,
      isActive
    }`;

    console.log('🔍 Past Conferences Styling Query:', query);

    const data = await client.fetch(query, {}, {
      next: {
        revalidate: 0, // Force fresh data for debugging
        tags: ['past-conferences-section-styling']
      }
    });

    console.log('🎨 Past Conferences Section Styling Raw Data:', JSON.stringify(data, null, 2));

    // If no data found or styling is not active, return default
    if (!data) {
      console.log('❌ No Past Conferences styling data found, returning default');
      return getDefaultStyling();
    }

    if (!data.isActive) {
      console.log('⚠️ Past Conferences styling is not active, returning default');
      return getDefaultStyling();
    }

    // Validate and return the data
    const processedData = {
      _id: data._id || 'default',
      title: data.title || 'Past Conferences Section Styling',
      backgroundImage: data.backgroundImage || undefined,
      overlayColor: data.overlayColor || undefined,
      overlayOpacity: typeof data.overlayOpacity === 'number' ? data.overlayOpacity : 80,
      isActive: data.isActive || false,
    };

    console.log('✅ Past Conferences Section Styling Processed:', JSON.stringify(processedData, null, 2));

    return processedData;
  } catch (error) {
    console.error('❌ Error fetching Past Conferences section styling:', error);

    // Log additional error details for debugging
    if (error instanceof Error) {
      console.error('Past Conferences section styling error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    }

    // Return default styling to prevent UI crashes
    console.log('🔄 Returning default styling due to error');
    return getDefaultStyling();
  }
}

// Helper function to generate CSS background styles
export function generateBackgroundStyles(styling: PastConferencesSectionStyling): React.CSSProperties {
  const styles: React.CSSProperties = {};

  if (styling.isActive && styling.backgroundImage?.url) {
    // Use background image with default positioning and sizing
    styles.backgroundImage = `url(${styling.backgroundImage.url})`;
    styles.backgroundPosition = 'center'; // Default to center
    styles.backgroundSize = 'cover'; // Default to cover
    styles.backgroundRepeat = 'no-repeat';
  }

  return styles;
}

// Helper function to generate overlay styles
export function generateOverlayStyles(styling: PastConferencesSectionStyling): React.CSSProperties {
  console.log('🎨 Generated overlay styles:', {
    hex: styling.overlayColor?.hex,
    alpha: styling.overlayColor?.alpha,
    overlayOpacity: styling.overlayOpacity,
    calculatedOpacity: styling.overlayColor ? (styling.overlayOpacity / 100) * (styling.overlayColor.alpha || 1) : 0,
    styles: styling.isActive && styling.overlayColor ? {
      backgroundColor: hexToRgba(styling.overlayColor.hex, (styling.overlayOpacity / 100) * (styling.overlayColor.alpha || 1)),
      opacity: styling.overlayColor.alpha
    } : 'No overlay - not active or no color'
  });

  if (!styling.isActive || !styling.overlayColor) {
    console.log('❌ Overlay not applied - isActive:', styling.isActive, 'overlayColor:', !!styling.overlayColor);
    return {};
  }

  const { hex, alpha } = styling.overlayColor;
  const opacity = (styling.overlayOpacity / 100) * (alpha || 1);

  // Use RGBA instead of separate backgroundColor and opacity to avoid transparency issues
  const rgbaColor = hexToRgba(hex, opacity);

  console.log('✅ Overlay styles generated:', {
    rgbaColor,
    originalHex: hex,
    originalAlpha: alpha,
    overlayOpacity: styling.overlayOpacity,
    calculatedOpacity: opacity
  });

  const overlayStyles = {
    backgroundColor: rgbaColor,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
    pointerEvents: 'none' as const,
  };

  console.log('🎯 Final overlay CSS styles:', overlayStyles);

  return overlayStyles;
}

// Helper function to convert hex color to RGBA
function hexToRgba(hex: string, alpha: number): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Helper function to generate fallback gradient classes
export function generateGradientClasses(styling: PastConferencesSectionStyling): string {
  // If custom styling is active and has background image, don't use gradient
  if (styling.isActive && styling.backgroundImage?.url) {
    return '';
  }

  // Always use default gradient when no background image is present
  return 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900';
}

// Helper function to generate custom gradient styles (simplified - no custom gradients)
export function generateGradientStyles(_styling: PastConferencesSectionStyling): React.CSSProperties {
  // Since we removed custom gradient configuration, always return empty styles
  // The default gradient will be handled by CSS classes in generateGradientClasses
  return {};
}
