import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Clock, Award } from 'lucide-react';

export const EditorialSection: React.FC = () => {
  return (
    <section className="py-20 bg-neutral-50 border-y border-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Block 1: Elegance lies in details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div className="order-2 lg:order-1 space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
              Master Craftsmanship
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
              Elegance <br />
              <span className="font-light italic text-neutral-600">lies in details.</span>
            </h2>
            <p className="text-neutral-600 leading-relaxed text-base sm:text-lg">
              Every curve, seam, and tuft is meticulously considered. Our wholesale storage beds are designed not just to satisfy modern storage needs, but to be the sculptural focal point of refined bedroom spaces.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="border-l-2 border-amber-600 pl-4">
                <span className="text-2xl font-bold text-neutral-900">20+</span>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Years of Experience</p>
              </div>
              <div className="border-l-2 border-amber-600 pl-4">
                <span className="text-2xl font-bold text-neutral-900">100%</span>
                <p className="text-xs text-neutral-500 uppercase tracking-wider">Quality Inspected</p>
              </div>
            </div>
            <div className="pt-4">
              <Link
                href="/about"
                className="inline-block px-6 py-3 bg-neutral-900 text-white hover:bg-amber-600 text-xs sm:text-sm uppercase tracking-wider font-medium rounded transition-colors"
              >
                Discover Our Heritage
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-4/3 sm:aspect-16/10">
              <img
                src="/images/editorial-1.webp"
                alt="Elegance in details"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg border border-neutral-100 hidden sm:block max-w-xs">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-neutral-900">Bespoke Finishes</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Tailored upholstery options across linen, velvet, and textured bouclé.
              </p>
            </div>
          </div>
        </div>

        {/* Block 2: Quality in every stitch */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-4/3 sm:aspect-16/10">
              <img
                src="/images/editorial-2.webp"
                alt="Quality in every stitch"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-neutral-100 hidden sm:block max-w-xs">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-neutral-900">Heavy Duty Frames</h4>
              </div>
              <p className="text-xs text-neutral-600">
                Solid timber structures and high-grade hydraulic gas struts for smooth lifting.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
              Premium Durability
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
              Quality <br />
              <span className="font-light italic text-neutral-600">in every stitch.</span>
            </h2>
            <p className="text-neutral-600 leading-relaxed text-base sm:text-lg">
              We understand the demands of retailers and wholesale clients. Our frames and mattresses are rigorously built with reinforced steel joins and precision upholstery that stand the test of time.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-sm text-neutral-700">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Reliable wholesale delivery cycles across Ireland & UK</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-neutral-700">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Hand-stitched deep button tufting & flawless fluting</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-neutral-900 text-white hover:bg-amber-600 text-xs sm:text-sm uppercase tracking-wider font-medium rounded transition-colors"
              >
                View Full Catalog
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

