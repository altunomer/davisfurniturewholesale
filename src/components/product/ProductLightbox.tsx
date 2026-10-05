'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ProductLightboxProps {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
  productName: string;
  onClose: () => void;
}

export const ProductLightbox: React.FC<ProductLightboxProps> = ({
  isOpen,
  images,
  initialIndex,
  productName,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Touch tracking for pinch-to-zoom & swipe-to-close
  const touchStartDist = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const lastTapTime = useRef<number>(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
    setTranslateY(0);
  }, [initialIndex, isOpen]);

  const nextImage = () => {
    setScale(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setScale(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation & Esc to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, images.length]);

  if (!isOpen || images.length === 0) return null;

  // Zoom helpers
  const zoomIn = () => setScale((s) => Math.min(s + 0.5, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.5, 1));
  const resetZoom = () => setScale(1);

  // Double tap to zoom
  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      setScale((prev) => (prev > 1 ? 1 : 2));
    }
    lastTapTime.current = now;

    if (Math.abs(translateY) > 90) {
      onClose();
    } else {
      setTranslateY(0);
    }

    touchStartDist.current = null;
    touchStartY.current = null;
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDist.current = dist;
    } else if (e.touches.length === 1) {
      touchStartY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartDist.current;
      setScale((prev) => Math.min(Math.max(prev * factor, 1), 3.5));
      touchStartDist.current = dist;
    } else if (e.touches.length === 1 && touchStartY.current && scale === 1) {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY.current;
      setTranslateY(deltaY);
    }
  };

  const activeSrc = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md select-none animate-in fade-in duration-200 cursor-zoom-out"
      onClick={() => {
        if (scale === 1) onClose();
      }}
    >
      {/* 1. Top Controls Bar */}
      <div
        className="flex-none h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/80 to-transparent cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase truncate max-w-[60vw]">
          <span>{productName}</span>
          <span className="text-neutral-400 ml-2">
            ({currentIndex + 1} / {images.length})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom Buttons (Desktop & Tablet) */}
          <button
            onClick={zoomIn}
            className="p-2 rounded-full hover:bg-white/20 transition-colors hidden sm:inline-flex cursor-pointer text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={zoomOut}
            className="p-2 rounded-full hover:bg-white/20 transition-colors hidden sm:inline-flex cursor-pointer text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          {scale > 1 && (
            <button
              onClick={resetZoom}
              className="p-2 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors ml-2 cursor-pointer text-white"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 2. Middle Image Canvas */}
      <div
        className="flex-1 min-h-0 w-full relative flex items-center justify-center p-3 sm:p-6 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Prev / Next Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white transition-all z-20 backdrop-blur-xs cursor-pointer shadow-lg"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white transition-all z-20 backdrop-blur-xs cursor-pointer shadow-lg"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div
          className={`w-full h-full flex items-center justify-center transition-transform ${isDragging ? 'duration-75' : 'duration-300'} ease-out`}
          style={{
            transform: `translateY(${translateY}px) scale(${scale})`,
            opacity: Math.max(1 - Math.abs(translateY) / 300, 0.4)
          }}
          onClick={(e) => {
            if (scale > 1) e.stopPropagation();
          }}
        >
          <img
            src={activeSrc}
            alt={`${productName} full screen preview`}
            className="max-h-full max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl pointer-events-auto"
            draggable={false}
          />
        </div>
      </div>

      {/* 3. Bottom Strip: Thumbnails & mobile hint */}
      <div
        className="flex-none py-3 px-4 z-20 flex flex-col items-center justify-center space-y-1.5 bg-gradient-to-t from-black/80 to-transparent cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <div className="flex justify-center space-x-2.5 overflow-x-auto max-w-full py-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setScale(1);
                  setCurrentIndex(idx);
                }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                  currentIndex === idx
                    ? 'border-amber-500 scale-105 shadow-lg'
                    : 'border-white/30 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="text-center text-[11px] text-neutral-400 pointer-events-none">
          Click background or press Esc to close • Pinch to zoom
        </div>
      </div>
    </div>
  );
};
