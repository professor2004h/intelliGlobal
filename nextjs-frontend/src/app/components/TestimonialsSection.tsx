'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getImageUrl } from '../getSiteSettings';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    <div className="bg-white rounded-xl shadow-lg p-6 h-full border border-gray-100 hover:shadow-xl transition-shadow duration-300">
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!data || !data.isActive || !data.testimonials?.length) {
    return null;
  }

  // Don't render Swiper on server side to avoid hydration issues
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
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: '.testimonials-next',
              prevEl: '.testimonials-prev',
            }}
            pagination={{
              clickable: true,
              el: '.testimonials-pagination',
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            className="testimonials-swiper"
          >
            {data.testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial._key} className="h-auto">
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows */}
          <button className="testimonials-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button className="testimonials-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Custom Pagination */}
          <div className="testimonials-pagination flex justify-center mt-8 space-x-2"></div>
        </div>
      </div>
    </section>
  );
}
