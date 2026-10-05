'use client';

import React from 'react';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';
import { ArrowRight } from 'lucide-react';

export const FavoritesSection: React.FC = () => {
  const { products } = useProducts();
  const favorites = products.filter((p) => p.isFavorite).slice(0, 6);

  if (favorites.length === 0) return null;

  return (
    <section className="pt-6 pb-14 md:pt-8 md:pb-18 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-1.5 block">
            Handpicked Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-3">
            Your Favorites
          </h2>
          <div className="w-12 h-0.5 bg-neutral-900 mx-auto" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((product) => {
            const primaryImage = product.images[0] || '/images/davis-logo.webp';
            const secondaryImage = product.images[1] || primaryImage;

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border border-neutral-100 hover:border-neutral-200 hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container with Hover Effect */}
                <Link
                  href={`/product/${product.slug}`}
                  className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-neutral-100 block"
                >
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className={`w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105 ${
                      secondaryImage !== primaryImage ? 'group-hover:opacity-0' : ''
                    }`}
                    loading="lazy"
                    decoding="async"
                  />
                  {secondaryImage !== primaryImage && (
                    <img
                      src={secondaryImage}
                      alt={`${product.name} alternate view`}
                      className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  )}

                  <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded">
                    Popular
                  </div>
                </Link>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-amber-600 transition-colors">
                      <Link href={`/product/${product.slug}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium mb-3">
                      {product.tagline || product.category}
                    </p>
                    <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                      {product.shortDescription || product.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      Sizes: {product.sizes.length} Options
                    </span>
                    <Link
                      href={`/product/${product.slug}`}
                      className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-neutral-900 group-hover:text-amber-600 transition-colors"
                    >
                      <span>View Range</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

