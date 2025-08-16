"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { TestimonialsSectionData, TestimonialItem } from '../getTestimonialsSection';

interface Props {
  data: TestimonialsSectionData | null;
}

function Stars({ rating }: { rating: number }) {
  const safe = Math.min(5, Math.max(0, Math.round(rating)));
  return (
    <div className="flex items-center" aria-label={`${safe} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 sm:w-5 sm:h-5 ${i < safe ? 'text-yellow-400' : 'text-slate-300'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: TestimonialItem }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 sm:p-6 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
          {t.imageUrl ? (
            <Image
              src={t.imageUrl}
              alt={`${t.customerName} photo`}
              fill
              sizes="56px"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-slate-200" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 truncate">{t.customerName}</div>
          <div className="text-slate-600 text-sm truncate">
            {[t.position, t.company].filter(Boolean).join(' • ')}
          </div>
          <Stars rating={t.rating} />
        </div>
      </div>
      <p className="text-slate-700 leading-relaxed text-sm sm:text-base line-clamp-6">{t.review}</p>
    </div>
  );
}

export default function TestimonialsCarousel({ data }: Props) {
  const testimonials = data?.testimonials || [];
  const [index, setIndex] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Determine slides per view based on width
  const [perView, setPerView] = useState(1);
  useEffect(() => {
    function updatePerView() {
      const width = window.innerWidth;
      if (width < 640) setPerView(1);
      else if (width < 1024) setPerView(2); // tablet: 1-2
      else setPerView(3);
    }
    updatePerView();
    window.addEventListener('resize', updatePerView);
    return () => window.removeEventListener('resize', updatePerView);
  }, []);

  // Autoplay
  useEffect(() => {
    if (isPaused || testimonials.length <= perView) return;
    autoplayRef.current && clearInterval(autoplayRef.current as any);
    autoplayRef.current = setInterval(() => {
      setIndex((i) => {
        const maxIndex = Math.max(0, testimonials.length - perView);
        return i >= maxIndex ? 0 : i + 1;
      });
    }, 4000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current as any);
    };
  }, [isPaused, testimonials.length, perView]);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center text-slate-500" role="status">No testimonials available.</div>
    );
  }

  const maxIndex = Math.max(0, testimonials.length - perView);
  const goPrev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  const goNext = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));

  // Keyboard support
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [maxIndex]);

  const slideWidthPct = 100 / perView;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Track */}
      <div className="overflow-hidden" ref={containerRef}>
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
          role="list"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="px-3 sm:px-4"
              style={{ minWidth: `${slideWidthPct}%`, maxWidth: `${slideWidthPct}%` }}
              role="listitem"
            >
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 bg-white border border-slate-200 shadow-sm hover:shadow-md rounded-full p-2 text-slate-700 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label="Previous testimonials"
        onClick={goPrev}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button
        type="button"
        className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 bg-white border border-slate-200 shadow-sm hover:shadow-md rounded-full p-2 text-slate-700 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label="Next testimonials"
        onClick={goNext}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
      </button>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Testimonials navigation">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-orange-600' : 'bg-slate-300 hover:bg-slate-400'}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === index}
            role="tab"
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

