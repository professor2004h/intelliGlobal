import { client, headerClient } from "./sanity/client";

export interface SiteSettings {
  _id: string;
  logo?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
  favicon?: {
    asset: {
      _id: string;
      url: string;
    };
  };
  siteDescription?: string;
  headerVisibility?: {
    showHeaderSection?: boolean;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
  };
  socialMedia?: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  journal?: {
    showJournal?: boolean;
    matterDescription?: string;
  };
  adminSettings?: {
    adminEmail?: string;
    invoiceEmailSubject?: string;
    invoiceEmailTemplate?: string;
    paymentConfirmationTemplate?: string;
  };
  footerContent?: {
    termsAndConditions?: any[];
    privacyPolicy?: any[];
    faqs?: Array<{
      question: string;
      answer: any[];
    }>;
    footerSocialMedia?: {
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      facebook?: string;
    };
    footerBackgroundImage?: {
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
    footerLogo?: {
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
    registerButton?: {
      text: string;
      url: string;
      openInNewTab: boolean;
    };
  };
  registerButton?: {
    text: string;
    url: string;
    openInNewTab: boolean;
  };
}

// Cache for site settings with timestamp and version
let siteSettingsCache: { 
  data: SiteSettings | null; 
  timestamp: number;
  version: string;
} | null = null;

const CACHE_DURATION = process.env.NODE_ENV === 'development' ? 5 * 1000 : 30 * 1000;
const CACHE_VERSION = '1.0'; // Increment this when making breaking changes

export async function getSiteSettings(forceRefresh = false): Promise<SiteSettings | null> {
  try {
    // Check if we have valid cached data
    if (!forceRefresh && 
        siteSettingsCache?.data && 
        siteSettingsCache.version === CACHE_VERSION &&
        Date.now() - siteSettingsCache.timestamp < CACHE_DURATION) {
      return siteSettingsCache.data;
    }

    const query = `*[_type == "siteSettings"][0]{
      _id,
      logo{
        asset->{
          _id,
          url
        },
        alt
      },
      favicon{
        asset->{
          _id,
          url
        }
      },
      siteDescription,
      headerVisibility,
      contactInfo,
      socialMedia,
      seo,
      journal,
      adminSettings,
      footerContent{
        termsAndConditions,
        privacyPolicy,
        faqs[]{
          question,
          answer
        },
        footerSocialMedia{
          twitter,
          instagram,
          linkedin,
          facebook
        },
        footerBackgroundImage{
          asset->{
            _id,
            url
          },
          alt
        },
        footerLogo{
          asset->{
            _id,
            url
          },
          alt
        },
        registerButton{
          text,
          url,
          openInNewTab
        }
      }
    }`;

    const siteSettings = await client.fetch(query, {}, {
      next: {
        revalidate: process.env.NODE_ENV === 'development' ? 1 : 30, // 1 second in dev for faster testing, 30 seconds in production
        tags: ['site-settings'] // Cache tag for targeted revalidation
      },
    });

    // Update cache with version
    siteSettingsCache = {
      data: siteSettings,
      timestamp: Date.now(),
      version: CACHE_VERSION
    };

    // Validate the data structure
    if (siteSettings && typeof siteSettings === 'object') {
      return siteSettings;
    }

    throw new Error('Invalid site settings data structure');

  } catch (error) {
    console.error("Error fetching site settings:", error);

    // Only return cached data if it exists and has the current version
    if (siteSettingsCache?.data && siteSettingsCache.version === CACHE_VERSION) {
      console.warn("Returning cached site settings due to fetch error");
      return siteSettingsCache.data;
    }

    // If cache is stale or invalid, return null and force a reload
    console.warn("No valid cached site settings available");
    return null;
  }
}

// Function to get fresh site settings with minimal caching for build compatibility
export async function getSiteSettingsFresh(): Promise<SiteSettings | null> {
  try {
    const query = `*[_type == "siteSettings"][0]{
      _id,
      logo{
        asset->{
          _id,
          url
        },
        alt
      },
      favicon{
        asset->{
          _id,
          url
        }
      },
      siteDescription,
      headerVisibility,
      contactInfo,
      socialMedia,
      seo,
      journal,
      adminSettings,
      footerContent{
        termsAndConditions,
        privacyPolicy,
        faqs[]{
          question,
          answer
        },
        footerSocialMedia{
          twitter,
          instagram,
          linkedin,
          facebook
        },
        footerBackgroundImage{
          asset->{
            _id,
            url
          },
          alt
        },
        footerLogo{
          asset->{
            _id,
            url
          },
          alt
        },
        registerButton{
          text,
          url,
          openInNewTab
        }
      }
    }`;

    const siteSettings = await client.fetch(query, {}, {
      next: {
        revalidate: 1, // Very short cache for near-fresh data
        tags: ['site-settings-fresh']
      }
    });

    return siteSettings;
  } catch (error) {
    console.error("Error fetching fresh site settings:", error);
    return null;
  }
}

// Function specifically for header component that works with static generation
export async function getSiteSettingsForHeader(): Promise<SiteSettings | null> {
  try {
    const query = `*[_type == "siteSettings"][0]{
      _id,
      logo{
        asset->{
          _id,
          url
        },
        alt
      },
      favicon{
        asset->{
          _id,
          url
        }
      },
      siteDescription,
      headerVisibility,
      contactInfo,
      socialMedia,
      seo,
      journal,
      adminSettings,
      footerContent{
        termsAndConditions,
        privacyPolicy,
        faqs[]{
          question,
          answer
        },
        footerSocialMedia{
          twitter,
          instagram,
          linkedin,
          facebook
        },
        footerBackgroundImage{
          asset->{
            _id,
            url
          },
          alt
        },
        footerLogo{
          asset->{
            _id,
            url
          },
          alt
        },
        registerButton{
          text,
          url,
          openInNewTab
        }
      },
      _updatedAt
    }`;

    // Use regular client with ISR-compatible caching
    const siteSettings = await client.fetch(query, {}, {
      next: {
        revalidate: 60, // Revalidate every 60 seconds
        tags: ['site-settings-header']
      }
    });

    return siteSettings;
  } catch (error) {
    console.error("Error fetching header site settings:", error);
    return null;
  }
}

// Function to get site settings with server-side rendering support
export async function getSiteSettingsSSR(): Promise<SiteSettings | null> {
  try {
    const query = `*[_type == "siteSettings"][0]{
      _id,
      logo{
        asset->{
          _id,
          url
        },
        alt
      },
      favicon{
        asset->{
          _id,
          url
        }
      },
      siteDescription,
      headerVisibility,
      contactInfo,
      socialMedia,
      seo,
      journal,
      adminSettings,
      footerContent{
        termsAndConditions,
        privacyPolicy,
        faqs[]{
          question,
          answer
        },
        footerSocialMedia{
          twitter,
          instagram,
          linkedin,
          facebook
        },
        footerBackgroundImage{
          asset->{
            _id,
            url
          },
          alt
        },
        footerLogo{
          asset->{
            _id,
            url
          },
          alt
        },
        registerButton{
          text,
          url,
          openInNewTab
        }
      }
    }`;

    const siteSettings = await client.fetch(query, {}, {
      next: {
        revalidate: process.env.NODE_ENV === 'development' ? 5 : 30, // 5 seconds in dev, 30 seconds in production
        tags: ['site-settings'] // Cache tag for targeted revalidation
      },
    });

    return siteSettings;
  } catch (error) {
    console.error("Error fetching site settings (SSR):", error);
    return null;
  }
}

// Function to clear the cache (useful for revalidation)
export function clearSiteSettingsCache(): void {
  siteSettingsCache = null;
  console.warn('Site settings cache cleared');
}

// Helper function to get image URL from Sanity asset with quality optimization
export function getImageUrl(
  imageAsset: { asset?: { url?: string } } | null | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }
): string | null {
  if (!imageAsset?.asset?.url) {
    return null;
  }

  let url = imageAsset.asset.url;

  // Add Sanity image transformation parameters for better quality
  if (options) {
    const params = new URLSearchParams();

    if (options.width) params.append('w', options.width.toString());
    if (options.height) params.append('h', options.height.toString());
    if (options.quality) params.append('q', options.quality.toString());
    if (options.format) params.append('fm', options.format);

    // Add fit parameter to maintain aspect ratio
    params.append('fit', 'max');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }

  return url;
}

// Helper function specifically for logo images with optimized settings
export function getLogoImageUrl(imageAsset: { asset?: { url?: string } } | null | undefined): string | null {
  return getImageUrl(imageAsset, {
    width: 600,  // Reduced from 800 for better header fit
    height: 200, // Added height constraint
    quality: 95,
    format: 'webp'
  });
}

// Testimonials data interface
export interface TestimonialsData {
  _id: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  isActive: boolean;
  testimonials: Array<{
    _key: string;
    customerImage: {
      asset: {
        _id: string;
        url: string;
      };
      alt?: string;
    };
    customerName: string;
    review: string;
    rating: number;
    position?: string;
    company?: string;
  }>;
}

// Function to fetch testimonials data
export async function getTestimonialsData(): Promise<TestimonialsData | null> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎭 Fetching Testimonials Data...');
    }

    // First try to get active testimonials, then fallback to any testimonials
    const query = `*[_type == "testimonialsSection"] | order(_createdAt desc)[0]{
      _id,
      sectionTitle,
      sectionSubtitle,
      isActive,
      testimonials[]{
        _key,
        customerImage{
          asset->{
            _id,
            url
          },
          alt
        },
        customerName,
        review,
        rating,
        position,
        company
      }
    }`;

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Testimonials Query:', query);
    }

    const data = await client.fetch<TestimonialsData>(query, {}, {
      next: {
        revalidate: 60, // Cache for 1 minute - faster updates
        tags: ['testimonials']
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('🎭 Testimonials Raw Data:', data);
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching testimonials data:', error);
    return null;
  }
}
