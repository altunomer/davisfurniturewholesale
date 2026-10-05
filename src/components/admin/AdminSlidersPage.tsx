'use client';

import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { optimizeImage } from '../../utils/imageOptimizer';
import {
  Plus,
  Trash2,
  Upload,
  Info,
  Check,
  RotateCcw,
  Smartphone,
  Monitor
} from 'lucide-react';

export const AdminSlidersPage: React.FC = () => {
  const { slides, addSlide, deleteSlide, resetSlides } = useProducts();

  const [desktopImage, setDesktopImage] = useState('');
  const [mobileImage, setMobileImage] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [isOptimizingDesktop, setIsOptimizingDesktop] = useState(false);
  const [isOptimizingMobile, setIsOptimizingMobile] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Auto WebP upload for desktop slide
  const handleDesktopUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizingDesktop(true);
    try {
      // Optimize to max 1600x678
      const res = await optimizeImage(file, 1600, 800, 0.85);
      setDesktopImage(res.dataUrl);
      setStatusMessage(`Desktop banner auto-optimized to WebP (${Math.round(res.optimizedSize / 1024)} KB)`);
    } catch (err) {
      console.error(err);
      alert('Failed to optimize image');
    } finally {
      setIsOptimizingDesktop(false);
    }
  };

  // Auto WebP upload for mobile slide
  const handleMobileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizingMobile(true);
    try {
      // Optimize to max 750x500
      const res = await optimizeImage(file, 750, 500, 0.85);
      setMobileImage(res.dataUrl);
      setStatusMessage(`Mobile banner auto-optimized to WebP (${Math.round(res.optimizedSize / 1024)} KB)`);
    } catch (err) {
      console.error(err);
      alert('Failed to optimize image');
    } finally {
      setIsOptimizingMobile(false);
    }
  };

  const handleCreateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desktopImage.trim()) {
      alert('Desktop banner image is required.');
      return;
    }

    addSlide({
      desktopImage: desktopImage.trim(),
      mobileImage: (mobileImage.trim() || desktopImage.trim()),
      title: title.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      linkUrl: '/products'
    });

    setDesktopImage('');
    setMobileImage('');
    setTitle('');
    setSubtitle('');
    setStatusMessage('New banner slide added to homepage successfully!');
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleDelete = (id: string) => {
    if (slides.length <= 1) {
      alert('You must keep at least 1 hero banner slide.');
      return;
    }
    if (window.confirm('Delete this banner slide from homepage?')) {
      deleteSlide(id);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset hero slides back to original 3 Davis Furniture wholesale banners?')) {
      resetSlides();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-1 block">
            Homepage Presentation
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Hero Slider Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Add, preview, and reorder full-fidelity hero banner slides with automated WebP compression.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Default Banners</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{statusMessage}</span>
        </div>
      )}

      {/* DIMENSIONS & GUIDELINES CARD */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Required Image Dimensions for Optimal Visual Quality</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-700">
          <div className="bg-white/80 p-4 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center space-x-2 text-neutral-900 font-bold text-sm">
              <Monitor className="w-4 h-4 text-amber-600" />
              <span>Desktop Banner Dimensions</span>
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Recommended:</strong> <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">1600 × 678 px</code> (Ratio ~ 16:7)</li>
              <li><strong>Max Resolution:</strong> 1920 × 814 px</li>
              <li><strong>File Format:</strong> WebP, PNG, or JPG (auto-compressed on upload)</li>
            </ul>
          </div>

          <div className="bg-white/80 p-4 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center space-x-2 text-neutral-900 font-bold text-sm">
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span>Mobile Banner Dimensions</span>
            </div>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Recommended:</strong> <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">750 × 500 px</code> (Ratio 3:2)</li>
              <li><strong>Purpose:</strong> Cropped for compact smartphone viewports</li>
              <li><strong>Fallback:</strong> If omitted, desktop banner will be used</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add New Slide Form */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b border-neutral-100">
          <div className="p-2.5 bg-neutral-900 text-white rounded-xl">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Add New Banner Slide</h2>
            <p className="text-xs text-neutral-500">
              Upload local photos or paste image URLs. Uploaded images are automatically converted into WebP.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateSlide} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Desktop Image Field */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                1. Desktop Banner (1600 × 678 px) *
              </label>
              
              {/* File upload trigger */}
              <div className="border-2 border-dashed border-neutral-300 hover:border-amber-600 rounded-xl p-4 text-center transition-colors bg-neutral-50/50">
                <input
                  type="file"
                  accept="image/*"
                  id="desktop-slide-input"
                  onChange={handleDesktopUpload}
                  className="hidden"
                  disabled={isOptimizingDesktop}
                />
                <label htmlFor="desktop-slide-input" className="cursor-pointer block space-y-1.5">
                  <Upload className="w-5 h-5 text-amber-600 mx-auto" />
                  <span className="text-xs font-semibold text-neutral-800 block">
                    {isOptimizingDesktop ? 'Optimizing WebP...' : 'Upload Desktop Banner File'}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">Auto-scales to 1600px width</span>
                </label>
              </div>

              {/* URL fallback */}
              <input
                type="text"
                value={desktopImage}
                onChange={(e) => setDesktopImage(e.target.value)}
                placeholder="Or paste Desktop Image URL / path..."
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />

              {desktopImage && (
                <div className="relative rounded-lg overflow-hidden border border-neutral-200 aspect-16/7 bg-neutral-100">
                  <img src={desktopImage} alt="Desktop preview" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-neutral-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Desktop View
                  </span>
                </div>
              )}
            </div>

            {/* Mobile Image Field */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                2. Mobile Banner (750 × 500 px, optional)
              </label>

              {/* File upload trigger */}
              <div className="border-2 border-dashed border-neutral-300 hover:border-amber-600 rounded-xl p-4 text-center transition-colors bg-neutral-50/50">
                <input
                  type="file"
                  accept="image/*"
                  id="mobile-slide-input"
                  onChange={handleMobileUpload}
                  className="hidden"
                  disabled={isOptimizingMobile}
                />
                <label htmlFor="mobile-slide-input" className="cursor-pointer block space-y-1.5">
                  <Upload className="w-5 h-5 text-amber-600 mx-auto" />
                  <span className="text-xs font-semibold text-neutral-800 block">
                    {isOptimizingMobile ? 'Optimizing WebP...' : 'Upload Mobile Banner File'}
                  </span>
                  <span className="text-[10px] text-neutral-400 block">Auto-scales to 750px width</span>
                </label>
              </div>

              {/* URL fallback */}
              <input
                type="text"
                value={mobileImage}
                onChange={(e) => setMobileImage(e.target.value)}
                placeholder="Or paste Mobile Image URL / path..."
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600"
              />

              {mobileImage && (
                <div className="relative rounded-lg overflow-hidden border border-neutral-200 aspect-3/2 max-w-[200px] bg-neutral-100">
                  <img src={mobileImage} alt="Mobile preview" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-neutral-900/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Mobile View
                  </span>
                </div>
              )}
            </div>

          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner to Slider</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Slides List */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Current Hero Banners</h3>
            <p className="text-xs text-neutral-500">Live order displayed on homepage</p>
          </div>
          <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
            {slides.length} Active Slides
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <span className="text-xs font-bold text-neutral-400 w-5">
                  #{idx + 1}
                </span>

                {/* Preview Image */}
                <div className="w-36 sm:w-44 aspect-16/7 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
                  <img
                    src={slide.desktopImage}
                    alt={slide.title || `Slide ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-neutral-900 truncate">
                    {slide.title || `Banner Slide #${idx + 1}`}
                  </h4>
                  <p className="text-xs text-neutral-500 truncate max-w-sm">
                    {slide.desktopImage}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-mono">
                      Desktop: 1600×678
                    </span>
                    {slide.mobileImage && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-mono">
                        Mobile: 750×500
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <button
                  onClick={() => handleDelete(String(slide.id))}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Slide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
