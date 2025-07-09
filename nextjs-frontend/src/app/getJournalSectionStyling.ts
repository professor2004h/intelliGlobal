import { client } from './sanity/client';

// TypeScript interface for Journal Section Styling
export interface JournalSectionStyling {
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
const getDefaultStyling = (): JournalSectionStyling => ({
  _id: 'default',
  title: 'Default Journal Section Styling',
  overlayOpacity: 80,
  isActive: false,
});

// Get Journal Section Styling from Sanity CMS
export async function getJournalSectionStyling(): Promise<JournalSectionStyling> {
  try {
    console.log('📰 Fetching Journal Section Styling...');

    const query = `*[_type == "journalSection"][0]{
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

    console.log('🔍 Journal Styling Query:', query);

    const data = await client.fetch(query, {}, {
      next: {
        revalidate: 0, // Force fresh data for debugging
        tags: ['journal-section-styling']
      }
    });

    console.log('📰 Journal Section Styling Raw Data:', JSON.stringify(data, null, 2));

    // If no data found or styling is not active, return default
    if (!data) {
      console.log('❌ No Journal styling data found, returning default');
      return getDefaultStyling();
    }

    if (!data.isActive) {
      console.log('⚠️ Journal styling is not active, returning default');
      return getDefaultStyling();
    }

    // Validate and return the data
    const processedData = {
      _id: data._id || 'default',
      title: data.title || 'Journal Section Styling',
      backgroundImage: data.backgroundImage || undefined,
      overlayColor: data.overlayColor || undefined,
      overlayOpacity: typeof data.overlayOpacity === 'number' ? data.overlayOpacity : 80,
      isActive: data.isActive || false,
    };

    console.log('✅ Journal Section Styling Processed:', JSON.stringify(processedData, null, 2));
    return processedData;

  } catch (error) {
    console.error('❌ Error fetching Journal section styling:', error);
    return getDefaultStyling();
  }
}

// Generate background styles for Journal section
export function generateJournalBackgroundStyles(styling?: JournalSectionStyling) {
  if (!styling?.isActive || !styling.backgroundImage?.url) {
    return {};
  }

  return {
    backgroundImage: `url(${styling.backgroundImage.url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
}

// Generate overlay styles for Journal section
export function generateJournalOverlayStyles(styling?: JournalSectionStyling) {
  if (!styling?.isActive || !styling.overlayColor) {
    return {};
  }

  const { hex, alpha } = styling.overlayColor;
  const opacity = styling.overlayOpacity ? styling.overlayOpacity / 100 : alpha || 0.8;

  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const overlayColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
  console.log('📰 Generated Journal overlay color:', overlayColor);

  return {
    backgroundColor: overlayColor,
  };
}
