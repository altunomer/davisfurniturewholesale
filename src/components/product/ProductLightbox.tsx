'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
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
  const zoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((s) => Math.min(s + 0.5, 3));
  };
  const zoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale((s) => Math.max(s - 0.5, 1));
  };
  const resetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(1);
  };

  const activeSrc = images[currentIndex] || images[0];
  const hasMultipleImages = images.length > 1;

  // Reserved space: Header (56px) + Bottom Bar (80px) + 24px safety margin = 160px
  const maxImgHeight = hasMultipleImages ? 'calc(100dvh - 160px)' : 'calc(100dvh - 90px)';

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md select-none animate-in fade-in duration-200"
      onClick={() => {
        if (scale === 1) onClose();
      }}
    >
      {/* 1. Top Controls Bar */}
      <div
        className="flex-none h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between text-white z-30 bg-black/60 border-b border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase truncate max-w-[55vw]">
          <span>{productName}</span>
          {hasMultipleImages && (
            <span className="text-neutral-400 ml-2">
              ({currentIndex + 1} / {images.length})
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom Buttons */}
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
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors ml-2 cursor-pointer text-white flex items-center justify-center"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Middle Image Canvas */}
      <div className="flex-1 min-h-0 w-full relative flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Prev / Next Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all z-30 cursor-pointer shadow-xl backdrop-blur-xs"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all z-30 cursor-pointer shadow-xl backdrop-blur-xs"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Scalable Image Container */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200 ease-out"
          style={{ transform: `scale(${scale})` }}
          onClick={(e) => {
            if (scale > 1) {
              e.stopPropagation();
            }
          }}
        >
          <img
            src={activeSrc}
            alt={`${productName} preview ${currentIndex + 1}`}
            style={{
              maxHeight: maxImgHeight,
              maxWidth: 'calc(100vw - 32px)',
            }}
            className="w-auto h-auto sm:max-w-[calc(100vw-140px)] object-contain rounded-xl shadow-2xl block mx-auto select-none pointer-events-auto"
            draggable={false}
          />
        </div>
      </div>

      {/* 3. Bottom Strip: Thumbnails */}
      {hasMultipleImages && (
        <div
          className="flex-none h-20 px-4 z-30 flex items-center justify-center bg-black/80 border-t border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center space-x-2.5 overflow-x-auto max-w-full py-1">
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
        </div>
      )}
    </div>
  );
};
