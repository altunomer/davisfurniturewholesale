'use client';

import React from 'react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { exportProductsToCsv } from '@/utils/csvHandler';
import {
  Package,
  Star,
  FileSpreadsheet,
  PlusCircle,
  Download,
  CheckCircle,
  Layers,
  ArrowRight,
  Sparkles,
  Sliders,
  Inbox
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, inquiries, unreadInquiriesCount } = useProducts();

  const totalProducts = products.length;
  const favorites = products.filter((p) => p.isFavorite).length;
  const inStock = products.filter((p) => p.inStock).length;
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-1 block">
            Store Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Catalog & Inventory Overview
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Manage your furniture ranges, review incoming quote requests, and dispatch notifications.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/welcome-webmaster/inquiries"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
          >
            <Inbox className="w-4 h-4" />
            <span>Inquiries {unreadInquiriesCount > 0 ? `(${unreadInquiriesCount} New)` : ''}</span>
          </Link>
          <Link
            href="/welcome-webmaster/products/new"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Range</span>
          </Link>
          <Link
            href="/welcome-webmaster/sliders"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
          >
            <Sliders className="w-4 h-4" />
            <span>Hero Sliders</span>
          </Link>
          <Link
            href="/welcome-webmaster/csv"
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV Portal</span>
          </Link>
          <button
            onClick={() => exportProductsToCsv(products)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Ranges
            </span>
            <div className="p-2 bg-neutral-100 text-neutral-700 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mt-3">{totalProducts}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Active wholesale models</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Bestsellers
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mt-3">{favorites}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Featured on homepage</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Made to Order
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mt-3">{inStock}</div>
          <p className="text-[11px] text-neutral-500 mt-1">Active production line</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Categories
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-bold text-neutral-900 mt-3">{categories.length}</div>
          <p className="text-[11px] text-neutral-500 mt-1">{categories.join(', ')}</p>
        </div>
      </div>

      {/* Feature notice: Auto Image Optimizer */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 bg-amber-600 text-white rounded-xl shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">
              Automatic Image WebP Optimization Active
            </h3>
            <p className="text-xs text-neutral-600 mt-0.5 max-w-xl">
              When uploading bed images in the product form, they are automatically compressed into ultra-lightweight WebP format via client-side canvas processing, maintaining sharp resolution while drastically reducing loading times.
            </p>
          </div>
        </div>
        <Link
          href="/welcome-webmaster/products/new"
          className="whitespace-nowrap px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg uppercase tracking-wider transition-colors"
        >
          Try Upload
        </Link>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Current Catalog</h3>
            <p className="text-xs text-neutral-500">Live products visible to customers</p>
          </div>
          <Link
            href="/welcome-webmaster/products"
            className="text-xs font-semibold uppercase tracking-wider text-amber-600 hover:text-amber-700 flex items-center space-x-1"
          >
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-neutral-100">
          {products.slice(0, 5).map((product) => (
            <div
              key={product.id}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <img
                  src={product.images[0] || '/images/davis-logo.webp'}
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover bg-neutral-100 flex-shrink-0 border border-neutral-200"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-neutral-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-neutral-500 truncate">{product.tagline}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] bg-neutral-100 px-2 py-0.5 rounded font-medium text-neutral-600">
                      {product.sizes.length} sizes
                    </span>
                    {product.isFavorite && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">
                        ★ Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                <Link
                  href={`/product/${product.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors font-medium hidden sm:inline-block"
                >
                  View
                </Link>
                <Link
                  href={`/welcome-webmaster/products/edit/${product.id}`}
                  className="px-3 py-1.5 text-xs text-white bg-neutral-900 hover:bg-amber-600 rounded-lg transition-colors font-semibold uppercase tracking-wider"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

