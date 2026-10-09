'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { slides } = useProducts();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Auto play
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Touch Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (slides.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 sm:pt-4 sm:pb-3">
      <div
        className="relative w-full overflow-hidden bg-neutral-100 select-none group rounded-2xl sm:rounded-3xl shadow-sm border border-neutral-200/60"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Container - Compacted Height */}
        <div
          className="flex transition-transform duration-700 ease-out h-[240px] sm:h-[340px] md:h-[420px] lg:h-[470px]"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className="w-full flex-shrink-0 relative h-full flex items-center justify-center overflow-hidden bg-neutral-100"
            >
              {/* Responsive Pure Banner Image without button or dark overlay */}
              <picture className="w-full h-full block">
                <source media="(max-width: 640px)" srcSet={slide.mobileImage || slide.desktopImage} />
                <img
                  src={slide.desktopImage}
                  alt={slide.title || 'Davis Furniture Banner'}
                  width={1600}
                  height={678}
                  className="w-full h-full object-cover object-center"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                />
              </picture>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Hover on Desktop, always touchable on mobile) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-neutral-900 transition-all opacity-70 md:opacity-0 md:group-hover:opacity-100 focus:outline-none shadow-md backdrop-blur-xs cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-neutral-900 transition-all opacity-70 md:opacity-0 md:group-hover:opacity-100 focus:outline-none shadow-md backdrop-blur-xs cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Slide Indicators / Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1 z-10 bg-black/25 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="p-1.5 focus:outline-none cursor-pointer flex items-center justify-center"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    currentSlide === idx
                      ? 'w-6 h-2 bg-white'
                      : 'w-2 h-2 bg-white/60 hover:bg-white'
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

