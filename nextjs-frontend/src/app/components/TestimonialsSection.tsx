'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl } from '../getSiteSettings';

interface Testimonial {
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
}

interface TestimonialsData {
  _id: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  isActive: boolean;
  testimonials: Testimonial[];
}

interface TestimonialsSectionProps {
  data: TestimonialsData | null;
}

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center space-x-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Individual testimonial card
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const imageUrl = getImageUrl(testimonial.customerImage, { width: 80, height: 80, quality: 90 });

  return (
    <div className="testimonial-card bg-white rounded-xl shadow-lg p-6 h-full border border-gray-100">
      <StarRating rating={testimonial.rating} />
      
      <blockquote className="text-gray-700 text-base leading-relaxed mb-6 flex-grow">
        "{testimonial.review}"
      </blockquote>
      
      <div className="flex items-center space-x-4 mt-auto">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={testimonial.customerImage.alt || testimonial.customerName}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {testimonial.customerName.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">
            {testimonial.customerName}
          </h4>
          {(testimonial.position || testimonial.company) && (
            <p className="text-gray-600 text-xs truncate">
              {[testimonial.position, testimonial.company].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TestimonialsSection({ data }: TestimonialsSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Debug logging
  console.log('🎭 TestimonialsSection received data:', data);
  console.log('🎭 Data conditions:', {
    hasData: !!data,
    isActive: data?.isActive,
    hasTestimonials: !!data?.testimonials?.length,
    testimonialsCount: data?.testimonials?.length || 0
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!data?.testimonials?.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % data.testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [data?.testimonials?.length]);

  if (!data || !data.testimonials?.length) {
    console.log('🚫 TestimonialsSection not rendering due to conditions:', {
      noData: !data,
      notActive: data && !data.isActive,
      noTestimonials: data && !data.testimonials?.length
    });

    // Show placeholder for debugging
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Testimonials Section (No Data)
            </h2>
            <p className="text-lg text-gray-600">
              No testimonials data found. Create testimonials in Sanity Studio to see them here.
            </p>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-500">
                Debug: data = {data ? 'exists' : 'null'},
                isActive = {data?.isActive ? 'true' : 'false'},
                testimonials = {data?.testimonials?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % data.testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + data.testimonials.length) % data.testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Show static grid on server side to avoid hydration issues
  if (!isClient) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {data.sectionTitle || 'What Our Attendees Say'}
            </h2>
            {data.sectionSubtitle && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {data.sectionSubtitle}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.testimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard key={testimonial._key} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {data.sectionTitle || 'What Our Attendees Say'}
          </h2>
          {data.sectionSubtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {data.sectionSubtitle}
            </p>
          )}
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Desktop: Show 3 cards, Tablet: Show 2 cards, Mobile: Show 1 card */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {data.testimonials.slice(currentSlide, currentSlide + 3).concat(
              data.testimonials.slice(0, Math.max(0, currentSlide + 3 - data.testimonials.length))
            ).slice(0, 3).map((testimonial) => (
              <TestimonialCard key={testimonial._key} testimonial={testimonial} />
            ))}
          </div>

          {/* Tablet: Show 2 cards */}
          <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-6">
            {data.testimonials.slice(currentSlide, currentSlide + 2).concat(
              data.testimonials.slice(0, Math.max(0, currentSlide + 2 - data.testimonials.length))
            ).slice(0, 2).map((testimonial) => (
              <TestimonialCard key={testimonial._key} testimonial={testimonial} />
            ))}
          </div>

          {/* Mobile: Show 1 card */}
          <div className="md:hidden">
            <TestimonialCard testimonial={data.testimonials[currentSlide]} />
          </div>

          {/* Navigation Arrows */}
          {data.testimonials.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Pagination Dots */}
          {data.testimonials.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {data.testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-blue-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
