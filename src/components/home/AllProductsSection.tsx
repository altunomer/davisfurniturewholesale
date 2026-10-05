'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';
import { Search, Check } from 'lucide-react';

export const AllProductsSection: React.FC = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories
  const categories = ['All', ...new Set(products.map((p) => p.category || 'Storage Beds'))];

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-16 md:py-24 bg-white" id="all-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-100 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-2 block">
              Wholesale Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              All Products
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Explore our handcrafted wholesale base and headboard ranges.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search ranges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <p className="text-neutral-500 text-sm">No products found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product) => {
              const primaryImage = product.images[0] || '/images/davis-logo.webp';
              const secondaryImage = product.images[1] || primaryImage;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white rounded-xl overflow-hidden border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300"
                >
                  {/* Image with hover transition */}
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
                        alt={`${product.name} secondary`}
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </Link>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
                          {product.category}
                        </span>
                        {product.inStock && (
                          <span className="flex items-center text-[11px] text-emerald-600 font-medium">
                            <Check className="w-3 h-3 mr-0.5" /> Made to Order
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                        <Link href={`/product/${product.slug}`}>
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                        {product.tagline}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {product.sizes.slice(0, 3).map((size) => (
                          <span
                            key={size}
                            className="inline-block bg-neutral-100 text-neutral-700 text-[11px] font-medium px-2 py-0.5 rounded"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-4 border-t border-neutral-100 flex items-center justify-between">
                      <Link
                        href={`/product/${product.slug}`}
                        className="w-full text-center py-2.5 px-4 bg-neutral-900 hover:bg-amber-600 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
                      >
                        View Product Range
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

