import { optimizedFetch } from './lib/optimizedFetching';

export interface HeroImage {
  url: string;
}

export interface SlideshowSettings {
  enableSlideshow: boolean;
  overlayColor: {
    hex: string;
  } | string;
  overlayOpacity: number;
  transitionDuration: number;
  enableZoomEffect: boolean;
  enableFadeTransition: boolean;
  showNavigationDots: boolean;
}

export interface HeroSectionType {
  images: HeroImage[];
  slideshowSettings: SlideshowSettings;
  welcomeText: string;
  subtitle: string;
  textColor: {
    hex: string;
    alpha: number;
  };
  primaryButton: {
    text: string;
    url: string;
  };
  secondaryButton: {
    text: string;
    url: string;
  };
}

export async function getHeroSection(): Promise<HeroSectionType | null> {
  try {
    // Complete hero section query with welcome text and buttons
    const query = `*[_type == "heroSection"][0]{
      images[] {
        "url": asset->url
      },
      slideshowSettings {
        enableSlideshow,
        overlayColor,
        overlayOpacity,
        transitionDuration,
        enableZoomEffect,
        enableFadeTransition,
        showNavigationDots
      },
      welcomeText,
      subtitle,
      textColor,
      primaryButton {
        text,
        url
      },
      secondaryButton {
        text,
        url
      }
    }`;

    const data = await optimizedFetch<HeroSectionType>(query, {}, {
      ttl: 5 * 60 * 1000, // 5 minutes cache
      tags: ['hero-section'],
      useCache: true
    });

    // Provide comprehensive defaults if needed
    if (data) {
      // Default slideshow settings
      if (!data.slideshowSettings) {
        data.slideshowSettings = {
          enableSlideshow: true,
          overlayColor: '#000000',
          overlayOpacity: 50,
          transitionDuration: 5,
          enableZoomEffect: true,
          enableFadeTransition: true,
          showNavigationDots: true,
        };
      }

      // Default welcome text
      if (!data.welcomeText) {
        data.welcomeText = 'Welcome to Intelli Global Conferences';
      }

      // Default subtitle
      if (!data.subtitle) {
        data.subtitle = 'A NEVER-ENDING JOURNEY OF SEEKING KNOWLEDGE - WITH PEOPLE AND THEIR THOUGHTS THAT ENABLE A BETTER LIVING';
      }

      // Default text color
      if (!data.textColor) {
        data.textColor = {
          hex: '#ffffff',
          alpha: 1
        };
      }

      // Default buttons
      if (!data.primaryButton) {
        data.primaryButton = {
          text: 'View All Conferences',
          url: '/conferences'
        };
      }

      if (!data.secondaryButton) {
        data.secondaryButton = {
          text: 'Contact Us',
          url: '/contact'
        };
      }
    }

    return data;
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return null;
  }
}
