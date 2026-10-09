'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync index when initialIndex or isOpen changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
    setShowControls(true);
  }, [initialIndex, isOpen]);

  // Auto-hide controls after 3.5 seconds of inactivity
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3500);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    resetControlsTimer();
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [isOpen, currentIndex, resetControlsTimer]);

  const nextImage = useCallback(() => {
    setScale(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setScale(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Lock scroll completely on body and documentElement
  useEffect(() => {
    if (!isOpen) return;

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      resetControlsTimer();
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [isOpen, nextImage, prevImage, onClose, resetControlsTimer]);

  if (!isOpen || !mounted || images.length === 0) return null;

  // Zoom helpers
  const zoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    resetControlsTimer();
    setScale((s) => Math.min(s + 0.5, 3));
  };

  const zoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    resetControlsTimer();
    setScale((s) => Math.max(s - 0.5, 1));
  };

  const resetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    resetControlsTimer();
    setScale(1);
  };

  // Wheel zoom without page scrolling
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    resetControlsTimer();
    if (e.deltaY < 0) {
      setScale((s) => Math.min(s + 0.2, 3));
    } else if (e.deltaY > 0) {
      setScale((s) => Math.max(s - 0.2, 1));
    }
  };

  const activeSrc = images[currentIndex] || images[0];
  const hasMultipleImages = images.length > 1;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] overflow-hidden bg-black/95 backdrop-blur-md select-none touch-none overscroll-none flex items-center justify-center animate-in fade-in duration-200"
      style={{ cursor: scale > 1 ? 'zoom-out' : 'default' }}
      onMouseMove={resetControlsTimer}
      onTouchStart={resetControlsTimer}
      onWheel={handleWheel}
      onClick={() => {
        if (scale === 1) {
          onClose();
        } else {
          setScale(1);
        }
      }}
    >
      {/* 1. Floating Top Controls Bar (Auto-hides on inactivity) */}
      <div
        className={`absolute top-0 left-0 right-0 z-40 transition-all duration-300 ${
          showControls
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-16 px-4 sm:px-8 flex items-center justify-between text-white bg-gradient-to-b from-black/90 via-black/50 to-transparent">
          {/* Product Title & Counter */}
          <div className="flex items-center space-x-3">
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white/90 drop-shadow truncate max-w-[50vw]">
              {productName}
            </span>
            {hasMultipleImages && (
              <span className="text-amber-400 font-mono text-xs px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/10">
                {currentIndex + 1} / {images.length}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Zoom In */}
            <button
              onClick={zoomIn}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all cursor-pointer hidden sm:inline-flex"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Zoom Out */}
            <button
              onClick={zoomOut}
              className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all cursor-pointer hidden sm:inline-flex"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Reset Zoom */}
            {scale > 1 && (
              <button
                onClick={resetZoom}
                className="p-2 sm:p-2.5 rounded-full bg-amber-600/80 hover:bg-amber-600 text-white backdrop-blur-sm transition-all cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 bg-white/15 hover:bg-red-600/80 rounded-full text-white backdrop-blur-sm transition-colors cursor-pointer flex items-center justify-center ml-2"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Centered Image Canvas - Guaranteed within Viewport */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-8 overflow-hidden pointer-events-none"
      >
        <img
          src={activeSrc}
          alt={`${productName} view ${currentIndex + 1}`}
          style={{
            transform: `scale(${scale})`,
            maxHeight: hasMultipleImages ? 'calc(100dvh - 180px)' : 'calc(100dvh - 110px)',
            maxWidth: 'calc(100vw - 32px)',
            cursor: scale === 1 ? 'zoom-in' : 'zoom-out',
          }}
          className="w-auto h-auto object-contain rounded-xl shadow-2xl transition-transform duration-200 block mx-auto select-none pointer-events-auto"
          draggable={false}
          onClick={(e) => {
            e.stopPropagation();
            resetControlsTimer();
            if (scale === 1) {
              setScale(1.75);
            } else {
              setScale(1);
            }
          }}
        />
      </div>

      {/* 3. Floating Left / Right Navigation Arrows */}
      {hasMultipleImages && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
              resetControlsTimer();
            }}
            className={`absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all z-40 cursor-pointer shadow-2xl backdrop-blur-md ${
              showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
              resetControlsTimer();
            }}
            className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white transition-all z-40 cursor-pointer shadow-2xl backdrop-blur-md ${
              showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* 4. Floating Bottom Strip: Thumbnails (Auto-hides on inactivity) */}
      {hasMultipleImages && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
            showControls
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-3 px-4 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="flex items-center space-x-2.5 overflow-x-auto max-w-full py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setScale(1);
                    setCurrentIndex(idx);
                    resetControlsTimer();
                  }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    currentIndex === idx
                      ? 'border-amber-500 scale-105 shadow-xl ring-2 ring-amber-500/50'
                      : 'border-white/30 opacity-60 hover:opacity-100 hover:border-white/70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="text-[11px] text-white/50 mt-1 pointer-events-none tracking-wide">
              Click anywhere outside or press Esc to close
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

