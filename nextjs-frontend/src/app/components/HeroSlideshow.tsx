'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { type HeroSectionType } from '../getHeroSection';

interface HeroSlideshowProps {
  hero: HeroSectionType | null;
}

export default function HeroSlideshow({ hero }: HeroSlideshowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  // Auto-advance slideshow
  useEffect(() => {
    if (!hero?.images || hero.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % hero.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [hero?.images]);

  // Simple overlay settings
  const overlayOpacity = hero?.slideshowSettings?.overlayOpacity || 50;
  const overlayColor = typeof hero?.slideshowSettings?.overlayColor === 'string'
    ? hero.slideshowSettings.overlayColor
    : hero?.slideshowSettings?.overlayColor?.hex || '#000000';



  return (
    <section className="hero-section">
      {/* Background Images with Slideshow */}
      {hero?.images && hero.images.length > 0 ? (
        <div className="absolute inset-0">
          {hero.images.map((image, index) => (
            <div
              key={index}
              className={`hero-image-responsive absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100 animate-zoom' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${image.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center bottom',
                backgroundRepeat: 'no-repeat',
                transform: index === currentImageIndex ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 5s ease-out, opacity 1s ease-in-out',
              }}
            />
          ))}
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900" />
      )}

      {/* Dynamic Overlay from CMS */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity / 100,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          {/* Dynamic Welcome Text from Sanity */}
          <h1
            className="hero-welcome-text"
            style={{
              color: hero?.textColor?.hex || '#ffffff',
              opacity: hero?.textColor?.alpha || 1
            }}
          >
            {hero?.welcomeText || 'Welcome to Intelli Global Conferences'}
          </h1>

          {/* Dynamic Subtitle Text from Sanity */}
          <p
            className="hero-subtitle-text"
            style={{
              color: hero?.textColor?.hex || '#ffffff',
              opacity: hero?.textColor?.alpha || 1
            }}
          >
            {hero?.subtitle || 'A NEVER-ENDING JOURNEY OF SEEKING KNOWLEDGE - WITH PEOPLE AND THEIR THOUGHTS THAT ENABLE A BETTER LIVING'}
          </p>

          {/* Dynamic Call to Action Buttons from Sanity */}
          <div className="hero-buttons-container">
            {/* Primary Button - Use Link for internal URLs, a tag for external URLs */}
            {(hero?.primaryButton?.url || '/conferences').startsWith('http://') ||
            (hero?.primaryButton?.url || '/conferences').startsWith('https://') ? (
              <a
                href={hero?.primaryButton?.url || '/conferences'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:from-orange-600 focus:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
                aria-label={hero?.primaryButton?.text || 'View all conferences'}
              >
                {hero?.primaryButton?.text || 'VIEW ALL CONFERENCES'}
              </a>
            ) : (
              <Link
                href={hero?.primaryButton?.url || '/conferences'}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:from-orange-600 focus:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300"
                aria-label={hero?.primaryButton?.text || 'View all conferences'}
              >
                {hero?.primaryButton?.text || 'VIEW ALL CONFERENCES'}
              </Link>
            )}

            {/* Secondary Button - Use Link for internal URLs, a tag for external URLs */}
            {(hero?.secondaryButton?.url || '/contact').startsWith('http://') ||
            (hero?.secondaryButton?.url || '/contact').startsWith('https://') ? (
              <a
                href={hero?.secondaryButton?.url || '/contact'}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-4 focus:ring-white"
                aria-label={hero?.secondaryButton?.text || 'Contact us'}
              >
                {hero?.secondaryButton?.text || 'CONTACT US'}
              </a>
            ) : (
              <Link
                href={hero?.secondaryButton?.url || '/contact'}
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-4 focus:ring-white"
                aria-label={hero?.secondaryButton?.text || 'Contact us'}
              >
                {hero?.secondaryButton?.text || 'CONTACT US'}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Dots - Desktop Only */}
      {hero?.images && hero.images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden lg:flex space-x-2">
          {hero.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}