'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { Search, Filter, ArrowRight } from 'lucide-react';

function ProductsCatalogContent() {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const urlSearch = searchParams?.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedSize, setSelectedSize] = useState<string>('All');

  useEffect(() => {
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [urlSearch]);

  // Extract all unique sizes across products
  const allSizes = ['All', ...new Set(products.flatMap((p) => p.sizes || []))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSize =
      selectedSize === 'All' || (product.sizes && product.sizes.includes(selectedSize));

    return matchesSearch && matchesSize;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-neutral-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-2 block">
            Wholesale Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Bespoke Bases & Headboards
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Engineered with reinforced frames, premium upholstery, and smooth hydraulic ottoman storage mechanisms. Designed for discerning retailers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 mb-8 border-b border-neutral-200">
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <input
              type="text"
              placeholder="Search by model, feature..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Size Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center mr-1">
              <Filter className="w-3.5 h-3.5 mr-1" /> Size:
            </span>
            {allSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSize === size
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-500 font-medium">
            Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> Ranges
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">No Ranges Found</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Try adjusting your search criteria or resetting filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSize('All');
              }}
              className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-medium uppercase tracking-wider rounded cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const primaryImage = product.images[0] || '/images/davis-logo.webp';
              const secondaryImage = product.images[1] || primaryImage;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-neutral-200 hover:border-neutral-300 hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
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
                    />
                    {secondaryImage !== primaryImage && (
                      <img
                        src={secondaryImage}
                        alt={`${product.name} alternate view`}
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}

                    {product.isFavorite && (
                      <span className="absolute top-3 left-3 bg-neutral-900/85 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </Link>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 block mb-1">
                        {product.category}
                      </span>
                      <h2 className="text-xl font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                        <Link href={`/product/${product.slug}`}>
                          {product.name}
                        </Link>
                      </h2>
                      <p className="text-xs text-neutral-500 font-medium mt-1 mb-3 line-clamp-1">
                        {product.tagline}
                      </p>
                      <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
                        {product.shortDescription || product.description}
                      </p>

                      {/* Sizes */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {product.sizes.map((size) => (
                          <span
                            key={size}
                            className="bg-neutral-100 text-neutral-700 text-[11px] font-medium px-2 py-0.5 rounded"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-full text-center py-2.5 px-4 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center justify-center space-x-1"
                      >
                        <span>View Details & Request Quote</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white py-24 text-center text-neutral-500">Loading catalog...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}

