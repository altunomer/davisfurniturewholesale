import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Shield, Compass, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Authentic Northern Irish Furniture Craftsmanship',
  description: 'Learn about Davis Furniture Wholesale: over two decades of crafting luxury bed bases and headboards rooted in Warrenpoint, Northern Ireland.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="bg-neutral-900 text-white py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-3 block">
            Our story so far.
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            About Us
          </h1>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mb-6" />
          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Crafting beds, headboards, and comfortable living spaces with authentic Irish craftsmanship and dedicated family values for over two decades.
          </p>
        </div>
      </div>

      {/* Main Narrative */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-7 space-y-6 text-neutral-700 leading-relaxed text-base sm:text-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Every dream whispers a beginning…
            </h2>
            <p>
              Ours started over two decades ago. Our journey wasn’t just about crafting bed bases and headboards; it was about weaving comfort, beauty, and deeper meaning into the very heart of the homes we touch.
            </p>
            <p>
              Rooted in the close-knit community of <strong>Warrenpoint</strong>, our story transcends mere business – it’s a testament to unwavering dedication, trust, and time-honored craftsmanship. Each piece we create resonates with the touch of experienced hands and a spirit of genuine care.
            </p>
            <p>
              We see more than just furniture: in every stitch and every frame, we envision a child drifting off to dreamland, a couple building their shared life, and a beloved elder finding peaceful rest.
            </p>
            <p className="italic text-neutral-600 border-l-2 border-amber-600 pl-4 py-1">
              &quot;To us, a bed is far more than just a piece of furniture; it’s a sanctuary for dreams, a silent observer of life’s most intimate moments, and the launchpad for bold new beginnings. A headboard isn’t merely wood and fabric – it’s a frame for the precious memories yet to unfold.&quot;
            </p>
          </div>

          <div className="md:col-span-5 space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-3/4">
              <img
                src="/images/editorial-3.webp"
                alt="Davis Furniture Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-xs text-neutral-500 italic">
              Hand-finished upholstery workshop, Warrenpoint
            </p>
          </div>

        </div>

        {/* Pillars / Values */}
        <div className="mt-24 pt-16 border-t border-neutral-100">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-2 block">
              Core Principles
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              Why Retailers Partner With Us
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4 text-center">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-amber-600 mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-neutral-900">Passion & Heritage</h4>
              <p className="text-sm text-neutral-600 leading-relaxed">
                As we continue to flourish alongside our trusted partners throughout the island of Ireland, our passion remains steadfast. We honor the original dream that sparked it all.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4 text-center">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-amber-600 mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-neutral-900">Uncompromising Standards</h4>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Built to withstand years of heavy residential and hospitality use. Every joint, seam, and hydraulic component passes rigorous durability verification.
              </p>
            </div>

            <div className="p-8 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4 text-center">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-amber-600 mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-neutral-900">Dedicated Wholesale Support</h4>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Personal direct contact with our manufacturing and dispatch team. Responsive lead times and tailored shipping logistics.
              </p>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="mt-20 p-8 sm:p-12 bg-neutral-900 rounded-2xl text-white text-center flex flex-col items-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            Become a Davis Furniture Trade Stockist
          </h3>
          <p className="text-neutral-400 text-sm max-w-xl mb-8 leading-relaxed">
            Gain access to our complete wholesale catalog, fabric swatches, and tiered retail price sheets.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold uppercase tracking-wider text-xs rounded transition-colors shadow-lg"
          >
            <span>Get in Touch With Us</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

      </div>
    </div>
  );
}

